import type { Countdown } from '../lib/countdown'
import { TimeUnit } from './TimeUnit'

interface CountdownDisplayProps {
  countdown: Countdown
}

export function CountdownDisplay({ countdown }: CountdownDisplayProps) {
  return (
    <div className="countdown-display">
      <p className="sr-only" role="status">
        {countdown.isComplete ? 'Расчётная дата наступила. Таймер не проверяет фактический статус блокировки.' : 'Обратный отсчёт до расчётной даты освобождения в VALORANT.'}
      </p>
      {countdown.isComplete ? (
        <div className="freedom-panel">
          <span className="eyebrow">РАСЧЁТНАЯ ДАТА НАСТУПИЛА</span>
          <h2>СВОБОДА</h2>
          <p>Таймер завершён. Фактический статус бана проверяй в игре.</p>
        </div>
      ) : (
        <dl className="timer-grid" role="timer" aria-live="off" aria-label="Оставшееся время">
          <TimeUnit value={countdown.days} label="ДНИ" index="01" />
          <TimeUnit value={countdown.hours} label="ЧАСЫ" index="02" />
          <TimeUnit value={countdown.minutes} label="МИНУТЫ" index="03" />
          <TimeUnit value={countdown.seconds} label="СЕКУНДЫ" index="04" accent />
        </dl>
      )}
    </div>
  )
}
