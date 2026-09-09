import { useEffect, useRef, useState } from 'react'
import type {
  AttemptResult,
  CalculationStep,
  GameState,
  LevelConfig,
  SupportedOperation,
} from '../types/mentalCalculation'
import {
  calculateTotal,
  calculateSessionSummary,
  generateChallenge,
} from '../utils/calculation'
import { saveResult } from '../utils/storage'

function delay(milliseconds: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timeout = window.setTimeout(resolve, milliseconds)
    signal.addEventListener('abort', () => {
      window.clearTimeout(timeout)
      resolve()
    }, { once: true })
  })
}

export function useMentalCalculation() {
  const [gameState, setGameState] = useState<GameState>('SELECT_LEVEL')
  const [level, setLevel] = useState<LevelConfig | null>(null)
  const [operation, setOperation] = useState<SupportedOperation>('addition')
  const [steps, setSteps] = useState<CalculationStep[]>([])
  const [correctAnswer, setCorrectAnswer] = useState(0)
  const [countdown, setCountdown] = useState('3')
  const [currentStep, setCurrentStep] = useState<CalculationStep | null>(null)
  const [result, setResult] = useState<AttemptResult | null>(null)
  const [sessionResults, setSessionResults] = useState<AttemptResult[]>([])
  const answerShownAt = useRef(0)

  useEffect(() => {
    if (gameState !== 'COUNTDOWN') return

    const controller = new AbortController()

    async function runCountdown() {
      for (const step of ['3', '2', '1', 'GO']) {
        if (controller.signal.aborted) return
        setCountdown(step)
        await delay(1000, controller.signal)
      }

      if (!controller.signal.aborted) setGameState('RUNNING')
    }

    void runCountdown()
    return () => controller.abort()
  }, [gameState])

  useEffect(() => {
    if (gameState !== 'RUNNING' || !level) return

    const controller = new AbortController()

    async function showOperands() {
      for (const step of steps) {
        if (controller.signal.aborted) return
        setCurrentStep(step)
        await delay(level!.intervalMs, controller.signal)
      }

      if (!controller.signal.aborted) {
        setCurrentStep(null)
        answerShownAt.current = performance.now()
        setGameState('ANSWER')
      }
    }

    void showOperands()
    return () => controller.abort()
  }, [gameState, level, steps])

  function selectLevel(selectedLevel: LevelConfig, selectedOperation: SupportedOperation) {
    if (gameState !== 'SELECT_LEVEL') return
    setLevel({ ...selectedLevel })
    setOperation(selectedOperation)
    setGameState('READY')
  }

  function startRound() {
    if (!level || (gameState !== 'READY' && gameState !== 'RESULT')) return
    const nextSteps = generateChallenge(level, operation)
    setSteps(nextSteps)
    setCorrectAnswer(calculateTotal(nextSteps))
    setCurrentStep(null)
    setResult(null)
    setGameState('COUNTDOWN')
  }

  function submitAnswer(answerText: string): boolean {
    const normalized = answerText.trim()
    if (gameState !== 'ANSWER' || !level || !/^-?\d+$/.test(normalized)) return false

    const userAnswer = Number(normalized)
    if (!Number.isSafeInteger(userAnswer)) return false

    const attempt: AttemptResult = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      level: level.label,
      operation,
      operands: steps.map((step) => step.value),
      operators: steps.map((step) => step.operator),
      correctAnswer,
      userAnswer,
      correct: userAnswer === correctAnswer,
      intervalMs: level.intervalMs,
      answerTimeMs: Math.max(0, Math.round(performance.now() - answerShownAt.current)),
    }

    setResult(attempt)
    setSessionResults((current) => [...current, attempt])
    saveResult(attempt)
    setGameState('RESULT')
    return true
  }

  function changeLevel() {
    if (gameState !== 'RESULT' && gameState !== 'READY') return
    setLevel(null)
    setResult(null)
    setSteps([])
    setCurrentStep(null)
    setGameState('SELECT_LEVEL')
  }

  return {
    gameState,
    level,
    operation,
    countdown,
    currentStep,
    result,
    sessionSummary: calculateSessionSummary(sessionResults),
    selectLevel,
    startRound,
    submitAnswer,
    changeLevel,
  }
}
