import Swiper from 'swiper'
import { Autoplay, EffectCards, EffectFade, Navigation } from 'swiper/modules'
import type { SwiperOptions } from 'swiper/types'

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
