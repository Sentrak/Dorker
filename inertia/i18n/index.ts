import { fr } from './fr'
import { en } from './en'
import type { Locale, Translations } from './types'

const translations: Record<Locale, Translations> = { fr, en }

export function getTranslations(locale: Locale): Translations {
  return translations[locale] ?? fr
}

export type { Locale, Translations }
