import { useEffect, useState } from 'react'
import { NOTES } from '../lib/content'
import { go, type Route } from '../lib/router'
import { useStore } from '../lib/store'

/**
 * For product discussion only. A small dot in the corner (or the ` key).
 * Not part of the user experience.
 */
export function Switcher({ route }: { route: Route }) {
  const { d } = useStore()
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState(false)

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement
      if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') return
      if (e.key === '`') setNotes((n) => !n)
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])

  const n = NOTES[route]
  return (
    <>
      <div className="fixed z-[60] left-3 bottom-3 font-sans" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {open && (
          <div className="fade absolute left-0 bottom-9 w-60 rounded-xl bg-[#2b2924] text-[#e9e3d6] shadow-2xl p-1.5 text-[13px]">
            <p className="px-3 pt-2 pb-1.5 text-[11px] text-[#9a9282]">Prototype</p>
            {(['room', 'radio', 'remembership'] as Route[]).map((r) => (
              <button
                key={r}
                onClick={() => {
                  go(r)
                  setOpen(false)
                }}
                className={`w-full text-left rounded-lg px-3 py-2 hover:bg-white/5 flex items-center gap-2 ${route === r ? 'text-white' : 'text-[#bdb5a3]'}`}
              >
                <span className={`size-1.5 rounded-full ${route === r ? 'bg-[#d9a441]' : 'bg-transparent'}`} />
                {NOTES[r].name}
                <span className="ml-auto text-[#7a7365]">/{r}</span>
              </button>
            ))}
            <div className="my-1 h-px bg-white/10" />
            <button onClick={() => (setNotes(true), setOpen(false))} className="w-full text-left rounded-lg px-3 py-2 hover:bg-white/5 text-[#bdb5a3]">
              Prototype notes <span className="text-[#7a7365]">( ` )</span>
            </button>
            <button
              onClick={() => {
                if (confirm('Reset all demo data (journal, reflections, days)?')) {
                  d({ type: 'reset' })
                  setOpen(false)
                }
              }}
              className="w-full text-left rounded-lg px-3 py-2 hover:bg-white/5 text-[#7a7365]"
            >
              Reset demo data
            </button>
          </div>
        )}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Prototype switcher"
          className="size-7 rounded-full grid place-items-center opacity-40 hover:opacity-100 transition-opacity"
        >
          <span className="size-2.5 rounded-full bg-[#8a8472] ring-4 ring-[#8a8472]/20" />
        </button>
      </div>

      {notes && (
        <div className="fixed inset-0 z-[70] bg-black/40 fade flex justify-end" onClick={() => setNotes(false)}>
          <aside
            onClick={(e) => e.stopPropagation()}
            className="h-full w-full max-w-md overflow-y-auto bg-[#2b2924] text-[#e9e3d6] px-7 py-8 font-sans"
          >
            <div className="flex items-center justify-between">
              <p className="text-[12px] text-[#9a9282]">Prototype notes, not part of the product</p>
              <button onClick={() => setNotes(false)} className="text-[13px] text-[#9a9282] hover:text-white">
                Close
              </button>
            </div>
            <h2 className="display text-[34px] mt-6">{n.name}</h2>
            <dl className="mt-6 space-y-5 text-[15px] leading-relaxed">
              <div>
                <dt className="text-[12px] text-[#d9a441]">Hypothesis</dt>
                <dd className="mt-1">{n.hypothesis}</dd>
              </div>
              <div>
                <dt className="text-[12px] text-[#d9a441]">Strength</dt>
                <dd className="mt-1">{n.strength}</dd>
              </div>
              <div>
                <dt className="text-[12px] text-[#d9a441]">Risk</dt>
                <dd className="mt-1">{n.risk}</dd>
              </div>
              <div>
                <dt className="text-[12px] text-[#d9a441]">Things to notice</dt>
                <dd className="mt-1">
                  <ul className="list-disc pl-4 space-y-2 text-[#cfc7b6]">
                    {n.notice.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
            <div className="mt-10 border-t border-white/10 pt-6">
              <p className="text-[12px] text-[#9a9282]">The question to ask afterwards</p>
              <p className="display text-[20px] leading-snug mt-2">“Which of these feels most like the thing you actually want to create?”</p>
            </div>
            <div className="mt-8 text-[13px] text-[#9a9282] leading-relaxed">
              Shared across all three: the journal, the other rooms, the live gathering, support. Audio is simulated and silent. Everything is stored in this browser only.
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
