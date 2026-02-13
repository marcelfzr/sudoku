import { getBoxId, getPeers } from '../lib/sudoku/board'
import { useTranslation } from 'react-i18next'
import type { Board, CellValue } from '../lib/sudoku/types'

type SudokuBoardProps = {
  given: Board
  values: Board
  notes: number[]
  selectedIndex: number | null
  conflicts: Set<number>
  highlightPeers: boolean
  onSelect: (index: number) => void
}

const noteDigits: CellValue[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export function SudokuBoard({
  given,
  values,
  notes,
  selectedIndex,
  conflicts,
  highlightPeers,
  onSelect,
}: SudokuBoardProps) {
  const { t } = useTranslation()
  const sameValue =
    selectedIndex !== null && values[selectedIndex] !== 0 ? values[selectedIndex] : null
  const peers = selectedIndex !== null ? new Set(getPeers(selectedIndex)) : new Set<number>()
  const selectedBox = selectedIndex !== null ? getBoxId(selectedIndex) : -1

  return (
    <div className="board-grid" role="grid" aria-label={t('a11y.sudokuBoard')}>
      {values.map((value, index) => {
        const isSelected = index === selectedIndex
        const isGiven = given[index] !== 0
        const hasConflict = conflicts.has(index)
        const inSameValue = sameValue !== null && value === sameValue
        const inPeerHighlight =
          highlightPeers &&
          selectedIndex !== null &&
          (peers.has(index) || getBoxId(index) === selectedBox)

        const classes = [
          'board-cell',
          isGiven ? 'given' : 'editable',
          isSelected ? 'selected' : '',
          hasConflict ? 'conflict' : '',
          inPeerHighlight ? 'peer' : '',
          inSameValue ? 'same-value' : '',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <button
            key={index}
            type="button"
            role="gridcell"
            className={classes}
            aria-label={t('a11y.cellPosition', {
              row: Math.floor(index / 9) + 1,
              col: (index % 9) + 1,
            })}
            onClick={() => onSelect(index)}
          >
            {value === 0 ? (
              <div className="notes-grid">
                {noteDigits.map((digit) => (
                  <span key={digit} className="note-digit">
                    {(notes[index] & (1 << digit)) !== 0 ? digit : ''}
                  </span>
                ))}
              </div>
            ) : (
              <span className="cell-value">{value}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
