import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GameToolbar } from '../components/GameToolbar'
import { NumberPad } from '../components/NumberPad'
import { SudokuBoard } from '../components/SudokuBoard'
import { useSudokuGame } from '../hooks/useSudokuGame'
import { formatDateKey } from '../lib/sudoku/board'
import { buildDailyPuzzle } from '../lib/sudoku/generator'
import { loadSettings, loadStoredGame, markGameCompleted, saveStoredGame } from '../lib/storage/storage'
import { formatDuration } from '../lib/time'
import type { CellValue } from '../lib/sudoku/types'

const isDateFormat = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value)

export function DailyPage() {
  const params = useParams<{ date: string }>()
  const navigate = useNavigate()
  const date = params.date && isDateFormat(params.date) ? params.date : formatDateKey(new Date())

  useEffect(() => {
    if (!params.date || !isDateFormat(params.date)) {
      navigate(`/daily/${date}`, { replace: true })
    }
  }, [date, navigate, params.date])

  return <DailyGame key={date} date={date} />
}

type DailyGameProps = {
  date: string
}

function DailyGame({ date }: DailyGameProps) {
  const { t } = useTranslation()
  const settings = useMemo(() => loadSettings(), [])
  const difficulty = settings.defaultDifficulty
  const puzzle = useMemo(() => buildDailyPuzzle(date, difficulty), [date, difficulty])
  const storedGame = useMemo(() => loadStoredGame(date, difficulty), [date, difficulty])

  const game = useSudokuGame({
    puzzle,
    storedGame,
    settings,
    onPersist: saveStoredGame,
    onComplete: (elapsedSeconds) => markGameCompleted(date, elapsedSeconds),
  })

  const disabledDigits = useMemo(() => {
    const counts = new Array(10).fill(0)
    for (const value of game.values) {
      if (value > 0) counts[value] += 1
    }
    const done = new Set<number>()
    for (let digit = 1; digit <= 9; digit += 1) {
      if (counts[digit] >= 9) done.add(digit)
    }
    return done
  }, [game.values])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key >= '1' && event.key <= '9') {
        game.applyInput(Number(event.key) as CellValue)
        return
      }
      if (event.key === 'Backspace' || event.key === 'Delete' || event.key === '0') {
        game.clearCell()
        return
      }
      if (event.key.toLowerCase() === 'n') {
        game.setNotesMode(!game.notesMode)
        return
      }
      if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') {
        event.preventDefault()
        game.moveSelection(-1, 0)
        return
      }
      if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') {
        event.preventDefault()
        game.moveSelection(1, 0)
        return
      }
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
        event.preventDefault()
        game.moveSelection(0, -1)
        return
      }
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
        event.preventDefault()
        game.moveSelection(0, 1)
        return
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault()
        if (event.shiftKey) {
          game.redo()
        } else {
          game.undo()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [game])

  return (
    <section className="game-page">
      <div className="panel game-header">
        <div className="row">
          <h1>{date === formatDateKey(new Date()) ? t('daily.today') : date}</h1>
        </div>
        <p className="muted">
          {t(`difficulty.${puzzle.difficulty}`)} · {t('home.clues', { count: puzzle.clueCount })}
        </p>
        <div className="game-stats">
          <span>{t('daily.time')}: {formatDuration(game.elapsedSeconds)}</span>
          <span>{t('daily.mistakes')}: {game.mistakes}</span>
          <span>{game.notesMode ? t('daily.notesOn') : t('daily.notesOff')}</span>
        </div>
        {game.completed ? (
          <p className="success" role="status">
            {t('daily.puzzleSolved')}
          </p>
        ) : null}
      </div>

      <div className="game-layout">
        <div className="panel board-panel">
          <SudokuBoard
            given={puzzle.given}
            values={game.values}
            notes={game.notes}
            selectedIndex={game.selectedIndex}
            conflicts={game.conflicts}
            highlightPeers={settings.highlightPeers}
            onSelect={game.setSelectedIndex}
          />
        </div>
        <aside className="panel controls-panel">
          <GameToolbar
            notesMode={game.notesMode}
            canUndo={game.canUndo}
            canRedo={game.canRedo}
            mistakeFlash={game.mistakeFlash}
            onToggleNotes={() => game.setNotesMode(!game.notesMode)}
            onUndo={game.undo}
            onRedo={game.redo}
            onClear={game.clearCell}
            onRestart={game.restart}
          />
        </aside>
      </div>

      <div className="sticky-input">
        <NumberPad
          disabled={game.completed}
          disabledDigits={disabledDigits}
          onInput={(value) => game.applyInput(value as CellValue)}
        />
      </div>
    </section>
  )
}
