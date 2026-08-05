import { useState, type ReactNode } from 'react'
import { translations, type Language } from './config/i18n'

type IconName = 'arrow' | 'mail' | 'menu' | 'close'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const projectTones = ['project-green', 'project-blue', 'project-sand']
const skills = ['Python', 'TypeScript', 'React', 'SQL', 'Docker', 'Cloud']

export default function App() {
  const [lang, setLang] = useState<Language>('zh')
  const [menuOpen, setMenuOpen] = useState(false)
  const t = translations[lang]
  const closeMenu = () => setMenuOpen(false)
  const switchLanguage = () => setLang(lang === 'zh' ? 'en' : 'zh')

  return <div className="site-shell">
    <header className="topbar">
      <a className="brand" href="#top" onClick={closeMenu}>IF<span>.</span></a>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation"><Icon name={menuOpen ? 'close' : 'menu'} /></button>
      <nav className={menuOpen ? 'nav nav-open' : 'nav'}>
        <a href="#about" onClick={closeMenu}>{t.navAbout}</a><a href="#work" onClick={closeMenu}>{t.navWork}</a><a href="#contact" onClick={closeMenu}>{t.navContact}</a>
        <button className="language" onClick={switchLanguage} aria-label="Switch language">{lang === 'zh' ? 'EN' : '中'}</button>
        <a className="nav-cta" href="mailto:hello@example.com" onClick={closeMenu}>{t.navCta} <Icon name="arrow" size={15} /></a>
      </nav>
    </header>

    <main id="top">
      <section className="hero section-wrap">
        <div className="hero-copy"><p className="eyebrow"><span className="status-dot" /> {t.availability}</p><h1>{t.heroTitle}</h1><p className="hero-intro">{t.heroIntro}</p><div className="hero-actions"><a className="button" href="#work">{t.workCta} <Icon name="arrow" size={16} /></a><a className="text-link" href="#about">↓</a></div></div>
        <div className="hero-mark" aria-hidden="true"><span>IF</span><i /></div>
      </section>

      <section className="about section-wrap" id="about"><div className="section-label">01 / {lang === 'zh' ? '关于' : 'ABOUT'}</div><div className="about-content"><h2>{t.aboutTitle}</h2><div className="about-detail"><p>{t.aboutText}</p><a className="text-link" href="mailto:hello@example.com">{t.aboutLink} <Icon name="arrow" size={15} /></a></div></div><div className="skill-list">{skills.map((skill, index) => <div className="skill-item" key={skill}><span>0{index + 1}</span><strong>{skill}</strong></div>)}</div></section>

      <section className="work section-wrap" id="work"><div className="section-label">02 / {t.workLabel.toUpperCase()}</div><div className="work-heading"><h2>{t.workTitle}</h2></div><div className="projects">{t.projects.map((project, index) => <article className="project-card" key={project.title}><div className={`project-visual ${projectTones[index]}`}><span>0{index + 1}</span></div><div className="project-info"><div><h3>{project.title}</h3><p>{project.tags}</p></div><Icon name="arrow" size={16} /></div></article>)}</div><a className="all-work text-link" href="#contact">{t.allWork} <Icon name="arrow" size={15} /></a></section>

      <section className="contact section-wrap" id="contact"><div className="section-label">03 / {t.contactLabel.toUpperCase()}</div><p className="contact-kicker">{t.contactKicker}</p><h2>{t.contactTitle}</h2><a className="contact-email" href="mailto:hello@example.com">hello@example.com <Icon name="arrow" size={22} /></a></section>
    </main>
    <footer className="footer section-wrap"><a className="brand" href="#top">IF<span>.</span></a><p>{t.footer}</p><a href="mailto:hello@example.com" aria-label="Email"><Icon name="mail" size={17} /></a></footer>
  </div>
}
