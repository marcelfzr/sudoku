import { useEffect, useMemo, useRef, useState } from 'react'
import {
  clearNoteDigit,
  cloneBoard,
  getPeers,
  noteHasDigit,
  toggleNoteDigit,
} from '../lib/sudoku/board'
import type {
  AppSettings,
  CellValue,
  GameSnapshot,
  PuzzleDefinition,
  StoredGame,
} from '../lib/sudoku/types'
import { getConflictSet, isSolved } from '../lib/sudoku/validate'

type UseSudokuGameProps = {
  puzzle: PuzzleDefinition
  storedGame: StoredGame | null
  settings: AppSettings
  onPersist: (game: StoredGame) => void
  onComplete: (elapsedSeconds: number) => void
}

const cloneSnapshot = (snapshot: GameSnapshot): GameSnapshot => ({
  values: cloneBoard(snapshot.values),
  notes: [...snapshot.notes],
  mistakes: snapshot.mistakes,
})

const buildInitialSnapshot = (
  puzzle: PuzzleDefinition,
  storedGame: StoredGame | null,
): GameSnapshot => {
  if (
    storedGame &&
    storedGame.date === puzzle.date &&
    storedGame.difficulty === puzzle.difficulty
  ) {
    return {
      values: cloneBoard(storedGame.values),
      notes: [...storedGame.notes],
      mistakes: storedGame.mistakes,
    }
  }
  return {
    values: cloneBoard(puzzle.given),
    notes: Array(81).fill(0),
    mistakes: 0,
  }
}

export const useSudokuGame = ({
  puzzle,
  storedGame,
  settings,
  onPersist,
  onComplete,
}: UseSudokuGameProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [notesMode, setNotesMode] = useState(storedGame?.notesMode ?? false)
  const [elapsedSeconds, setElapsedSeconds] = useState(storedGame?.elapsedSeconds ?? 0)
  const [mistakeFlash, setMistakeFlash] = useState(false)
  const mistakeFlashTimeoutRef = useRef<number | null>(null)
  const [past, setPast] = useState<GameSnapshot[]>([])
  const [future, setFuture] = useState<GameSnapshot[]>([])
  const [present, setPresent] = useState(() => buildInitialSnapshot(puzzle, storedGame))

  const completed = useMemo(
    () => isSolved(present.values, puzzle.solution),
    [present.values, puzzle.solution],
  )

  const conflicts = useMemo(() => getConflictSet(present.values), [present.values])

  useEffect(() => {
    if (completed) return
    const interval = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1)
    }, 1000)
    return () => window.clearInterval(interval)
  }, [completed])

  useEffect(() => {
    onPersist({
      date: puzzle.date,
      difficulty: puzzle.difficulty,
      values: present.values,
      notes: present.notes,
      mistakes: present.mistakes,
      elapsedSeconds,
      notesMode,
      completed,
      completedAt: completed ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    })
  }, [completed, elapsedSeconds, notesMode, onPersist, present, puzzle.date, puzzle.difficulty])

  useEffect(() => {
    if (completed) onComplete(elapsedSeconds)
  }, [completed, elapsedSeconds, onComplete])

  useEffect(
    () => () => {
      if (mistakeFlashTimeoutRef.current !== null) {
        window.clearTimeout(mistakeFlashTimeoutRef.current)
      }
    },
    [],
  )

  const pushHistory = (next: GameSnapshot) => {
    setPast((history) => [...history.slice(-99), cloneSnapshot(present)])
    setFuture([])
    setPresent(next)
  }

  const restart = () => {
    setPast([])
    setFuture([])
    setElapsedSeconds(0)
    setPresent({
      values: cloneBoard(puzzle.given),
      notes: Array(81).fill(0),
      mistakes: 0,
    })
  }

  const applyInput = (digit: CellValue) => {
    if (selectedIndex === null || puzzle.given[selectedIndex] !== 0 || completed) return

    const next = cloneSnapshot(present)
    const currentValue = next.values[selectedIndex]

    if (notesMode) {
      next.notes[selectedIndex] = toggleNoteDigit(next.notes[selectedIndex], digit)
      pushHistory(next)
      return
    }

    if (currentValue === digit) return
    next.values[selectedIndex] = digit
    next.notes[selectedIndex] = 0

    if (settings.autoRemoveNotes) {
      for (const peer of getPeers(selectedIndex)) {
        next.notes[peer] = clearNoteDigit(next.notes[peer], digit)
      }
    }

    if (settings.autoCheckConflicts && digit !== puzzle.solution[selectedIndex]) {
      next.mistakes += 1
      if (settings.highlightRecoveryActionsOnMistake) {
        setMistakeFlash(true)
        if (mistakeFlashTimeoutRef.current !== null) {
          window.clearTimeout(mistakeFlashTimeoutRef.current)
        }
        mistakeFlashTimeoutRef.current = window.setTimeout(() => {
          setMistakeFlash(false)
          mistakeFlashTimeoutRef.current = null
        }, 1200)
      }
    }

    pushHistory(next)
  }

  const clearCell = () => {
    if (selectedIndex === null || puzzle.given[selectedIndex] !== 0 || completed) return
    if (present.values[selectedIndex] === 0 && present.notes[selectedIndex] === 0) return
    const next = cloneSnapshot(present)
    next.values[selectedIndex] = 0
    next.notes[selectedIndex] = 0
    pushHistory(next)
  }

  const undo = () => {
    setPast((history) => {
      if (history.length === 0) return history
      const previous = history[history.length - 1]
      setFuture((next) => [cloneSnapshot(present), ...next.slice(0, 99)])
      setPresent(cloneSnapshot(previous))
      return history.slice(0, -1)
    })
  }

  const redo = () => {
    setFuture((upcoming) => {
      if (upcoming.length === 0) return upcoming
      const [next, ...rest] = upcoming
      setPast((history) => [...history.slice(-99), cloneSnapshot(present)])
      setPresent(cloneSnapshot(next))
      return rest
    })
  }

  const moveSelection = (deltaRow: number, deltaCol: number) => {
    const index = selectedIndex ?? 0
    const row = Math.floor(index / 9)
    const col = index % 9
    const nextRow = (row + deltaRow + 9) % 9
    const nextCol = (col + deltaCol + 9) % 9
    setSelectedIndex(nextRow * 9 + nextCol)
  }

  const shouldHighlightNote = (index: number, digit: CellValue) =>
    noteHasDigit(present.notes[index], digit)

  return {
    values: present.values,
    notes: present.notes,
    mistakes: present.mistakes,
    selectedIndex,
    setSelectedIndex,
    notesMode,
    setNotesMode,
    elapsedSeconds,
    completed,
    mistakeFlash,
    conflicts,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    applyInput,
    clearCell,
    undo,
    redo,
    restart,
    moveSelection,
    shouldHighlightNote,
  }
}
