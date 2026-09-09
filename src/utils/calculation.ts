import type {
  AttemptResult,
  CalculationOperator,
  CalculationStep,
  LevelConfig,
  SessionSummary,
  SupportedOperation,
} from '../types/mentalCalculation'
import { generateRandomInteger } from './random'

export function generateOperands(config: LevelConfig): number[] {
  return Array.from({ length: config.numberOfOperands }, () =>
    generateRandomInteger(config.minOperand, config.maxOperand),
  )
}

export function generateChallenge(
  config: LevelConfig,
  operation: SupportedOperation,
): CalculationStep[] {
  if (operation === 'subtraction') {
    const subtrahends = Array.from({ length: Math.max(0, config.numberOfOperands - 1) }, () =>
      generateRandomInteger(config.minOperand, config.maxOperand),
    )
    const finalValue = generateRandomInteger(config.minOperand, config.maxOperand)
    const startingValue = subtrahends.reduce((sum, value) => sum + value, finalValue)

    return [
      { operator: 'start', value: startingValue },
      ...subtrahends.map((value): CalculationStep => ({ operator: 'subtract', value })),
    ]
  }

  const values = generateOperands(config)
  if (operation === 'addition') {
    return values.map((value, index) => ({ operator: index === 0 ? 'start' : 'add', value }))
  }

  let runningTotal = values[0] ?? 0
  return values.map((value, index): CalculationStep => {
    if (index === 0) return { operator: 'start', value }

    const operator: CalculationOperator = Math.random() < 0.5 && runningTotal >= value
      ? 'subtract'
      : 'add'
    runningTotal += operator === 'subtract' ? -value : value
    return { operator, value }
  })
}

export function calculateTotal(steps: CalculationStep[]): number {
  return steps.reduce((total, step) => {
    if (step.operator === 'start') return step.value
    return total + (step.operator === 'add' ? step.value : -step.value)
  }, 0)
}

export function calculateAdditionTotal(operands: number[]): number {
  return calculateTotal(
    operands.map((value, index) => ({ operator: index === 0 ? 'start' : 'add', value })),
  )
}

export function formatCalculation(
  operands: number[],
  operators?: CalculationOperator[],
): string {
  return operands.map((value, index) => {
    const operator = operators?.[index] ?? (index === 0 ? 'start' : 'add')
    if (operator === 'start') return String(value)
    return `${operator === 'add' ? '+' : '−'} ${value}`
  }).join(' ')
}

export function calculateSessionSummary(results: AttemptResult[]): SessionSummary {
  const totalAttempts = results.length
  const correctAttempts = results.filter((result) => result.correct).length
  const answerTimes = results.map((result) => result.answerTimeMs)

  return {
    totalAttempts,
    correctAttempts,
    incorrectAttempts: totalAttempts - correctAttempts,
    accuracy: totalAttempts === 0 ? 0 : (correctAttempts / totalAttempts) * 100,
    averageAnswerTimeMs:
      totalAttempts === 0
        ? 0
        : answerTimes.reduce((sum, time) => sum + time, 0) / totalAttempts,
    bestAnswerTimeMs: totalAttempts === 0 ? 0 : Math.min(...answerTimes),
  }
}

export function formatDuration(milliseconds: number): string {
  return `${(milliseconds / 1000).toFixed(2)} sec`
}

export function formatInterval(milliseconds: number): string {
  return `${milliseconds / 1000} sec`
}
