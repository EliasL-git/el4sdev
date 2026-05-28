import React from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import GlitchText from '../components/GlitchText'
import styles from './Freexyz.module.css'

export default function Freexyz() {
  return (
    <div className={styles.page}>
      <SiteHeader current="/freexyz" />

      <main className={styles.main}>
        <div className={styles.scaffold}>
          <span className={styles.scaffoldLabel}>GRANTS · 03</span>
          <span className={styles.scaffoldSep} aria-hidden="true">—</span>
          <span className={styles.scaffoldLabel}>HACK CLUB · UNOFFICIAL</span>
          <span className={styles.scaffoldSep} aria-hidden="true">—</span>
          <span className={`${styles.scaffoldLabel} ${styles.scaffoldAccent}`}>
            ONE PER BUILDER · WHILE STOCK LASTS
          </span>
        </div>

        <section className={styles.hero}>
          <h1 className={styles.heading}>
            <GlitchText as="span" duration={900} stagger={60}>
              FREE
            </GlitchText>{' '}
            <GlitchText
              as="span"
              className={styles.headingAccent}
              duration={900}
              stagger={50}
              delay={120}
            >
              .XYZ
            </GlitchText>
            <br />
            <GlitchText as="span" duration={900} stagger={70} delay={260}>
              DOMAINS.
            </GlitchText>
          </h1>

          <p className={styles.lede}>
            Build something worth showing. Then come collect a domain — on me,
            via <strong>EL4S</strong> × <strong>GEN.XYZ</strong>. Unofficial
            Hack Club program. One per builder. While stock lasts.
          </p>
        </section>

        <section className={styles.steps}>
          <div className={styles.step}>
            <span className={styles.stepNo}>01 ·</span>
            <span className={styles.stepText}>SHIP SOMETHING<br />YOU&rsquo;RE PROUD OF</span>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNo}>02 ·</span>
            <span className={styles.stepText}>DM ME ON<br />HACK CLUB SLACK</span>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNo}>03 ·</span>
            <span className={`${styles.stepText} ${styles.stepAccent}`}>GET YOUR<br />.XYZ DOMAIN</span>
          </div>
        </section>

        <section className={styles.ctaRow}>
          <a
            className={styles.btn}
            href="https://hackclub.enterprise.slack.com/team/U08J9R1TUT1"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="dm"
          >
            <span className={styles.btnNo}>→</span>
            <span className={styles.btnLabel}>MESSAGE @EL4S ON SLACK</span>
          </a>
          <p className={styles.tinyPrint}>
            * No catches. Build something interesting. I&rsquo;ll cover the
            registration. You bring the idea.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
