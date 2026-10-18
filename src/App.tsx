import { SentenceProgress } from './components/SentenceProgress'
import { CountdownDisplay } from './components/CountdownDisplay'
import { ReleaseDetails } from './components/ReleaseDetails'
import { StatusBadge } from './components/StatusBadge'
import { countdownConfig } from './config/countdown'
import { useCountdown } from './hooks/useCountdown'
import './App.css'

const targetTime = Date.parse(countdownConfig.endsAt)

function App() {
  const countdown = useCountdown(targetTime)

  return (
    <div className="app-shell relative mx-auto flex min-h-svh w-full flex-col">
      <header className="site-header flex items-center justify-between gap-4">
        <a className="wordmark" href="#main" aria-label="ЗОНА / COUNTDOWN — главная">
          <span className="brand-mark" aria-hidden="true"><i /><i /></span>
          ЗОНА<span className="wordmark-divider">/</span><span className="wordmark-light">COUNTDOWN</span>
        </a>
        <span className="header-label">ЛИЧНОЕ ДЕЛО <span className="red-text">№ 001</span></span>
      </header>

      <main id="main" className="main-content flex flex-1 flex-col justify-center">
        <section aria-labelledby="countdown-title">
          <div className="section-meta flex flex-wrap items-center justify-between gap-4">
            <span className="eyebrow"><span className="red-text">//</span> VALORANT · СТРОГИЙ РЕЖИМ</span>
            <StatusBadge isComplete={countdown.isComplete} />
          </div>
          <div className={`intro ${countdown.isComplete ? 'intro--complete' : ''}`}>
            <h1 id="countdown-title">{countdown.isComplete ? 'СРОК ОТМОТАН.' : 'МОТАЮ'}{countdown.isComplete ? <br /> : ' '}
              <span className={countdown.isComplete ? undefined : 'title-word'}>{countdown.isComplete ? 'Я НА ВОЛЕ.' : 'СРОК'}</span>
            </h1>
            <p>{countdown.isComplete ? 'Три месяца позади. Братва, я вернулся.' : 'Три месяца строгого режима. За хорошее поведение не скостят.'}</p>
          </div>
          <div className="timer-caption flex items-center justify-between gap-4">
            <span className="eyebrow">{countdown.isComplete ? 'РАСЧЁТНЫЙ СРОК ЗАВЕРШЁН' : 'ДО ВЫХОДА НА ВОЛЮ'}</span>
            <span className="caption-detail">{countdown.isComplete ? '00:00:00:00' : 'Д : Ч : М : С'}</span>
          </div>
          <CountdownDisplay countdown={countdown} />
          <SentenceProgress startsAt={countdownConfig.startsAt} endsAt={countdownConfig.endsAt} />
          <ReleaseDetails endsAt={countdownConfig.endsAt} timeZone={countdownConfig.timeZone} />
        </section>
        <div className="closing-note"><span aria-hidden="true">+</span><p>От звонка до звонка. Без права на УДО.</p><span aria-hidden="true">+</span></div>
      </main>

      <footer className="site-footer">
        <span className="footer-start">
          <span className="footer-brand">ЗОНА / COUNTDOWN</span>
          <span className="footer-project"><span className="footer-slash">/</span><span>ЛИЧНЫЙ ПРОЕКТ</span></span>
        </span>
        <span className="footer-end"><span className="red-text">●</span><span>ДЕЛО № 001 · ОСОБЫЙ УЧЁТ</span></span>
      </footer>
    </div>
  )
}

export default App
