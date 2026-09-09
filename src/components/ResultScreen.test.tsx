import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { AttemptResult, LevelConfig } from '../types/mentalCalculation'
import { ResultScreen } from './ResultScreen'

const level: LevelConfig = {
  id: 'test',
  label: 'Test level',
  numberOfOperands: 2,
  minOperand: 10,
  maxOperand: 20,
  intervalMs: 1000,
}

const incorrectResult: AttemptResult = {
  id: 'test-result',
  timestamp: '2026-09-10T00:00:00.000Z',
  level: 'Test level',
  operation: 'subtraction',
  operands: [50, 20],
  operators: ['start', 'subtract'],
  correctAnswer: 30,
  userAnswer: 27,
  correct: false,
  intervalMs: 1000,
  answerTimeMs: 1250,
}

describe('result feedback', () => {
  it('shows incorrect feedback and offers next or exit actions', () => {
    const onNextRound = vi.fn()
    const onExit = vi.fn()
    render(
      <ResultScreen
        result={incorrectResult}
        level={level}
        onNextRound={onNextRound}
        onExit={onExit}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Incorrect' })).toBeInTheDocument()
    expect(screen.getByText('-3')).toBeInTheDocument()
    expect(screen.getByText('50 − 20 =', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Subtraction')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Next challenge' }))
    fireEvent.click(screen.getByRole('button', { name: 'Break / Exit' }))
    expect(onNextRound).toHaveBeenCalledOnce()
    expect(onExit).toHaveBeenCalledOnce()
  })
})
