function expandIpv6(ipv6: string) {
  console.debug('function expandIpv6')

  const sections = ipv6.split('::')
  const left = sections[0] ? sections[0].split(':') : []
  const right = sections[1] ? sections[1].split(':') : []
  const missingSections = 8 - (left.length + right.length)
  const full = [...left, ...new Array(missingSections).fill('0'), ...right]
  return full.map((section) => section.padStart(4, '0')).join(':')
}

function ipv6ToBinary(ipv6: string) {
  console.debug('function ipv6ToBinary')

  console.debug('calling expandIpv6')
  return expandIpv6(ipv6)
    .split(':')
    .map((section) =>
      Number.parseInt(section, 16).toString(2).padStart(16, '0')
    )
    .join('')
}

export function isIpv6InCidr(ip: string, cidr: string) {
  console.debug('function isIpv6InCidr')

  const [rangeBase, prefixLength] = cidr.split('/')

  if (!(rangeBase && prefixLength)) {
    console.info('not cidr')
    return
  }

  const ipBinary = ipv6ToBinary(ip)
  const rangeBinary = ipv6ToBinary(rangeBase)
  const prefixBits = Number.parseInt(prefixLength, 10)
  const ipPrefix = ipBinary.substring(0, prefixBits)
  const rangePrefix = rangeBinary.substring(0, prefixBits)
  return ipPrefix === rangePrefix
}
