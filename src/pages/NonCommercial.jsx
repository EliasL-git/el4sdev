import React from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import GlitchText from '../components/GlitchText'
import styles from './NonCommercial.module.css'

export default function NonCommercial() {
  const year = new Date().getFullYear()

  return (
    <div className={styles.page}>
      <SiteHeader current="/non-commercial" />

      <main className={styles.main}>
        <div className={styles.scaffold}>
          <span className={styles.scaffoldLabel}>LICENSE · 02</span>
          <span className={styles.scaffoldSep} aria-hidden="true">—</span>
          <span className={styles.scaffoldLabel}>VOL · IV · {year}</span>
          <span className={styles.scaffoldSep} aria-hidden="true">—</span>
          <span className={`${styles.scaffoldLabel} ${styles.scaffoldAccent}`}>
            ALL RIGHTS RESERVED
          </span>
        </div>

        <article className={styles.article}>
          <h1 className={styles.heading}>
            <GlitchText as="span" duration={900} stagger={50}>
              NON
            </GlitchText>
            <br />
            <GlitchText
              as="span"
              className={styles.headingAccent}
              duration={900}
              stagger={40}
              delay={120}
            >
              COMMERCIAL
            </GlitchText>
            <br />
            <GlitchText as="span" duration={900} stagger={70} delay={240}>
              USE ONLY.
            </GlitchText>
          </h1>

          <div className={styles.bodyGrid}>
            <div className={styles.lhs}>
              <span className={styles.clauseNo}>§ 01</span>
              <p className={styles.lede}>
                This portfolio and every image presented within it are made
                available for personal, non-commercial viewing — nothing more,
                nothing less.
              </p>
            </div>

            <div className={styles.lhs}>
              <span className={styles.clauseNo}>§ 02</span>
              <p>
                Reproduction, redistribution, derivative works, training of
                machine&#8209;learning models, or any commercial use of these
                photographs is not permitted without prior written consent.
              </p>
            </div>

            <div className={styles.lhs}>
              <span className={styles.clauseNo}>§ 03</span>
              <p>
                If you&rsquo;d like to license an image, commission new work, or
                discuss collaboration, write to{' '}
                <a href="mailto:el4s@el4s.dev" data-cursor="email">
                  el4s@el4s.dev
                </a>
                . I read every message and reply personally.
              </p>
            </div>
          </div>

          <div className={styles.stampBlock}>
            <span className={styles.stampHead}>STAMP</span>
            <span className={styles.stampBody}>NO REUSE · NO TRAINING · NO RESALE</span>
            <span className={styles.stampDate}>EFFECTIVE {year}.01.01 →</span>
          </div>

          <footer className={styles.signoff}>
            <span className={styles.signoffName}>EL4S</span>
            <span className={styles.signoffMeta}>
              &copy; {year} · ALL RIGHTS RESERVED
            </span>
          </footer>
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}
