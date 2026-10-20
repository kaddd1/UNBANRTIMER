import { memo, useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { getWorldTime } from '../lib/worldTime'
import './WorldClocks.css'

const cities = [
  { name: 'ТАШКЕНТ', timeZone: 'Asia/Tashkent', code: 'TAS' },
  { name: 'ЛОНДОН', timeZone: 'Europe/London', code: 'LON' },
] as const

type ClockAngles = ReturnType<typeof getWorldTime>['angles']
type HandStyle = CSSProperties & { '--start-angle': string; '--current-angle': string }

function ClockFace({ angles }: { angles: ClockAngles }) {
  const [initialAngles] = useState(angles)

  return (
    <div className="world-clock__stage">
      <svg className="world-clock__face" viewBox="0 0 320 320" aria-hidden="true">
        <circle className="world-clock__outline" cx="160" cy="160" r="145" />
        {Array.from({ length: 60 }, (_, index) => (
          <line
            key={index}
            className={[
              'world-clock__tick',
              index % 5 === 0 ? 'world-clock__tick--major' : '',
              index === 0 ? 'world-clock__tick--north' : '',
            ].filter(Boolean).join(' ')}
            x1="160" y1="29" x2="160" y2={index % 5 === 0 ? '41' : '33'}
            transform={`rotate(${index * 6} 160 160)`}
          />
        ))}
        <g className="world-clock__numerals">
          <text x="160" y="64">12</text>
          <text x="256" y="160">3</text>
          <text x="160" y="256">6</text>
          <text x="64" y="160">9</text>
        </g>
        {(['hour', 'minute', 'second'] as const).map((hand) => (
          <g
            key={hand}
            className={`world-clock__hand world-clock__hand--${hand}`}
            style={{
              '--start-angle': `${initialAngles[hand]}deg`,
              '--current-angle': `${angles[hand]}deg`,
            } as HandStyle}
          >
            {hand === 'hour' && <path d="M156 171V101l8-5v75Z" />}
            {hand === 'minute' && <path d="M158.25 175V62l3.5-4v117Z" />}
            {hand === 'second' && <line x1="160" y1="184" x2="160" y2="35" />}
          </g>
        ))}
        <circle className="world-clock__hub" cx="160" cy="160" r="5" />
        <circle className="world-clock__pin" cx="160" cy="160" r="1.8" />
      </svg>
    </div>
  )
}

export const WorldClocks = memo(function WorldClocks() {
  const [clock, setClock] = useState(() => ({ now: Date.now(), revision: 0 }))

  useEffect(() => {
    let timeoutId: number | undefined

    function tick() {
      setClock((current) => ({ ...current, now: Date.now() }))
      timeoutId = window.setTimeout(tick, 1000 - Date.now() % 1000)
    }

    function sync() {
      window.clearTimeout(timeoutId)
      if (document.visibilityState === 'hidden') return
      // Restart the sweep after sleep/focus or a system clock change.
      setClock((current) => ({ now: Date.now(), revision: current.revision + 1 }))
      timeoutId = window.setTimeout(tick, 1000 - Date.now() % 1000)
    }

    sync()
    document.addEventListener('visibilitychange', sync)
    window.addEventListener('pageshow', sync)
    window.addEventListener('focus', sync)
    return () => {
      window.clearTimeout(timeoutId)
      document.removeEventListener('visibilitychange', sync)
      window.removeEventListener('pageshow', sync)
      window.removeEventListener('focus', sync)
    }
  }, [])

  return (
    <section className="world-clocks" aria-labelledby="world-clocks-title">
      <header className="world-clocks__header">
        <div>
          <p className="world-clocks__eyebrow">ДВА ГОРОДА / ОДИН МОМЕНТ</p>
          <h2 id="world-clocks-title">МИРОВОЕ <span>ВРЕМЯ</span></h2>
        </div>
        <span className="world-clocks__status"><i aria-hidden="true" />В РЕАЛЬНОМ ВРЕМЕНИ</span>
      </header>
      <div className="world-clocks__grid">
        {cities.map((city) => {
          const time = getWorldTime(city.timeZone, clock.now)
          return (
            <article className="world-clock" key={city.timeZone} aria-labelledby={`clock-${city.code}`}>
              <ClockFace key={`${clock.revision}-${time.offset}`} angles={time.angles} />
              <div className="world-clock__readout">
                <div className="world-clock__location">
                  <h3 id={`clock-${city.code}`}>{city.name}</h3>
                  <p className="world-clock__offset">{time.offset}</p>
                </div>
                <div className="world-clock__time-panel">
                  <time className="world-clock__digital" dateTime={time.digital} aria-label={time.digital}>
                    <span>{time.digital.slice(0, 2)}</span>
                    <span className="world-clock__delimiter">:</span>
                    <span>{time.digital.slice(3, 5)}</span>
                    <span className="world-clock__delimiter">:</span>
                    <span className="world-clock__seconds">{time.digital.slice(6)}</span>
                  </time>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
})
