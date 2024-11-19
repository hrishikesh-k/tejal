import { getCollection } from 'astro:content'

const advertisingCollection = await getCollection('advertising')
const fashionCollection = await getCollection('fashion')
const presentationCollection = await getCollection('presentation')

export const advertisingPosts = advertisingCollection
  .filter((post) => !post.data.draft)
  .sort((post1, post2) => post1.data.weight - post2.data.weight)
  .reverse()

export const fashionPosts = fashionCollection
  .filter((post) => !post.data.draft)
  .sort((post1, post2) => post1.data.weight - post2.data.weight)
  .reverse()

export const presentationPosts = presentationCollection
  .filter((post) => !post.data.draft)
  .sort((post1, post2) => post1.data.weight - post2.data.weight)
  .reverse()
