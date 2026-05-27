import React, { useEffect, useRef, useState } from 'react'
import quotes from '../lib/quotes'
import styles from './Quotes.module.css'

export default function Quotes() {
  const [activeIndex, setActiveIndex] = useState(() =>
    quotes.length > 0 ? Math.floor(Math.random() * quotes.length) : 0
  )
  const [phase, setPhase] = useState('in') // 'in' | 'out'
  const cycleRef = useRef(null)

  // Cycle every 9s with fade-out → switch → fade-in.
  useEffect(() => {
    if (quotes.length <= 1) return
    cycleRef.current = window.setInterval(() => {
      setPhase('out')
      window.setTimeout(() => {
        setActiveIndex((i) => (i + 1) % quotes.length)
        setPhase('in')
      }, 380)
    }, 9000)
    return () => window.clearInterval(cycleRef.current)
  }, [])

  if (quotes.length === 0) {
    return <p className={styles.status}>—</p>
  }

  const q = quotes[activeIndex]

  return (
    <figure className={`${styles.figure} ${phase === 'out' ? styles.out : styles.in}`}>
      <span className={styles.openQuote} aria-hidden="true">&ldquo;</span>
      <blockquote className={styles.text}>{q.text}</blockquote>
      <figcaption className={styles.author}>
        <span className={styles.dash} aria-hidden="true" />
        <span>{q.author || 'el4s'}</span>
        {q.category ? <span className={styles.category}>· {q.category}</span> : null}
      </figcaption>
    </figure>
  )
}
