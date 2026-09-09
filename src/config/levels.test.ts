import { describe, expect, it } from 'vitest'
import { LEVELS } from './levels'

describe('preset levels', () => {
  it('defines every preset with the required settings', () => {
    expect(LEVELS).toEqual([
      { id: 'baseline', label: 'Baseline', numberOfOperands: 8, minOperand: 10, maxOperand: 99, intervalMs: 2000 },
      { id: 'aboveAverage', label: 'Above Average', numberOfOperands: 10, minOperand: 10, maxOperand: 99, intervalMs: 1500 },
      { id: 'strong', label: 'Strong', numberOfOperands: 12, minOperand: 10, maxOperand: 99, intervalMs: 1000 },
      { id: 'advanced', label: 'Advanced', numberOfOperands: 15, minOperand: 10, maxOperand: 99, intervalMs: 800 },
      { id: 'exceptional', label: 'Exceptional', numberOfOperands: 10, minOperand: 10, maxOperand: 999, intervalMs: 1000 },
    ])
  })
})
