import type { HlsVideoElement } from 'hls-video-element'
import type { MediaController } from 'media-chrome/media-controller'

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
  connectedCallback() {
    const horizontalDimensions = {
      '1440': '2560x1440',
      '1080': '1920x1080',
      '720': '1280x720',
      '480': '854x480',
      '360': '640x360',
      '240': '426x240',
      '144': '256x144'
    }

    const controller = this.querySelector('media-controller') as MediaController

    const data = JSON.parse(
      (this.querySelector('script') as HTMLScriptElement).textContent
    ) as {
      qualities: Record<string, string[]>
      thumbs: string
      vertical: boolean
    }

    const hlsVideo = this.querySelector('hls-video') as HlsVideoElement
    const qualities = data.qualities
    const qualitiesKeys = Object.keys(qualities)

    const thumbs = generateThumbsVtt(
      controller.defaultDuration as number,
      data.thumbs,
      data.vertical
    )

    const thumbsTrack = hlsVideo.querySelector(
      'track[label="thumbnails"]'
    ) as HTMLTrackElement

    const verticalDimensions = {
      '1440': '1440x2560',
      '1080': '1080x1920',
      '720': '720x1280',
      '480': '480x854',
      '360': '360x640',
      '240': '240x426',
      '144': '144x256'
    }

    let m3u8 = '#EXTM3U\n#EXT-X-VERSION:3\n'

    if (!window.blobs) {
      window.blobs = []
    }

    for (const quality in qualities) {
      if ((qualities[quality] as string[]).length > 0) {
        // TODO: check bandwidth value
        m3u8 += '#EXT-X-STREAM-INF:BANDWIDTH=2780800,RESOLUTION='
        if (data.vertical) {
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
        controller.defaultDuration as number,
        index === qualitiesKeys.length - 1,
        m3u8,
        quality,
        qualities[quality] as string[]
      )
    }

    window.blobs.push(m3u8)
    window.blobs.push(thumbs)
    hlsVideo.src = m3u8
    thumbsTrack.src = thumbs
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
