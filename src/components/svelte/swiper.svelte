<script lang="ts">
import { type Snippet, onMount } from 'svelte'
import type { SwiperContainer } from 'swiper/element'
import { register } from 'swiper/element/bundle'
import { Autoplay, Navigation } from 'swiper/modules'
import type { SwiperOptions } from 'swiper/types'

let {
  children
}: {
  children: Snippet
} = $props()

let swiperContainer: null | SwiperContainer = $state(null)

onMount(() => {
  register()
  if (swiperContainer) {
    Object.assign(swiperContainer, {
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      breakpoints: {
        640: {
          slidesPerView: 1
        },
        768: {
          slidesPerView: 2
        },
        1024: {
          slidesPerView: 3
        }
      },
      grabCursor: true,
      modules: [Autoplay, Navigation],
      spaceBetween: 24,
      speed: 500
    } as SwiperOptions)
    /*
      the following is a workaround for https://github.com/withastro/astro/issues/5475
      `<astro-slot>` is required for hydration, but swiper wants `<swiper-slide>`
      to be a direct child of `<swiper-container>`. so we move all `<swiper-slide>`
      out of `<astro-slot>` directly into `<swiper-container>`. practically, this can cause
      hydration errors, but it's already done at this point. other alternatives were to
      make this entire component an Astro component and use querySelectors to work
      with Swiper.
     */
    for (const slide of swiperContainer.querySelectorAll('swiper-slide')) {
      if (swiperContainer) {
        swiperContainer.appendChild(slide)
      }
    }
    swiperContainer.initialize()
  }
})
</script>

<swiper-container bind:this={swiperContainer} init="false">
  {@render children()}
</swiper-container>
