// added script here to Biome can lint it

import hls from 'hls.js'
import Swiper from 'swiper'
import { Autoplay, EffectCards, EffectFade, Navigation } from 'swiper/modules'
import type { SwiperOptions } from 'swiper/types'
import { type MediaProviderChangeEvent, isHLSProvider } from 'vidstack'
import type {
  MediaPlayerElement,
  MediaVideoLayoutElement
} from 'vidstack/elements'
import 'vidstack/player'
import 'vidstack/player/layouts/default'
import 'vidstack/player/ui'
import 'vidstack/player/styles/default/theme.css'
import 'vidstack/player/styles/default/layouts/video.css'

function generateM3u8ForQuality(
  duration: number,
  last: boolean,
  m3u8: string,
  quality: string,
  srcs: string[]
) {
  let manifest =
    '#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-TARGETDURATION:2\n#EXT-X-MEDIA-SEQUENCE:0\n#EXT-X-PLAYLIST-TYPE:VOD\n'

  for (const [index, src] of srcs.entries()) {
    const indexWithDuration = index * 2 + 2
    manifest += `#EXTINF:${indexWithDuration > duration ? indexWithDuration - duration : 2}.000000,\n${location.origin}${src}\n`
  }

  manifest += '#EXT-X-ENDLIST\n'
  manifest = URL.createObjectURL(
    new Blob([manifest], {
      type: 'application/x-mpegurl'
    })
  )

  const m3u8Return = m3u8.replace(new RegExp(`{{% ${quality}p %}}`), manifest)

  if (last) {
    return URL.createObjectURL(
      new Blob([m3u8Return], {
        type: 'application/x-mpegurl'
      })
    )
  }

  return m3u8Return
}

function generateThumbsVtt(
  duration: number,
  thumbs: string,
  vertical: boolean
) {
  let thumbsvtt = 'WEBVTT\n\n'

  for (let i = 0; i < duration; i += 2) {
    const height = vertical ? 320 : 108
    const thumbnailIndex = i / 2
    thumbsvtt += `${new Date(i * 1000).toISOString().substring(11, 19)}.000 --> ${new Date((i + 2) * 1000).toISOString().substring(11, 19)}.000\n${location.origin}${thumbs}#xywh=${(thumbnailIndex % 10) * 192},${Math.floor(thumbnailIndex / 10) * height},${192},${height}\n\n`
  }

  return URL.createObjectURL(
    new Blob([thumbsvtt], {
      type: 'text/vtt'
    })
  )
}

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

export class AstroVideo extends HTMLElement {
  connectedCallback() {
    const duration = Number.parseInt(this.dataset['duration'] || '1')

    const horizontalDimensions = {
      '1080': '1920x1080',
      '720': '1280x720',
      '480': '854x480',
      '360': '640x360',
      '240': '426x240',
      '144': '256x144'
    }

    const player = this.querySelector('media-player') as MediaPlayerElement
    const qualities = JSON.parse(this.dataset['qualities'] || '{}')
    const qualitiesKeys = Object.keys(qualities)
    const vertical = Boolean(this.dataset['vertical'])

    const thumbs = generateThumbsVtt(
      duration,
      this.dataset['thumbs'] || '',
      vertical
    )

    const verticalDimensions = {
      '1080': '1080x1920',
      '720': '720x1280',
      '480': '480x854',
      '360': '360x640',
      '240': '240x426',
      '144': '144x256'
    }

    const videoLayout = this.querySelector(
      'media-video-layout'
    ) as MediaVideoLayoutElement

    let m3u8 = '#EXTM3U\n#EXT-X-VERSION:3\n'

    if (!window.blobs) {
      window.blobs = []
    }

    for (const quality in qualities) {
      if (qualities[quality].length > 0) {
        m3u8 += '#EXT-X-STREAM-INF:BANDWIDTH=2780800,RESOLUTION='
        if (vertical) {
          m3u8 += verticalDimensions[quality as keyof typeof verticalDimensions]
        } else {
          m3u8 +=
            horizontalDimensions[quality as keyof typeof horizontalDimensions]
        }
        m3u8 += `,CODECS="avc1.640028,mp4a.40.2"\n{{% ${quality}p %}}\n\n`
      }
    }

    for (const [index, quality] of qualitiesKeys.entries()) {
      m3u8 = generateM3u8ForQuality(
        duration,
        index === qualitiesKeys.length - 1,
        m3u8,
        quality,
        qualities[quality]
      )
    }

    window.blobs.push(m3u8)
    window.blobs.push(thumbs)

    player?.addEventListener(
      'provider-change',
      (event: MediaProviderChangeEvent) => {
        const provider = event.detail
        if (isHLSProvider(provider)) {
          provider.library = hls
        }
      }
    )

    player.src = {
      src: m3u8,
      type: 'application/x-mpegurl'
    }

    videoLayout.thumbnails = thumbs

    if (window.rh) {
      window.rh()
    }
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

export function addWindowBeforeUnloadEventHandler() {
  window.addEventListener('beforeunload', () => {
    if (window.blobs) {
      for (const blob of window.blobs) {
        URL.revokeObjectURL(blob)
      }
    }
  })
}
