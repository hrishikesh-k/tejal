<script lang="ts">
import hls from 'hls.js'
import { type MediaProviderChangeEvent, isHLSProvider } from 'vidstack'
import 'vidstack/player'
import 'vidstack/player/layouts/default'
import 'vidstack/player/ui'
import 'vidstack/player/styles/default/theme.css'
import 'vidstack/player/styles/default/layouts/video.css'

let {
  poster,
  src
}: {
  poster: string
  src: string
} = $props()

function onProviderChange(event: MediaProviderChangeEvent) {
  const provider = event.detail
  if (isHLSProvider(provider)) {
    provider.library = hls
  }
}
</script>

<media-player onprovider-change={onProviderChange} src="{src}/index.m3u8">
  <media-provider>
    <media-poster src="/.netlify/images?url={poster}&w=1920"></media-poster>
  </media-provider>
  <media-video-layout thumbnails="{src}/thumbs.vtt"></media-video-layout>
</media-player>
