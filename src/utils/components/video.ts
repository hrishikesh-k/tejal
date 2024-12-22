import hls from 'hls.js'
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

export class AstroVideo extends HTMLElement {
  override dataset: {
    qualities: string
    thumbs: string
    vertical?: 'true'
  } = {
    qualities: '{}',
    thumbs: ''
  }
  connectedCallback() {
    const horizontalDimensions = {
      '1080': '1920x1080',
      '720': '1280x720',
      '480': '854x480',
      '360': '640x360',
      '240': '426x240',
      '144': '256x144'
    }

    const player = this.querySelector('media-player') as MediaPlayerElement
    const qualities = JSON.parse(this.dataset.qualities)
    const qualitiesKeys = Object.keys(qualities)
    const vertical = Boolean(this.dataset.vertical)

    const thumbs = generateThumbsVtt(
      player.duration,
      this.dataset.thumbs,
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
        player.duration,
        index === qualitiesKeys.length - 1,
        m3u8,
        quality,
        qualities[quality]
      )
    }

    window.blobs.push(m3u8)
    window.blobs.push(thumbs)

    player.addEventListener(
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

export function addWindowBeforeUnloadEventHandler() {
  window.addEventListener('beforeunload', () => {
    if (window.blobs) {
      for (const blob of window.blobs) {
        URL.revokeObjectURL(blob)
      }
    }
  })
}

export function resizePlayer(player: MediaPlayerElement) {
  const computedStyles = getComputedStyle(player)
  const originalHeight = Number.parseInt(computedStyles.height)
  const originalWidth = Number.parseInt(computedStyles.width)

  if (originalHeight > originalWidth) {
    player.style.maxWidth = `${Math.round(((window.innerHeight * 0.8) / originalHeight) * originalWidth)}px`
  }
}
