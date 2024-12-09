<script lang="ts">
import Icon from '~/components/svelte/icon.svelte'
import Tooltip from '~/components/svelte/tooltip.svelte'
// biome-ignore lint/style/useImportType: also used as component, but Biome can't check Svelte
import { collectionList } from '~/utils/constants.ts'

let {
  collection,
  menu
}: {
  collection?: (typeof collectionList)[number]['slug']
  menu?: 'about' | 'contact' | 'work'
} = $props()

const mainAnchorActiveClass = ['after:w-20', 'md:after:w-full'].join(' ')

const mainAnchorBaseClass = [
  'after:bg-current',
  'after:border-rounded-0.25',
  'after:bottom-0.5',
  'after:content',
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

let open = $state(false)

function onclickNavigation() {
  open = !open
}
</script>

<nav class="bg-light-500 flex flex-col md:flex-row gap-x-3 items-center left-0 pos-absolute md:pos-static transition-duration-250 transition-top w-full md:w-unset" class:top-4={open} class:top--30={!open}>
  <div class="cursor-pointer flex gap-x-1 group items-center justify-center {mainAnchorBaseClass} {menu === 'work' && mainAnchorActiveClass}">
    <span>Work</span>
    <Icon name="caret-down" size={3}/>
    <div class="bg-light-500 border-0.25 border-gray-300 border-rounded-1.5 border-solid bottom--36 box-border hidden group-hover:block pos-absolute right-3/8 md:right-0 z-1">
      {#each collectionList as collectionEntry, index (collectionEntry)}
        <a class="{subAnchorClass} {index === 0 && 'border-t-rounded-1.5'} {index === 3 && 'border-b-rounded-1.5'}" href="/work/{collectionEntry.slug}/">
          {#if collectionEntry.slug === collection}
            <Icon name="caret-right" size={3}/>
          {/if}
          <span class="block flex-basis-0 flex-grow-1 flex-shrink-1">{collectionEntry.name}</span>
        </a>
      {/each}
    </div>
  </div>
  <a class="{mainAnchorBaseClass} {menu === 'about' ? mainAnchorActiveClass : mainAnchorPassiveClass}" href="/about/">About</a>
  <a class="{mainAnchorBaseClass} {menu === 'contact' ? mainAnchorActiveClass : mainAnchorPassiveClass}" href="/contact/">Contact</a>
</nav>
<div class="block md:hidden z-1">
  <Tooltip onclick={onclickNavigation} icon="bars" text="Toggle navigation"/>
</div>
