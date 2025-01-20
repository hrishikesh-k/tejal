import { getStore } from '@netlify/blobs'
import wretch from 'wretch'

const blobExpiry = Date.now() - 7 * 24 * 60 * 60 * 1000

export async function fetchBotIps(
  blobKey: string,
  url: string
): Promise<ReturnType<typeof parseBingGoogleIps>> {
  console.debug('function fetchBotIps')

  console.info('fetching ip list from blobs')
  const store = ipStore()
  const blobRes = (await store.getWithMetadata(blobKey)) as null | {
    data: string
    metadata: {
      lastmod: number
    }
  }

  if (blobRes && blobRes.metadata.lastmod > blobExpiry) {
    console.info('blob fresh')
    return JSON.parse(blobRes.data)
  }

  console.info('fetching ip list from url')
  const ipPrefixesRes = await wretch()
    .get(url)
    .json<Parameters<typeof parseBingGoogleIps>[0]>()

  let ipPrefixes: ReturnType<typeof parseBingGoogleIps> = {
    v4: [],
    v6: []
  }

  if (blobKey === 'bingbot' || blobKey === 'googlebot') {
    console.debug('calling parseBingGoogleIps')
    ipPrefixes = parseBingGoogleIps(ipPrefixesRes)
  }

  console.info('storing ip list in blobs')
  await store.setJSON(blobKey, ipPrefixes, {
    metadata: {
      lastmod: Date.now()
    }
  })

  return ipPrefixes
}

function ipStore() {
  return getStore('ip')
}

function parseBingGoogleIps(ipPrefixesRes: {
  creationTime: string
  prefixes: {
    [K in 'ipv4Prefix' | 'ipv6Prefix']: string
  }[]
}) {
  console.debug('function parseBingGoogleIps')

  console.info('parsing ipv4')
  const ip4Prefixes = ipPrefixesRes.prefixes
    .map((p) => p.ipv4Prefix)
    .filter(Boolean)

  console.info('parsing ipv6')
  const ip6Prefixes = ipPrefixesRes.prefixes
    .map((p) => p.ipv6Prefix)
    .filter(Boolean)

  return {
    v4: ip4Prefixes,
    v6: ip6Prefixes
  }
}
