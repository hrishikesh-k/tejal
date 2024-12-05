// added script here to Biome can lint it

import Swiper from 'swiper'
import { Autoplay, EffectCards, EffectFade, Navigation } from 'swiper/modules'
import type { SwiperOptions } from 'swiper/types'
import type { MediaPlayerElement } from 'vidstack/elements'

function resizeMasonry(masonry: HTMLDivElement, vw: number) {
  const columns = vw < 640 ? 1 : vw < 768 ? 2 : 3
  const gap = 24
  const columnHeights = new Array(columns).fill(0)
  const columnWidth = (masonry.clientWidth - (columns - 1) * gap) / columns

  for (const item of masonry.querySelectorAll('picture')) {
    const shortestColumnIndex = columnHeights.indexOf(
      Math.min(...columnHeights)
    )
    item.style.height = 'auto'
    item.style.position = 'absolute'
    item.style.width = `${columnWidth}px`
    item.style.top = `${columnHeights[shortestColumnIndex]}px`
    item.style.left = `${shortestColumnIndex * (columnWidth + gap)}px`
    columnHeights[shortestColumnIndex] += item.offsetHeight + gap
  }

  masonry.style.height = `${Math.max(...columnHeights)}px`
}

function resizePlayer(player: MediaPlayerElement) {
  const computedStyles = getComputedStyle(player)
  const originalHeight = Number.parseInt(computedStyles.height)
  const originalWidth = Number.parseInt(computedStyles.width)

  if (originalHeight > originalWidth) {
    player.style.maxWidth = `${Math.round(((window.innerHeight * 0.8) / originalHeight) * originalWidth)}px`
  }
}

function resizeRecaptcha(recaptcha: HTMLDivElement, vw: number) {
  const parentDiv = recaptcha.parentElement as HTMLDivElement
  parentDiv.classList.remove(vw < 420 ? 'm-y-6' : 'scale-75')
  parentDiv.classList.add(vw < 420 ? 'scale-75' : 'm-y-6')
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

export class AstroSwiper extends HTMLElement {
  connectedCallback() {
    const options: SwiperOptions = {
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      cardsEffect: {
        slideShadows: false
      },
      modules: [Autoplay],
      speed: 500
    }

    if (this.dataset['effect'] === 'cards') {
      options.centeredSlides = true
      options.effect = 'cards'
      options.modules?.push(EffectCards)
    } else if (this.dataset['effect'] === 'fade') {
      options.centeredSlides = true
      options.effect = 'fade'
      options.modules?.push(EffectFade)
    } else {
      options.breakpoints = {
        640: {
          slidesPerView: 1
        },
        768: {
          slidesPerView: 2
        },
        1024: {
          slidesPerView: 3
        }
      }
      options.spaceBetween = 24
    }

    if (this.dataset['center']) {
      options.centeredSlides = true
    }

    if (this.dataset['navigation'] === 'true') {
      options.modules?.push(Navigation)
      options.navigation = {
        nextEl: this.nextElementSibling as HTMLButtonElement,
        prevEl: this.previousElementSibling as HTMLButtonElement
      }
    }

    new Swiper(this, options)
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
      document.querySelectorAll<HTMLDivElement>('.g-recaptcha')
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
