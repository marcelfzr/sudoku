import { useEffect, useState } from 'react'
import { loadSettings, saveSettings } from '../lib/storage/storage'
import type { AppSettings, Difficulty } from '../lib/sudoku/types'
import { applyThemeFromSettings } from '../lib/theme'

const toggleSettingLabels: Record<
  Exclude<keyof AppSettings, 'themeMode' | 'defaultDifficulty'>,
  string
> = {
  autoRemoveNotes: 'Auto remove notes when entering a number',
  highlightPeers: 'Highlight row, column, and box for selected cell',
  autoCheckConflicts: 'Count mistakes when entering wrong values',
  highlightRecoveryActionsOnMistake: 'Highlight undo and erase after mistakes',
  highContrast: 'Use high contrast board colors',
}

const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert']

export function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings())

  useEffect(() => {
    applyThemeFromSettings(settings)
  }, [settings])

  const toggle = (key: Exclude<keyof AppSettings, 'themeMode' | 'defaultDifficulty'>) => {
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

  return (
    <section className="panel stack-lg">
      <h1>Settings</h1>
      <p className="muted">Customize how the game feels on mobile and desktop.</p>

      <div className="theme-picker" role="radiogroup" aria-label="Theme mode">
        <span className="muted">Theme</span>
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
              {mode[0].toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="theme-picker" role="radiogroup" aria-label="Default difficulty">
        <span className="muted">Default difficulty</span>
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
              {difficulty[0].toUpperCase() + difficulty.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-list">
        {(Object.keys(toggleSettingLabels) as Array<
          Exclude<keyof AppSettings, 'themeMode' | 'defaultDifficulty'>
        >).map((key) => (
          <label className="setting-row" key={key}>
            <input
              type="checkbox"
              checked={settings[key]}
              onChange={() => toggle(key)}
              aria-label={toggleSettingLabels[key]}
            />
            <span>{toggleSettingLabels[key]}</span>
          </label>
        ))}
      </div>
    </section>
  )
}
