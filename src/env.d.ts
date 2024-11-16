/// <reference path="../.astro/types.d.ts" />

import type { ILazyLoadInstance } from 'vanilla-lazyload'

declare global {
  interface Window {
    ll?: ILazyLoadInstance
    re?: () => void
  }
}
