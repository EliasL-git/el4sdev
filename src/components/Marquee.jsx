import React from 'react'
import styles from './Marquee.module.css'

// Endless horizontal scroll band. Items repeat so the loop is seamless.
export default function Marquee({
  items,
  separator = '◇',
  reverse = false,
  speed = 36, // seconds for one full traversal
  size = 'lg', // 'md' | 'lg' | 'xl'
}) {
  // Duplicate enough times that the seam never reaches the edge of the
  // viewport before the keyframe loops.
  const reps = 6
  const slug = Array.from({ length: reps }).flatMap(() => items)

  return (
    <div className={styles.marquee} aria-hidden="true">
      <div
        className={`${styles.track} ${reverse ? styles.reverse : ''} ${styles[size]}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {slug.map((item, i) => (
          <span key={i} className={styles.item}>
            <span className={styles.text}>{item}</span>
            <span className={styles.sep} aria-hidden="true">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
