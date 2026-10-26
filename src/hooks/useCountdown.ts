import { useEffect, useState } from 'react'
import { getCountdown, getNextTickDelay } from '../lib/countdown'

export function useCountdown(targetTime: number) {
  const [countdown, setCountdown] = useState(() => getCountdown(targetTime))

  useEffect(() => {
    let timeoutId: number | undefined

    // Wake exactly when the displayed second changes, so the countdown stays
    // in phase with the wall clock instead of lagging by the page-load offset.
    function update() {
      const next = getCountdown(targetTime)
      setCountdown(next)
      if (!next.isComplete) timeoutId = window.setTimeout(update, getNextTickDelay(targetTime))
    }

    function sync() {
      window.clearTimeout(timeoutId)
      if (document.visibilityState === 'hidden') return
      update()
    }

    sync()
    document.addEventListener('visibilitychange', sync)
    window.addEventListener('pageshow', sync)
    return () => {
      window.clearTimeout(timeoutId)
      document.removeEventListener('visibilitychange', sync)
      window.removeEventListener('pageshow', sync)
    }
  }, [targetTime])

  return countdown
}
