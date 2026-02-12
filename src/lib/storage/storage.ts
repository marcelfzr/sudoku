import type { AppSettings, GameStats, StoredGame } from '../sudoku/types'

const GAME_KEY_PREFIX = 'sudoku:game:'
const SETTINGS_KEY = 'sudoku:settings'
const STATS_KEY = 'sudoku:stats'

const defaultSettings: AppSettings = {
  themeMode: 'system',
  autoRemoveNotes: true,
  highlightPeers: true,
  autoCheckConflicts: true,
  highContrast: false,
}

const defaultStats: GameStats = {
  completedGames: 0,
  bestStreak: 0,
  currentStreak: 0,
  totalTimeSeconds: 0,
  lastCompletedDate: null,
}

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export const loadSettings = (): AppSettings => {
  const parsed = safeParse<Partial<AppSettings>>(localStorage.getItem(SETTINGS_KEY), {})
  return { ...defaultSettings, ...parsed }
}

export const saveSettings = (settings: AppSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export const loadStats = (): GameStats =>
  safeParse<GameStats>(localStorage.getItem(STATS_KEY), defaultStats)

export const saveStats = (stats: GameStats) => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats))
}

export const loadStoredGame = (date: string): StoredGame | null => {
  const entry = safeParse<StoredGame | null>(
    localStorage.getItem(`${GAME_KEY_PREFIX}${date}`),
    null,
  )
  return entry
}

export const saveStoredGame = (game: StoredGame) => {
  localStorage.setItem(`${GAME_KEY_PREFIX}${game.date}`, JSON.stringify(game))
}

export const markGameCompleted = (date: string, elapsedSeconds: number) => {
  const stats = loadStats()
  const alreadyCountedKey = `${GAME_KEY_PREFIX}${date}:counted`

  if (localStorage.getItem(alreadyCountedKey)) {
    return
  }

  const previousDate = stats.lastCompletedDate
  stats.completedGames += 1
  stats.totalTimeSeconds += elapsedSeconds
  stats.lastCompletedDate = date

  if (!previousDate) {
    stats.currentStreak = 1
  } else {
    const previous = new Date(`${previousDate}T00:00:00`)
    const current = new Date(`${date}T00:00:00`)
    const diffDays = Math.round(
      (current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24),
    )
    stats.currentStreak = diffDays === 1 ? stats.currentStreak + 1 : 1
  }

  stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak)
  saveStats(stats)
  localStorage.setItem(alreadyCountedKey, 'true')
}
