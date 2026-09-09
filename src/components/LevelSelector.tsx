import { useState, type FormEvent } from 'react'
import { DEFAULT_CUSTOM_LEVEL, LEVELS } from '../config/levels'
import { OPERATIONS } from '../config/operations'
import type { LevelConfig, SupportedOperation } from '../types/mentalCalculation'
import { formatInterval } from '../utils/calculation'

interface LevelSelectorProps {
  onSelect: (level: LevelConfig, operation: SupportedOperation) => void
}

export function LevelSelector({ onSelect }: LevelSelectorProps) {
  const [custom, setCustom] = useState(DEFAULT_CUSTOM_LEVEL)
  const [operation, setOperation] = useState<SupportedOperation>('addition')
  const [error, setError] = useState('')

  function updateCustom(field: keyof LevelConfig, value: string) {
    setCustom((current) => ({ ...current, [field]: Number(value) }))
  }

  function submitCustom(event: FormEvent) {
    event.preventDefault()
    const values = [
      custom.numberOfOperands,
      custom.minOperand,
      custom.maxOperand,
      custom.intervalMs,
    ]

    if (!values.every(Number.isSafeInteger)) {
      setError('All custom settings must be whole numbers.')
      return
    }
    if (custom.numberOfOperands < 1 || custom.numberOfOperands > 100) {
      setError('Choose between 1 and 100 operands.')
      return
    }
    if (custom.minOperand < 1 || custom.maxOperand > 999999) {
      setError('Operands must be between 1 and 999999.')
      return
    }
    if (custom.minOperand > custom.maxOperand) {
      setError('Minimum operand cannot exceed maximum operand.')
      return
    }
    if (custom.intervalMs < 100 || custom.intervalMs > 60000) {
      setError('Interval must be between 100 and 60000 milliseconds.')
      return
    }

    setError('')
    onSelect(custom, operation)
  }

  return (
    <section className="screen selection-screen" aria-labelledby="level-heading">
      <div className="intro">
        <p className="eyebrow">Mental Calculation Trainer</p>
        <h1 id="level-heading">Arithma</h1>
        <p className="lede">Choose a pace. Hold the running total in your head.</p>
      </div>

      <div className="operation-picker" aria-label="Arithmetic type">
        {OPERATIONS.map((item) => (
          <button
            className={`operation-option ${operation === item.id ? 'selected' : ''}`}
            type="button"
            key={item.id}
            aria-pressed={operation === item.id}
            onClick={() => setOperation(item.id)}
          >
            <span className="operation-symbol" aria-hidden="true">{item.symbol}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="level-grid">
        {LEVELS.map((level) => (
          <button
            className="level-card"
            key={level.id}
            type="button"
            onClick={() => onSelect(level, operation)}
          >
            <span className="level-name">{level.label}</span>
            <span>{level.numberOfOperands} numbers</span>
            <span>{level.minOperand}–{level.maxOperand}</span>
            <span>{formatInterval(level.intervalMs)} each</span>
          </button>
        ))}
      </div>

      <form className="custom-card" onSubmit={submitCustom}>
        <div className="custom-heading">
          <div>
            <p className="eyebrow">Set your own pace</p>
            <h2>Custom</h2>
          </div>
          <button className="button button-secondary custom-start" type="submit">
            Use custom
          </button>
        </div>
        <div className="custom-fields">
          <label>
            Numbers
            <input
              type="number"
              min="1"
              max="100"
              value={custom.numberOfOperands}
              onChange={(event) => updateCustom('numberOfOperands', event.target.value)}
            />
          </label>
          <label>
            Minimum
            <input
              type="number"
              min="1"
              max="999999"
              value={custom.minOperand}
              onChange={(event) => updateCustom('minOperand', event.target.value)}
            />
          </label>
          <label>
            Maximum
            <input
              type="number"
              min="1"
              max="999999"
              value={custom.maxOperand}
              onChange={(event) => updateCustom('maxOperand', event.target.value)}
            />
          </label>
          <label>
            Interval (ms)
            <input
              type="number"
              min="100"
              max="60000"
              step="100"
              value={custom.intervalMs}
              onChange={(event) => updateCustom('intervalMs', event.target.value)}
            />
          </label>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
      </form>
    </section>
  )
}
