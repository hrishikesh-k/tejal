import type { Context } from '@netlify/edge-functions'
import { allowIp } from './allow-ip.ts'
import { fetchBotIps } from './bot-ip.ts'
import { isJwtValid } from './jwt.ts'

export async function gatekeeper() {
  console.debug('function gatekeeper')

  console.debug('calling fetchBotIps for bingbot')
  const bingbotIps = await fetchBotIps(
    'bingbot',
    'https://www.bing.com/toolbox/bingbot.json'
  )

  console.debug('calling fetchBotIps for googlebot')
  const googlebotIps = await fetchBotIps(
    'googlebot',
    'https://developers.google.com/static/search/apis/ipranges/googlebot.json'
  )

  console.debug('calling isJwtValid')
  const jwtValid = await isJwtValid()

  const context = Netlify.context as Context
  return (
    allowIp(context.ip, bingbotIps) ||
    allowIp(context.ip, googlebotIps) ||
    jwtValid
  )
}

export async function passwordPrompt() {
  console.debug('function passwordPrompt')

  console.info('calling gatekeeper')
  const allow = await gatekeeper()

  if (allow) {
    console.info('gatekeeper returned true')
    return
  }

  console.info('gatekeeper returned false, fetching /password/')
  const context = Netlify.context as Context
  const res = await context.next(
    new Request(new URL('/password/', context.url.origin))
  )

  console.info('responding with /password/: 401')
  return new Response(res.body, {
    status: 401
  })
}
