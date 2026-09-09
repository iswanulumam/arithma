import { beforeEach, describe, expect, it } from 'vitest'
import type { AttemptResult } from '../types/mentalCalculation'
import { HISTORY_STORAGE_KEY, loadHistory, saveResult } from './storage'

const attempt: AttemptResult = {
  id: 'one',
  timestamp: '2026-09-10T00:00:00.000Z',
  level: 'Baseline',
  operation: 'addition',
  operands: [10, 20],
  correctAnswer: 30,
  userAnswer: 30,
  correct: true,
  intervalMs: 2000,
  answerTimeMs: 900,
}

describe('history storage', () => {
  beforeEach(() => localStorage.clear())

  it('appends and reloads historical results', () => {
    saveResult(attempt)
    saveResult({ ...attempt, id: 'two' })
    expect(loadHistory().map((result) => result.id)).toEqual(['one', 'two'])
  })

  it('recovers from malformed stored data', () => {
    localStorage.setItem(HISTORY_STORAGE_KEY, '{broken')
    expect(loadHistory()).toEqual([])
  })
})
