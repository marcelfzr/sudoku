import { Eraser, Pencil, Redo2, RotateCcw, Undo2 } from 'lucide-react'

type GameToolbarProps = {
  notesMode: boolean
  canUndo: boolean
  canRedo: boolean
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
  onToggleNotes,
  onUndo,
  onRedo,
  onClear,
  onRestart,
}: GameToolbarProps) {
  return (
    <div className="game-toolbar" role="toolbar" aria-label="Game actions">
      <button
        type="button"
        className={notesMode ? 'active' : ''}
        onClick={onToggleNotes}
        aria-label="Toggle notes mode"
        title="Notes"
      >
        <Pencil size={20} />
      </button>
      <button type="button" onClick={onUndo} disabled={!canUndo} aria-label="Undo" title="Undo">
        <Undo2 size={20} />
      </button>
      <button type="button" onClick={onRedo} disabled={!canRedo} aria-label="Redo" title="Redo">
        <Redo2 size={20} />
      </button>
      <button type="button" onClick={onClear} aria-label="Erase cell" title="Erase">
        <Eraser size={20} />
      </button>
      <button type="button" onClick={onRestart} aria-label="Restart puzzle" title="Restart">
        <RotateCcw size={20} />
      </button>
    </div>
  )
}
