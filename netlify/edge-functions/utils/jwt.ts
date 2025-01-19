import type { Context } from '@netlify/edge-functions'
import { SignJWT, jwtVerify } from 'jose'

const jwtSecret = new TextEncoder().encode(Netlify.env.get('JWT_SECRET'))

export async function createJwt() {
  console.debug('function createJwt')

  const context = Netlify.context as Context
  return await new SignJWT({
    ip: context.ip
  } as Pick<Context, 'ip'>)
    .setExpirationTime('1h')
    .setProtectedHeader({
      alg: 'HS256'
    })
    .sign(jwtSecret)
}

export async function isJwtValid() {
  console.debug('function isJwtValid')

  console.info('checking if cookie exists')
  const context = Netlify.context as Context
  const cookie = context.cookies.get(context.site.id as string)

  if (!cookie) {
    console.info('cookie missing')
    return false
  }

  try {
    console.info('checking cookie validity')
    const jwt = await jwtVerify<Pick<Context, 'ip'>>(cookie, jwtSecret)
    console.info('cookie valid, comparing ip')
    return jwt.payload.ip === context.ip
  } catch {
    console.info('failed to validate cookie')
    return false
  }
}
