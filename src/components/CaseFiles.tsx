import { memo, useId, useState } from 'react'
import { caseFiles } from '../config/caseFiles'
import type { CaseFile } from '../config/caseFiles'
import { PrisonerProfile } from './PrisonerProfile'
import './CaseFiles.css'

interface CaseFileEntryProps {
  entry: CaseFile
  expanded: boolean
  onToggle: () => void
}

function CaseFileEntry({ entry, expanded, onToggle }: CaseFileEntryProps) {
  const id = useId()
  const triggerId = `${id}-trigger`
  const detailId = `${id}-detail`

  return (
    <li className="case-files__entry" data-open={expanded} data-confirmed={entry.confirmed}>
      <h3 className="case-files__entry-heading">
        <button
          id={triggerId}
          type="button"
          className="case-files__trigger"
          aria-expanded={expanded}
          aria-controls={detailId}
          onClick={onToggle}
        >
          <span className="case-files__number"><span className="sr-only">Эпизод </span>{entry.id}</span>
          <span className="case-files__charge">{entry.charge}</span>
          <span className="case-files__status">{entry.status}</span>
          <span className="case-files__arrow" aria-hidden="true" />
        </button>
      </h3>
      <div
        id={detailId}
        className="case-files__detail"
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!expanded}
        inert={!expanded}
      >
        <div className="case-files__clip">
          <div className="case-files__body">
            <span className="case-files__annotation">ИЗ МАТЕРИАЛОВ ПРОВЕРКИ</span>
            <p>{entry.description}</p>
          </div>
        </div>
      </div>
    </li>
  )
}

export const CaseFiles = memo(function CaseFiles() {
  const [openId, setOpenId] = useState<string | null>(null)
  const headingId = useId()

  return (
    <section className="case-files" aria-labelledby={headingId}>
      <header className="case-files__header flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="case-files__eyebrow">ДЕЛО № 001 / РЕЕСТР НАРУШЕНИЙ</p>
          <h2 id={headingId}>МАТЕРИАЛЫ <span>ДЕЛА</span></h2>
        </div>
        <div className="case-files__index" aria-label={`${caseFiles.length} эпизодов в деле`}>
          <span className="case-files__index-mark" aria-hidden="true" />
          <span>{String(caseFiles.length).padStart(2, '0')} ЭПИЗОДОВ <span aria-hidden="true">/</span> ЛИЧНОЕ ДЕЛО</span>
        </div>
      </header>
      <PrisonerProfile />
      <div className="case-files__registry-meta flex flex-wrap items-center justify-between gap-2" aria-hidden="true">
        <span>ОПИСЬ МАТЕРИАЛОВ</span>
        <span>НАЖМИТЕ НА ЭПИЗОД ДЛЯ ПРОСМОТРА <span>↙</span></span>
      </div>
      <ol className="case-files__list">
        {caseFiles.map((entry) => (
          <CaseFileEntry
            key={entry.id}
            entry={entry}
            expanded={openId === entry.id}
            onToggle={() => setOpenId((current) => current === entry.id ? null : entry.id)}
          />
        ))}
      </ol>
      <footer className="case-files__verdict flex flex-wrap items-center justify-between gap-6">
        <div className="case-files__sentence">
          <span className="case-files__verdict-mark" aria-hidden="true">//</span>
          <div>
            <p className="case-files__verdict-label">ПРИГОВОР ВЫНЕСЕН</p>
            <p className="case-files__term">90 суток строгого режима.</p>
          </div>
        </div>
        <span className="case-files__final">ОБЖАЛОВАНИЮ НЕ ПОДЛЕЖИТ</span>
      </footer>
    </section>
  )
})
