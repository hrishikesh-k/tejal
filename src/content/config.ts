import { defineCollection, z } from 'astro:content'

const defaultCollection = defineCollection({
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

const presentationCollection = defineCollection({
  schema: (context) =>
    z.object({
      cover: context.image(),
      draft: z.optional(z.boolean().default(false)),
      pdf: z.optional(z.boolean().default(true)),
      title: z.string(),
      weight: z.number()
    }),
  type: 'content'
})

export const collections = {
  advertising: defaultCollection,
  fashion: defaultCollection,
  presentation: presentationCollection
}
