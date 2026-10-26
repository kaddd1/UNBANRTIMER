export interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
  isComplete: boolean
}

export function getCountdown(targetTime: number, now = Date.now()): Countdown {
  if (!Number.isFinite(targetTime) || !Number.isFinite(now)) {
    throw new Error('Countdown requires valid timestamps')
  }

  const remaining = Math.max(0, targetTime - now)
  const totalSeconds = Math.ceil(remaining / 1000)

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isComplete: remaining === 0,
  }
}

export function getNextTickDelay(targetTime: number, now = Date.now()): number {
  const remaining = targetTime - now
  if (remaining <= 0) return 0
  return remaining % 1000 || 1000
}
