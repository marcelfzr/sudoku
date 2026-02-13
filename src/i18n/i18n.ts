import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { loadSettings } from '../lib/storage/storage'
import { en } from './locales/en'
import { de } from './locales/de'

export const supportedLanguages = ['en', 'de'] as const
export type SupportedLanguage = (typeof supportedLanguages)[number]

export function getBrowserPreferredLanguage(): string {
  const browserLangs = navigator.languages ?? [navigator.language]
  for (const lang of browserLangs) {
    const code = lang.split('-')[0].toLowerCase()
    if (supportedLanguages.includes(code as SupportedLanguage)) {
      return code
    }
  }
  return 'en'
}

function resolveLanguage(): string {
  const settings = loadSettings()
  const override = settings.languageOverride
  if (override && override !== 'system') return override
  return getBrowserPreferredLanguage()
}

const initialLng = resolveLanguage()

i18n.use(initReactI18next).init({
  lng: initialLng,
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    de: { translation: de },
  },
  interpolation: {
    escapeValue: false,
  },
})

document.documentElement.lang = initialLng
document.title = i18n.t('nav.brand')
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng
  document.title = i18n.t('nav.brand')
})

export { i18n }
