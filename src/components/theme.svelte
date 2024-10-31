<script lang="ts">
import { onMount } from 'svelte'
import Tooltip from '~/components/tooltip.svelte'

let icon: 'moon' | 'sun-bright' = $state('moon')
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

function onclick() {
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
<Tooltip {icon} {onclick} text="Toggle theme"/>
