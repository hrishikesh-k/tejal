import type { Config, Context } from '@netlify/edge-functions'
import { parseContactForm } from './utils/contact.ts'
import { passwordPrompt } from './utils/gatekeeper.ts'
import { validatePassword } from './utils/password.ts'
import { http400 } from './utils/responses.ts'

export const config: Config = {
  method: ['GET', 'POST'],
  onError: 'bypass',
  pattern: [
    '^\\/(?:[Ii][Nn][Dd][Ee][Xx]\\.[Hh][Tt][Mm][Ll])?$',
    '^\\/[Aa][Bb][Oo][Uu][Tt](?:\\/(?:[Ii][Nn][Dd][Ee][Xx]\\.[Hh][Tt][Mm][Ll])?|\\.[Hh][Tt][Mm][Ll])?$',
    '^\\/[Cc][Oo][Nn][Tt][Aa][Cc][Tt](?:\\/(?:[Ii][Nn][Dd][Ee][Xx]\\.[Hh][Tt][Mm][Ll])?|\\.[Hh][Tt][Mm][Ll])?$',
    '^\\/[Ww][Oo][Rr][Kk](?:.*)?(?:\\/(?:[Ii][Nn][Dd][Ee][Xx]\\.[Hh][Tt][Mm][Ll])?|\\.[Hh][Tt][Mm][Ll])?$'
  ]
}

export default async function (req: Request, context: Context) {
  console.info(`[${req.method}] ${context.url.pathname}`)

  if (req.method.toUpperCase() === 'GET') {
    return await passwordPrompt()
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
      return await validatePassword(body)
    }

    if (formName === 'contact') {
      return await parseContactForm(req, body)
    }

    return http400
  }

  return
}
