import React, { useEffect, useState } from 'react'
import { mediaUrl } from '../lib/media'
import styles from './WorkStrip.module.css'

const FEATURE_IMAGE = 'IMG_0541.JPEG'

export default function WorkStrip() {
  const [images, setImages] = useState([])

  useEffect(() => {
    let mounted = true
    fetch(mediaUrl('list.json'))
      .then((res) => (res.ok ? res.json() : []))
      .then((list) => {
        if (!mounted) return
        const arr = Array.isArray(list) ? list : []
        // Show up to 5 thumbnails on the home page, excluding the hero feature.
        setImages(arr.filter((f) => f !== FEATURE_IMAGE).slice(0, 5))
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  function nav(e, to) {
    e.preventDefault()
    window.navigate(to)
  }

  return (
    <section className={styles.section} aria-label="Selected work">
      <div className={styles.headRow}>
        <div className={styles.headLeft}>
          <span className={styles.index}>008</span>
          <span className={styles.dash} aria-hidden="true" />
          <h2 className={styles.heading}>Selected work</h2>
        </div>
        <a
          href="/photography"
          className={styles.viewAll}
          onClick={(e) => nav(e, '/photography')}
        >
          <span>View all</span>
          <span className={styles.viewArrow} aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <div className={styles.strip}>
        {images.length === 0 ? (
          <div className={styles.placeholder}>Loading…</div>
        ) : (
          images.map((src, i) => (
            <a
              key={src}
              href="/photography"
              className={styles.tile}
              onClick={(e) => nav(e, '/photography')}
              style={{ animationDelay: `${i * 70}ms` }}
              aria-label={`Open photography — ${src}`}
            >
              <img
                src={mediaUrl(src)}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <span className={styles.tileNo} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
            </a>
          ))
        )}
      </div>
    </section>
  )
}
