import React from 'react'
import styles from './Gallery.module.css'

export default function Gallery({ images, fit10, onImageClick }) {
  if (!images || images.length === 0) {
    return (
      <p style={{ color: 'var(--text-muted)', padding: '40px 24px', textAlign: 'center' }}>
        No images found — add files and list them in <code>media/list.json</code>.
      </p>
    )
  }

  return (
    <section
      className={`${styles.gallery}${fit10 ? ` ${styles.fit10}` : ''}`}
      aria-label="Photography gallery"
    >
      {images.map((src, i) => (
        <figure
          key={i}
          className={styles.photo}
          onClick={() => onImageClick(src)}
          role="button"
          tabIndex={0}
          aria-label={`View photo ${i + 1}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onImageClick(src)
            }
          }}
        >
          <img src={`/media/${src}`} alt={`Photo ${i + 1}`} loading="lazy" />
        </figure>
      ))}
    </section>
  )
}
