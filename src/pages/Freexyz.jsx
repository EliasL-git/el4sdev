import React from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import styles from './Freexyz.module.css'

export default function Freexyz() {
  return (
    <div className={styles.page}>
      <SiteHeader current="/freexyz" />

      <main className={styles.main}>
        <section className={styles.card}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowDash} aria-hidden="true" />
            <span>Hack&nbsp;Club · Unofficial</span>
          </p>

          <h1 className={styles.heading}>
            Free <span className={styles.headingItalic}>.xyz</span> domains for
            cool projects.
          </h1>

          <p className={styles.body}>
            Build something interesting, then come claim a domain courtesy of
            <strong> el4s</strong> &times; <strong>Gen.xyz</strong>. It&rsquo;s
            an unofficial Hack&nbsp;Club program &mdash; one&nbsp;per&nbsp;builder, while
            supplies last.
          </p>

          <div className={styles.steps}>
            <div className={styles.step}>
              <span className={styles.stepNo}>01</span>
              <span className={styles.stepText}>Ship something you&rsquo;re proud of</span>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNo}>02</span>
              <span className={styles.stepText}>DM me on the Hack&nbsp;Club Slack</span>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNo}>03</span>
              <span className={styles.stepText}>Get your .xyz domain on me</span>
            </div>
          </div>

          <a
            className={styles.btn}
            href="https://hackclub.enterprise.slack.com/team/U08J9R1TUT1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Message @el4s on Slack</span>
            <span className={styles.btnArrow} aria-hidden="true">&rarr;</span>
          </a>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
