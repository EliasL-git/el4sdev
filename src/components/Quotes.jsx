import React, { useEffect, useState } from 'react'
import styles from './Quotes.module.css'

export default function Quotes() {
  const [quotes, setQuotes] = useState([])
  const [error, setError] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    let isMounted = true

    const loadQuotes = async () => {
      try {
        const res = await fetch('/media/quotes.json', { cache: 'no-store' })

        if (!res.ok) {
          throw new Error('Failed to load quotes')
        }

        const list = await res.json()

        if (!isMounted) return

        const nextQuotes = Array.isArray(list) ? list : []
        setQuotes(nextQuotes)
        setError(null)

        if (nextQuotes.length > 0) {
          const nextIndex = Math.floor(Math.random() * nextQuotes.length)
          setActiveIndex(nextQuotes.length > 1 ? nextIndex : 0)
        }
      } catch (err) {
        if (!isMounted) return
        setError(err.message)
      }
    }

    loadQuotes()

    const timer = window.setInterval(loadQuotes, 15000)

    return () => {
      isMounted = false
      window.clearInterval(timer)
    }
  }, [])

  if (error) {
    return <p className={styles.status}>{error}</p>
  }

  if (quotes.length === 0) {
    return <p className={styles.status}>Loading quotes…</p>
  }

  return (
    <section className={styles.section} aria-label="Quote">
      <blockquote className={styles.card} aria-live="polite">
        <p className={styles.text}>“{quotes[activeIndex].text}”</p>
        <footer className={styles.author}>— {quotes[activeIndex].author || 'el4s'}</footer>
      </blockquote>
    </section>
  )
}