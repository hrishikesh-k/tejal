<script lang="ts">
import { type Snippet, onMount } from 'svelte'
import type { SwiperContainer } from 'swiper/element'
import { register } from 'swiper/element'
import { Autoplay, EffectCards, Navigation } from 'swiper/modules'
import type { SwiperOptions } from 'swiper/types'
import Icon from '~/components/svelte/icon.svelte'
import 'swiper/element/css/effect-cards'

let {
  center,
  children,
  effect,
  maxWidth,
  noNavigation
}: {
  center?: boolean
  children: Snippet
  effect?: 'cards'
  maxWidth?: string
  noNavigation?: boolean
} = $props()

const navButtonClass = [
  'bg-transparent',
  'block',
  'border-0',
  'cursor-pointer',
  'disabled:opacity-50',
  'outline-0',
  'p-0',
  'disabled:pointer-none',
  'pos-absolute',
  'text-current',
  'top-1/2',
  'transform',
  'transition-duration-250',
  'transition-opacity',
  'translate-y--1/2'
].join(' ')

let swiperContainer: null | SwiperContainer = $state(null)

onMount(() => {
  register()
  if (swiperContainer?.parentElement) {
    Object.assign(swiperContainer, {
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      breakpoints: effect !== 'cards' && {
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
      cardsEffect: {
        slideShadows: false
      },
      centeredSlides: center || effect === 'cards',
      effect,
      grabCursor: true,
      injectStyles: effect === 'cards' && ['.swiper{overflow: visible}'],
      modules: [
        Autoplay,
        effect === 'cards' && EffectCards,
        !noNavigation && Navigation
      ].filter(Boolean),
      navigation: !noNavigation && {
        nextEl: swiperContainer.parentElement.querySelector(
          'button:nth-child(2)'
        ),
        prevEl: swiperContainer.parentElement.querySelector(
          'button:nth-child(1)'
        )
      },
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

<div class="pos-relative">
  {#if !noNavigation}
    <button class="{navButtonClass} left-0">
      <Icon name="circle-arrow-left"/>
    </button>
    <button class="{navButtonClass} right-0">
      <Icon name="circle-arrow-right"/>
    </button>
  {/if}
  <swiper-container bind:this={swiperContainer} class="block {maxWidth ?? 'max-w-5/6 md:max-w-11/12'}" init="false">
    {@render children()}
  </swiper-container>
</div>
