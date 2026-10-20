export function getTermProgress(
  startsAt: string | null,
  endsAt: string,
  now = Date.now(),
): number | null {
  const end = Date.parse(endsAt)
  const start = startsAt === null ? null : Date.parse(startsAt)

  if (!Number.isFinite(end) || !Number.isFinite(now)) return null
  if (start !== null && (!Number.isFinite(start) || start >= end)) return null
  if (now >= end) return 100
  if (start === null) return null

  return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100))
}

export function formatTermProgress(progress: number | null): string {
  if (progress === null) return '—'
  const displayedProgress = progress < 100 ? Math.min(progress, 99.99) : progress
  return `${displayedProgress.toFixed(2)}%`
}
