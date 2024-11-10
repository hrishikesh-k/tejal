import { defineCollection, z } from 'astro:content'

const advertisingCollection = defineCollection({
  schema: (context) =>
    z.object({
      assets: z.optional(
        z
          .array(
            z.object({
              alt: z.string(),
              img: context.image(),
              name: z.string()
            })
          )
          .default([])
      ),
      cover: context.image(),
      description: z.string(),
      draft: z.optional(z.boolean().default(false)),
      subtitle: z.optional(z.string()),
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
