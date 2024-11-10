import type { InferEntrySchema } from 'astro:content'
import placeholder from '~/assets/placeholder.png'

export function findAsset(
  post: {
    collection: string
    data: InferEntrySchema<'advertising'>
    id: string
    slug: string
  },
  name: string
) {
  if (post.data.assets) {
    return post.data.assets.find((asset) => asset.name === name) as NonNullable<
      Extract<InferEntrySchema<'advertising'>['assets'], object[]>
    >[number]
  }
  return {
    alt: 'asset not found',
    img: placeholder,
    name: 'placeholder'
  }
}

export function setParentWidth(img: HTMLImageElement, parent: HTMLElement) {
  if (window.innerWidth < 1024) {
    parent.style.removeProperty('max-width')
  } else {
    const originalHeight = Number.parseInt(img.getAttribute('height') || '0')
    const renderedHeight = Number.parseInt(
      getComputedStyle(img).height.slice(0, -2)
    )
    parent.style.maxWidth = `${Math.round((renderedHeight / originalHeight) * Number.parseInt(img.getAttribute('width') || '0'))}px`
  }
}
