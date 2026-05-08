import React from 'react'
import styles from './NonCommercial.module.css'

export default function NonCommercial() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <a
          className={styles.back}
          href="/"
          onClick={(e) => {
            e.preventDefault()
            window.navigate('/')
          }}
        >
          &larr; Back
        </a>

        <p className={styles.label}>Legal</p>
        <h1 className={styles.heading}>Non-commercial Use</h1>
        <div className={styles.divider} />

        <div className={styles.body}>
          <p>
            This portfolio and all images shown here are provided for personal
            and non-commercial viewing only.
          </p>
          <p>
            If you'd like to license or reuse any image for commercial purposes,
            please <a href="mailto:hello@el4s.dev">contact me</a> to discuss
            terms and request permission.
          </p>
          <p>
            Thanks for respecting these terms.
          </p>
        </div>

        <p className={styles.footer}>&copy; {new Date().getFullYear()} el4s. All rights reserved.</p>
      </div>
    </main>
  )
}
