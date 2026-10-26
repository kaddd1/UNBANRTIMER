import type { Countdown } from '../lib/countdown'
import { pluralizeRussian } from '../lib/pluralizeRussian'
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
        <div role="timer" aria-live="off" aria-label="Оставшееся время">
          <dl className="timer-grid">
            <TimeUnit value={countdown.days} label={pluralizeRussian(countdown.days, ['ДЕНЬ', 'ДНЯ', 'ДНЕЙ'])} index="01" />
            <TimeUnit value={countdown.hours} label={pluralizeRussian(countdown.hours, ['ЧАС', 'ЧАСА', 'ЧАСОВ'])} index="02" />
            <TimeUnit value={countdown.minutes} label={pluralizeRussian(countdown.minutes, ['МИНУТА', 'МИНУТЫ', 'МИНУТ'])} index="03" />
            <TimeUnit value={countdown.seconds} label={pluralizeRussian(countdown.seconds, ['СЕКУНДА', 'СЕКУНДЫ', 'СЕКУНД'])} index="04" accent />
          </dl>
        </div>
      )}
    </div>
  )
}
