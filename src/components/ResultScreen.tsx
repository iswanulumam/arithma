import type { AttemptResult, LevelConfig } from '../types/mentalCalculation'
import { getOperationConfig } from '../config/operations'
import { formatCalculation, formatDuration, formatInterval } from '../utils/calculation'

interface ResultScreenProps {
  result: AttemptResult
  level: LevelConfig
  onNextRound: () => void
  onExit: () => void
}

export function ResultScreen({ result, level, onNextRound, onExit }: ResultScreenProps) {
  const difference = result.userAnswer - result.correctAnswer
  const operation = result.operation === 'subtraction' || result.operation === 'mixed'
    ? result.operation
    : 'addition'
  const operationConfig = getOperationConfig(operation)

  return (
    <section className="screen result-screen" aria-labelledby="result-heading">
      <div className={`result-banner ${result.correct ? 'correct' : 'incorrect'}`}>
        <p className="eyebrow">Round complete</p>
        <h1 id="result-heading">{result.correct ? 'Correct' : 'Incorrect'}</h1>
        <div className="answer-comparison">
          <p>Your answer <strong>{result.userAnswer}</strong></p>
          <p>Correct answer <strong>{result.correctAnswer}</strong></p>
          {!result.correct && <p>Difference <strong>{difference > 0 ? '+' : ''}{difference}</strong></p>}
        </div>
      </div>

      <div className="calculation-reveal" aria-label="Complete calculation">
        {formatCalculation(result.operands, result.operators)} = <strong>{result.correctAnswer}</strong>
      </div>

      <dl className="result-details">
        <div><dt>Operation</dt><dd>{operationConfig.label}</dd></div>
        <div><dt>Level</dt><dd>{level.label}</dd></div>
        <div><dt>Numbers</dt><dd>{level.numberOfOperands}</dd></div>
        <div><dt>Range</dt><dd>{level.minOperand}–{level.maxOperand}</dd></div>
        <div><dt>Interval</dt><dd>{formatInterval(level.intervalMs)}</dd></div>
        <div><dt>Result</dt><dd>{result.correct ? 'Correct' : 'Incorrect'}</dd></div>
        <div><dt>Answer time</dt><dd>{formatDuration(result.answerTimeMs)}</dd></div>
      </dl>

      <div className="button-row">
        <button className="button button-primary" type="button" onClick={onNextRound} autoFocus>
          Next challenge
        </button>
        <button className="button button-secondary" type="button" onClick={onExit}>
          Break / Exit
        </button>
      </div>
    </section>
  )
}
