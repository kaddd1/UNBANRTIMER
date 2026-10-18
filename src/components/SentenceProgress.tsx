import { formatTermProgress, getTermProgress } from '../lib/progress'
import './SentenceProgress.css'

interface SentenceProgressProps {
  startsAt: string | null
  endsAt: string
}

/** Receives the existing countdown's once-per-second parent render. */
export function SentenceProgress({ startsAt, endsAt }: SentenceProgressProps) {
  const progress = getTermProgress(startsAt, endsAt)
  const heading = progress === 100 ? 'СРОК ОТМОТАН' : 'СРОК ОТБЫТ'
  const label = formatTermProgress(progress)

  return (
    <div className="sentence-progress">
      <div className="sentence-progress__heading">
        <span>{heading}</span>
        <span className="sentence-progress__percentage">{label}</span>
      </div>
      <div
        className="sentence-progress__track"
        role={progress === null ? undefined : 'progressbar'}
        aria-label={heading}
        aria-valuemin={progress === null ? undefined : 0}
        aria-valuemax={progress === null ? undefined : 100}
        aria-valuenow={progress ?? undefined}
        aria-valuetext={progress === null ? undefined : label}
      >
        {progress !== null && progress > 0 && (
          <div className="sentence-progress__extent" style={{ width: `${progress}%` }}>
            <div className="sentence-progress__fill">
              <span className="sentence-progress__shimmer" aria-hidden="true" />
            </div>
          </div>
        )}
      </div>
      {progress === null && (
        <p className="sentence-progress__note">Дата начала срока не указана</p>
      )}
    </div>
  )
}
