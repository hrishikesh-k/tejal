// @unocss-include

import type { MediaPlayerElement } from 'vidstack/elements'
import { resizeMasonry } from '~/utils/components/masonry.ts'
import { resizePlayer } from '~/utils/components/video.ts'

function resizeRecaptcha(recaptcha: HTMLDivElement, vw: number) {
  const parentDiv = recaptcha.parentElement as HTMLDivElement
  if (vw < 348) {
    const calc = `${(vw - 48) / 3}%`
    parentDiv.style.setProperty('--u-scale-x', calc)
    parentDiv.style.setProperty('--u-scale-y', calc)
    parentDiv.style.setProperty('--u-scale-z', calc)
  } else {
    parentDiv.style.removeProperty('--u-scale-x')
    parentDiv.style.removeProperty('--u-scale-y')
    parentDiv.style.removeProperty('--u-scale-z')
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
  const linksToRound = container.querySelectorAll('a')

  for (const [index, link] of linksToRound.entries()) {
    roundCorners(index, linksToRound.length, link, vw)
  }
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
    const mediaPlayersToResize =
      document.querySelectorAll<MediaPlayerElement>('media-player')
    const recaptchaToResize =
      document.querySelectorAll<HTMLDivElement>('.cf-turnstile')
    const vw = document.documentElement.clientWidth

    for (const container of linksToRoundContainers) {
      roundCornersInit(container, vw)
    }

    for (const masonry of masonryToResize) {
      resizeMasonry(masonry, vw)
    }

    for (const player of mediaPlayersToResize) {
      resizePlayer(player)
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
