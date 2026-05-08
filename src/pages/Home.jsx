import React from 'react'
import Hero from '../components/Hero'
import styles from './Home.module.css'

export default function Home() {
  return (
    <main className={styles.page}>
      <Hero />
    </main>
  )
}
