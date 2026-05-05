export type Locale = 'fr' | 'en'

export const LOCALES: Locale[] = ['fr', 'en']

export const LOCALE_LABELS: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
}

export interface Translations {
  nav: {
    guide: string
    cta: string
  }
  home: {
    badge: string
    subtitle: string
    placeholder: string
    noDomain: string
    target: string
    copyAll: string
    download: string
    copiedAll: string
    downloaded: string
    hint: string
    copyCategory: string
    copied: string
    needDomain: string
    needDomainDesc: string
    dorks: string
    categories: string
    categoryNames: Record<string, string>
  }
  learn: {
    badge: string
    title: string
    subtitle: string
    whatIsTitle: string
    whatIs: string[]
    warning: string
    warningBody: string
    operatorsTitle: string
    exampleTitle: string
    exampleQuery: string
    practicesTitle: string
    ctaTitle: string
    ctaSubtitle: string
    ctaBtn: string
    practices: { title: string; desc: string }[]
    operators: { op: string; example: string; desc: string }[]
    decomp: { op: string; desc: string }[]
  }
  footer: {
    description: string
    columns: {
      tool: { title: string; links: string[] }
      resources: { title: string; links: string[] }
      legal: { title: string; links: string[] }
    }
    copyright: string
    tagline: string
  }
}
