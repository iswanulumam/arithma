import { useState, type FormEvent, type KeyboardEvent } from 'react'

interface AnswerInputProps {
  onSubmit: (answer: string) => boolean
}

export function AnswerInput({ onSubmit }: AnswerInputProps) {
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')

  function submitAnswer() {
    if (!onSubmit(answer)) setError('Enter a whole-number answer.')
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    submitAnswer()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') return
    event.preventDefault()
    submitAnswer()
  }

  return (
    <section className="screen centered-screen answer-screen" aria-labelledby="answer-heading">
      <p className="eyebrow">Sequence complete</p>
      <h1 id="answer-heading">What is the total?</h1>
      <form className="answer-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="total-answer">Your total</label>
        <input
          id="total-answer"
          className="answer-input"
          type="text"
          inputMode="numeric"
          pattern="-?[0-9]*"
          autoComplete="off"
          value={answer}
          onChange={(event) => {
            setAnswer(event.target.value)
            setError('')
          }}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <button className="button button-primary" type="submit">Submit</button>
        {error && <p className="form-error" role="alert">{error}</p>}
      </form>
    </section>
  )
}
