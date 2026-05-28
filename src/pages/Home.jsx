import React from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import Hero from '../components/Hero'
import MarqueeStrip from '../components/MarqueeStrip'
import WorkStrip from '../components/WorkStrip'
import Quotes from '../components/Quotes'
import styles from './Home.module.css'

export default function Home() {
  return (
    <div className={styles.page}>
      <SiteHeader current="/" />
      <main className={styles.main}>
        <Hero />
        <MarqueeStrip
          top={['Photographer', 'Actor', 'Developer', 'Photographer', 'Actor', 'Developer']}
          bottom={['Vol·IV', '2026', 'EL4S.DEV', 'Selected', 'No reuse', 'Build']}
        />
        <WorkStrip />
        <Quotes />
      </main>
      <SiteFooter />
    </div>
  )
}
