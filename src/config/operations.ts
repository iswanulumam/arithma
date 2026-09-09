import type { SupportedOperation } from '../types/mentalCalculation'

export interface OperationConfig {
  id: SupportedOperation
  label: string
  symbol: string
  instruction: string
}

export const OPERATIONS: readonly OperationConfig[] = [
  {
    id: 'addition',
    label: 'Addition',
    symbol: '+',
    instruction: 'Add each new value to your running total.',
  },
  {
    id: 'subtraction',
    label: 'Subtraction',
    symbol: '−',
    instruction: 'Start with the first value, then subtract each new value.',
  },
  {
    id: 'mixed',
    label: 'Mixed + / −',
    symbol: '±',
    instruction: 'Follow the operator shown before each new value.',
  },
]

export function getOperationConfig(operation: SupportedOperation): OperationConfig {
  return OPERATIONS.find((item) => item.id === operation) ?? OPERATIONS[0]
}
