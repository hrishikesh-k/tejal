import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const advertisingCollection = defineCollection({
  loader: glob({
    base: './src/content/advertising/',
    pattern: '**/[^_]*.mdx'
  }),
  schema: (context) =>
    z.object({
      cover: context.image(),
      description: z.string(),
      draft: z.optional(z.boolean().default(false)),
      subtitle: z.optional(z.string()),
      title: z.string(),
      weight: z.number()
    })
})

const modellingCollection = defineCollection({
  loader: glob({
    base: './src/content/modelling/',
    pattern: '**/[^_]*.mdx'
  }),
  schema: (context) =>
    z.object({
      cover: context.image(),
      description: z.string(),
      draft: z.optional(z.boolean().default(false)),
      title: z.string(),
      weight: z.number()
    })
})

const presentationCollection = defineCollection({
  loader: glob({
    base: './src/content/presentations/',
    pattern: '**/[^_]*.mdx'
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

const theAmazingFashionMagazineIssue19Collection = defineCollection({
  loader: glob({
    base: './src/content/the-amazing-fashion-magazine-issue-19/',
    pattern: '**/[^_]*.mdx'
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
      title: z.string(),
      weight: z.number()
    })
})

export const collections = {
  advertising: advertisingCollection,
  modelling: modellingCollection,
  presentation: presentationCollection,
  theAmazingFashionMagazineIssue19: theAmazingFashionMagazineIssue19Collection
}
