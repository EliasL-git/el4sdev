import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { marked } from 'marked'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const contentDir = path.join(root, 'content', 'blog')
const outFile = path.join(root, 'src', 'lib', 'posts.json')

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { meta: {}, body: raw }

  const yamlBlock = match[1]
  const body = match[2]
  const meta = {}
  let currentKey = null
  let arrayValues = []

  for (const line of yamlBlock.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const inlineArr = trimmed.match(/^(\w[\w_-]*):\s*\[([^\]]*)\]/)
    if (inlineArr) {
      meta[inlineArr[1]] = inlineArr[2]
        .split(',')
        .map(s => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
      currentKey = null
      continue
    }

    if (currentKey && trimmed.startsWith('- ')) {
      arrayValues.push(trimmed.slice(2).replace(/^["']|["']$/g, ''))
      continue
    }

    if (currentKey && arrayValues.length > 0) {
      meta[currentKey] = arrayValues
      currentKey = null
      arrayValues = []
    }

    const kvMatch = trimmed.match(/^(\w[\w_-]*):\s*(.*)/)
    if (kvMatch) {
      const key = kvMatch[1]
      const value = kvMatch[2].trim()
      if (!value) {
        currentKey = key
        arrayValues = []
      } else {
        currentKey = null
        meta[key] = value.replace(/^["']|["']$/g, '')
      }
    }
  }

  if (currentKey && arrayValues.length > 0) {
    meta[currentKey] = arrayValues
  }

  return { meta, body }
}

function estimateReadTime(body) {
  const words = body.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 225))
  return `${minutes} min read`
}

const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'))

const posts = files.map(filename => {
  const raw = fs.readFileSync(path.join(contentDir, filename), 'utf-8')
  const { meta, body } = parseFrontmatter(raw)
  const slug = filename.replace('.md', '')
  const publishedAt = meta.published_at || meta.date || ''
  const updatedAt = meta.updated_at || publishedAt
  return {
    slug,
    title: meta.title || slug,
    description: meta.description || '',
    author: meta.author || 'el4s',
    tags: Array.isArray(meta.tags) ? meta.tags : meta.tags ? [meta.tags] : [],
    publishedAt,
    updatedAt,
    readTime: estimateReadTime(body),
    html: marked.parse(body),
  }
}).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

fs.mkdirSync(path.dirname(outFile), { recursive: true })
fs.writeFileSync(outFile, JSON.stringify(posts, null, 2), 'utf-8')

console.log(`Generated ${outFile} with ${posts.length} post(s)`)
