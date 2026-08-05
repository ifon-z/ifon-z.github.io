import { useState, type ReactNode } from 'react'

type Language = 'zh' | 'en'
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

const copy = {
  zh: {
    navAbout: '关于', navWork: '作品', navContact: '联系', navCta: '一起合作',
    availability: '目前开放合作机会', heroTitle: <>构建智能、<em>可靠</em>的数字体验。</>,
    heroIntro: <>我是 IF，一名专注于 <strong>AI 全栈</strong> 与 <strong>数据工程</strong> 的初级软件工程师。</>,
    workCta: '查看作品', aboutLink: '更多关于我', aboutTitle: <>把想法转化为<br />真正有用的产品。</>,
    aboutText: '我从问题出发，梳理数据、设计体验，并将它们变成稳定可迭代的解决方案。',
    workLabel: '精选实践', workTitle: <>一些正在生长的<br /><em>实践</em>。</>, allWork: '浏览全部作品',
    contactLabel: '联系', contactKicker: '有一个想法？', contactTitle: <>让我们一起<br /><em>创造点什么。</em></>,
    footer: '© 2026 — Crafted with curiosity.',
  },
  en: {
    navAbout: 'About', navWork: 'Work', navContact: 'Contact', navCta: 'Let’s talk',
    availability: 'Available for opportunities', heroTitle: <>Building intelligent,<br /><em>reliable</em> digital experiences.</>,
    heroIntro: <>I’m IF, a junior software engineer focused on <strong>AI full-stack</strong> and <strong>data engineering</strong>.</>,
    workCta: 'View my work', aboutLink: 'More about me', aboutTitle: <>Turning ideas into<br />useful products.</>,
    aboutText: 'I start with the problem, shape the data and experience, then turn both into dependable, evolving solutions.',
    workLabel: 'Selected work', workTitle: <>A few things<br /><em>in progress</em>.</>, allWork: 'See all work',
    contactLabel: 'Contact', contactKicker: 'Have an idea?', contactTitle: <>Let’s make<br /><em>something useful.</em></>,
    footer: '© 2026 — Crafted with curiosity.',
  },
} as const

const projects = [
  { title: 'AI Workflow', tags: 'LLM · Automation', tone: 'project-green' },
  { title: 'Data Platform', tags: 'ETL · Analytics', tone: 'project-blue' },
  { title: 'Web Experience', tags: 'React · UI', tone: 'project-sand' },
]
const skills = ['Python', 'TypeScript', 'React', 'SQL', 'Docker', 'Cloud']

export default function App() {
  const [lang, setLang] = useState<Language>('zh')
  const [menuOpen, setMenuOpen] = useState(false)
  const t = copy[lang]
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

      <section className="work section-wrap" id="work"><div className="section-label">02 / {t.workLabel.toUpperCase()}</div><div className="work-heading"><h2>{t.workTitle}</h2></div><div className="projects">{projects.map((project, index) => <article className="project-card" key={project.title}><div className={`project-visual ${project.tone}`}><span>0{index + 1}</span></div><div className="project-info"><div><h3>{project.title}</h3><p>{project.tags}</p></div><Icon name="arrow" size={16} /></div></article>)}</div><a className="all-work text-link" href="#contact">{t.allWork} <Icon name="arrow" size={15} /></a></section>

      <section className="contact section-wrap" id="contact"><div className="section-label">03 / {t.contactLabel.toUpperCase()}</div><p className="contact-kicker">{t.contactKicker}</p><h2>{t.contactTitle}</h2><a className="contact-email" href="mailto:hello@example.com">hello@example.com <Icon name="arrow" size={22} /></a></section>
    </main>
    <footer className="footer section-wrap"><a className="brand" href="#top">IF<span>.</span></a><p>{t.footer}</p><a href="mailto:hello@example.com" aria-label="Email"><Icon name="mail" size={17} /></a></footer>
  </div>
}
