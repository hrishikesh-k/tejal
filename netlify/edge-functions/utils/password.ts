import type { Context } from '@netlify/edge-functions'
import sodium from 'libsodium-wrappers-sumo'
import { createJwt } from './jwt.ts'
import { http204, http400, http401 } from './responses.ts'
import { isCaptchaValid } from './turnstile.ts'

export async function validatePassword(formData: FormData) {
  console.debug('function validatePassword')

  const password = formData.get('password')
  const turnstile = formData.get('cf-turnstile-response')

  if (!(password && turnstile)) {
    return http400
  }

  console.debug('calling isCaptchaValid')
  const captcha = await isCaptchaValid(turnstile)

  if (!captcha) {
    console.info('captcha invalid')
    return http401
  }

  console.info('validating password')
  await sodium.ready
  const verified = sodium.crypto_pwhash_str_verify(
    Netlify.env.get('SITE_PASSWORD_HASH') as string,
    password as string
  )

  if (!verified) {
    console.info('invalid password')
    return http401
  }

  console.debug('calling createJwt')
  const jwt = await createJwt()

  console.info('setting cookie')
  const context = Netlify.context as Context
  context.cookies.set({
    expires: Date.now() + 60 * 60 * 1000,
    httpOnly: true,
    name: context.site.id as string,
    path: '/',
    sameSite: 'Strict',
    secure: true,
    value: jwt
  })

  console.info('returning 204')
  return http204
}
