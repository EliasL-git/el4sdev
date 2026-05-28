import React from 'react'
import styles from './MarqueeStrip.module.css'

/**
 * Two opposing marquee rows. Each row repeats its content twice
 * back-to-back to make the keyframe loop seamless.
 *
 * Props:
 *   - top: array of strings (top row)
 *   - bottom: array of strings (bottom row, scrolls opposite direction)
 *   - topSpeed: seconds per loop (default 36)
 *   - bottomSpeed: seconds per loop (default 48)
 */
export default function MarqueeStrip({
  top = ['Photographer', 'Actor', 'Developer'],
  bottom = ['2026', 'Vol·IV', 'Selected', 'el4s'],
  topSpeed = 38,
  bottomSpeed = 52,
}) {
  const topRow = renderRow(top, 6)
  const bottomRow = renderRow(bottom, 8)

  return (
    <section className={styles.section} aria-hidden="true">
      <div className={styles.row} style={{ animationDuration: `${topSpeed}s` }}>
        {topRow}
        {topRow}
      </div>
      <div
        className={`${styles.row} ${styles.reverse}`}
        style={{ animationDuration: `${bottomSpeed}s` }}
      >
        {bottomRow}
        {bottomRow}
      </div>
    </section>
  )
}

function renderRow(items, repeat) {
  // Tile each item `repeat` times in one half — gives the row enough
  // content that the seamless wrap works.
  const tiled = []
  for (let r = 0; r < repeat; r++) {
    items.forEach((item, i) => {
      tiled.push(
        <span key={`${r}-${i}`} className={styles.cell}>
          <span className={styles.word}>{item}</span>
          <span className={styles.dot} aria-hidden="true" />
        </span>
      )
    })
  }
  return tiled
}
