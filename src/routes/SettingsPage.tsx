import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { i18n, getBrowserPreferredLanguage } from '../i18n/i18n'
import { loadSettings, saveSettings } from '../lib/storage/storage'
import type { AppSettings, Difficulty } from '../lib/sudoku/types'
import { applyThemeFromSettings } from '../lib/theme'

const toggleSettingKeys = [
  'autoRemoveNotes',
  'highlightPeers',
  'autoCheckConflicts',
  'highlightRecoveryActionsOnMistake',
  'highContrast',
] as const

const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert']

export function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings())

  useEffect(() => {
    applyThemeFromSettings(settings)
  }, [settings])

  const toggle = (key: (typeof toggleSettingKeys)[number]) => {
    const next = { ...settings, [key]: !settings[key] }
    setSettings(next)
    saveSettings(next)
  }

  const setThemeMode = (themeMode: AppSettings['themeMode']) => {
    const next = { ...settings, themeMode }
    setSettings(next)
    saveSettings(next)
  }

  const setDefaultDifficulty = (defaultDifficulty: Difficulty) => {
    const next = { ...settings, defaultDifficulty }
    setSettings(next)
    saveSettings(next)
  }

  const setLanguageOverride = (languageOverride: AppSettings['languageOverride']) => {
    const next = { ...settings, languageOverride }
    setSettings(next)
    saveSettings(next)
    const lng =
      languageOverride === 'system' ? getBrowserPreferredLanguage() : languageOverride
    i18n.changeLanguage(lng)
  }

  const { t } = useTranslation()

  const languageOptions: Array<{ value: AppSettings['languageOverride']; labelKey: string }> = [
    { value: 'system', labelKey: 'settings.languageSystem' },
    { value: 'en', labelKey: 'settings.languageEn' },
    { value: 'de', labelKey: 'settings.languageDe' },
  ]

  return (
    <section className="panel stack-lg">
      <h1>{t('settings.title')}</h1>
      <p className="muted">{t('settings.subtitle')}</p>

      <div className="theme-picker" role="radiogroup" aria-label={t('settings.themeModeA11y')}>
        <span className="muted">{t('settings.theme')}</span>
        <div className="theme-options">
          {(['system', 'light', 'dark'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              className={settings.themeMode === mode ? 'active' : ''}
              onClick={() => setThemeMode(mode)}
              role="radio"
              aria-checked={settings.themeMode === mode}
            >
              {t(`settings.${mode}`)}
            </button>
          ))}
        </div>
      </div>

      <div
        className="theme-picker"
        role="radiogroup"
        aria-label={t('settings.defaultDifficultyA11y')}
      >
        <span className="muted">{t('settings.defaultDifficulty')}</span>
        <div className="difficulty-options">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty}
              type="button"
              className={settings.defaultDifficulty === difficulty ? 'active' : ''}
              onClick={() => setDefaultDifficulty(difficulty)}
              role="radio"
              aria-checked={settings.defaultDifficulty === difficulty}
            >
              {t(`difficulty.${difficulty}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="theme-picker" role="radiogroup" aria-label={t('settings.languageA11y')}>
        <span className="muted">{t('settings.language')}</span>
        <div className="theme-options">
          {languageOptions.map(({ value, labelKey }) => (
            <button
              key={value}
              type="button"
              className={settings.languageOverride === value ? 'active' : ''}
              onClick={() => setLanguageOverride(value)}
              role="radio"
              aria-checked={settings.languageOverride === value}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-list">
        {toggleSettingKeys.map((key) => (
          <label className="setting-row" key={key}>
            <input
              type="checkbox"
              checked={settings[key]}
              onChange={() => toggle(key)}
              aria-label={t(`settings.${key}`)}
            />
            <span>{t(`settings.${key}`)}</span>
          </label>
        ))}
      </div>
    </section>
  )
}
