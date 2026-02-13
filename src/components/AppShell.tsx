import { useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { PropsWithChildren } from 'react'
import { loadSettings } from '../lib/storage/storage'
import { applyThemeFromSettings } from '../lib/theme'

export function AppShell({ children }: PropsWithChildren) {
  const { t } = useTranslation()
  useEffect(() => {
    const settings = loadSettings()
    applyThemeFromSettings(settings)

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      const latest = loadSettings()
      if (latest.themeMode === 'system') {
        applyThemeFromSettings(latest)
      }
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand">
          {t('nav.brand')}
        </Link>
        <nav className="main-nav" aria-label={t('a11y.navMain')}>
          <NavLink to="/" end>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/archive">{t('nav.archive')}</NavLink>
          <NavLink to="/settings">{t('nav.settings')}</NavLink>
        </nav>
      </header>
      <main className="app-main">{children}</main>
    </div>
  )
}
