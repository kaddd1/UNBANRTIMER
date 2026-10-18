import { memo } from 'react'
import './ReleaseDetails.css'

interface ReleaseDetailsProps {
  endsAt: string
  timeZone: string
}

export const ReleaseDetails = memo(function ReleaseDetails({ endsAt, timeZone }: ReleaseDetailsProps) {
  const date = new Date(endsAt)
  const dateLabel = new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit', month: 'long', year: 'numeric', timeZone,
  }).formatToParts(date)
    .filter((part) => part.type === 'day' || part.type === 'month' || part.type === 'year')
    .map((part) => part.value)
    .join(' ')
    .toLocaleUpperCase('ru-RU')
  const timeLabel = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone,
  }).format(date)
  const offset = new Intl.DateTimeFormat('ru-RU', {
    timeZoneName: 'longOffset', timeZone,
  }).formatToParts(date).find((part) => part.type === 'timeZoneName')?.value.replace('GMT', 'UTC')

  return (
    <div className="release-details" role="group" aria-label="Дата освобождения">
      <div className="release-details__heading">
        <span className="release-details__signal" aria-hidden="true" />
        <p>ДАТА ОСВОБОЖДЕНИЯ</p>
      </div>
      <time className="release-details__date" dateTime={endsAt}>
        <span>{dateLabel}</span>
        <span className="release-details__clock">
          <span className="release-details__slash" aria-hidden="true">/</span>
          {timeLabel}
        </span>
      </time>
      <div className="release-details__timezone">
        <span>{timeZone === 'Asia/Tashkent' ? 'Ташкент' : timeZone}</span>
        <span className="release-details__offset">{offset}</span>
      </div>
    </div>
  )
})
