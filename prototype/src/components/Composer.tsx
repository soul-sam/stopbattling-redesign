import { useState } from 'react'
import type { Theme } from '../lib/content'
import { agoLabel, findEcho, todayISO, uid, useOverlay, useStore } from '../lib/store'

type Intent = 'private' | 'public' | 'either'

/**
 * Write something. Private goes to the journal. Shared goes to the room (and, by default, the journal too).
 * After saving, if the journal holds something similar from months ago, it says so. Mocked by theme.
 */
export function Composer({
  on,
  theme,
  source,
  intent = 'either',
  placeholder = 'Whatever came up. It doesn’t have to be profound.',
  onDone,
  autoFocus,
}: {
  on: string
  theme: Theme
  source: string
  intent?: Intent
  placeholder?: string
  onDone?: (shared: boolean) => void
  autoFocus?: boolean
}) {
  const { s, d } = useStore()
  const { open } = useOverlay()
  const [text, setText] = useState('')
  const [anon, setAnon] = useState(false)
  const [keep, setKeep] = useState(true)
  const [saved, setSaved] = useState<null | { shared: boolean; journaled: boolean }>(null)

  const submit = (shared: boolean) => {
    const t = text.trim()
    if (!t) return
    const journaled = !shared || keep
    if (journaled) d({ type: 'journal', e: { id: uid(), date: todayISO(), text: t, source, theme } })
    if (shared)
      d({ type: 'reflect', r: { id: uid(), on, author: anon ? 'Someone' : 'You', anonymous: anon, text: t, when: 'just now', replies: [], mine: true } })
    setSaved({ shared, journaled })
    onDone?.(shared)
  }

  if (saved) {
    const echo = saved.journaled ? findEcho(s.journal, theme) : undefined
    return (
      <div className="arrive rounded-2xl border border-line px-5 py-5">
        <p className="display text-[20px] leading-snug">
          {saved.shared ? 'It’s on the table now.' : 'Kept. Only you can see it.'}
        </p>
        <p className="text-[14px] text-soft mt-1">
          {saved.shared
            ? saved.journaled
              ? 'Also in your journal. If someone answers, it’ll be there whenever you come back.'
              : 'If someone answers, it’ll be there whenever you come back.'
            : 'It’s in your journal.'}
        </p>
        {echo && (
          <button
            onClick={() => open({ kind: 'journal', focus: echo.id })}
            className="mt-4 block w-full text-left rounded-xl bg-wash px-4 py-3.5 hover:opacity-90"
          >
            <span className="block text-[13px] text-hush">You wrote about something similar {agoLabel(echo.date)}.</span>
            <span className="block font-serif italic text-[15px] text-soft mt-1 line-clamp-2">“{echo.text}”</span>
          </button>
        )}
      </div>
    )
  }

  const canShare = intent !== 'private'
  const canKeep = intent !== 'public'
  return (
    <div className="rounded-2xl border border-line bg-card px-4 pt-3 pb-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        rows={3}
        className="w-full min-h-[92px] resize-none bg-transparent font-serif text-[17px] leading-relaxed text-fg placeholder:text-hush outline-none"
      />
      {canShare && (
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-soft pb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} className="accent-[var(--c-fg)]" />
            Share without my name
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={keep} onChange={(e) => setKeep(e.target.checked)} className="accent-[var(--c-fg)]" />
            Keep a copy in my journal
          </label>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line pt-3">
        {canKeep && (
          <button
            disabled={!text.trim()}
            onClick={() => submit(false)}
            className={`rounded-full px-4 py-2 text-[14px] disabled:opacity-40 ${intent === 'private' ? 'bg-fg text-bg' : 'text-fg border border-line'}`}
          >
            Keep it private
          </button>
        )}
        {canShare && (
          <button disabled={!text.trim()} onClick={() => submit(true)} className="rounded-full bg-fg text-bg px-4 py-2 text-[14px] disabled:opacity-40">
            Share with the room
          </button>
        )}
      </div>
    </div>
  )
}
