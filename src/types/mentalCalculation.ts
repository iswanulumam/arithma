export type GameState =
  | 'SELECT_LEVEL'
  | 'READY'
  | 'COUNTDOWN'
  | 'RUNNING'
  | 'ANSWER'
  | 'RESULT'

export type OperationType =
  | 'addition'
  | 'subtraction'
  | 'mixed'
  | 'multiplication'
  | 'division'

export type SupportedOperation = Extract<OperationType, 'addition' | 'subtraction' | 'mixed'>

export type CalculationOperator = 'start' | 'add' | 'subtract'

export interface CalculationStep {
  operator: CalculationOperator
  value: number
}

export interface LevelConfig {
  id: string
  label: string
  numberOfOperands: number
  minOperand: number
  maxOperand: number
  intervalMs: number
}

export interface AttemptResult {
  id: string
  timestamp: string
  level: string
  operation: OperationType
  operands: number[]
  operators?: CalculationOperator[]
  correctAnswer: number
  userAnswer: number
  correct: boolean
  intervalMs: number
  answerTimeMs: number
}

export interface SessionSummary {
  totalAttempts: number
  correctAttempts: number
  incorrectAttempts: number
  accuracy: number
  averageAnswerTimeMs: number
  bestAnswerTimeMs: number
}
