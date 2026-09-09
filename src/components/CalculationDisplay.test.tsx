import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CalculationDisplay } from './CalculationDisplay'

describe('calculation display', () => {
  it('shows the operator with the current value', () => {
    render(<CalculationDisplay step={{ operator: 'subtract', value: 18 }} />)

    expect(screen.getByLabelText('subtract 18')).toHaveTextContent('−18')
    expect(screen.queryByText('Get ready')).not.toBeInTheDocument()
  })
})
