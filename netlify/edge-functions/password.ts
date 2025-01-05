import { getStore } from '@netlify/blobs'
import type { Config, Context } from '@netlify/edge-functions'
import ipAddress from 'ip-address'
import { SignJWT, jwtVerify } from 'jose'
import wretch from 'wretch'

type JwtPayload = {
  ip: string
}

export const config: Config = {
  method: [/*'GET', */ 'POST'],
  onError: 'bypass',
  pattern: [
    //'^\\/(?:[Ii][Nn][Dd][Ee][Xx]\\.[Hh][Tt][Mm][Ll])?$',
    //'^\\/[Aa][Bb][Oo][Uu][Tt](?:\\/(?:[Ii][Nn][Dd][Ee][Xx]\\.[Hh][Tt][Mm][Ll])?|\\.[Hh][Tt][Mm][Ll])?$',
    '^\\/[Cc][Oo][Nn][Tt][Aa][Cc][Tt](?:\\/(?:[Ii][Nn][Dd][Ee][Xx]\\.[Hh][Tt][Mm][Ll])?|\\.[Hh][Tt][Mm][Ll])?$'
    //'^\\/[Ww][Oo][Rr][Kk](?:.*)?(?:\\/(?:[Ii][Nn][Dd][Ee][Xx]\\.[Hh][Tt][Mm][Ll])?|\\.[Hh][Tt][Mm][Ll])?$'
  ]
}

const cookieName = 'ts-jwt'

const http400 = new Response(null, {
  status: 400
})

const jwtSecret = new TextEncoder().encode(Netlify.env.get('JWT_SECRET'))

function allowIp(ip: string, cidr: Awaited<ReturnType<typeof fetchBotIps>>) {
  if (ip.includes(':')) {
    return cidr.v6.some((c) =>
      new ipAddress.Address6(ip).isInSubnet(new ipAddress.Address6(c))
    )
  }

  return cidr.v4.some((c) =>
    new ipAddress.Address4(ip).isInSubnet(new ipAddress.Address4(c))
  )
}

async function blockRejectedRequests(req: Request, context: Context) {
  const allow = await isReqAllowed(context)

  if (allow) {
    return
  }

  const res = await context.next(new Request(new URL('/password/', req.url)))

  return new Response(res.body, {
    status: 401
  })
}

async function isCaptchaValid(body: FormData, context: Context) {
  const result = await wretch()
    .headers({
      'content-type': 'application/json'
    })
    .post(
      {
        remoteip: context.ip,
        response: body.get('cf-turnstile-response'),
        secret: Netlify.env.get('TURNSTILE_SECRET_KEY')
      },
      'https://challenges.cloudflare.com/turnstile/v0/siteverify'
    )
    .json<{
      // biome-ignore lint/style/useNamingConvention: Cloudflare's API
      challenge_ts: string
      'error-codes': string[]
      hostname: string
      success: boolean
    }>()

  return result.success
}

async function isJwtValid(context: Context) {
  const cookie = context.cookies.get(cookieName)

  if (!cookie) {
    return false
  }

  try {
    const jwt = await jwtVerify<JwtPayload>(cookie, jwtSecret)
    return jwt.payload.ip === context.ip
  } catch {
    return false
  }
}

async function isReqAllowed(context: Context) {
  const bingbotIps = await fetchBotIps(
    'bingbot',
    'https://www.bing.com/toolbox/bingbot.json'
  )

  const googlebotIps = await fetchBotIps(
    'googlebot',
    'https://developers.google.com/static/search/apis/ipranges/googlebot.json'
  )

  const jwtValid = await isJwtValid(context)

  return (
    allowIp(context.ip, bingbotIps) ||
    allowIp(context.ip, googlebotIps) ||
    jwtValid
  )
}

function ipStore() {
  return getStore('ip')
}

async function fetchBotIps(
  blobKey: string,
  url: string
): Promise<ReturnType<typeof parseBotIps>> {
  const blobRes = (await ipStore().getWithMetadata(blobKey)) as null | {
    data: string
    metadata: {
      lastmod: number
    }
  }
  if (
    blobRes &&
    blobRes.metadata.lastmod > Date.now() - 7 * 24 * 60 * 60 * 1000
  ) {
    return JSON.parse(blobRes.data)
  }

  const ipPrefixesRes = await wretch(url)
    .get()
    .json<Parameters<typeof parseBotIps>[0]>()

  const ipPrefixes = parseBotIps(ipPrefixesRes)

  await ipStore().setJSON(blobKey, ipPrefixes, {
    metadata: {
      lastmod: Date.now()
    }
  })

  return ipPrefixes
}

function parseBotIps(ipPrefixesRes: {
  creationTime: string
  prefixes: {
    [K in 'ipv4Prefix' | 'ipv6Prefix']: string
  }[]
}) {
  const ip4Prefixes = ipPrefixesRes.prefixes
    .map((p) => p.ipv4Prefix)
    .filter(Boolean)

  const ip6Prefixes = ipPrefixesRes.prefixes
    .map((p) => p.ipv6Prefix)
    .filter(Boolean)

  return {
    v4: ip4Prefixes,
    v6: ip6Prefixes
  }
}

async function parsePasswordForm(body: FormData, context: Context) {
  const captcha = await isCaptchaValid(body, context)

  if (!captcha) {
    return false
  }

  const verified = Netlify.env.get('SITE_PASSWORD') === body.get('password')

  if (!verified) {
    return false
  }

  const jwt = await new SignJWT({
    ip: context.ip
  } as JwtPayload)
    .setExpirationTime('1h')
    .setProtectedHeader({
      alg: 'HS256'
    })
    .sign(jwtSecret)

  context.cookies.set({
    expires: Date.now() + 60 * 60,
    httpOnly: true,
    name: cookieName,
    path: '/',
    sameSite: 'Strict',
    secure: true,
    value: jwt
  })

  return true
}

export default async function (req: Request, context: Context) {
  if (req.method.toUpperCase() === 'GET') {
    return await blockRejectedRequests(req, context)
  }

  if (req.method.toUpperCase() === 'POST') {
    let body: FormData

    try {
      body = await req.clone().formData()
    } catch {
      return http400
    }

    const formName = body.get('form-name')

    if (formName === 'password') {
      const verified = await parsePasswordForm(body, context)

      if (verified) {
        return
      }

      return new Response(null, {
        status: 401
      })
    }

    if (formName === 'contact') {
      const captcha = await isCaptchaValid(body, context)

      if (!captcha) {
        return http400
      }

      return /* await blockRejectedRequests(req, context)*/
    }

    return http400
  }
  return
}
