import { describe, expect, it } from 'vitest'
import { OPERATIONS } from './operations'

describe('supported operations', () => {
  it('offers addition, subtraction, and mixed arithmetic', () => {
    expect(OPERATIONS.map((operation) => operation.id)).toEqual([
      'addition',
      'subtraction',
      'mixed',
    ])
  })
})
