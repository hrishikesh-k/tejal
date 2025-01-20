import type { fetchBotIps } from './bot-ip.ts'
import { isIpv4InCidr } from './ipv4.ts'
import { isIpv6InCidr } from './ipv6.ts'

export function allowIp(
  ip: string,
  cidr: Awaited<ReturnType<typeof fetchBotIps>>
) {
  console.debug('function allowIp')

  if (ip.includes(':')) {
    console.info('checking ipv6')
    return cidr.v6.some((c) => ip === c || isIpv6InCidr(ip, c as string))
  }

  console.info('checking ipv4')
  return cidr.v4.some((c) => ip === c || isIpv4InCidr(ip, c as string))
}
