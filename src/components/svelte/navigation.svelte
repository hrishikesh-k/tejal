<script lang="ts">
import { onMount } from 'svelte'
import { on } from 'svelte/events'
import Icon from '~/components/svelte/icon.svelte'
import Tooltip from '~/components/svelte/tooltip.svelte'

let {
  menu,
  section
}: {
  menu?: 'about' | 'contact' | 'work'
  section?: 'advertising' | 'fashion' | 'presentations'
} = $props()

const mainAnchorActiveClass = ['after:w-20', 'md:after:w-full'].join(' ')

const mainAnchorBaseClass = [
  'after:bg-current',
  'after:border-rounded-0.25',
  'after:bottom-0.5',
  'box-border',
  'decoration-none',
  'after:h-0.5',
  'after:left-1/2',
  'md:after:left-0',
  'p-2',
  'pos-relative',
  'after:pos-absolute',
  'text-center',
  'text-current',
  'after:transform',
  'after:translate-x--1/2',
  'md:after:translate-x-0',
  'w-full',
  'md:w-unset'
].join(' ')

const mainAnchorPassiveClass = [
  'after:transition-duration-250',
  'after:transition-width',
  'after:w-0',
  'after:hover:w-20',
  'md:after:hover:w-full'
].join(' ')

const subAnchorClass = [
  'hover:bg-light-900',
  'hover:dark:bg-dark-900',
  'block',
  'box-border',
  'decoration-none',
  'flex',
  'gap-x-1',
  'items-center',
  'p-2',
  'text-current',
  'text-right'
].join(' ')

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
  on(window.matchMedia('(prefers-color-scheme: dark)'), 'change', checkTheme)
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
  <div class="cursor-pointer flex gap-x-1 group items-center justify-center {mainAnchorBaseClass} {menu === 'work' && mainAnchorActiveClass}">
    <span>Work</span>
    <Icon name="caret-down" size={3}/>
    <div class="bg-light-500 dark:bg-dark-500 border-0.25 border-gray-300 dark:border-gray-500 border-rounded-1.5 border-solid bottom--26 box-border hidden group-hover:block pos-absolute right-3/8 md:right-0 z-1">
      {#each ['Advertising', 'Fashion', 'Presentations'] as sec, index (sec)}
        {@const secLower = sec.toLowerCase()}
        <a class="{subAnchorClass} {index === 0 && 'border-t-rounded-1.5'} {index === 2 && 'border-b-rounded-1.5'}" href="/work/{secLower}/">
          {#if secLower === section}
            <Icon name="caret-right" size={3}/>
          {/if}
          <span class="block flex-basis-0 flex-grow-1 flex-shrink-1">{sec}</span>
        </a>
      {/each}
    </div>
  </div>
  <a class="{mainAnchorBaseClass} {menu === 'about' ? mainAnchorActiveClass : mainAnchorPassiveClass}" href="/about/">About</a>
  <a class="{mainAnchorBaseClass} {menu === 'contact' ? mainAnchorActiveClass : mainAnchorPassiveClass}" href="/contact/">Contact</a>
</nav>
<Tooltip {icon} onclick={onclickTheme} text="Toggle theme"/>
<div class="block md:hidden z-1">
  <Tooltip onclick={onclickNavigation} icon="bars" text="Toggle navigation"/>
</div>
