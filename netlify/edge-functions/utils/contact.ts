import type { Context } from '@netlify/edge-functions'
import wretch from 'wretch'
import wretchFormUrlAddon from 'wretch/addons/formUrl'
import { gatekeeper } from './gatekeeper.ts'
import { http204, http400, http401 } from './responses.ts'
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

  console.debug('calling blockRejectedRequest')
  const allow = await gatekeeper()

  if (!allow) {
    console.info('gatekeeper returned false')
    return http401
  }

  console.info('checking form fields')
  const email = formData.get('e-mail') as string
  const firstName = formData.get('first name') as string
  const lastName = formData.get('last name') as string
  const message = formData.get('message') as string
  const subject = formData.get('subject')
  const turnstile = formData.get('cf-turnstile-response')

  if (!(email && firstName && lastName && message && subject && turnstile)) {
    console.info('field missing')
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

  console.info('sending user email via SendGrid')
  await wretch()
    .auth(`Bearer ${Netlify.env.get('SENDGRID_API_KEY')}`)
    .post(
      {
        from: {
          email: 'no-reply@tejalshinde.com'
        },
        personalizations: [
          {
            dynamic_template_data: {
              email,
              firstName,
              lastName,
              message,
              subject
            },
            to: [
              {
                email
              }
            ]
          }
        ],
        template_id: Netlify.env.get('SENDGRID_USER_TEMPLATE_ID')
        /*reply_to: {
          email,
          name: `${firstName}${lastName}`
        }*/
      },
      'https://api.sendgrid.com/v3/mail/send'
    )
    .res()

  console.info('returning 204')
  return http204
}
