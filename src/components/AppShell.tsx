import { useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import type { PropsWithChildren } from 'react'
import { loadSettings } from '../lib/storage/storage'
import { applyThemeFromSettings } from '../lib/theme'

export function AppShell({ children }: PropsWithChildren) {
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
          Daily Sudoku
        </Link>
        <nav className="main-nav" aria-label="Main">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/archive">Archive</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </nav>
      </header>
      <main className="app-main">{children}</main>
    </div>
  )
}
