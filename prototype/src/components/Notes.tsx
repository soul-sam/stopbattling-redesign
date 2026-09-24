import { useState } from 'react'
import { BookmarkPlus, Check } from 'lucide-react'
import type { Reflection, Theme } from '../lib/content'
import { todayISO, uid, useStore } from '../lib/store'

/** Reflections as notes left around a table, not a feed. */
export function Notes({ on, theme, loose = true, empty }: { on: string; theme: Theme; loose?: boolean; empty?: string }) {
  const { s } = useStore()
  const list = s.reflections.filter((r) => r.on === on)
  if (!list.length) return <p className="text-[14px] text-hush italic font-serif">{empty ?? 'Nobody has left anything here yet.'}</p>
  return (
    <div className="flex flex-col gap-4">
      {list.map((r, i) => (
        <Note key={r.id} r={r} theme={theme} tilt={loose ? (i % 3 === 0 ? -0.5 : i % 3 === 1 ? 0.35 : -0.15) : 0} />
      ))}
    </div>
  )
}

function Note({ r, theme, tilt }: { r: Reflection; theme: Theme; tilt: number }) {
  const { d } = useStore()
  const [replying, setReplying] = useState(false)
  const [reply, setReply] = useState('')
  const [kept, setKept] = useState(false)
  const name = r.anonymous ? (r.mine ? 'You, unnamed' : 'Unnamed') : r.author

  const keep = () => {
    d({ type: 'journal', e: { id: uid(), date: todayISO(), text: r.text, source: `Something ${r.anonymous ? 'someone' : r.author} left in the room`, theme } })
    setKept(true)
  }

  return (
    <article
      className="arrive rounded-[18px] bg-card px-5 pt-4 pb-3 shadow-[0_1px_0_var(--c-line),0_8px_24px_-18px_rgba(40,30,10,0.35)]"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <p className="font-serif text-[17px] leading-[1.6] text-fg">{r.text}</p>
      <div className="mt-3 flex items-center gap-3 text-[13px] text-hush">
        <span className="text-soft">{name}</span>
        <span>{r.when}</span>
        <span className="flex-1" />
        <button onClick={() => setReplying((v) => !v)} className="hover:text-fg px-1 py-1">
          Reply
        </button>
        <button onClick={keep} disabled={kept} aria-label="Keep in my journal" title="Keep in my journal" className="hover:text-fg p-1">
          {kept ? <Check size={16} /> : <BookmarkPlus size={16} />}
        </button>
      </div>
      {kept && <p className="fade text-[12px] text-hush -mt-1 mb-1 text-right">In your journal.</p>}

      {(r.replies.length > 0 || replying) && (
        <div className="mt-2 mb-1 border-l border-line pl-4 flex flex-col gap-3">
          {r.replies.map((x) => (
            <div key={x.id}>
              <p className={`font-serif text-[15px] leading-relaxed ${x.author === 'Oriya' ? 'text-fg' : 'text-soft'}`}>{x.text}</p>
              <p className="text-[12px] text-hush mt-1">
                {x.author === 'Oriya' ? <span className="text-moss">Oriya</span> : x.author}
                <span className="ml-2">{x.when}</span>
              </p>
            </div>
          ))}
          {replying && (
            <form
              className="flex items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                if (!reply.trim()) return
                d({ type: 'reply', id: r.id, text: reply.trim() })
                setReply('')
                setReplying(false)
              }}
            >
              <textarea
                autoFocus
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={1}
                placeholder={`Say something to ${r.anonymous ? 'them' : r.author}`}
                className="flex-1 resize-none bg-transparent font-serif text-[15px] py-1.5 outline-none border-b border-line placeholder:text-hush"
              />
              <button disabled={!reply.trim()} className="text-[13px] text-fg disabled:opacity-40 py-1.5">
                Send
              </button>
            </form>
          )}
        </div>
      )}
    </article>
  )
}
