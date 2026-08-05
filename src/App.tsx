import { useState, type ReactNode } from 'react'

type IconName = 'arrow' | 'github' | 'linkedin' | 'mail' | 'sparkle' | 'menu' | 'close'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    github: <><path d="M15 22v-3.9c0-1.1.4-1.8.9-2.2 3-.3 6.1-1.5 6.1-6.7 0-1.5-.5-2.7-1.4-3.7.1-.3.6-1.8-.1-3.7 0 0-1.1-.4-3.8 1.4a13 13 0 0 0-6.9 0C7.1 1.4 6 1.8 6 1.8c-.7 1.9-.2 3.4-.1 3.7C5 6.5 4.5 7.7 4.5 9.2c0 5.2 3.1 6.4 6.1 6.7.5.4.9 1.2.9 2.2V22" /><path d="M9 19c-2.7.9-3-1.2-4.1-1.6" /></>,
    linkedin: <><path d="M7 8v9" /><path d="M7 5v.01" /><path d="M11 17v-5a3 3 0 0 1 6 0v5" /><path d="M11 12V8" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    sparkle: <><path d="m12 3-1.4 5.6L5 10l5.6 1.4L12 17l1.4-5.6L19 10l-5.6-1.4L12 3Z" /><path d="m19 15-.6 2.4L16 18l2.4.6L19 21l.6-2.4L22 18l-2.4-.6L19 15Z" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  }
  return <svg {...common}>{paths[name]}</svg>
}

const projects = [
  { no: '01', title: 'AI Workflow', tags: ['LLM', 'Automation'], className: 'project-violet' },
  { no: '02', title: 'Data Platform', tags: ['ETL', 'Analytics'], className: 'project-orange' },
  { no: '03', title: 'Web Experience', tags: ['React', 'UI Engineering'], className: 'project-blue' },
]

const skills = ['Python', 'TypeScript', 'React', 'SQL', 'Docker', 'Cloud']

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" onClick={closeMenu} aria-label="回到首页">IF<span>.</span></a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="切换导航菜单" aria-expanded={menuOpen}>
          <Icon name={menuOpen ? 'close' : 'menu'} />
        </button>
        <nav className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="主导航">
          <a href="#about" onClick={closeMenu}>关于</a>
          <a href="#work" onClick={closeMenu}>作品</a>
          <a href="#contact" onClick={closeMenu}>联系</a>
          <a className="nav-cta" href="mailto:hello@example.com" onClick={closeMenu}>一起合作 <Icon name="arrow" size={16} /></a>
        </nav>
      </header>

      <main id="top">
        <section className="hero section-wrap">
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" /> Available for opportunities</p>
            <h1>构建智能、<br /><em>可靠</em>的数字体验。</h1>
            <p className="hero-intro">我是 IF，一名专注于 <strong>AI 全栈</strong> 与 <strong>数据工程</strong> 的初级软件工程师。</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">查看我的作品 <Icon name="arrow" size={17} /></a>
              <a className="text-link" href="#about">认识一下 <span>↓</span></a>
            </div>
          </div>
          <div className="hero-art" aria-label="抽象数据流图形">
            <div className="orb orb-one" />
            <div className="orb orb-two" />
            <div className="art-window">
              <div className="window-top"><i /><i /><i /><span>system.online</span></div>
              <div className="code-lines"><b /><b /><b /><b /><b /></div>
              <div className="data-node node-a" /><div className="data-node node-b" /><div className="data-node node-c" />
              <svg className="data-path" viewBox="0 0 430 340" fill="none" aria-hidden="true"><path d="M63 250C135 244 126 133 210 151s70 103 160 72" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 8" /></svg>
            </div>
            <div className="hero-badge"><Icon name="sparkle" size={17} /><span>curious<br />by default</span></div>
          </div>
        </section>

        <section className="ticker" aria-label="专业领域">
          <div><span>AI APPLICATIONS</span><b>✦</b><span>DATA ENGINEERING</span><b>✦</b><span>FULL-STACK DEVELOPMENT</span><b>✦</b><span>AI APPLICATIONS</span></div>
        </section>

        <section className="about section-wrap" id="about">
          <div className="section-label">01 / ABOUT</div>
          <div className="about-content">
            <h2>把想法转化为<br />真正有用的产品。</h2>
            <div className="about-detail">
              <p>我享受从模糊的问题出发，梳理数据、设计体验，并将它们变成稳定可迭代的解决方案。</p>
              <a className="text-link" href="mailto:hello@example.com">更多关于我 <Icon name="arrow" size={16} /></a>
            </div>
          </div>
          <div className="skill-list">
            {skills.map((skill, index) => <div className="skill-item" key={skill}><span>0{index + 1}</span><strong>{skill}</strong></div>)}
          </div>
        </section>

        <section className="work section-wrap" id="work">
          <div className="work-heading"><div className="section-label">02 / SELECTED WORK</div><h2>一些正在生长的<br /><em>实践</em>。</h2></div>
          <div className="projects">
            {projects.map((project) => (
              <article className="project-card" key={project.no}>
                <div className={`project-visual ${project.className}`}><span>{project.no}</span><div className="visual-shape" /></div>
                <div className="project-info"><div><h3>{project.title}</h3><p>{project.tags.join(' · ')}</p></div><a href="#contact" aria-label={`了解 ${project.title}`}><Icon name="arrow" /></a></div>
              </article>
            ))}
          </div>
          <a className="all-work" href="#contact">浏览全部作品 <Icon name="arrow" size={17} /></a>
        </section>

        <section className="contact section-wrap" id="contact">
          <div className="section-label">03 / CONTACT</div>
          <p className="contact-kicker">有一个想法？</p>
          <h2>让我们一起<br /><em>创造点什么。</em></h2>
          <a className="contact-email" href="mailto:hello@example.com">hello@example.com <Icon name="arrow" size={26} /></a>
        </section>
      </main>

      <footer className="footer section-wrap">
        <a className="brand" href="#top">IF<span>.</span></a>
        <p>© 2026 — Crafted with curiosity.</p>
        <div className="social-links"><a href="#top" aria-label="GitHub"><Icon name="github" /></a><a href="#top" aria-label="LinkedIn"><Icon name="linkedin" /></a><a href="mailto:hello@example.com" aria-label="Email"><Icon name="mail" /></a></div>
      </footer>
    </div>
  )
}
