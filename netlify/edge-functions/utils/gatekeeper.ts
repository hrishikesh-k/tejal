import type { Context } from '@netlify/edge-functions'
import wretch from 'wretch'
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

  console.debug('calling fetchBotIps for googlebot-common')
  const googlebotCommonIps = await fetchBotIps(
    'googlebot-common',
    'https://developers.google.com/static/search/apis/ipranges/googlebot.json'
  )

  console.debug('calling fetchBotIps for googlebot-special-case')
  const googlebotSpecialCaseIps = await fetchBotIps(
    'googlebot-special',
    'https://developers.google.com/static/search/apis/ipranges/special-crawlers.json'
  )

  console.debug('calling fetchBotIps for googlebot-user-triggered-fetchers')
  const googlebotUserTriggeredFetchersIps = await fetchBotIps(
    'googlebot-user-triggered-fetchers',
    'https://developers.google.com/static/search/apis/ipranges/user-triggered-fetchers.json'
  )

  console.debug(
    'calling fetchBotIps for googlebot-user-triggered-fetchers-google'
  )
  const googlebotUserTriggeredFetchersGoogleIps = await fetchBotIps(
    'googlebot-user-triggered-fetchers-google',
    'https://developers.google.com/static/search/apis/ipranges/user-triggered-fetchers-google.json'
  )

  const duckDuckBotIps = await fetchBotIps(
    'duckduckbot',
    'https://raw.githubusercontent.com/duckduckgo/duckduckgo-help-pages/master/_docs/results/duckduckbot.md',
    async (url: string) => {
      const doc = await wretch().get(url).text()

      const ips = Array.from(
        doc.matchAll(/^-\s+(?<ip>.*)$/gm) as RegExpStringIterator<
          RegExpExecArray & {
            groups: {
              ip?: string
            }
          }
        >
      ).map((m) => m.groups?.ip)

      return {
        creationTime: new Date().toISOString(),
        prefixes: ips.filter(Boolean).map((ip) =>
          (ip as string).includes(':')
            ? {
                ipv6Prefix: ip
              }
            : {
                ipv4Prefix: ip
              }
        )
      }
    }
  )

  console.debug('calling isJwtValid')
  const jwtValid = await isJwtValid()

  const context = Netlify.context as Context
  return (
    allowIp(context.ip, bingbotIps) ||
    allowIp(context.ip, googlebotCommonIps) ||
    allowIp(context.ip, googlebotSpecialCaseIps) ||
    allowIp(context.ip, googlebotUserTriggeredFetchersIps) ||
    allowIp(context.ip, googlebotUserTriggeredFetchersGoogleIps) ||
    allowIp(context.ip, duckDuckBotIps) ||
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
