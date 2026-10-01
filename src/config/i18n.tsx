import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type Language = 'zh' | 'en'

export type Project = {
  title: string
  tags: string[]
  /** file stem in public/projects — two widths are generated per image */
  image: string
  alt: string
  year: string
  href: string
}

export type Translation = {
  navAbout: string
  navWork: string
  navContact: string
  navCta: string
  availability: string
  heroTitle: ReactNode
  heroIntro: ReactNode
  workCta: string
  aboutLink: string
  aboutTitle: ReactNode
  aboutText: string
  workLabel: string
  workTitle: ReactNode
  allWork: string
  worldwideText: string
  marquee: string[]
  contactLabel: string
  contactKicker: string
  contactTitle: ReactNode
  footer: string
  projects: Project[]
  caseStudy: string
}

const projects = (lang: 'zh' | 'en'): Project[] => [
  {
    title: lang === 'zh' ? 'AI 工作流' : 'AI Workflow',
    tags: ['LLM', 'Automation', 'Python'],
    image: 'latent',
    alt:
      lang === 'zh'
        ? '电路板微距特写，细密的走线在深色底上泛着冷光'
        : 'Macro photograph of a circuit board, fine traces glowing against a dark base',
    year: '2025',
    href: '#contact',
  },
  {
    title: lang === 'zh' ? '数据平台' : 'Data Platform',
    tags: ['ETL', 'Analytics', 'SQL'],
    image: 'pipeline',
    alt:
      lang === 'zh'
        ? '机房内一排排服务器机柜，指示灯连成长条'
        : 'Rows of server racks in a data centre with banks of status lights',
    year: '2025',
    href: '#contact',
  },
  {
    title: lang === 'zh' ? 'Web 体验' : 'Web Experience',
    tags: ['React', 'UI', 'Performance'],
    image: 'metric',
    alt:
      lang === 'zh'
        ? '深色主题的实时数据看板，柱状图与折线图铺满屏幕'
        : 'A dark-themed realtime analytics dashboard filled with bar and line charts',
    year: '2024',
    href: '#contact',
  },
]

export const translations: Record<Language, Translation> = {
  zh: {
    navAbout: '关于',
    navWork: '作品',
    navContact: '联系',
    navCta: '一起合作',
    availability: '目前开放合作机会',
    heroTitle: (
      <>
        构建智能、
        <br />
        <span className="serif-em">可靠</span>的数字体验。
      </>
    ),
    heroIntro: (
      <>
        我是 IF，一名专注于 <strong>AI 全栈</strong> 与 <strong>数据工程</strong> 的软件工程师。
        我把混乱的数据梳理成可用的产品。
      </>
    ),
    workCta: '查看作品',
    aboutLink: '更多关于我',
    aboutTitle: (
      <>
        把想法转化为
        <br />
        <span className="serif-em">真正有用</span>的产品。
      </>
    ),
    aboutText:
      '我从问题出发，梳理数据、设计体验，并将它们变成稳定可迭代的解决方案。比起堆砌技术名词，我更在意一件事能不能被真正用起来。',
    workLabel: '精选实践',
    workTitle: (
      <>
        一些正在生长的
        <br />
        <span className="serif-em">实践</span>。
      </>
    ),
    allWork: '浏览全部作品',
    worldwideText: '数据流过每一个时区，产品就要在每一个时区都说得通。',
    marquee: ['AI 全栈', '数据工程', '把想法做出来', '可迭代的系统', '注重细节'],
    contactLabel: '联系',
    contactKicker: '有一个想法？',
    contactTitle: (
      <>
        让我们一起
        <br />
        <span className="serif-em">创造点什么。</span>
      </>
    ),
    footer: '© 2026 — Crafted with curiosity.',
    projects: projects('zh'),
    caseStudy: '查看案例',
  },
  en: {
    navAbout: 'About',
    navWork: 'Work',
    navContact: 'Contact',
    navCta: 'Let’s talk',
    availability: 'Available for opportunities',
    heroTitle: (
      <>
        Building intelligent,
        <br />
        <span className="serif-em">reliable</span> digital experiences.
      </>
    ),
    heroIntro: (
      <>
        I’m IF, a software engineer focused on <strong>AI full-stack</strong> and{' '}
        <strong>data engineering</strong>. I turn messy data into products people actually use.
      </>
    ),
    workCta: 'View my work',
    aboutLink: 'More about me',
    aboutTitle: (
      <>
        Turning ideas into
        <br />
        <span className="serif-em">useful</span> products.
      </>
    ),
    aboutText:
      'I start with the problem, shape the data and the experience, then turn both into dependable, evolving solutions. I care more about whether a thing gets used than about how many tools it names.',
    workLabel: 'Selected work',
    workTitle: (
      <>
        A few things
        <br />
        <span className="serif-em">in progress</span>.
      </>
    ),
    allWork: 'See all work',
    worldwideText: 'Data crosses every time zone, so the product has to make sense in every one of them.',
    marquee: ['AI full-stack', 'Data engineering', 'Shipping ideas', 'Systems that evolve', 'Obsessed with detail'],
    contactLabel: 'Contact',
    contactKicker: 'Have an idea?',
    contactTitle: (
      <>
        Let’s make
        <br />
        <span className="serif-em">something useful.</span>
      </>
    ),
    footer: '© 2026 — Crafted with curiosity.',
    projects: projects('en'),
    caseStudy: 'View case study',
  },
}

type LanguageContextValue = {
  lang: Language
  t: Translation
  toggle: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(
    () => (document.documentElement.lang.startsWith('en') ? 'en' : 'zh'),
  )

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      t: translations[lang],
      toggle: () =>
        setLang((current) => {
          const next: Language = current === 'zh' ? 'en' : 'zh'
          document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en'
          return next
        }),
    }),
    [lang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return value
}
