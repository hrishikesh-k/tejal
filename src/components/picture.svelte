<script lang="ts">
import { onMount } from 'svelte'
import LazyLoad from 'vanilla-lazyload'

const presetWidths = [320, 375, 414, 640, 768, 1024, 1280, 1440, 1920]

let {
  alt,
  height,
  maxWidth = 1920,
  src,
  width
}: {
  alt: string
  height: number
  maxWidth?: number
  src: string
  width: number
} = $props()

let widths = $derived(
  presetWidths
    .filter((presetWidth) => presetWidth < maxWidth && presetWidth <= width)
    .concat([maxWidth])
)

function generateImageCdnUrl(w: number) {
  return `/.netlify/images?url=${src}&w=${w}`
}

onMount(() => {
  if (window.ll) {
    window.ll.update()
  } else {
    window.ll = new LazyLoad({
      // biome-ignore lint/style/useNamingConvention: library code
      callback_loaded(el) {
        el.classList.remove('blur-2')
        el.classList.remove('filter')
      }
    })
  }
})
</script>
<picture class="block overflow-hidden">
  <!--
    The logic for the following block is as follows:
      - For each width of the generated widths array, do the following:
        - if the current width is last in the array:
          - if the widths array has more than 1 items:
            - set the min width to the second last width, but generate the image for the current width.
              this would be required when you're at the max width
          - else:
            - set the current width as the only available width.
              this would happen if you set a width lower than or equal to the min width from presetWidths
        - else:
          - set the current width as the max width and generate the image for the current width.
      - end loop
  -->
  {#each widths as width, i}
    {#if i === widths.length - 1}
      {#if widths.length > 1}
        <source data-srcset="{generateImageCdnUrl(width)}" media="(min-width: {widths[i - 1]}px)"/>
      {:else}
        <source data-srcset="{generateImageCdnUrl(width)}"/>
      {/if}
    {:else}
      <source data-srcset="{generateImageCdnUrl(width)}" media="(max-width: {width}px)"/>
    {/if}
  {/each}
  <img {alt} class="block blur-2 filter h-full lazy object-contain transition-duration-250 transition-filter w-full" {height} src="{generateImageCdnUrl(64)}" {width}/>
</picture>
