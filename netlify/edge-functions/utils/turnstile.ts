import type { Context } from '@netlify/edge-functions'
import wretch from 'wretch'

export async function isCaptchaValid(turnstileResponse: FormDataEntryValue) {
  console.debug('function isCaptchaValid')

  console.info('sending data to Cloudflare')
  const result = await wretch()
    .headers({
      'content-type': 'application/json'
    })
    .post(
      {
        remoteip: (Netlify.context as Context).ip,
        response: turnstileResponse,
        secret: Netlify.env.get('TURNSTILE_SECRET_KEY')
      },
      'https://challenges.cloudflare.com/turnstile/v0/siteverify'
    )
    .json<{
      challenge_ts: string
      'error-codes': string[]
      hostname: string
      success: boolean
    }>()

  console.info(`Cloudflare responded ${result.success}`)
  return result.success
}
