import type { ILazyLoadInstance } from 'vanilla-lazyload'

declare global {
  interface Window {
    blobs?: string[]
    ll?: ILazyLoadInstance
    rh?: () => void
  }
}

export interface Env {
  // biome-ignore lint/style/useNamingConvention: Environment variable
  PUBLIC_TURNSTILE_SITE_KEY?: string
}
