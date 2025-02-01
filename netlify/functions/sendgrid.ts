import { resolve4 } from 'node:dns'
import { type IncomingHttpHeaders, request } from 'node:http'
import type { Config, Context } from '@netlify/functions'

export default async function (_: Request, context: Context) {
  const ips = await new Promise<string[]>((resolve, reject) => {
    resolve4('sendgrid.net', (err, addresses) => {
      if (err) {
        reject(err)
      }
      resolve(addresses)
    })
  })

  const headers = await new Promise<IncomingHttpHeaders>((resolve, reject) => {
    const req = request(
      {
        headers: {
          host: 'email.tejalshinde.com'
        },
        hostname: ips[0],
        method: 'GET',
        path: `/ls/click?upn=${context.url.searchParams.get('upn')}`,
        port: 80
      },
      (res) => {
        res.on('data', () => {
          // TODO: removing this breaks the app
        })
        res.on('end', () => {
          resolve(res.headers)
        })
      }
    )
    req.on('close', () => {
      // TODO: removing this breaks the app
    })
    req.on('error', reject)
    req.end()
  })

  return new Response(null, {
    headers: {
      location: `${headers.location}?q=`,
      'x-robots-tag': 'nofollow, noindex'
    },
    status: 302
  })
}

export const config: Config = {
  method: 'GET',
  path: '/ls/click'
}
