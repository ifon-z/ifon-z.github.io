import type { ReactNode } from 'react'

export type Language = 'zh' | 'en'
export type Translation = {
  navAbout: string; navWork: string; navContact: string; navCta: string; availability: string
  heroTitle: ReactNode; heroIntro: ReactNode; workCta: string; aboutLink: string; aboutTitle: ReactNode; aboutText: string
  workLabel: string; workTitle: ReactNode; allWork: string; contactLabel: string; contactKicker: string; contactTitle: ReactNode; footer: string
  projects: Array<{ title: string; tags: string }>
}

export const translations: Record<Language, Translation> = {
  zh: {
    navAbout: '关于', navWork: '作品', navContact: '联系', navCta: '一起合作', availability: '目前开放合作机会',
    heroTitle: <>构建智能、<em>可靠</em>的数字体验。</>, heroIntro: <>我是 IF，一名专注于 <strong>AI 全栈</strong> 与 <strong>数据工程</strong> 的初级软件工程师。</>,
    workCta: '查看作品', aboutLink: '更多关于我', aboutTitle: <>把想法转化为<br />真正有用的产品。</>, aboutText: '我从问题出发，梳理数据、设计体验，并将它们变成稳定可迭代的解决方案。',
    workLabel: '精选实践', workTitle: <>一些正在生长的<br /><em>实践</em>。</>, allWork: '浏览全部作品', contactLabel: '联系', contactKicker: '有一个想法？', contactTitle: <>让我们一起<br /><em>创造点什么。</em></>, footer: '© 2026 — Crafted with curiosity.',
    projects: [{ title: 'AI Workflow', tags: 'LLM · Automation' }, { title: 'Data Platform', tags: 'ETL · Analytics' }, { title: 'Web Experience', tags: 'React · UI' }],
  },
  en: {
    navAbout: 'About', navWork: 'Work', navContact: 'Contact', navCta: 'Let’s talk', availability: 'Available for opportunities',
    heroTitle: <>Building intelligent,<br /><em>reliable</em> digital experiences.</>, heroIntro: <>I’m IF, a junior software engineer focused on <strong>AI full-stack</strong> and <strong>data engineering</strong>.</>,
    workCta: 'View my work', aboutLink: 'More about me', aboutTitle: <>Turning ideas into<br />useful products.</>, aboutText: 'I start with the problem, shape the data and experience, then turn both into dependable, evolving solutions.',
    workLabel: 'Selected work', workTitle: <>A few things<br /><em>in progress</em>.</>, allWork: 'See all work', contactLabel: 'Contact', contactKicker: 'Have an idea?', contactTitle: <>Let’s make<br /><em>something useful.</em></>, footer: '© 2026 — Crafted with curiosity.',
    projects: [{ title: 'AI Workflow', tags: 'LLM · Automation' }, { title: 'Data Platform', tags: 'ETL · Analytics' }, { title: 'Web Experience', tags: 'React · UI' }],
  },
}
