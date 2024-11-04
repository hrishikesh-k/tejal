import { defineCollection, z } from 'astro:content'

const advertisingCollection = defineCollection({
  schema: (context) =>
    z.object({
      cover: context.image(),
      description: z.string(),
      draft: z.optional(z.boolean().default(false)),
      title: z.string(),
      weight: z.number()
    }),
  type: 'content'
})

const fashionCollection = defineCollection({
  schema: {},
  type: 'content'
})

export const collections = {
  advertising: advertisingCollection,
  fashionCollection: fashionCollection
}
