import { marked } from 'marked'

// Parse YAML frontmatter from a markdown string
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };

  const yamlBlock = match[1];
  const body = match[2];

  const meta = {};
  let currentKey = null;
  let arrayValues = [];

  const lines = yamlBlock.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Inline array: key: [a, b, c]
    const inlineArr = trimmed.match(/^(\w[\w_-]*):\s*\[([^\]]*)\]/);
    if (inlineArr) {
      meta[inlineArr[1]] = inlineArr[2]
        .split(',')
        .map(s => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
      currentKey = null;
      continue;
    }

    // Multi-line array continuation: - value
    if (currentKey && trimmed.startsWith('- ')) {
      arrayValues.push(trimmed.slice(2).replace(/^["']|["']$/g, ''));
      continue;
    }

    // Finish previous array if we're starting a new key
    if (currentKey && arrayValues.length > 0) {
      meta[currentKey] = arrayValues;
      currentKey = null;
      arrayValues = [];
    }

    // Key: value
    const kvMatch = trimmed.match(/^(\w[\w_-]*):\s*(.*)/);
    if (kvMatch) {
      const key = kvMatch[1];
      const value = kvMatch[2].trim();
      if (!value) {
        // Potentially start of multi-line array
        currentKey = key;
        arrayValues = [];
      } else {
        currentKey = null;
        meta[key] = value.replace(/^["']|["']$/g, '');
      }
    }
  }

  // Flush trailing array
  if (currentKey && arrayValues.length > 0) {
    meta[currentKey] = arrayValues;
  }

  return { meta, body };
}

// Estimate read time from word count (225 wpm average)
function estimateReadTime(body) {
  const words = body.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 225));
  return `${minutes} min read`;
}

// Load all markdown blog posts at build time via Vite glob
const blogModules = import.meta.glob('/content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

// Parse all posts, sorted by date descending
// Markdown is pre-rendered to HTML at module load time so page renders are instant
const posts = Object.entries(blogModules)
  .map(([filepath, raw]) => {
    const { meta, body } = parseFrontmatter(raw);
    const slug = filepath.replace('/content/blog/', '').replace('.md', '');
    const publishedAt = meta.published_at || meta.date || '';
    const updatedAt = meta.updated_at || publishedAt;
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
    };
  })
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export function getAllPosts() {
  return posts;
}

export function getPostBySlug(slug) {
  return posts.find(p => p.slug === slug) || null;
}
