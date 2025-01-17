import { getStore } from '@netlify/blobs'
import type { Config, Context } from '@netlify/edge-functions'
import ipAddress from 'ip-address'
import { SignJWT, jwtVerify } from 'jose'
import winston from 'winston'
import wretch from 'wretch'
import wretchFormUrlAddon from 'wretch/addons/formUrl'

type JwtPayload = {
  ip: Context['ip']
}

export const config: Config = {
  method: [/*'GET', */ 'POST'],
  onError: 'bypass',
  pattern: [
    // '^\\/(?:[Ii][Nn][Dd][Ee][Xx]\\.[Hh][Tt][Mm][Ll])?$',
    // '^\\/[Aa][Bb][Oo][Uu][Tt](?:\\/(?:[Ii][Nn][Dd][Ee][Xx]\\.[Hh][Tt][Mm][Ll])?|\\.[Hh][Tt][Mm][Ll])?$',
    '^\\/[Cc][Oo][Nn][Tt][Aa][Cc][Tt](?:\\/(?:[Ii][Nn][Dd][Ee][Xx]\\.[Hh][Tt][Mm][Ll])?|\\.[Hh][Tt][Mm][Ll])?$'
    // '^\\/[Ww][Oo][Rr][Kk](?:.*)?(?:\\/(?:[Ii][Nn][Dd][Ee][Xx]\\.[Hh][Tt][Mm][Ll])?|\\.[Hh][Tt][Mm][Ll])?$'
  ]
}

const blobExpiry = Date.now() - 7 * 24 * 60 * 60 * 1000
const cookieName = 'ts-jwt'

const http204 = new Response(null, {
  status: 204
})

const http400 = new Response(null, {
  status: 400
})

const jwtSecret = new TextEncoder().encode(Netlify.env.get('JWT_SECRET'))

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      forceConsole: true
    })
  ]
})

function allowIp(ip: string, cidr: Awaited<ReturnType<typeof fetchBotIps>>) {
  logger.debug('function allowIp')

  if (ip.includes(':')) {
    logger.info('ipv6 detected, checking ipv6')
    return cidr.v6.some((c) =>
      new ipAddress.Address6(ip).isInSubnet(new ipAddress.Address6(c))
    )
  }

  logger.info('checking ipv4')
  return cidr.v4.some((c) =>
    new ipAddress.Address4(ip).isInSubnet(new ipAddress.Address4(c))
  )
}

async function blockRejectedRequest() {
  logger.debug('function blockRejectedRequest')

  logger.debug('calling isReqAllowed')
  const allow = await isReqAllowed()

  if (allow) {
    logger.info('isReqAllowed returned true')
    return
  }

  logger.info('isReqAllowed returned false, fetching /password/')
  const context = Netlify.context as Context
  const res = await context.next(
    new Request(new URL('/password/', context.url.origin))
  )

  logger.info('responding with /password/: 401')
  return new Response(res.body, {
    status: 401
  })
}

async function isAkismetSpam(req: Request, formData: FormData) {
  logger.debug('function isAkismetSpam')

  logger.info('sending data to Akismet')
  const context = Netlify.context as Context
  const akismetResponse = await wretch(
    'https://rest.akismet.com/1.1/comment-check'
  )
    .addon(wretchFormUrlAddon)
    .formUrl({
      api_key: Netlify.env.get('AKISMET_API_KEY'),
      blog: context.url.origin,
      blog_charset: 'UTF-8',
      blog_lang: 'en',
      comment_author: `${formData.get('first name')}${formData.get('last name')}`,
      comment_author_email: formData.get('e-mail'),
      comment_content: formData.get('message'),
      comment_type: 'contact‑form',
      permalink: req.url,
      referrer: req.headers.get('referer'),
      user_agent: req.headers.get('user-agent'),
      user_ip: context.ip
    })
    .post()
    .text()

  logger.info(`Akismet responded ${akismetResponse}`)
  return akismetResponse === 'true'
}

async function isCaptchaValid(body: FormData) {
  logger.debug('function isCaptchaValid')

  logger.info('sending data to Cloudflare')
  const result = await wretch()
    .headers({
      'content-type': 'application/json'
    })
    .post(
      {
        remoteip: (Netlify.context as Context).ip,
        response: body.get('cf-turnstile-response'),
        secret: Netlify.env.get('TURNSTILE_SECRET_KEY')
      },
      'https://challenges.cloudflare.com/turnstile/v0/siteverify'
    )
    .json<{
      challenge_ts: string
      'error-codes': string[]
      hostname: string
      success: boolean
    }>()

  logger.info(`Cloudflare responded ${result.success}`)
  return result.success
}

async function isJwtValid() {
  logger.debug('function isJwtValid')

  logger.info('checking if cookie exists')
  const context = Netlify.context as Context
  const cookie = context.cookies.get(cookieName)

  if (!cookie) {
    logger.info('cookie missing')
    return false
  }

  try {
    logger.info('checking cookie validity')
    const jwt = await jwtVerify<JwtPayload>(cookie, jwtSecret)
    logger.info('cookie valid, comparing ip')
    return jwt.payload.ip === context.ip
  } catch {
    logger.info('failed to validate cookie')
    return false
  }
}

async function isReqAllowed() {
  logger.debug('function isReqAllowed')

  logger.info('fetching bingbot IPs')
  logger.debug('calling fetchBotIps')
  const bingbotIps = await fetchBotIps(
    'bingbot',
    'https://www.bing.com/toolbox/bingbot.json'
  )

  logger.info('fetching googlebot IPs')
  logger.debug('calling fetchBotIps')
  const googlebotIps = await fetchBotIps(
    'googlebot',
    'https://developers.google.com/static/search/apis/ipranges/googlebot.json'
  )

  logger.info('validating jwt')
  logger.debug('calling isJwtValid')
  const jwtValid = await isJwtValid()

  const context = Netlify.context as Context
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
  logger.debug('function fetchBotIps')

  logger.info('fetching ip list from blobs')
  const blobRes = (await ipStore().getWithMetadata(blobKey)) as null | {
    data: string
    metadata: {
      lastmod: number
    }
  }

  if (blobRes && blobRes.metadata.lastmod > blobExpiry) {
    logger.info('blob fresh')
    return JSON.parse(blobRes.data)
  }

  logger.info('fetching ip list from url')
  const ipPrefixesRes = await wretch(url)
    .get()
    .json<Parameters<typeof parseBotIps>[0]>()

  logger.debug('calling parseBotIps')
  const ipPrefixes = parseBotIps(ipPrefixesRes)

  logger.info('storing ip list in blobs')
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
  logger.debug('function parseBotIps')

  logger.info('parsing ipv4')
  const ip4Prefixes = ipPrefixesRes.prefixes
    .map((p) => p.ipv4Prefix)
    .filter(Boolean)

  logger.info('parsing ipv6')
  const ip6Prefixes = ipPrefixesRes.prefixes
    .map((p) => p.ipv6Prefix)
    .filter(Boolean)

  return {
    v4: ip4Prefixes,
    v6: ip6Prefixes
  }
}

async function parseContactForm(req: Request, formData: FormData) {
  logger.debug('function parseContactForm')

  logger.debug('calling blockRejectedRequest')
  const blockRequest = await blockRejectedRequest()

  if (blockRequest) {
    logger.info('blockRequest: true')
    return blockRequest
  }

  logger.info('checking if all form fields exist')
  const email = formData.get('e-mail')
  const firstName = formData.get('first name')
  const lastName = formData.get('last name')
  const message = formData.get('message')
  const subject = formData.get('subject')

  if (!(email && firstName && lastName && message && subject)) {
    logger.info('field missing')
    return http400
  }

  logger.debug('calling isCaptchaValid')
  const captcha = await isCaptchaValid(formData)

  if (!captcha) {
    logger.info('captcha: false')
    return http400
  }

  logger.debug('calling isAkismetSpam')
  const akismet = await isAkismetSpam(req, formData)

  if (akismet) {
    logger.info('akismet: true')
    return http400
  }

  logger.info('sending user email via SendGrid')
  await wretch()
    .auth(`Bearer ${Netlify.env.get('SENDGRID_API_KEY')}`)
    .post(
      {
        from: {
          email: 'no-reply@tejalshinde.com'
        },
        personalizations: [
          {
            dynamic_template_data: {
              email,
              firstName,
              lastName,
              message,
              subject
            },
            to: [
              {
                email
              }
            ]
          }
        ],
        template_id: Netlify.env.get('SENDGRID_USER_TEMPLATE_ID')
        /*reply_to: {
          email,
          name: `${firstName}${lastName}`
        }*/
      },
      'https://api.sendgrid.com/v3/mail/send'
    )
    .res()

  logger.info('returning 204')
  return http204
}

async function parsePasswordForm(body: FormData) {
  const captcha = await isCaptchaValid(body)

  if (!captcha) {
    return http400
  }

  const verified = Netlify.env.get('SITE_PASSWORD') === body.get('password')

  if (!verified) {
    return new Response(null, {
      status: 401
    })
  }

  const context = Netlify.context as Context
  const jwt = await new SignJWT({
    ip: context.ip
  } as JwtPayload)
    .setExpirationTime('1h')
    .setProtectedHeader({
      alg: 'HS256'
    })
    .sign(jwtSecret)

  context.cookies.set({
    expires: Date.now() + 60 * 60 * 1000,
    httpOnly: true,
    name: cookieName,
    path: '/',
    sameSite: 'Strict',
    secure: true,
    value: jwt
  })

  logger.info('returning 204')
  return http204
}

export default async function (req: Request, context: Context) {
  logger.info(`[${req.method}] ${context.url.pathname}`)

  if (req.method.toUpperCase() === 'GET') {
    return await blockRejectedRequest()
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
      return await parsePasswordForm(body)
    }

    if (formName === 'contact') {
      return await parseContactForm(req, body)
    }

    return http400
  }

  return
}
