import React from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import styles from './NonCommercial.module.css'

export default function NonCommercial() {
  const year = new Date().getFullYear()

  return (
    <div className={styles.page}>
      <SiteHeader current="/non-commercial" />

      <main className={styles.main}>
        <article className={styles.article}>
          <div className={styles.crumbs}>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault()
                window.navigate('/')
              }}
            >
              Index
            </a>
            <span className={styles.crumbSep} aria-hidden="true">/</span>
            <span className={styles.crumbActive}>Non-commercial</span>
          </div>

          <p className={styles.eyebrow}>
            <span className={styles.eyebrowDash} aria-hidden="true" />
            <span>Legal · Usage</span>
          </p>

          <h1 className={styles.heading}>
            <span className={styles.headingItalic}>Non-commercial</span>{' '}
            use only.
          </h1>

          <div className={styles.body}>
            <p className={styles.lede}>
              <span className={styles.dropcap}>T</span>his portfolio and every
              image presented within it are made available for personal,
              non-commercial viewing &mdash; nothing more, nothing less.
            </p>

            <p>
              Reproduction, redistribution, derivative works, training of
              machine&#8209;learning models, or any commercial use of these
              photographs is not permitted without prior written consent.
            </p>

            <p>
              If you&rsquo;d like to license an image, commission new work, or
              discuss collaboration, write to{' '}
              <a href="mailto:hello@el4s.dev">hello@el4s.dev</a>. I read every
              message and reply personally.
            </p>

            <p className={styles.thanks}>
              Thank you for respecting the work.
            </p>
          </div>

          <footer className={styles.signoff}>
            <span className={styles.signoffName}>el4s</span>
            <span className={styles.signoffMeta}>
              &copy; {year} &middot; All rights reserved
            </span>
          </footer>
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}
