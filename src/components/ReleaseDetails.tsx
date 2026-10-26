import { memo, useEffect, useEffectEvent, useRef, useState } from 'react'
import './ReleaseDetails.css'

interface ReleaseDetailsProps {
  endsAt: string
  timeZone: string
}

type CardState = 'front' | 'offer' | 'processing' | 'denied' | 'closing' | 'returning'

export const ReleaseDetails = memo(function ReleaseDetails({ endsAt, timeZone }: ReleaseDetailsProps) {
  const [state, setState] = useState<CardState>('front')
  const stateRef = useRef<CardState>('front')
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const cardRef = useRef<HTMLDivElement>(null)
  const frontButton = useRef<HTMLButtonElement>(null)
  const submitButton = useRef<HTMLButtonElement>(null)
  const backFace = useRef<HTMLDivElement>(null)
  const flipped = state === 'offer' || state === 'processing' || state === 'denied'

  const focusTarget = useRef<'submit' | 'front' | null>(null)

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // The face being focused stays inert until the new state is committed,
  // so focus has to move after render rather than from a timer.
  useEffect(() => {
    if (focusTarget.current === 'submit' && state === 'offer') {
      submitButton.current?.focus({ preventScroll: true })
    } else if (focusTarget.current === 'front' && (state === 'closing' || state === 'returning')) {
      frontButton.current?.focus({ preventScroll: true })
    } else {
      return
    }
    focusTarget.current = null
  }, [state])

  const closeOnOutsidePointer = useEffectEvent((event: PointerEvent) => {
    if (!cardRef.current?.contains(event.target as Node)) returnToDate()
  })

  // Touch has no pointerleave, and iOS does not blur on taps outside the card.
  useEffect(() => {
    if (state !== 'offer') return
    document.addEventListener('pointerdown', closeOnOutsidePointer)
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer)
  }, [state])

  function changeState(next: CardState) {
    stateRef.current = next
    setState(next)
  }

  function openPetition(moveFocus = false) {
    if (stateRef.current !== 'front' && stateRef.current !== 'closing') return
    timers.current.forEach(clearTimeout)
    timers.current = []
    // The front face is about to become inert; blur it now so that the resulting
    // focus loss is not mistaken for the user leaving the card.
    if (cardRef.current?.contains(document.activeElement)) (document.activeElement as HTMLElement).blur()
    focusTarget.current = moveFocus ? 'submit' : null
    changeState('offer')
  }

  function returnToDate() {
    focusTarget.current = cardRef.current?.contains(document.activeElement) ? 'front' : null
    changeState(stateRef.current === 'offer' ? 'closing' : 'returning')
    timers.current.push(setTimeout(() => changeState('front'), 1100))
  }

  function submitPetition() {
    if (stateRef.current !== 'offer') return
    timers.current.forEach(clearTimeout)
    timers.current = []
    if (cardRef.current?.contains(document.activeElement)) backFace.current?.focus({ preventScroll: true })
    changeState('processing')
    timers.current.push(setTimeout(() => changeState('denied'), 850))
    timers.current.push(setTimeout(returnToDate, 3350))
  }

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
    <div
      ref={cardRef}
      className="release-details"
      data-state={state}
      data-flipped={flipped}
      role="group"
      aria-label="Дата освобождения и прошение на УДО"
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') openPetition()
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse' && stateRef.current === 'offer'
          && !event.currentTarget.contains(document.activeElement)) returnToDate()
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget) && stateRef.current === 'offer') returnToDate()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && stateRef.current === 'offer') {
          event.preventDefault()
          returnToDate()
        }
      }}
    >
      <div className="release-details__rotator">
        <span className="release-details__edge release-details__edge--left" aria-hidden="true" />
        <span className="release-details__edge release-details__edge--right" aria-hidden="true" />
        <span className="release-details__edge release-details__edge--top" aria-hidden="true" />
        <span className="release-details__edge release-details__edge--bottom" aria-hidden="true" />
        <div className="release-details__face release-details__front" inert={flipped} aria-hidden={flipped}>
          <button
            ref={frontButton}
            type="button"
            className="release-details__open"
            aria-label={`Дата освобождения: ${dateLabel}, ${timeLabel}, ${offset}. Открыть прошение на УДО`}
            onClick={() => openPetition(true)}
          />
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
        <div
          ref={backFace}
          className="release-details__face release-details__back"
          inert={!flipped}
          aria-hidden={!flipped}
          tabIndex={-1}
          aria-label="Рассмотрение прошения на УДО"
        >
          {state === 'offer' || state === 'front' || state === 'closing' ? (
            <div key="offer" className="release-details__screen release-details__offer">
              <span className="release-details__case">ХОДАТАЙСТВО № 001</span>
              <h2>ПРОСИТЬСЯ НА ВОЛЮ?</h2>
              <p>Подать прошение об условно-досрочном освобождении</p>
              <button ref={submitButton} type="button" className="release-details__submit" onClick={submitPetition}>
                ПОДАТЬ ПРОШЕНИЕ <span aria-hidden="true">→</span>
              </button>
            </div>
          ) : state === 'processing' ? (
            <div key="processing" className="release-details__screen release-details__processing">
              <span className="release-details__case">ХОДАТАЙСТВО № 001 · НА РАССМОТРЕНИИ</span>
              <h2>ПРОШЕНИЕ РАССМАТРИВАЕТСЯ...</h2>
              <span className="release-details__progress" aria-hidden="true"><i /></span>
            </div>
          ) : (
            <div key="denial" className="release-details__screen release-details__denial">
              <span className="release-details__case">ХОДАТАЙСТВО № 001 · РЕШЕНИЕ ВЫНЕСЕНО</span>
              <h2>В УДО ОТКАЗАНО</h2>
              <p>Отбывайте срок полностью.</p>
            </div>
          )}
        </div>
      </div>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {state === 'processing' ? 'Прошение рассматривается.' : state === 'denied' ? 'В УДО отказано. Отбывайте срок полностью.' : ''}
      </span>
    </div>
  )
})
