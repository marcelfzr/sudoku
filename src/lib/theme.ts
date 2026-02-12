import type { AppSettings } from './sudoku/types'

export const getEffectiveTheme = (themeMode: AppSettings['themeMode']) => {
  if (themeMode === 'light' || themeMode === 'dark') return themeMode
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const applyThemeFromSettings = (settings: AppSettings) => {
  const theme = getEffectiveTheme(settings.themeMode)
  document.documentElement.dataset.theme = theme
  document.documentElement.dataset.contrast = settings.highContrast ? 'true' : 'false'
}
