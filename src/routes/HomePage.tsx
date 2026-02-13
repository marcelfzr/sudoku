import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { formatDateKey } from '../lib/sudoku/board'
import { buildDailyPuzzle } from '../lib/sudoku/generator'
import { loadSettings, loadStats, loadStoredGame } from '../lib/storage/storage'
import { formatDuration } from '../lib/time'

export function HomePage() {
  const { t } = useTranslation()
  const today = formatDateKey(new Date())
  const settings = loadSettings()
  const puzzle = buildDailyPuzzle(today, settings.defaultDifficulty)
  const saved = loadStoredGame(today, settings.defaultDifficulty)
  const stats = loadStats()
  const averageTime =
    stats.completedGames > 0 ? Math.round(stats.totalTimeSeconds / stats.completedGames) : 0

  return (
    <section className="panel stack-lg">
      <h1>{t('home.title')}</h1>
      <p className="muted">{t('home.tagline')}</p>

      <div className="stats-grid">
        <article>
          <h2>{t('home.today')}</h2>
          <p>{today}</p>
          <p className="muted">
            {t(`difficulty.${puzzle.difficulty}`)} · {t('home.clues', { count: puzzle.clueCount })}
          </p>
        </article>
        <article>
          <h2>{t('home.progress')}</h2>
          <p>
            {saved?.completed
              ? t('home.completed')
              : saved
                ? t('home.inProgress')
                : t('home.notStarted')}
          </p>
          <p className="muted">
            {saved ? t('home.elapsed', { duration: formatDuration(saved.elapsedSeconds) }) : '-'}
          </p>
        </article>
      </div>

      <div className="cta-row">
        <Link className="button" to={`/daily/${today}`}>
          {saved ? t('home.continueToday') : t('home.startToday')}
        </Link>
        <Link className="button button-soft" to="/archive">
          {t('home.browseArchive')}
        </Link>
      </div>

      <div className="stats-grid">
        <article>
          <h2>{t('home.completed')}</h2>
          <p>{stats.completedGames}</p>
        </article>
        <article>
          <h2>{t('home.currentStreak')}</h2>
          <p>{stats.currentStreak}</p>
        </article>
        <article>
          <h2>{t('home.bestStreak')}</h2>
          <p>{stats.bestStreak}</p>
        </article>
        <article>
          <h2>{t('home.avgTime')}</h2>
          <p>{averageTime ? formatDuration(averageTime) : t('home.noTime')}</p>
        </article>
      </div>
    </section>
  )
}
