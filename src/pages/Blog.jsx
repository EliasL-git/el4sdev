import React, { useEffect } from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { getAllPosts } from '../lib/blogs'
import styles from './Blog.module.css'

export default function Blog() {
  const posts = getAllPosts()

  useEffect(() => {
    document.title = 'Blog — el4s'
  }, [])

  function formatDate(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className={styles.page}>
      <SiteHeader current="/blog" />
      <main className={styles.main}>
        <header className={styles.hero}>
          <h1 className={styles.title}>Blog</h1>
          <p className={styles.subtitle}>
            Thoughts on software, photography, and the creative process.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className={styles.empty}>No posts yet — check back soon.</p>
        ) : (
          <div className={styles.grid}>
            {posts.map((post) => {
              const hasUpdated = post.updatedAt && post.updatedAt !== post.publishedAt
              return (
                <article key={post.slug} className={styles.card}>
                  <a
                    href={`/blog/${post.slug}`}
                    className={styles.cardLink}
                    onClick={(e) => {
                      e.preventDefault()
                      window.navigate(`/blog/${post.slug}`)
                    }}
                  >
                    <h2 className={styles.cardTitle}>{post.title}</h2>
                    {post.description && (
                      <p className={styles.cardDesc}>{post.description}</p>
                    )}
                    <div className={styles.cardMeta}>
                      <span className={styles.cardAuthor}>{post.author}</span>
                      <span className={styles.cardMetaSep}>·</span>
                      <time className={styles.cardDate}>{formatDate(post.publishedAt)}</time>
                      {hasUpdated && (
                        <>
                          <span className={styles.cardMetaSep}>·</span>
                          <span className={styles.cardUpdated}>Updated {formatDate(post.updatedAt)}</span>
                        </>
                      )}
                      <span className={styles.cardMetaSep}>·</span>
                      <span className={styles.cardReadTime}>{post.readTime}</span>
                    </div>
                    {post.tags.length > 0 && (
                      <div className={styles.tags}>
                        {post.tags.map((tag) => (
                          <span key={tag} className={styles.tag}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </a>
                </article>
              )
            })}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
