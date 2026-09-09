import { AnswerInput } from './components/AnswerInput'
import { CalculationDisplay } from './components/CalculationDisplay'
import { Countdown } from './components/Countdown'
import { LevelSelector } from './components/LevelSelector'
import { ReadyScreen } from './components/ReadyScreen'
import { ResultScreen } from './components/ResultScreen'
import { SessionStats } from './components/SessionStats'
import { useMentalCalculation } from './hooks/useMentalCalculation'

function App() {
  const game = useMentalCalculation()
  const { gameState } = game
  const showStats = gameState === 'SELECT_LEVEL' || gameState === 'READY' || gameState === 'RESULT'

  return (
    <main className={`app app-${game.gameState.toLowerCase()}`}>
      {game.gameState === 'SELECT_LEVEL' && <LevelSelector onSelect={game.selectLevel} />}
      {game.gameState === 'READY' && game.level && (
        <ReadyScreen
          level={game.level}
          operation={game.operation}
          onStart={game.startRound}
          onChangeLevel={game.changeLevel}
        />
      )}
      {game.gameState === 'COUNTDOWN' && <Countdown value={game.countdown} />}
      {game.gameState === 'RUNNING' && <CalculationDisplay step={game.currentStep} />}
      {game.gameState === 'ANSWER' && <AnswerInput onSubmit={game.submitAnswer} />}
      {game.gameState === 'RESULT' && game.result && game.level && (
        <ResultScreen
          result={game.result}
          level={game.level}
          onNextRound={game.startRound}
          onExit={game.changeLevel}
        />
      )}
      {showStats && <SessionStats summary={game.sessionSummary} />}
    </main>
  )
}

export default App
