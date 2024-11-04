import { getCollection } from 'astro:content'

const advertisingCollection = await getCollection('advertising')

export const advertisingPosts = advertisingCollection
  .filter((post) => !post.data.draft)
  .sort((post1, post2) => post1.data.weight - post2.data.weight)
  .reverse()
