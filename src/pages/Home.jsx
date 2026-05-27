import React from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import HoverReveal from '../components/HoverReveal'
import Magnetic from '../components/Magnetic'
import { useApp } from '../lib/AppContext'
import { useReveal } from '../lib/useReveal'
import styles from './Home.module.css'

export default function Home() {
  const { navigate } = useApp()
  const [contactRef, contactIn] = useReveal()

  function nav(e, to) {
    e.preventDefault()
    navigate(to)
  }

  return (
    <div className={styles.page}>
      <SiteHeader current="/" />
      <main className={styles.main}>
        <Hero />

        <Marquee
          items={['Photographer', 'Actor', 'Developer', 'Available 2026', 'Open to commissions']}
          separator="◇"
          speed={42}
          size="xl"
        />

        <HoverReveal />

        <Marquee
          items={['Frames', 'Performances', 'Code', 'Stories', 'Light', 'Color']}
          separator="✦"
          reverse
          speed={56}
          size="lg"
        />

        <section
          ref={contactRef}
          className={`${styles.contact} ${contactIn ? styles.contactIn : ''}`}
        >
          <div className={styles.contactInner}>
            <span className={styles.contactEyebrow}>
              <span className={styles.contactDash} aria-hidden="true" />
              <span>Say hello</span>
            </span>
            <h2 className={styles.contactHeading}>
              Got a story <span className={styles.italic}>worth telling?</span>
            </h2>
            <p className={styles.contactLede}>
              Photography, performance, software &mdash; or something stranger.
              I&rsquo;m reading every message.
            </p>
            <Magnetic strength={0.3}>
              <a className={styles.contactBtn} href="mailto:el4s@el4s.dev">
                <span className={styles.contactBtnLabel}>el4s@el4s.dev</span>
                <span className={styles.contactBtnArrow} aria-hidden="true">&rarr;</span>
              </a>
            </Magnetic>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
