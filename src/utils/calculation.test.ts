import { describe, expect, it, vi } from 'vitest'
import type { AttemptResult, LevelConfig } from '../types/mentalCalculation'
import {
  calculateAdditionTotal,
  calculateSessionSummary,
  calculateTotal,
  formatCalculation,
  generateChallenge,
  generateOperands,
} from './calculation'
import { generateRandomInteger } from './random'

describe('addition calculations', () => {
  it('calculates a serial addition total', () => {
    expect(calculateAdditionTotal([47, 28, 63, 19])).toBe(157)
  })

  it('generates the configured number of inclusive operands', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.999999)
    const config: LevelConfig = {
      id: 'test',
      label: 'Test',
      numberOfOperands: 2,
      minOperand: 10,
      maxOperand: 99,
      intervalMs: 100,
    }

    expect(generateOperands(config)).toEqual([10, 99])
    vi.restoreAllMocks()
  })

  it('includes both random range boundaries', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.999999)
    expect(generateRandomInteger(-2, 2)).toBe(-2)
    expect(generateRandomInteger(-2, 2)).toBe(2)
    vi.restoreAllMocks()
  })
})

describe('operation challenges', () => {
  const config: LevelConfig = {
    id: 'test',
    label: 'Test',
    numberOfOperands: 4,
    minOperand: 10,
    maxOperand: 20,
    intervalMs: 100,
  }

  it('generates subtraction values with a nonnegative running total', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.999999)
      .mockReturnValueOnce(0)

    const steps = generateChallenge(config, 'subtraction')
    const runningTotals: number[] = []
    let total = 0
    for (const step of steps) {
      total = step.operator === 'start' ? step.value : total - step.value
      runningTotals.push(total)
    }

    expect(steps).toEqual([
      { operator: 'start', value: 55 },
      { operator: 'subtract', value: 10 },
      { operator: 'subtract', value: 15 },
      { operator: 'subtract', value: 20 },
    ])
    expect(runningTotals.every((value) => value >= 0)).toBe(true)
    expect(calculateTotal(steps)).toBe(10)
    vi.restoreAllMocks()
  })

  it('generates mixed operators without negative running totals', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const steps = generateChallenge(config, 'mixed')
    let total = 0

    for (const step of steps) {
      total = step.operator === 'start'
        ? step.value
        : total + (step.operator === 'add' ? step.value : -step.value)
      expect(total).toBeGreaterThanOrEqual(0)
    }

    expect(steps.map((step) => step.operator)).toEqual(['start', 'subtract', 'add', 'subtract'])
    expect(calculateTotal(steps)).toBe(0)
    vi.restoreAllMocks()
  })

  it('formats an operator-aware calculation', () => {
    expect(formatCalculation([50, 12, 8], ['start', 'subtract', 'add'])).toBe('50 − 12 + 8')
    expect(formatCalculation([10, 20])).toBe('10 + 20')
  })
})

describe('session statistics', () => {
  const result = (correct: boolean, answerTimeMs: number): AttemptResult => ({
    id: String(answerTimeMs),
    timestamp: '2026-09-10T00:00:00.000Z',
    level: 'Test',
    operation: 'addition',
    operands: [10, 20],
    correctAnswer: 30,
    userAnswer: correct ? 30 : 31,
    correct,
    intervalMs: 100,
    answerTimeMs,
  })

  it('calculates accuracy and timing statistics', () => {
    expect(calculateSessionSummary([result(true, 1000), result(false, 3000)])).toEqual({
      totalAttempts: 2,
      correctAttempts: 1,
      incorrectAttempts: 1,
      accuracy: 50,
      averageAnswerTimeMs: 2000,
      bestAnswerTimeMs: 1000,
    })
  })
})
