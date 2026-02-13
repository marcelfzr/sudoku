import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { listArchiveDates } from '../lib/sudoku/generator'
import { loadSettings, loadStoredGame } from '../lib/storage/storage'
import { formatDuration } from '../lib/time'

export function ArchivePage() {
  const { t } = useTranslation()
  const dates = listArchiveDates(90)
  const settings = loadSettings()

  return (
    <section className="panel stack-lg">
      <h1>{t('archive.title')}</h1>
      <p className="muted">{t('archive.description')}</p>

      <div className="archive-list">
        {dates.map((date) => {
          const game = loadStoredGame(date, settings.defaultDifficulty)
          return (
            <Link key={date} className="archive-item" to={`/daily/${date}`}>
              <span>{date}</span>
              <span className="muted">
                {game?.completed
                  ? `${t('archive.completed')} · ${formatDuration(game.elapsedSeconds)}`
                  : game
                    ? `${t('archive.inProgress')} · ${formatDuration(game.elapsedSeconds)}`
                    : t('archive.notStarted')}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
