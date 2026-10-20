import { memo, useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { getWorldTime } from '../lib/worldTime'
import './WorldClocks.css'

const cities = [
  { name: 'ТАШКЕНТ', timeZone: 'Asia/Tashkent', code: 'TAS', index: '01' },
  { name: 'ЛОНДОН', timeZone: 'Europe/London', code: 'LON', index: '02' },
] as const

type ClockAngles = ReturnType<typeof getWorldTime>['angles']
type HandStyle = CSSProperties & { '--start-angle': string; '--current-angle': string }

function ClockFace({ angles }: { angles: ClockAngles }) {
  const [initialAngles] = useState(angles)

  return (
    <div className="world-clock__stage">
      <svg className="world-clock__face" viewBox="0 0 320 320" aria-hidden="true">
        <path className="world-clock__frame"
          d="M7 43V7h36 M277 7h18l18 18v18 M313 277v36h-36 M43 313H25L7 295v-18" />
        <path className="world-clock__frame-accent" d="M7 31V7h24 M289 313h24v-24" />
        <circle className="world-clock__dial-field" cx="160" cy="160" r="126" />
        <circle className="world-clock__sector-ring" cx="160" cy="160" r="145"
          pathLength="360" strokeDasharray="52 8 22 8" transform="rotate(-116 160 160)" />
        <circle className="world-clock__signal-arc" cx="160" cy="160" r="145"
          pathLength="360" strokeDasharray="28 332" transform="rotate(-116 160 160)" />
        <circle className="world-clock__track" cx="160" cy="160" r="134"
          pathLength="360" strokeDasharray="72 18" transform="rotate(-36 160 160)" />

        {Array.from({ length: 60 }, (_, index) => (
          <g key={index} transform={`rotate(${index * 6} 160 160)`}>
            <line
              className={index % 5 === 0 ? 'world-clock__tick world-clock__tick--major' : 'world-clock__tick'}
              x1="160" y1="36" x2="160" y2={index % 5 === 0 ? '47' : '41'}
            />
            {index % 15 === 0 && <path className="world-clock__cardinal" d="M157 19h6l-3 5Z" />}
          </g>
        ))}
        <g className="world-clock__numerals">
          <text x="160" y="67">12</text>
          <text x="253" y="160">03</text>
          <text x="160" y="253">06</text>
          <text x="67" y="160">09</text>
        </g>
        <path className="world-clock__guides" d="M160 82v21 M160 217v21 M82 160h21 M217 160h21" />
        <circle className="world-clock__reticle" cx="160" cy="160" r="27"
          pathLength="100" strokeDasharray="15 10" transform="rotate(-27 160 160)" />
        <path className="world-clock__side-scale"
          d="M9 142h5 M9 151h8 M9 160h11 M9 169h8 M9 178h5 M306 142h5 M303 151h8 M300 160h11 M303 169h8 M306 178h5" />

        {(['hour', 'minute', 'second'] as const).map((hand) => (
          <g
            key={hand}
            className={`world-clock__hand world-clock__hand--${hand}`}
            style={{
              '--start-angle': `${initialAngles[hand]}deg`,
              '--current-angle': `${angles[hand]}deg`,
            } as HandStyle}
          >
            {hand === 'hour' && <path d="M157 170V105l6-6v71Z" />}
            {hand === 'minute' && <path d="M158.5 175V63l3-5v117Z" />}
            {hand === 'second' && <>
              <line className="world-clock__second-shaft" x1="160" y1="188" x2="160" y2="36" />
              <path className="world-clock__second-tip" d="m160 32 3 7h-6Z" />
              <path className="world-clock__counterweight" d="M157.5 177h5v9h-5Z" />
            </>}
          </g>
        ))}
        <path className="world-clock__hub" d="m160 152 8 8-8 8-8-8Z" />
        <path className="world-clock__pin" d="M158 158h4v4h-4Z" />
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
          <p className="world-clocks__eyebrow">ВРЕМЕННОЙ ПРОТОКОЛ / 02 УЗЛА</p>
          <h2 id="world-clocks-title">МИРОВОЕ <span>ВРЕМЯ</span></h2>
        </div>
        <span className="world-clocks__status"><i aria-hidden="true" />В РЕАЛЬНОМ ВРЕМЕНИ</span>
      </header>
      <div className="world-clocks__grid">
        {cities.map((city) => {
          const time = getWorldTime(city.timeZone, clock.now)
          return (
            <article className="world-clock" key={city.timeZone} aria-labelledby={`clock-${city.code}`}>
              <div className="world-clock__meta" aria-hidden="true">
                <span className="world-clock__node"><b>{city.index}</b><span>/ {city.code}</span></span>
                <span className="world-clock__module"><i />TIME MODULE</span>
              </div>
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
                  <div className="world-clock__time-scale" aria-hidden="true">
                    <span>ЧАСЫ</span><span>МИНУТЫ</span><span>СЕКУНДЫ</span>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
})
