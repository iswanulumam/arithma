import type { SessionSummary } from '../types/mentalCalculation'
import { formatDuration } from '../utils/calculation'

interface SessionStatsProps {
  summary: SessionSummary
}

export function SessionStats({ summary }: SessionStatsProps) {
  const passed = summary.totalAttempts > 0 && summary.accuracy >= 90

  return (
    <aside className="stats" aria-labelledby="stats-heading">
      <div className="stats-heading-row">
        <div>
          <p className="eyebrow">Current session</p>
          <h2 id="stats-heading">Performance</h2>
        </div>
        <span className={`status-badge ${passed ? 'passed' : ''}`}>
          {passed ? 'Passed' : 'Not passed'}
        </span>
      </div>
      <p className="target-note">Target accuracy: ≥90%</p>
      <dl className="stats-grid">
        <div><dt>Attempts</dt><dd>{summary.totalAttempts}</dd></div>
        <div><dt>Correct</dt><dd>{summary.correctAttempts}</dd></div>
        <div><dt>Incorrect</dt><dd>{summary.incorrectAttempts}</dd></div>
        <div><dt>Accuracy</dt><dd>{summary.accuracy.toFixed(0)}%</dd></div>
        <div><dt>Average time</dt><dd>{formatDuration(summary.averageAnswerTimeMs)}</dd></div>
        <div><dt>Best time</dt><dd>{formatDuration(summary.bestAnswerTimeMs)}</dd></div>
      </dl>
    </aside>
  )
}
