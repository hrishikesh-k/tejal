import { getCollection } from 'astro:content'

const advertisingCollection = await getCollection('advertising')
const issue19Collection = await getCollection('issue19')
const modellingCollection = await getCollection('modelling')
const presentationCollection = await getCollection('presentation')

export const advertisingPosts = advertisingCollection
  .filter((post) => !post.data.draft)
  .sort((post1, post2) => post1.data.weight - post2.data.weight)
  .reverse()

export const issue19Posts = issue19Collection
  .sort((post1, post2) => post1.data.weight - post2.data.weight)
  .reverse()

export const modellingPosts = modellingCollection
  .filter((post) => !post.data.draft)
  .sort((post1, post2) => post1.data.weight - post2.data.weight)
  .reverse()

export const presentationPosts = presentationCollection
  .filter((post) => !post.data.draft)
  .sort((post1, post2) => post1.data.weight - post2.data.weight)
  .reverse()
