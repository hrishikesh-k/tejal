import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const advertisingCollection = defineCollection({
  loader: glob({
    base: './src/content/advertising/',
    pattern: '**/[^_]*.md'
  }),
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
    })
})

const fashionCollection = defineCollection({
  loader: glob({
    base: './src/content/fashion/',
    pattern: '**/[^_]*.md'
  }),
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
    })
})

const presentationCollection = defineCollection({
  loader: glob({
    base: './src/content/presentations/',
    pattern: '**/[^_]*.md'
  }),
  schema: (context) =>
    z.object({
      cover: context.image(),
      draft: z.optional(z.boolean().default(false)),
      pdf: z.optional(z.boolean().default(true)),
      title: z.string(),
      weight: z.number()
    })
})

export const collections = {
  advertising: advertisingCollection,
  fashion: fashionCollection,
  presentation: presentationCollection
}
