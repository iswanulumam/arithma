import type { CalculationStep } from '../types/mentalCalculation'

interface CalculationDisplayProps { step: CalculationStep | null }

export function CalculationDisplay({ step }: CalculationDisplayProps) {
  const symbol = step?.operator === 'add' ? '+' : step?.operator === 'subtract' ? '−' : ''
  const spokenOperator = step?.operator === 'add' ? 'add' : step?.operator === 'subtract' ? 'subtract' : 'start with'

  return (
    <section className="focus-screen challenge-screen" aria-label="Current calculation step">
      {step && (
        <p className="operand-value" aria-live="assertive" aria-label={`${spokenOperator} ${step.value}`}>
          {symbol && <span className="operand-operator">{symbol}</span>}
          <span>{step.value}</span>
        </p>
      )}
    </section>
  )
}
