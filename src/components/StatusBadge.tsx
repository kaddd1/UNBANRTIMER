interface StatusBadgeProps {
  isComplete: boolean
}

export function StatusBadge({ isComplete }: StatusBadgeProps) {
  return (
    <span className="status-badge">
      <span className="status-dot" aria-hidden="true" />
      {isComplete ? 'ОСВОБОЖДЁН' : 'ОТБЫВАЕТ НАКАЗАНИЕ'}
    </span>
  )
}
