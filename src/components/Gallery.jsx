import React from 'react'
import styles from './Gallery.module.css'

export default function Gallery({ photos, onImageClick }) {
  if (!photos || photos.length === 0) {
    return (
      <p className={styles.empty}>
        No images found &mdash; add files and list them in <code>media/list.json</code>.
      </p>
    )
  }

  return (
    <section className={styles.gallery} aria-label="Photography gallery">
      {photos.map((p, i) => (
        <figure
          key={p.name}
          className={styles.tile}
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <button
            type="button"
            className={styles.button}
            onClick={() => onImageClick(i)}
            aria-label={`View photo ${i + 1} — ${p.name}`}
          >
            <img
              src={p.url}
              alt={`Photograph ${i + 1}`}
              loading={i < 4 ? 'eager' : 'lazy'}
              decoding="async"
            />
            <span className={styles.overlay} aria-hidden="true">
              <span className={styles.no}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.name}>{p.name.replace(/\.[A-Z]+$/i, '')}</span>
            </span>
          </button>
        </figure>
      ))}
    </section>
  )
}
