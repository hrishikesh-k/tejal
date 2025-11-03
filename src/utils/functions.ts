// @unocss-include

import wretch from 'wretch'
import { resizeMasonry } from '~/utils/components/masonry.ts'

function resizeRecaptcha(recaptcha: HTMLDivElement, vw: number) {
  const parentDiv = recaptcha.parentElement as HTMLDivElement
  const properties = ['x', 'y', 'z'].map((d) => `--u-scale-${d}`)
  if (vw < 348) {
    const calc = `${(vw - 48) / 3}%`
    properties.map((p) => parentDiv.style.setProperty(p, calc))
  } else {
    properties.map((p) => parentDiv.style.removeProperty(p))
  }
}

function roundCorners(
  index: number,
  length: number,
  link: HTMLAnchorElement,
  vw: number
) {
  for (const prop of [
    'border-radius',
    'border-bottom-left-radius',
    'border-bottom-right-radius',
    'border-top-left-radius',
    'border-top-right-radius'
  ]) {
    link.style.removeProperty(prop)
  }

  if (length === 1) {
    setBorderRadius(link, ['borderRadius'])
    return
  }

  if (length === 2) {
    roundCornersLength2(index, link, vw)
    return
  }

  if (length === 3) {
    roundCornersLength3(index, link, vw)
    return
  }

  roundCornersLengthGt3(index, length, link, vw)
}

function roundCornersInit(container: HTMLDivElement, vw: number) {
  Array.from(container.querySelectorAll('a'))
    .filter((l) => getComputedStyle(l).display === 'block')
    .forEach((l, i, a) => {
      roundCorners(i, a.length, l, vw)
    })
}

function roundCornersLength2(
  index: number,
  link: HTMLAnchorElement,
  vw: number
) {
  if (index === 0) {
    setBorderRadius(
      link,
      vw < 640
        ? ['borderTopLeftRadius', 'borderTopRightRadius']
        : ['borderTopLeftRadius', 'borderBottomLeftRadius']
    )
  } else {
    setBorderRadius(
      link,
      vw < 640
        ? ['borderBottomLeftRadius', 'borderBottomRightRadius']
        : ['borderTopRightRadius', 'borderBottomRightRadius']
    )
  }
}

function roundCornersLength3(
  index: number,
  link: HTMLAnchorElement,
  vw: number
) {
  if (index === 0) {
    setBorderRadius(
      link,
      vw < 640
        ? ['borderTopLeftRadius', 'borderTopRightRadius']
        : vw < 1024
          ? ['borderTopLeftRadius']
          : ['borderTopLeftRadius', 'borderBottomLeftRadius']
    )
  } else if (index === 1 && vw < 1024 && vw >= 640) {
    setBorderRadius(link, ['borderTopRightRadius', 'borderBottomRightRadius'])
  } else if (index === 2) {
    setBorderRadius(
      link,
      vw < 1024
        ? ['borderBottomLeftRadius', 'borderBottomRightRadius']
        : ['borderTopRightRadius', 'borderBottomRightRadius']
    )
  }
}

function roundCornersLengthGt3(
  index: number,
  length: number,
  link: HTMLAnchorElement,
  vw: number
) {
  if (vw < 640) {
    roundCornersLengthGt3Sm(index, length, link)
    return
  }

  if (vw < 1024 && vw >= 640) {
    roundCornersLengthGt3Md(index, length, link)
    return
  }

  roundCornersLengthGt3Lg(index, length, link)
}

function roundCornersLengthGt3Lg(
  index: number,
  length: number,
  link: HTMLAnchorElement
) {
  const remainder = length % 3

  if (index === 0) {
    setBorderRadius(link, ['borderTopLeftRadius'])
    return
  }

  if (index === 2) {
    setBorderRadius(link, ['borderTopRightRadius'])
    return
  }

  if (remainder === 0 && index >= length - 3) {
    const radiusMapping = {
      [length - 3]: ['borderBottomLeftRadius'],
      [length - 1]: ['borderBottomRightRadius']
    }

    setBorderRadius(
      link,
      radiusMapping[index] as Parameters<typeof setBorderRadius>[1]
    )
    return
  }

  if (remainder === 1 && index >= length - 2) {
    setBorderRadius(
      link,
      index === length - 2
        ? ['borderBottomRightRadius']
        : ['borderBottomLeftRadius', 'borderBottomRightRadius']
    )
    return
  }

  if (remainder === 2 && index >= length - 2) {
    setBorderRadius(
      link,
      index === length - 2
        ? ['borderBottomLeftRadius']
        : ['borderBottomRightRadius']
    )
  }
}

function roundCornersLengthGt3Md(
  index: number,
  length: number,
  link: HTMLAnchorElement
) {
  const remainder = length % 2
  if (index === 0) {
    setBorderRadius(link, ['borderTopLeftRadius'])
  } else if (index === 1) {
    setBorderRadius(link, ['borderTopRightRadius'])
  } else if (remainder === 0 && index >= length - 2) {
    setBorderRadius(
      link,
      index === length - 2
        ? ['borderBottomLeftRadius']
        : ['borderBottomRightRadius']
    )
  } else if (remainder === 1 && index >= length - 2) {
    setBorderRadius(
      link,
      index === length - 2
        ? ['borderBottomRightRadius']
        : ['borderBottomLeftRadius', 'borderBottomRightRadius']
    )
  }
}

function roundCornersLengthGt3Sm(
  index: number,
  length: number,
  link: HTMLAnchorElement
) {
  if (index === 0) {
    setBorderRadius(link, ['borderTopLeftRadius', 'borderTopRightRadius'])
  } else if (index === length - 1) {
    setBorderRadius(link, ['borderBottomLeftRadius', 'borderBottomRightRadius'])
  }
}

function setBorderRadius(
  link: HTMLAnchorElement,
  styles: Array<
    | 'borderRadius'
    | 'borderBottomLeftRadius'
    | 'borderBottomRightRadius'
    | 'borderTopLeftRadius'
    | 'borderTopRightRadius'
  >
) {
  for (const property of styles) {
    link.style[property] = '0.375rem'
  }
}

export function addWindowResizeEventHandler() {
  let timeout: NodeJS.Timeout

  function windowResizeHandler() {
    const linksToRoundContainers = document.querySelectorAll<HTMLDivElement>(
      'div.grid.grid-cols-1.overflow-hidden'
    )
    const masonryToResize =
      document.querySelectorAll<HTMLDivElement>('[data-masonry]')

    const recaptchaToResize =
      document.querySelectorAll<HTMLDivElement>('.cf-turnstile')

    const vw = document.documentElement.clientWidth

    const wecoBagStuffer =
      document.querySelector<HTMLHeadingElement>('h3#bag-stuffer')

    if (wecoBagStuffer) {
      const wecoEmailImage = (
        (wecoBagStuffer.parentElement as HTMLDivElement)
          .previousElementSibling as HTMLDivElement
      ).querySelector('div') as HTMLDivElement
      if (vw >= 768) {
        wecoEmailImage.style.height = `${(wecoBagStuffer.nextElementSibling as HTMLDivElement).clientHeight}px`
      } else {
        wecoEmailImage.style.height = ''
      }
    }

    for (const container of linksToRoundContainers) {
      roundCornersInit(container, vw)
    }

    for (const masonry of masonryToResize) {
      resizeMasonry(masonry, vw)
    }

    for (const recaptcha of recaptchaToResize) {
      resizeRecaptcha(recaptcha, vw)
    }
  }

  window.addEventListener('resize', () => {
    clearTimeout(timeout)
    timeout = setTimeout(windowResizeHandler, 250)
  })

  window.rh = windowResizeHandler
  window.rh()
}

export function addTurnstileScript() {
  const script = document.createElement('script')
  script.setAttribute(
    'src',
    'https://challenges.cloudflare.com/turnstile/v0/api.js'
  )
  document.body.appendChild(script)
}

export async function submitForm(event: SubmitEvent) {
  event.preventDefault()
  const form = event.target as HTMLFormElement & {
    dataset: {
      reload?: 'true' | undefined
    }
  }
  const formProgress = [
    'cursor-not-allowed',
    'children:opacity-50',
    'children:pointer-none'
  ]
  const formTextDefault = [
    'border-rounded-1',
    'box-border',
    'm-t-6',
    'p-2',
    'text-center',
    'transition-background-color-color'
  ]
  const formTextError = ['bg-red-500', 'text-light-500']
  const formTextSuccess = ['bg-green-500', 'text-light-500']
  const formTextWarn = ['bg-yellow-500', 'text-dark-500']
  const inputs = form.querySelectorAll('button, input, textarea')
  const p = document.createElement('p')
  formTextDefault.map((c) => p.classList.add(c))
  formTextWarn.map((c) => p.classList.add(c))
  p.innerText = 'Submitting...'
  ;(form.parentElement as HTMLDivElement).appendChild(p)

  try {
    formProgress.map((c) => form.classList.add(c))
    const formData = new FormData(form)

    for (const i of inputs) {
      i.setAttribute('disabled', 'true')
    }

    await wretch()
      .post(formData, form.getAttribute('action') || '/')
      .res()
    p.innerText = 'Submission successful'
    formTextSuccess.map((c) => p.classList.add(c))

    if (form.dataset.reload) {
      location.reload()
    } else {
      form.reset()
    }
  } catch {
    p.innerText = 'Submission failed'
    formTextError.map((c) => p.classList.add(c))
  } finally {
    formProgress.map((c) => form.classList.remove(c))

    for (const i of inputs) {
      i.removeAttribute('disabled')
    }

    formTextWarn.map((c) => p.classList.remove(c))
    setTimeout(() => {
      p.remove()
    }, 5000)
  }
}
