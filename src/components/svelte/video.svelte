<script lang="ts">
import hls from 'hls.js'
import { onMount } from 'svelte'
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

let {
  duration,
  poster,
  qualities,
  thumbs,
  vertical
}: {
  duration: number
  poster: string
  qualities: {
    [Key in '1080' | '720' | '480' | '360' | '240' | '144']: string[]
  }
  thumbs: string
  vertical?: boolean
} = $props()

const blobs: string[] = []
const horizontalDimensions = {
  '1080': '1920x1080',
  '720': '1280x720',
  '480': '854x480',
  '360': '640x360',
  '240': '426x240',
  '144': '256x144'
}
const verticalDimensions = {
  '1080': '1080x1920',
  '720': '720x1280',
  '480': '480x854',
  '360': '360x640',
  '240': '240x426',
  '144': '144x256'
}

let m3u8 = '#EXTM3U\n#EXT-X-VERSION:3\n'

for (const quality in qualities) {
  const qualityInQualities = quality as keyof typeof qualities
  if (qualities[qualityInQualities].length > 0) {
    m3u8 += '#EXT-X-STREAM-INF:BANDWIDTH=2780800,RESOLUTION='
    if (vertical) {
      m3u8 += verticalDimensions[qualityInQualities]
    } else {
      m3u8 += horizontalDimensions[qualityInQualities]
    }
    m3u8 += `,CODECS="avc1.640028,mp4a.40.2"\n{{% ${quality}p %}}\n\n`
  }
}

let newM3u8 = m3u8
let player: MediaPlayerElement | null = $state(null)
let videoLayout: MediaVideoLayoutElement | null = $state(null)

function generateM3u8ForQuality(_m3u8: string, quality: string) {
  const currentQuality = qualities[quality as keyof typeof qualities]

  let manifest =
    '#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-TARGETDURATION:2\n#EXT-X-MEDIA-SEQUENCE:0\n#EXT-X-PLAYLIST-TYPE:VOD\n'

  for (const [index, src] of currentQuality.entries()) {
    const indexWithDuration = index * 2 + 2
    manifest += `#EXTINF:${indexWithDuration > duration ? indexWithDuration - duration : 2}.000000,\n${location.origin}${src}\n`
  }

  manifest += '#EXT-X-ENDLIST\n'
  manifest = URL.createObjectURL(
    new Blob([manifest], {
      type: 'application/x-mpegurl'
    })
  )

  blobs.push(manifest)
  newM3u8 = newM3u8.replace(new RegExp(`{{% ${quality}p %}}`), manifest)
}

function generateThumbsVtt() {
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

function onbeforeunload() {
  for (const blob of blobs) {
    URL.revokeObjectURL(blob)
  }
}

function onProviderChange(event: MediaProviderChangeEvent) {
  const provider = event.detail
  if (isHLSProvider(provider)) {
    provider.library = hls
  }
}

onMount(() => {
  if (player && videoLayout) {
    const newThumbs = generateThumbsVtt()

    for (const quality of Object.keys(qualities)) {
      generateM3u8ForQuality(m3u8, quality)
    }

    newM3u8 = URL.createObjectURL(
      new Blob([newM3u8], {
        type: 'application/x-mpegurl'
      })
    )

    blobs.push(newM3u8)
    blobs.push(newThumbs)

    player.src = {
      src: newM3u8,
      type: 'application/x-mpegurl'
    }

    if (window.rh) {
      window.rh()
    }

    videoLayout.thumbnails = newThumbs

    // TODO: Set vertical quality indicator correctly
  }
})
</script>

<media-player bind:this={player} onprovider-change={onProviderChange} style:aspect-ratio={vertical ? '9/16' : '16/9'}>
  <media-provider>
    <media-poster class="vds-poster" src="/images/1920{poster}"></media-poster>
  </media-provider>
  <media-video-layout bind:this={videoLayout}></media-video-layout>
</media-player>

<svelte:window {onbeforeunload}/>
