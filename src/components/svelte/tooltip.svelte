<script lang="ts">
import { autoPlacement, computePosition, offset, shift } from '@floating-ui/dom'
import { type ComponentProps, tick } from 'svelte'
// biome-ignore lint/style/useImportType: also used as component, but Biome can't check Svelte
import Icon from '~/components/svelte/icon.svelte'

let {
  icon,
  onclick,
  text
}: {
  icon: ComponentProps<typeof Icon>['name']
  onclick?: () => void
  text: string
} = $props()

let button: HTMLButtonElement | null = $state(null)
let left = $state(0)
let showTooltip = $state(false)
let tooltip: HTMLSpanElement | null = $state(null)
let top = $state(0)

async function onmouseenter() {
  showTooltip = true
  await tick()
  if (button && tooltip) {
    const pos = await computePosition(button, tooltip, {
      middleware: [
        offset(8),
        shift(),
        autoPlacement({
          allowedPlacements: ['bottom', 'top']
        })
      ]
    })
    left = pos.x
    top = pos.y
  }
}

function onmouseleave() {
  showTooltip = false
}
</script>
<button bind:this={button} class="bg-light-900 dark:bg-dark-100 block border-0 border-rounded-1.5 cursor-pointer outline-0 p-2 text-current" {onclick} {onmouseenter} {onmouseleave}>
  <Icon name={icon} size={5}/>
  {#if showTooltip}
    <span bind:this={tooltip} class="bg-light-900 dark:bg-dark-100 border-rounded-1 p-2 pointer-none pos-absolute text-3 text-current" style:left="{left}px" style:top="{top}px">{text}</span>
  {/if}
</button>
