import type { ILazyLoadInstance } from 'vanilla-lazyload'

declare global {
  interface Window {
    blobs?: string[]
    ll?: ILazyLoadInstance
    rh?: () => void
  }
}
