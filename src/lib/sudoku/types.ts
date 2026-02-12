export type CellValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type Board = CellValue[]

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'

export type PuzzleDefinition = {
  id: string
  date: string
  difficulty: Difficulty
  given: Board
  solution: Board
  clueCount: number
}

export type GameSnapshot = {
  values: Board
  notes: number[]
  mistakes: number
}

export type StoredGame = {
  date: string
  values: Board
  notes: number[]
  mistakes: number
  elapsedSeconds: number
  notesMode: boolean
  completed: boolean
  completedAt: string | null
  updatedAt: string
}

export type GameStats = {
  completedGames: number
  bestStreak: number
  currentStreak: number
  totalTimeSeconds: number
  lastCompletedDate: string | null
}

export type AppSettings = {
  themeMode: 'system' | 'light' | 'dark'
  autoRemoveNotes: boolean
  highlightPeers: boolean
  autoCheckConflicts: boolean
  highContrast: boolean
}
