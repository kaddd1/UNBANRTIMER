import { useEffect, useState } from 'react'
import { getCountdown } from '../lib/countdown'

export function useCountdown(targetTime: number) {
  const [countdown, setCountdown] = useState(() => getCountdown(targetTime))

  useEffect(() => {
    let intervalId: number | undefined

    function update() {
      const next = getCountdown(targetTime)
      setCountdown(next)
      if (next.isComplete) window.clearInterval(intervalId)
    }

    function sync() {
      window.clearInterval(intervalId)
      if (document.visibilityState === 'hidden') return
      intervalId = window.setInterval(update, 1000)
      update()
    }

    sync()
    document.addEventListener('visibilitychange', sync)
    window.addEventListener('pageshow', sync)
    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', sync)
      window.removeEventListener('pageshow', sync)
    }
  }, [targetTime])

  return countdown
}
