interface CountdownProps {
  value: string
}

export function Countdown({ value }: CountdownProps) {
  return (
    <section className="focus-screen countdown-screen" aria-label="Exercise countdown">
      <div className="countdown-content">
        <p className="countdown-label">Get ready</p>
        <p className={`focus-value ${value === 'GO' ? 'countdown-go' : ''}`} aria-live="assertive">{value}</p>
      </div>
    </section>
  )
}
