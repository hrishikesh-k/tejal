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
