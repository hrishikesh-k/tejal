<script lang="ts">
import { onMount } from 'svelte'
import Icon from '~/components/icon.svelte'
import Tooltip from '~/components/tooltip.svelte'

let icon: 'moon' | 'sun-bright' = $state('moon')
let open = $state(false)
let theme: 'dark' | 'light' = $state('light')

function checkTheme() {
  const selectedTheme = localStorage.getItem('theme') as typeof theme | null
  if (selectedTheme) {
    theme = selectedTheme
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme = 'dark'
  } else {
    theme = 'light'
  }
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', checkTheme)
}

function onclickNavigation() {
  open = !open
}

function onclickTheme() {
  if (theme === 'dark') {
    theme = 'light'
  } else {
    theme = 'dark'
  }
  localStorage.setItem('theme', theme)
}

$effect(() => {
  const html = document.querySelector('html') as HTMLHtmlElement
  if (theme === 'dark') {
    html.classList.add('dark')
    html.classList.remove('light')
    icon = 'sun-bright'
  } else {
    html.classList.add('light')
    html.classList.remove('dark')
    icon = 'moon'
  }
})

onMount(checkTheme)
</script>
<nav class="bg-light-500 dark:bg-dark-500 flex flex-col md:flex-row gap-x-3 items-center left-0 pos-absolute md:pos-static transition-duration-250 transition-top w-full md:w-unset" class:top-4={open} class:top--30={!open}>
  <div class="box-border cursor-pointer flex gap-x-1 group items-center justify-center p-2 pos-relative w-full md:w-unset">
    <span>Work</span>
    <Icon name="caret-down" size={3}/>
    <div class="bg-light-500 dark:bg-dark-500 border-0.25 border-gray-300 dark:border-gray-500 border-rounded-1.5 border-solid bottom--26 box-border hidden group-hover:block pos-absolute right-3/8 md:right-0 z-1">
      <a class="hover:bg-light-900 hover:dark:bg-dark-900 block box-border border-t-rounded-1.5 decoration-none p-2 text-current text-right" href="/work/advertising/">Advertising</a>
      <a class="hover:bg-light-900 hover:dark:bg-dark-900 block box-border decoration-none p-2 text-current text-right" href="/work/fashion/">Fashion</a>
      <a class="hover:bg-light-900 hover:dark:bg-dark-900 block border-b-rounded-1.5 box-border decoration-none p-2 text-current text-right" href="/work/presentations/">Presentations</a>
    </div>
  </div>
  <a class="after:bg-current after:border-rounded-0.25 after:bottom-0.5 box-border decoration-none after:h-0.5 after:left-0 p-2 pos-relative after:pos-absolute text-center text-current after:transition-duration-250 after:transition-width w-full md:w-unset after:w-0 hover:after:w-full" href="/about/">About</a>
  <a class="after:bg-current after:border-rounded-0.25 after:bottom-0.5 box-border decoration-none after:h-0.5 after:left-0 p-2 pos-relative after:pos-absolute text-center text-current after:transition-duration-250 after:transition-width w-full md:w-unset after:w-0 hover:after:w-full" href="/contact/">Contact</a>
</nav>
<Tooltip {icon} onclick={onclickTheme} text="Toggle theme"/>
<div class="block md:hidden z-1">
  <Tooltip onclick={onclickNavigation} icon="bars" text="Toggle navigation"/>
</div>
