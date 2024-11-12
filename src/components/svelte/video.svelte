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
  manifest,
  poster,
  qualities,
  thumbs
}: {
  manifest: string
  poster: string
  qualities: {
    [Key in '1080' | '720' | '480' | '360' | '240' | '144']: string[]
  }
  thumbs: {
    manifest: string
    src: string
  }
} = $props()

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
    const manifest144p = URL.createObjectURL(
      new Blob(
        [
          manifest.replace(
            /{{% segment %}}/g,
            () => `${location.origin}${qualities['144'].shift()}`
          )
        ],
        {
          type: 'application/x-mpegurl'
        }
      )
    )

    const manifest240p = URL.createObjectURL(
      new Blob(
        [
          manifest.replace(
            /{{% segment %}}/g,
            () => `${location.origin}${qualities['240'].shift()}`
          )
        ],
        {
          type: 'application/x-mpegurl'
        }
      )
    )

    const manifest360p = URL.createObjectURL(
      new Blob(
        [
          manifest.replace(
            /{{% segment %}}/g,
            () => `${location.origin}${qualities['360'].shift()}`
          )
        ],
        {
          type: 'application/x-mpegurl'
        }
      )
    )

    const manifest480p = URL.createObjectURL(
      new Blob(
        [
          manifest.replace(
            /{{% segment %}}/g,
            () => `${location.origin}${qualities['480'].shift()}`
          )
        ],
        {
          type: 'application/x-mpegurl'
        }
      )
    )

    const manifest720p = URL.createObjectURL(
      new Blob(
        [
          manifest.replace(
            /{{% segment %}}/g,
            () => `${location.origin}${qualities['720'].shift()}`
          )
        ],
        {
          type: 'application/x-mpegurl'
        }
      )
    )

    const manifest1080p = URL.createObjectURL(
      new Blob(
        [
          manifest.replace(
            /{{% segment %}}/g,
            () => `${location.origin}${qualities['1080'].shift()}`
          )
        ],
        {
          type: 'application/x-mpegurl'
        }
      )
    )

    let newM3u8 = m3u8.replace('{{% 144p %}}', manifest144p)
    newM3u8 = newM3u8.replace('{{% 240p %}}', manifest240p)
    newM3u8 = newM3u8.replace('{{% 360p %}}', manifest360p)
    newM3u8 = newM3u8.replace('{{% 480p %}}', manifest480p)
    newM3u8 = newM3u8.replace('{{% 720p %}}', manifest720p)
    newM3u8 = newM3u8.replace('{{% 1080p %}}', manifest1080p)

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

    blobs.push(manifest144p)
    blobs.push(manifest240p)
    blobs.push(manifest360p)
    blobs.push(manifest480p)
    blobs.push(manifest720p)
    blobs.push(manifest1080p)
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
