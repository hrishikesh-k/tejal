<script lang="ts">
import { autoPlacement, computePosition, offset, shift } from '@floating-ui/dom'
import { tick } from 'svelte'
import Icon from '~/islands/icon.svelte'

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
<button bind:this={button} class="bg-light-900 dark:bg-dark-100 block border-0 border-rounded-1.5 cursor-pointer outline-0 p-2 text-current" onmouseenter={onmouseenter} onmouseleave={onmouseleave}>
  <Icon name="moon"/>
  {#if showTooltip}
    <span bind:this={tooltip} class="bg-light-900 dark:bg-dark-100 border-rounded-1 p-2 pointer-none pos-absolute text-3 text-current" style:left="{left}px" style:top="{top}px">Toggle theme</span>
  {/if}
</button>
