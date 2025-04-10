import type { Context } from '@netlify/edge-functions'
import wretch from 'wretch'
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

async function triggerSengdridEmail(
  reply: {
    email: string
    name: string
  },
  templateData: Record<string, string>,
  templateId: string,
  to: string
) {
  console.debug('function triggerSengdridEmail')

  await wretch()
    .auth(`Bearer ${Netlify.env.get('SENDGRID_API_KEY')}`)
    .post(
      {
        from: {
          email: 'no-reply@tejalshinde.com'
        },
        personalizations: [
          {
            dynamic_template_data: templateData,
            to: [
              {
                email: to
              }
            ]
          }
        ],
        template_id: templateId,
        reply_to: reply
      },
      'https://api.sendgrid.com/v3/mail/send'
    )
    .res()
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

  console.info('sending user email via SendGrid')
  console.debug('calling triggerSendgridEmail')
  await triggerSengdridEmail(
    {
      email: Netlify.env.get('ADMIN_EMAIL') as string,
      name: 'Tejal Shinde'
    },
    {
      email,
      firstName,
      lastName,
      message,
      subject
    },
    Netlify.env.get('SENDGRID_USER_TEMPLATE_ID') as string,
    email
  )

  console.info('sending admin email via SendGrid')
  console.debug('calling triggerSendgridEmail')
  await triggerSengdridEmail(
    {
      email,
      name: `${firstName} ${lastName}`
    },
    {
      email,
      firstName,
      lastName,
      message,
      subject
    },
    Netlify.env.get('SENDGRID_ADMIN_TEMPLATE_ID') as string,
    Netlify.env.get('ADMIN_EMAIL') as string
  )

  console.info('returning 204')
  return http204
}
