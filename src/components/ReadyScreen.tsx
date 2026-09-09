import { getOperationConfig } from '../config/operations'
import type { LevelConfig, SupportedOperation } from '../types/mentalCalculation'
import { formatInterval } from '../utils/calculation'

interface ReadyScreenProps {
  level: LevelConfig
  operation: SupportedOperation
  onStart: () => void
  onChangeLevel: () => void
}

export function ReadyScreen({ level, operation, onStart, onChangeLevel }: ReadyScreenProps) {
  const operationConfig = getOperationConfig(operation)

  return (
    <section className="screen centered-screen" aria-labelledby="ready-heading">
      <p className="eyebrow">{operationConfig.label}</p>
      <h1 id="ready-heading">{level.label}</h1>
      <dl className="details-list ready-details">
        <div><dt>Operation</dt><dd>{operationConfig.label}</dd></div>
        <div><dt>Numbers</dt><dd>{level.numberOfOperands}</dd></div>
        <div><dt>Range</dt><dd>{level.minOperand}–{level.maxOperand}</dd></div>
        <div><dt>Interval</dt><dd>{formatInterval(level.intervalMs)}</dd></div>
      </dl>
      <p className="instruction">{operationConfig.instruction} You will only see each value once.</p>
      <div className="button-row">
        <button className="button button-primary" type="button" onClick={onStart} autoFocus>
          Start
        </button>
        <button className="text-button" type="button" onClick={onChangeLevel}>
          Change level
        </button>
      </div>
    </section>
  )
}
