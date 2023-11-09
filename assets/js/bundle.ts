import {autoPlacement, computePosition, offset, shift} from '@floating-ui/dom'
import {Autoplay, EffectCards, Navigation} from 'swiper/modules'
import axios from 'axios'
import Hls from 'hls.js'
import {isHLSProvider, type MediaProviderChangeEvent} from 'vidstack'
import LazyLoad from 'vanilla-lazyload'
import type {MediaPlayerElement} from 'vidstack/elements'
import {register, type SwiperContainer} from 'swiper/element/bundle'
import type {SwiperModule, SwiperOptions} from 'swiper/types'
import '@appnest/masonry-layout'
import 'vidstack/player'
import 'vidstack/player/layouts'
import 'vidstack/player/ui'
type SwiperModuleNames = 'autoplay' | 'cards' | 'navigation'
register()
const html = document.querySelector<HTMLHtmlElement>('html')!
const masonryObserver = new ResizeObserver(masonryEntries => {
  masonryEntries.forEach(masonryEntry => {
    if (window.innerWidth < 768) {
      masonryEntry.target.setAttribute('cols', '1')
    } else {
      masonryEntry.target.setAttribute('cols', '2')
    }
  })
})
const moonIcon = 'M2.57,24a24,24,0,0,1,24-24,29.23,29.23,0,0,1,4.38.4,1.12,1.12,0,0,1,.35,2.08A18.8,18.8,0,0,0,44.09,37.3a1.12,1.12,0,0,1,1.08,1.81A24,24,0,0,1,2.57,24Z'
const sunIcon = 'M11.27,14.46a2.23,2.23,0,0,0,1.59.66,2.25,2.25,0,0,0,1.6-3.84L10.21,7A2.25,2.25,0,0,0,7,10.21ZM24,10.5a2.25,2.25,0,0,0,2.25-2.25v-6a2.25,2.25,0,0,0-4.5,0v6A2.25,2.25,0,0,0,24,10.5ZM10.5,24a2.25,2.25,0,0,0-2.25-2.25h-6a2.25,2.25,0,0,0,0,4.5h6A2.24,2.24,0,0,0,10.5,24Zm24.64-8.89a2.25,2.25,0,0,0,1.59-.66L41,10.21A2.25,2.25,0,0,0,37.79,7l-4.24,4.24a2.25,2.25,0,0,0,0,3.18A2.19,2.19,0,0,0,35.14,15.11ZM24,37.5a2.25,2.25,0,0,0-2.25,2.25v6a2.25,2.25,0,0,0,4.5,0v-6A2.25,2.25,0,0,0,24,37.5Zm-12.73-4L7,37.79A2.25,2.25,0,1,0,10.21,41l4.24-4.24a2.25,2.25,0,0,0-3.18-3.19ZM45.75,21.75h-6a2.25,2.25,0,0,0,0,4.5h6a2.25,2.25,0,0,0,0-4.5Zm-9,11.79a2.25,2.25,0,0,0-3.18,3.18L37.79,41A2.25,2.25,0,0,0,41,37.79ZM24,13.5A10.5,10.5,0,1,0,34.5,24,10.5,10.5,0,0,0,24,13.5Z'
const swiperModules : {
  [key in SwiperModuleNames] : SwiperModule
} = {
  autoplay: Autoplay,
  cards: EffectCards,
  navigation: Navigation
}
const themeButton = document.querySelector<HTMLButtonElement>('button[aria-label="Toggle theme"]')!
const themePath = themeButton.querySelector<SVGPathElement>('path')!
function setTheme(theme : 'dark' | 'light') {
  if (theme === 'dark') {
    html.classList.add('dark')
    html.classList.remove('light')
    themePath.setAttribute('d', sunIcon)
  } else {
    html.classList.add('light')
    html.classList.remove('dark')
    themePath.setAttribute('d', moonIcon)
  }
}
function checkTheme() {
  const selectedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
  if (selectedTheme) {
    if (selectedTheme === 'dark') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark')
  } else {
    setTheme('light')
  }
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkTheme)
}
themeButton.addEventListener('click', () => {
  if (html.classList.contains('light')) {
    setTheme('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    setTheme('light')
    localStorage.setItem('theme', 'light')
  }
  window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', checkTheme)
})
document.querySelectorAll<HTMLFormElement>('form').forEach(form => {
  form.querySelectorAll<HTMLTextAreaElement>('textarea').forEach(textarea => {
    textarea.addEventListener('input', () => {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight + 2}px`
    })
  })
  form.addEventListener('submit', event => {
    event.preventDefault()
    const formStatus = document.createElement('p')
    formStatus.classList.add('bg-yellow-500', 'box-border', 'm-t-6', 'p-2', 'text-center', 'text-dark-500')
    formStatus.innerText = 'Submitting...'
    form.appendChild(formStatus)
    axios({
      data: new FormData(form),
      method: 'post',
      responseType: 'text',
      url: '/'
    }).then(() => {
      form.reset()
      formStatus.classList.remove('bg-yellow-500', 'text-dark-500')
      formStatus.classList.add('bg-green-500', 'text-light-500')
      formStatus.innerText = 'Successfully submitted!'
    }, formSubmitError => {
      console.error('Error submitting form: ', formSubmitError)
      formStatus.classList.remove('bg-yellow-500', 'text-dark-500')
      formStatus.classList.add('bg-red-500', 'text-light-500')
      formStatus.innerText = 'Failed to submit form!'
    }).finally(() => {
      setTimeout(() => {
        formStatus.remove()
      }, 5000)
    })
  })
})
document.querySelector<HTMLButtonElement>('button[aria-label="Toggle navigation"]')!.addEventListener('click', () => {
  const navigation = document.querySelector<HTMLDivElement>('nav')!
  if (navigation.classList.contains('transform-translate-y--45')) {
    navigation.classList.remove('transform-translate-y--45')
  } else {
    navigation.classList.add('transform-translate-y--45')
  }
})
document.querySelectorAll<HTMLButtonElement>('button[aria-label]').forEach(tooltipButton => {
  const tooltipSpan = tooltipButton.querySelector<HTMLSpanElement>('span')!
  function hideTooltip() {
    tooltipSpan.removeAttribute('style')
  }
  function showTooltip() {
    if (!tooltipButton.hasAttribute('data-tooltip-hide')) {
      tooltipSpan.style.display = 'block'
      computePosition(tooltipButton, tooltipSpan, {
        middleware: [
          offset(12),
          shift(),
          autoPlacement({
            allowedPlacements: [
              'bottom',
              'top'
            ]
          })
        ]
      }).then(themeTooltipComputation => {
        tooltipSpan.style.left = `${themeTooltipComputation.x}px`
        tooltipSpan.style.top = `${themeTooltipComputation.y}px`
      })
    }
  }
  tooltipButton.addEventListener('mouseenter', showTooltip)
  tooltipButton.addEventListener('mouseleave', hideTooltip)
})
document.querySelectorAll<HTMLElement>('masonry-layout').forEach(masonryLayout => {
  masonryObserver.observe(masonryLayout)
})
document.querySelectorAll<MediaPlayerElement>('media-player').forEach(videoElement => {
  videoElement.addEventListener('provider-change', (videoProverChangeEvent : MediaProviderChangeEvent) => {
    const provider = videoProverChangeEvent.detail
    if (isHLSProvider(provider)) {
      provider.library = Hls
    }
  })
})
document.querySelectorAll<SwiperContainer>('swiper-container').forEach(swiperContainer => {
  const swiperProps : SwiperOptions & {
    modules : Array<SwiperModuleNames>
  } = JSON.parse(swiperContainer.getAttribute('data-swiper')!)
  Object.assign(swiperContainer, {
    ...swiperProps,
    modules: (swiperProps.modules || []).map((module : SwiperModuleNames) => {
      return swiperModules[module]
    }),
    navigation: {
      nextEl: swiperContainer.parentElement!.querySelector('button:nth-child(2)'),
      prevEl: swiperContainer.parentElement!.querySelector('button:nth-child(1)')
    },
    on: {
      init: (swiper) => {
        if (swiper.navigation) {
          swiper.navigation.destroy()
        }
      }
    }
  } as SwiperOptions)
  swiperContainer.initialize()
})
new LazyLoad({
  cancel_on_exit: true,
  data_src: 'src',
  elements_selector: '[lazy]',
  restore_on_error: true,
  unobserve_completed: true
})
checkTheme()