import { getStore } from '@netlify/blobs'
import wretch from 'wretch'

const blobExpiry = Date.now() - 7 * 24 * 60 * 60 * 1000

export async function fetchBotIps(
  blobKey: string,
  url: string,
  fetcher?: (url: string) => Promise<Parameters<typeof parseBotIps>[0]>
): Promise<ReturnType<typeof parseBotIps>> {
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
  const ipPrefixesRes = fetcher
    ? await fetcher(url)
    : await wretch().get(url).json<Parameters<typeof parseBotIps>[0]>()

  console.debug('calling parseBotIps')
  const ipPrefixes = parseBotIps(ipPrefixesRes)

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

function parseBotIps(ipPrefixesRes: {
  creationTime: string
  prefixes: (
    | {
        ipv4Prefix?: never
        ipv6Prefix: string | undefined
      }
    | {
        ipv4Prefix: string | undefined
        ipv6Prefix?: never
      }
  )[]
}) {
  console.debug('function parseBotIps')

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
