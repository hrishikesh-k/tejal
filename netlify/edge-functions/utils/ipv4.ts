function ipv4ToNumeric(ipv4: string) {
  console.debug('function ipv4ToNumeric')

  return ipv4
    .split('.')
    .reduce((acc, octet) => (acc << 8) + Number.parseInt(octet, 10), 0)
}

export function isIpv4InCidr(ip: string, cidr: string) {
  console.debug('function isIpv4InCidr')

  const [rangeBase, prefixLength] = cidr.split('/')

  if (!(rangeBase && prefixLength)) {
    console.error('investigate why this was hit')
    return
  }

  const ipNumeric = ipv4ToNumeric(ip)
  const rangeNumeric = ipv4ToNumeric(rangeBase)
  const mask = ~(2 ** (32 - Number.parseInt(prefixLength, 10)) - 1)
  return (ipNumeric & mask) === (rangeNumeric & mask)
}
