import React, { useEffect } from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { getPostBySlug, getAllPosts } from '../lib/blogs'
import styles from './BlogPost.module.css'

export default function BlogPost({ slug }) {
  const post = getPostBySlug(slug)

  useEffect(() => {
    if (post) {
      document.title = `${post.title} — el4s`
    }
  }, [post])

  function formatDate(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (!post) {
    return (
      <div className={styles.page}>
        <SiteHeader current="/blog" />
        <main className={styles.main}>
          <h1 className={styles.notFoundTitle}>Post not found</h1>
          <p className={styles.notFoundText}>
            That blog post doesn't exist.{' '}
            <a
              href="/blog"
              className={styles.backLink}
              onClick={(e) => {
                e.preventDefault()
                window.navigate('/blog')
              }}
            >
              Back to all posts
            </a>
          </p>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const posts = getAllPosts()
  const idx = posts.findIndex(p => p.slug === slug)
  const prev = idx < posts.length - 1 ? posts[idx + 1] : null
  const next = idx > 0 ? posts[idx - 1] : null
  const hasUpdated = post.updatedAt && post.updatedAt !== post.publishedAt

  return (
    <div className={styles.page}>
      <SiteHeader current="/blog" />
      <main className={styles.main}>
        <a
          href="/blog"
          className={styles.back}
          onClick={(e) => {
            e.preventDefault()
            window.navigate('/blog')
          }}
        >
          ← All posts
        </a>

        <article className={styles.article}>
          <header className={styles.header}>
            <h1 className={styles.title}>{post.title}</h1>
            {post.description && (
              <p className={styles.desc}>{post.description}</p>
            )}

            <div className={styles.meta}>
              <span className={styles.author}>{post.author}</span>
              <span className={styles.metaSep}>·</span>
              <time className={styles.metaDate}>{formatDate(post.publishedAt)}</time>
              {hasUpdated && (
                <>
                  <span className={styles.metaSep}>·</span>
                  <span className={styles.metaUpdated}>Updated {formatDate(post.updatedAt)}</span>
                </>
              )}
              <span className={styles.metaSep}>·</span>
              <span className={styles.metaReadTime}>{post.readTime}</span>
            </div>

            {post.tags.length > 0 && (
              <div className={styles.tags}>
                {post.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            )}
          </header>

          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </article>

        {(prev || next) && (
          <nav className={styles.pagination}>
            {prev && (
              <a
                href={`/blog/${prev.slug}`}
                className={styles.paginationLink}
                onClick={(e) => {
                  e.preventDefault()
                  window.navigate(`/blog/${prev.slug}`)
                }}
              >
                <span className={styles.paginationLabel}>← Older</span>
                <span className={styles.paginationTitle}>{prev.title}</span>
              </a>
            )}
            {next && (
              <a
                href={`/blog/${next.slug}`}
                className={`${styles.paginationLink} ${styles.paginationNext}`}
                onClick={(e) => {
                  e.preventDefault()
                  window.navigate(`/blog/${next.slug}`)
                }}
              >
                <span className={styles.paginationLabel}>Newer →</span>
                <span className={styles.paginationTitle}>{next.title}</span>
              </a>
            )}
          </nav>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
