import type { Config, Context } from '@netlify/edge-functions'
import { jwtDecrypt } from 'jose'

export default async function (req: Request, context: Context) {
  const jwtSecret = new TextEncoder().encode(Netlify.env.get('JWT_SECRET'))

  if (req.method === 'GET') {
    const tsJwt = context.cookies.get('ts_jwt')

    async function passwordPage() {
      const passwordPage = await context.next(
        new Request(new URL('/password/', req.url))
      )
      return new Response(passwordPage.body, {
        headers: passwordPage.headers,
        status: 401
      })
    }

    if (!tsJwt) {
      return passwordPage()
    }

    try {
      await jwtDecrypt(tsJwt, jwtSecret)
      return
    } catch {
      return passwordPage()
    }
  }

  if (req.method === 'POST') {
    let body: {
      password: string
    }

    try {
      body = await req.json()
    } catch {
      return Response.json(
        {
          mgs: 'invalid req body'
        },
        {
          status: 400
        }
      )
    }

    if (!body.hasOwnProperty('password')) {
      return Response.json(
        {
          msg: 'password missing'
        },
        {
          status: 400
        }
      )
    }

    if (body.password !== Netlify.env.get('PROJECT_PASSWORD')) {
      return Response.json(
        {
          msg: 'password missing'
        },
        {
          status: 401
        }
      )
    }
  }

  return
}

export const config: Config = {
  method: ['GET', 'POST'],
  path: []
}
