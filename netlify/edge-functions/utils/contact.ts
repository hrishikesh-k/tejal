import type { Context } from '@netlify/edge-functions'
import wretch from 'wretch'
import wretchBasicAuthAddon from 'wretch/addons/basicAuth'
import wretchFormUrlAddon from 'wretch/addons/formUrl'
// import { gatekeeper } from './gatekeeper.ts'
import { http204, http400 /*, http401*/ } from './responses.ts'
import { isCaptchaValid } from './turnstile.ts'

async function isSpamAccordingToAkismet(
  req: {
    referrer: ReturnType<Request['headers']['get']>
    url: Request['url']
    userAgent: ReturnType<Request['headers']['get']>
  },
  formData: {
    email: string
    firstName: string
    lastName: string
    message: string
  }
) {
  console.info('function isSpamAccordingToAkismet')

  console.info('sending data to Akismet')
  const context = Netlify.context as Context
  const akismetResponse = await wretch(
    'https://rest.akismet.com/1.1/comment-check'
  )
    .addon(wretchFormUrlAddon)
    .formUrl({
      api_key: Netlify.env.get('AKISMET_API_KEY'),
      blog: context.url.origin,
      blog_charset: 'UTF-8',
      blog_lang: 'en',
      comment_author: `${formData.firstName}${formData.lastName}`,
      comment_author_email: formData.email,
      comment_content: formData.message,
      comment_type: 'contact‑form',
      permalink: req.url,
      referrer: req.referrer,
      user_agent: req.userAgent,
      user_ip: context.ip
    })
    .post()
    .text()

  console.info(`Akismet responded ${akismetResponse}`)
  return akismetResponse === 'true'
}

export async function parseContactForm(req: Request, formData: FormData) {
  console.debug('function parseContactForm')

  /* console.debug('calling gatekeeper')
  const allow = await gatekeeper()

  if (!allow) {
    console.info('gatekeeper returned false')
    return http401
  } */

  console.info('checking form fields')
  const email = formData.get('e-mail')
  const firstName = formData.get('first name')
  const lastName = formData.get('last name')
  const message = formData.get('message')
  const subject = formData.get('subject')
  const turnstile = formData.get('cf-turnstile-response')

  if (
    typeof email !== 'string' ||
    typeof firstName !== 'string' ||
    typeof lastName !== 'string' ||
    typeof message !== 'string' ||
    typeof subject !== 'string' ||
    typeof turnstile !== 'string'
  ) {
    console.info('field missing or invalid')
    return http400
  }

  console.debug('calling isCaptchaValid')
  const captcha = await isCaptchaValid(
    formData.get('cf-turnstile-response') as FormDataEntryValue
  )

  if (!captcha) {
    console.info('captcha: false')
    return http400
  }

  console.debug('calling isAkismetSpam')
  const akismet = await isSpamAccordingToAkismet(
    {
      referrer: req.headers.get('referer'),
      url: req.url,
      userAgent: req.headers.get('user-agent')
    },
    {
      email,
      firstName,
      lastName,
      message
    }
  )

  if (akismet) {
    console.info('akismet: true')
    return http400
  }

  console.info('sending emails via Mailjet')
  await wretch()
    .addon(wretchBasicAuthAddon)
    .basicAuth(
      Netlify.env.get('MAILJET_USERNAME') as string,
      Netlify.env.get('MAILJET_PASSWORD') as string
    )
    .post(
      {
        globals: {
          from: {
            email: 'no-reply@tejalshinde.com',
            name: 'Tejal Shinde'
          },
          templateLanguage: true,
          variables: {
            email,
            firstName,
            lastName,
            message,
            subject
          }
        },
        messages: [
          {
            replyTo: {
              email: Netlify.env.get('MAILJET_REPLY_EMAIL'),
              name: 'Tejal Shinde'
            },
            to: [
              {
                email: email,
                name: `${firstName} ${lastName}`
              }
            ],
            subject: 'Thank you for reaching out, {{var:firstName:""}}!',
            templateID: 7132141
          },
          {
            replyTo: {
              email,
              name: `${firstName} ${lastName}`
            },
            to: [
              {
                email: Netlify.env.get('MAILJET_NOTIFICATION_EMAIL'),
                name: 'Tejal Shinde'
              }
            ],
            subject: '{{var:firstName:""}} is trying to reach out!',
            templateID: 7132552
          }
        ]
      },
      'https://api.mailjet.com/v3.1/send'
    )
    .json()

  console.info('returning 204')
  return http204
}
