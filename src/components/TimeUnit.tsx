interface TimeUnitProps {
  value: number
  label: string
  index: string
  accent?: boolean
}

export function TimeUnit({ value, label, index, accent = false }: TimeUnitProps) {
  return (
    <div className={`time-unit ${accent ? 'time-unit--accent' : ''}`}>
      <dt className="time-label">
        <span className="unit-index" aria-hidden="true">{index}</span>
        {label}
      </dt>
      <dd className="time-value">{String(value).padStart(2, '0')}</dd>
    </div>
  )
}
