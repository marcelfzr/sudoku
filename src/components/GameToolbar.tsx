import { Eraser, Pencil, Redo2, RotateCcw, Undo2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type GameToolbarProps = {
  notesMode: boolean
  canUndo: boolean
  canRedo: boolean
  mistakeFlash: boolean
  onToggleNotes: () => void
  onUndo: () => void
  onRedo: () => void
  onClear: () => void
  onRestart: () => void
}

export function GameToolbar({
  notesMode,
  canUndo,
  canRedo,
  mistakeFlash,
  onToggleNotes,
  onUndo,
  onRedo,
  onClear,
  onRestart,
}: GameToolbarProps) {
  const { t } = useTranslation()

  return (
    <div className="game-toolbar" role="toolbar" aria-label={t('a11y.gameActions')}>
      <button
        type="button"
        className={notesMode ? 'active' : ''}
        onClick={onToggleNotes}
        aria-label={t('a11y.toggleNotesMode')}
        title={t('toolbar.notes')}
      >
        <Pencil size={20} />
      </button>
      <button
        type="button"
        className={mistakeFlash ? 'attention' : ''}
        onClick={onUndo}
        disabled={!canUndo}
        aria-label={t('a11y.undo')}
        title={t('toolbar.undo')}
      >
        <Undo2 size={20} />
      </button>
      <button
        type="button"
        onClick={onRedo}
        disabled={!canRedo}
        aria-label={t('a11y.redo')}
        title={t('toolbar.redo')}
      >
        <Redo2 size={20} />
      </button>
      <button
        type="button"
        className={mistakeFlash ? 'attention' : ''}
        onClick={onClear}
        aria-label={t('a11y.eraseCell')}
        title={t('toolbar.erase')}
      >
        <Eraser size={20} />
      </button>
      <button
        type="button"
        onClick={onRestart}
        aria-label={t('a11y.restartPuzzle')}
        title={t('toolbar.restart')}
      >
        <RotateCcw size={20} />
      </button>
    </div>
  )
}
