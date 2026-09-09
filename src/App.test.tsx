import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { HISTORY_STORAGE_KEY } from './utils/storage'

describe('trainer flow', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.999999)
      .mockReturnValue(0.5)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('shows one number at a time, submits with Enter, and starts a fresh round', async () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Arithma' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Addition/ })).toHaveAttribute('aria-pressed', 'true')

    fireEvent.change(screen.getByLabelText('Numbers'), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText('Minimum'), { target: { value: '10' } })
    fireEvent.change(screen.getByLabelText('Maximum'), { target: { value: '11' } })
    fireEvent.change(screen.getByLabelText('Interval (ms)'), { target: { value: '100' } })
    fireEvent.click(screen.getByRole('button', { name: 'Use custom' }))

    expect(screen.getByRole('heading', { name: 'Custom' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start' })).toHaveFocus()
    fireEvent.click(screen.getByRole('button', { name: 'Start' }))
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Get ready')).toBeInTheDocument()

    await act(() => vi.advanceTimersByTimeAsync(4000))
    expect(screen.getByText('10')).toBeInTheDocument()

    await act(() => vi.advanceTimersByTimeAsync(100))
    expect(screen.queryByText('10')).not.toBeInTheDocument()
    expect(screen.getByText('11')).toBeInTheDocument()

    await act(() => vi.advanceTimersByTimeAsync(100))
    const answerInput = screen.getByLabelText('Your total')
    expect(answerInput).toHaveFocus()
    expect(screen.queryByText('11')).not.toBeInTheDocument()

    fireEvent.change(answerInput, { target: { value: '21' } })
    fireEvent.keyDown(answerInput, { key: 'Enter' })

    expect(screen.getByRole('heading', { name: 'Correct' })).toBeInTheDocument()
    expect(screen.getByText('10 + 11 =', { exact: false })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) ?? '[]')).toHaveLength(1)
    expect(screen.getByText('100%', { exact: true })).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Next challenge' })).toHaveFocus()
    const randomCalls = vi.mocked(Math.random).mock.calls.length
    expect(Math.random).toHaveBeenCalledTimes(randomCalls)
    fireEvent.click(screen.getByRole('button', { name: 'Next challenge' }))
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(Math.random).toHaveBeenCalledTimes(randomCalls + 2)
  })

  it('carries the selected arithmetic type into the ready screen', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Subtraction/ }))
    fireEvent.click(screen.getByRole('button', { name: /Baseline/ }))

    expect(screen.getByRole('heading', { name: 'Baseline' })).toBeInTheDocument()
    expect(screen.getAllByText('Subtraction')).toHaveLength(2)
    expect(screen.getByText(/subtract each new value/i)).toBeInTheDocument()
  })
})
