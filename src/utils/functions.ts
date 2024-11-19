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

export function resizeMasonry(masonry: HTMLDivElement) {
  const vw = document.documentElement.clientWidth

  let columns = 0

  if (vw < 640) {
    columns = 1
  } else if (vw < 768) {
    columns = 2
  } else {
    columns = 3
  }

  const gap = 24
  const columnHeights = new Array(columns).fill(0)
  const columnWidth = (masonry.clientWidth - (columns - 1) * gap) / columns

  for (const item of masonry.querySelectorAll('picture')) {
    const shortestColumnIndex = columnHeights.indexOf(
      Math.min(...columnHeights)
    )
    item.style.height = 'auto'
    item.style.position = 'absolute'
    item.style.width = `${columnWidth}px`
    item.style.top = `${columnHeights[shortestColumnIndex]}px`
    item.style.left = `${shortestColumnIndex * (columnWidth + gap)}px`
    columnHeights[shortestColumnIndex] += item.offsetHeight + gap
  }

  masonry.style.height = `${Math.max(...columnHeights)}px`
}
