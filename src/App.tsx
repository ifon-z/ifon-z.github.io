import { useEffect, useRef, useState, type ReactNode } from 'react'
import { LanguageProvider, useLanguage } from './config/i18n'
import { Hero3DStage } from './components/Hero3D'
import { useMagnetic, useReveal, useTopbarStuck } from './lib/motion'

type IconName = 'arrow' | 'mail' | 'menu' | 'close'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

const projectBase = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/projects/`
const skills = ['Python', 'TypeScript', 'React', 'SQL', 'Docker', 'Cloud']

/** Two committed widths per image; the shell is fixed at 3:2 so nothing shifts. */
function ProjectImage({ image, alt, eager = false }: { image: string; alt: string; eager?: boolean }) {
  return (
    <img
      src={`${projectBase}${image}-800.webp`}
      srcSet={`${projectBase}${image}-800.webp 800w, ${projectBase}${image}-1600.webp 1600w`}
      sizes="(min-width: 1000px) 62vw, 100vw"
      width={1600}
      height={1067}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
}

function Site() {
  const { lang, t, toggle } = useLanguage()
  const scrollRef = useRef(0)
  const [heroReady, setHeroReady] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const magneticCta = useMagnetic<HTMLAnchorElement>(0.2)
  const closeMenu = () => setMenuOpen(false)

  useReveal()
  useTopbarStuck()

  // A single rAF-throttled scroll source that both the CSS and the 3D camera read.
  useEffect(() => {
    let frame = 0
    const sync = () => {
      frame = 0
      const distance = window.innerHeight || 1
      scrollRef.current = Math.min(1, Math.max(0, window.scrollY / distance))
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(sync)
    }
    sync()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="wrap">
          <a className="brand" href="#top" onClick={closeMenu}>
            IF<span>.</span>
          </a>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? (lang === 'zh' ? '关闭导航' : 'Close navigation') : lang === 'zh' ? '打开导航' : 'Open navigation'}
            aria-expanded={menuOpen}
            aria-controls="site-nav"
          >
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
          <nav
            id="site-nav"
            className={menuOpen ? 'nav nav-open' : 'nav'}
            aria-label={lang === 'zh' ? '主导航' : 'Main'}
          >
            <a href="#about" onClick={closeMenu}>{t.navAbout}</a>
            <a href="#work" onClick={closeMenu}>{t.navWork}</a>
            <a href="#contact" onClick={closeMenu}>{t.navContact}</a>
            <button className="language" onClick={toggle} aria-label={lang === 'zh' ? 'Switch to English' : '切换到中文'}>
              {lang === 'zh' ? 'EN' : '中'}
            </button>
            <a className="nav-cta" href="mailto:hello@example.com" onClick={closeMenu}>
              {t.navCta} <Icon name="arrow" size={15} />
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero wrap">
          <div className="hero-copy">
            <p className="eyebrow mono hero-in">
              <span className="status-dot" aria-hidden="true" /> {t.availability}
            </p>
            <h1 className="hero-title">{t.heroTitle}</h1>
            <p className="lede hero-in hero-in-2">{t.heroIntro}</p>
            <div className="hero-actions hero-in hero-in-3">
              <a className="button" ref={magneticCta} href="#work">
                {t.workCta} <Icon name="arrow" size={16} />
              </a>
              <a className="text-link" href="#about">
                {t.aboutLink}
              </a>
            </div>
          </div>

          {/* The poster renders for everyone; the canvas fades in over it and is
              never fetched at all under reduced-motion or save-data. */}
          <div className="hero-stage">
            <div className={heroReady ? 'hero-poster hero-poster-off' : 'hero-poster'} aria-hidden="true">
              <div className="poster-rings">
                <i /><i /><i />
                <span />
              </div>
            </div>
            <Hero3DStage scrollRef={scrollRef} onReady={() => setHeroReady(true)} />
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...t.marquee, ...t.marquee].map((word, index) => (
              <span key={`${word}-${index}`}>
                <em>✦</em>
                {word}
              </span>
            ))}
          </div>
        </div>

        <section className="section wrap" id="about">
          <div className="section-label mono" data-reveal>
            01 — {t.navAbout}
          </div>
          <div className="about-grid">
            <h2 className="about-title" data-reveal>
              {t.aboutTitle}
            </h2>
            <div className="about-detail" data-reveal>
              <p>{t.aboutText}</p>
              <a className="text-link" href="mailto:hello@example.com">
                {t.aboutLink} <Icon name="arrow" size={15} />
              </a>
            </div>
          </div>

          <div className="skill-list">
            {skills.map((skill, index) => (
              <div className="skill-item" key={skill} data-reveal>
                <span className="mono">{String(index + 1).padStart(2, '0')}</span>
                <strong>{skill}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="work" id="work">
          <div className="wrap">
            <div className="section-label mono" data-reveal>
              02 — {t.workLabel}
            </div>
            <div className="work-heading">
              <h2 data-reveal>{t.workTitle}</h2>
            </div>

            <div className="projects">
              {t.projects.map((project, index) => (
                <article className="project-card" key={project.title} data-reveal>
                  <figure className="project-visual">
                    <ProjectImage image={project.image} alt={project.alt} />
                    <figcaption className="project-index mono">{String(index + 1).padStart(2, '0')}</figcaption>
                  </figure>
                  <div className="project-info">
                    <h3>{project.title}</h3>
                    <p className="mono">{project.year}</p>
                    <ul className="project-tags">
                      {project.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                    <a className="project-link" href={project.href}>
                      {t.caseStudy} <Icon name="arrow" size={15} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="worldwide">
          <div className="worldwide-media">
            <img
              src={`${projectBase}signal-800.webp`}
              srcSet={`${projectBase}signal-800.webp 800w, ${projectBase}signal-1600.webp 1600w`}
              sizes="100vw"
              width={1600}
              height={1065}
              alt={lang === 'zh' ? '从轨道俯瞰夜间的城市灯光网络' : 'City light networks seen from orbit at night'}
              loading="lazy"
              decoding="async"
            />
            <div className="worldwide-inner">
              <p data-reveal>{t.worldwideText}</p>
            </div>
          </div>
        </section>

        <section className="section wrap contact" id="contact">
          <div className="section-label mono" data-reveal>
            03 — {t.contactLabel}
          </div>
          <p className="contact-kicker" data-reveal>
            {t.contactKicker}
          </p>
          <h2 data-reveal>{t.contactTitle}</h2>
          <a className="contact-email" href="mailto:hello@example.com" data-reveal>
            hello@example.com <Icon name="arrow" size={22} />
          </a>
        </section>
      </main>

      <footer className="footer wrap">
        <a className="brand" href="#top">
          IF<span>.</span>
        </a>
        <p>{t.footer}</p>
        <a className="footer-mail" href="mailto:hello@example.com" aria-label="Email">
          <Icon name="mail" size={17} />
          hello@example.com
        </a>
      </footer>

      <div className="grain" aria-hidden="true" />
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <Site />
    </LanguageProvider>
  )
}
