import React from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import Hero from '../components/Hero'
import WorkStrip from '../components/WorkStrip'
import styles from './Home.module.css'

export default function Home() {
  return (
    <div className={styles.page}>
      <SiteHeader current="/" />
      <main className={styles.main}>
        <Hero />
        <WorkStrip />
      </main>
      <SiteFooter />
    </div>
  )
}
