import React from 'react'
import { photos, featured } from '../lib/photos'
import styles from './WorkStrip.module.css'

export default function WorkStrip() {
  // Show up to 5 thumbnails, excluding whichever photo the hero is featuring
  // so the same image doesn't appear twice on the home page.
  const items = photos
    .filter((p) => !featured || p.name !== featured.name)
    .slice(0, 5)

  function nav(e, to) {
    e.preventDefault()
    window.navigate(to)
  }

  return (
    <section className={styles.section} aria-label="Selected work">
      <div className={styles.headRow}>
        <div className={styles.headLeft}>
          <span className={styles.index}>{String(photos.length).padStart(3, '0')}</span>
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
        {items.length === 0 ? (
          <div className={styles.placeholder}>No photographs listed yet.</div>
        ) : (
          items.map((p, i) => (
            <a
              key={p.name}
              href="/photography"
              className={styles.tile}
              onClick={(e) => nav(e, '/photography')}
              style={{ animationDelay: `${i * 70}ms` }}
              aria-label={`Open photography — ${p.name}`}
            >
              <img
                src={p.url}
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
