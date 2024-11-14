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
  poster,
  qualities,
  thumbs
}: {
  poster: string
  qualities: {
    [Key in '1080' | '720' | '480' | '360' | '240' | '144']: string[]
  }
  thumbs: {
    manifest: string
    src: string
  }
} = $props()

if (
  Object.values(qualities)
    .map((quality) => quality.length)
    .some((quality, _, qualityLengths) => quality !== qualityLengths[0])
) {
  throw new Error('some qualities have less segments than others')
}

const blobs: string[] = []

const m3u8 =
  '#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-STREAM-INF:BANDWIDTH=2780800,RESOLUTION=1920x1080,CODECS="avc1.640028,mp4a.40.2"\n{{% 1080p %}}\n\n#EXT-X-STREAM-INF:BANDWIDTH=2415600,RESOLUTION=1280x720,CODECS="avc1.64001f,mp4a.40.2"\n{{% 720p %}}\n\n#EXT-X-STREAM-INF:BANDWIDTH=2068000,RESOLUTION=854x480,CODECS="avc1.64001f,mp4a.40.2"\n{{% 480p %}}\n\n#EXT-X-STREAM-INF:BANDWIDTH=1720400,RESOLUTION=640x360,CODECS="avc1.64001e,mp4a.40.2"\n{{% 360p %}}\n\n#EXT-X-STREAM-INF:BANDWIDTH=1372800,RESOLUTION=426x240,CODECS="avc1.640015,mp4a.40.2"\n{{% 240p %}}\n\n#EXT-X-STREAM-INF:BANDWIDTH=1025200,RESOLUTION=256x144,CODECS="avc1.64000d,mp4a.40.2"\n{{% 144p %}}\n'

let player: MediaPlayerElement | null = $state(null)
let videoLayout: MediaVideoLayoutElement | null = $state(null)

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
    const manifest =
      '#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-TARGETDURATION:2\n#EXT-X-MEDIA-SEQUENCE:0\n#EXT-X-PLAYLIST-TYPE:VOD\n'

    let newM3u8 = m3u8

    for (const quality of Object.keys(qualities)) {
      const currentQuality = qualities[quality as keyof typeof qualities]
      let qualityManifest = manifest
      for (const src of currentQuality) {
        qualityManifest += `#EXTINF:2.000000,\n${location.origin}${src}\n`
      }
      qualityManifest += '#EXT-X-ENDLIST\n'
      qualityManifest = URL.createObjectURL(
        new Blob([qualityManifest], {
          type: 'application/x-mpegurl'
        })
      )
      newM3u8 = newM3u8.replace(
        new RegExp(`{{% ${quality}p %}}`),
        qualityManifest
      )
      blobs.push(qualityManifest)
    }

    const newThumbs = URL.createObjectURL(
      new Blob(
        [
          thumbs.manifest.replaceAll(
            '{{% thumbs %}}',
            `${location.origin}${thumbs.src}`
          )
        ],
        {
          type: 'text/vtt'
        }
      )
    )

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

    videoLayout.thumbnails = newThumbs
  }
})
</script>

<media-player bind:this={player} onprovider-change={onProviderChange}>
  <media-provider>
    <media-poster src="/.netlify/images?url={poster}&w=1920"></media-poster>
  </media-provider>
  <media-video-layout bind:this={videoLayout}></media-video-layout>
</media-player>

<svelte:window {onbeforeunload}/>
