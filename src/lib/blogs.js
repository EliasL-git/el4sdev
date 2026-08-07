// Generated at build time by scripts/generate-posts.js
// Contains pre-rendered HTML — no markdown parsing in the browser
import posts from './posts.json'

export function getAllPosts() {
  return posts
}

export function getPostBySlug(slug) {
  return posts.find(p => p.slug === slug) || null
}
