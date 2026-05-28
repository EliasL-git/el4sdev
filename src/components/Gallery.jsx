import React from 'react'
import styles from './Gallery.module.css'

// Tile size pattern — repeats across the photo list for asymmetric layout
const SIZE_PATTERN = ['tall', 'wide', 'square', 'tall', 'square', 'wide', 'square', 'tall']

export default function Gallery({ photos, onImageClick }) {
  if (!photos || photos.length === 0) {
    return (
      <p className={styles.empty}>
        NO FRAMES BUNDLED &mdash; DROP JPEG / PNG / WEBP FILES INTO{' '}
        <code>media/</code> AND THEY&rsquo;LL APPEAR HERE.
      </p>
    )
  }

  return (
    <>
      {/* SVG filters used for hover RGB-split effect */}
      <svg
        className={styles.svgDefs}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter id="rgbSplit" x="-5%" y="-5%" width="110%" height="110%">
            <feColorMatrix type="matrix" values="
              1 0 0 0 0
              0 0 0 0 0
              0 0 0 0 0
              0 0 0 1 0" in="SourceGraphic" result="r" />
            <feOffset in="r" dx="3" dy="0" result="rOff" />
            <feColorMatrix type="matrix" values="
              0 0 0 0 0
              0 1 0 0 0
              0 0 0 0 0
              0 0 0 1 0" in="SourceGraphic" result="g" />
            <feColorMatrix type="matrix" values="
              0 0 0 0 0
              0 0 0 0 0
              0 0 1 0 0
              0 0 0 1 0" in="SourceGraphic" result="b" />
            <feOffset in="b" dx="-3" dy="0" result="bOff" />
            <feBlend mode="screen" in="rOff" in2="g" result="rg" />
            <feBlend mode="screen" in="rg" in2="bOff" />
          </filter>
        </defs>
      </svg>

      <section className={styles.gallery} aria-label="Photography gallery">
        {photos.map((p, i) => {
          const size = SIZE_PATTERN[i % SIZE_PATTERN.length]
          return (
            <figure
              key={p.name}
              className={`${styles.tile} ${styles[size]}`}
            >
              <button
                type="button"
                className={styles.button}
                onClick={() => onImageClick(i)}
                aria-label={`View photo ${i + 1} — ${p.name}`}
                data-cursor="open"
              >
                <span className={styles.imgWrap}>
                  <img
                    src={p.url}
                    alt={`Photograph ${i + 1}`}
                    loading={i < 4 ? 'eager' : 'lazy'}
                    decoding="async"
                    className={styles.img}
                  />
                </span>
                <span className={styles.overlay} aria-hidden="true">
                  <span className={styles.no}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.name}>
                    {p.name.replace(/\.[A-Z]+$/i, '')}
                  </span>
                  <span className={styles.openLabel}>OPEN →</span>
                </span>
                <span className={styles.cornerTL} aria-hidden="true" />
                <span className={styles.cornerBR} aria-hidden="true" />
              </button>
            </figure>
          )
        })}
      </section>
    </>
  )
}
