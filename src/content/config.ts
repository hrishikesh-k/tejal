import { defineCollection, z } from 'astro:content'

const advertisingCollection = defineCollection({
  schema: z.object({
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
