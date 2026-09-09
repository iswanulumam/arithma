import type { AttemptResult } from '../types/mentalCalculation'

export const HISTORY_STORAGE_KEY = 'mental-calculation-history'

export function loadHistory(): AttemptResult[] {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY)
    if (!stored) return []

    const parsed: unknown = JSON.parse(stored)
    return Array.isArray(parsed) ? (parsed as AttemptResult[]) : []
  } catch {
    return []
  }
}

export function saveResult(result: AttemptResult): void {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify([...loadHistory(), result]))
  } catch {
    // An attempt remains part of the active session if storage is unavailable.
  }
}
