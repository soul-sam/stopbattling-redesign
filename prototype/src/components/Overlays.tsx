import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowLeft, Mic, MicOff, X } from 'lucide-react'
import { TOPICS, type JournalEntry } from '../lib/content'
import { agoLabel, findEcho, useOverlay, useStore, type Tier } from '../lib/store'
import { Composer } from './Composer'
import { Notes } from './Notes'
import { Player } from './Player'

export function Overlays() {
  const { overlay } = useOverlay()
  if (!overlay) return null
  switch (overlay.kind) {
    case 'journal':
      return <Journal focus={overlay.focus} />
    case 'topics':
      return <Topics topic={overlay.topic} />
    case 'gathering':
      return <Gathering />
    case 'membership':
      return <Membership />
    case 'leave':
      return <Leave />
    case 'sit':
      return <Sit seconds={overlay.seconds} line={overlay.line} />
  }
}

function useEscape(fn: () => void) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && fn()
    window.addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', k)
      document.body.style.overflow = ''
    }
  }, [fn])
}

/** Full screen on a phone, a quiet page on desktop. */
function Sheet({ children, title, onBack }: { children: ReactNode; title?: string; onBack?: () => void }) {
  const { close } = useOverlay()
  useEscape(close)
  return (
    <div className="fixed inset-0 z-40 bg-bg grain overflow-y-auto fade" role="dialog" aria-modal="true">
      <div className="relative mx-auto max-w-[36rem] px-5 pb-24">
        <div className="sticky top-0 z-10 -mx-5 px-5 bg-bg/95 backdrop-blur-sm flex items-center h-14 gap-2">
          {onBack && (
            <button onClick={onBack} aria-label="Back" className="-ml-2 p-2 text-soft hover:text-fg">
              <ArrowLeft size={20} />
            </button>
          )}
          <span className="text-[14px] text-soft">{title}</span>
          <span className="flex-1" />
          <button onClick={close} aria-label="Close" className="-mr-2 p-2 text-soft hover:text-fg">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- journal

const monthDay = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

function Journal({ focus }: { focus?: string }) {
  const { s } = useStore()
  const [writing, setWriting] = useState(false)
  const [lit, setLit] = useState<string | undefined>(focus)
  const refs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    if (lit) refs.current[lit]?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [lit])

  const entries = [...s.journal].sort((a, b) => b.date.localeCompare(a.date))
  const byDate = entries.reduce<Record<string, JournalEntry[]>>((acc, e) => ((acc[e.date] ??= []).push(e), acc), {})

  return (
    <Sheet title="Your journal">
      <header className="pt-6 pb-8">
        <h1 className="display text-[40px] leading-[1.05]">What you’ve kept</h1>
        <p className="text-[15px] text-soft mt-3">Only you can see this. Nothing here is analysed, scored or shared.</p>
        {!writing ? (
          <button onClick={() => setWriting(true)} className="mt-5 rounded-full border border-line px-4 py-2 text-[14px]">
            Write something
          </button>
        ) : (
          <div className="mt-5">
            <Composer on="journal" theme="free" source="Written on your own" intent="private" autoFocus placeholder="Just for you." onDone={() => setTimeout(() => setWriting(false), 1600)} />
          </div>
        )}
      </header>

      <ol className="flex flex-col gap-9">
        {Object.entries(byDate).map(([date, list]) => (
          <li key={date} className="grid grid-cols-[4.2rem_1fr] gap-4">
            <span className="text-[13px] text-hush pt-1.5 tabular-nums">{monthDay(date)}</span>
            <div className="flex flex-col gap-6">
              {list.map((e) => {
                const echo = findEcho(s.journal, e.theme, e.id)
                const older = echo && echo.date < e.date ? echo : undefined
                return (
                  <article
                    key={e.id}
                    ref={(el) => {
                      refs.current[e.id] = el
                    }}
                    className={`transition-colors duration-700 rounded-xl -mx-3 px-3 py-2 ${lit === e.id ? 'bg-wash' : ''}`}
                  >
                    <p className="font-serif text-[18px] leading-[1.6]">“{e.text}”</p>
                    {e.source && <p className="text-[13px] text-hush mt-2">{e.source}</p>}
                    {older && (
                      <button onClick={() => setLit(older.id)} className="mt-2 block text-left text-[13px] text-moss underline decoration-line underline-offset-4 hover:decoration-moss">
                        You wrote about something similar {agoLabel(older.date)}
                      </button>
                    )}
                  </article>
                )
              })}
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-16 text-center font-serif italic text-hush">A memory of the inside.</p>
    </Sheet>
  )
}

// ---------------------------------------------------------------- other rooms

function Topics({ topic }: { topic?: string }) {
  const { open } = useOverlay()
  const t = TOPICS.find((x) => x.id === topic)
  if (!t)
    return (
      <Sheet title="Other rooms">
        <h1 className="display text-[36px] leading-tight pt-6">Other rooms</h1>
        <p className="text-[15px] text-soft mt-2 mb-8">Smaller conversations. Go in when you need one, not to keep up.</p>
        <ul className="border-t border-line">
          {TOPICS.map((x) => (
            <li key={x.id} className="border-b border-line">
              <button onClick={() => open({ kind: 'topics', topic: x.id })} className="w-full text-left py-5 group">
                <span className="display text-[22px] group-hover:text-moss transition-colors">{x.name}</span>
                <span className="block text-[14px] text-soft mt-0.5">{x.line}</span>
              </button>
            </li>
          ))}
        </ul>
      </Sheet>
    )
  return (
    <Sheet title="Other rooms" onBack={() => open({ kind: 'topics' })}>
      <h1 className="display text-[40px] leading-tight pt-6">{t.name}</h1>
      <p className="text-[15px] text-soft mt-1">{t.line}</p>

      <section className="mt-8 border-l-2 border-moss pl-4">
        <p className="text-[13px] text-moss mb-1.5">Oriya, {t.oriya.when}</p>
        <p className="display text-[21px] leading-snug">{t.oriya.text}</p>
        {t.oriya.track && (
          <div className="mt-4">
            <Player id={t.oriya.track} showTitle />
          </div>
        )}
      </section>

      <section className="mt-10">
        <Notes on={t.id} theme="free" loose={false} />
      </section>
      <section className="mt-8">
        <Composer on={t.id} theme="free" source={`In ${t.name}`} intent="public" placeholder="Say something." />
      </section>
    </Sheet>
  )
}

// ---------------------------------------------------------------- live gathering (mock)

const PEOPLE = ['Maya', 'Tomás', 'Ines', 'Dev', 'Hana', 'Kofi', 'Lior', 'June', 'Rafa']

function Gathering() {
  const [open, setOpen] = useState(false)
  const [mic, setMic] = useState(false)
  const { close } = useOverlay()
  if (!open)
    return (
      <Sheet title="The room is open">
        <div className="pt-10">
          <p className="text-[14px] text-hush">Thursday, 8 PM your time</p>
          <h1 className="display text-[40px] leading-[1.08] mt-2">An informal live conversation with Oriya.</h1>
          <p className="font-serif text-[17px] leading-relaxed text-soft mt-5">
            No agenda. Bring a question, or don’t. Camera optional. Nobody has to speak. If you arrive late, you haven’t missed anything, because there’s nothing to miss.
          </p>
          <p className="text-[14px] text-hush mt-8">Tomorrow, the button below will simply open the call.</p>
          <button onClick={() => setOpen(true)} className="mt-3 rounded-full border border-dashed border-hush px-4 py-2 text-[13px] text-soft">
            Preview it open (prototype)
          </button>
        </div>
      </Sheet>
    )
  return (
    <div className="fixed inset-0 z-40 tone-night bg-bg text-fg fade flex flex-col" role="dialog" aria-modal="true">
      <div className="flex items-center h-14 px-5 text-[14px] text-soft">
        <span className="size-2 rounded-full bg-accent mr-2" /> The room is open
        <span className="flex-1" />
        <span className="text-hush">11 here</span>
      </div>
      <div className="flex-1 grid place-items-center px-6">
        <div className="text-center max-w-md">
          <div className="mx-auto size-28 rounded-full bg-wash grid place-items-center display text-[34px] ring-1 ring-line relative">
            O
            <span className="absolute inset-[-10px] rounded-full border border-accent/40 breathe" />
          </div>
          <p className="mt-4 text-soft text-[14px]">Oriya is talking</p>
          <p className="display text-[22px] leading-snug mt-6">“I don’t want to give a talk. What’s actually going on for you this week?”</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {PEOPLE.map((p) => (
              <span key={p} className="size-11 rounded-full bg-card ring-1 ring-line grid place-items-center text-[13px] text-soft" title={p}>
                {p[0]}
              </span>
            ))}
            <span className="size-11 rounded-full ring-1 ring-accent grid place-items-center text-[12px] text-fg">you</span>
          </div>
          <p className="mt-8 text-[13px] text-hush">In the real thing this is where Zoom, Meet or LiveKit would sit.</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 pb-10">
        <button onClick={() => setMic((m) => !m)} className="size-12 rounded-full bg-card ring-1 ring-line grid place-items-center" aria-label={mic ? 'Mute' : 'Unmute'}>
          {mic ? <Mic size={18} /> : <MicOff size={18} className="text-hush" />}
        </button>
        <button onClick={close} className="rounded-full bg-fg text-bg px-5 h-12 text-[14px]">
          Leave quietly
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- membership (mock)

const TIERS: { id: Tier; name: string; price: string; line: string; cta: string }[] = [
  { id: 'free', name: 'Free', price: '', line: 'Listen, sit, write. The public audio and the occasional open experience.', cta: 'Stay here' },
  { id: 'supporter', name: 'Supporter', price: '$6 a month', line: 'Simply keeps the work going. Extra audio and the longer letters, if you want them.', cta: 'Support the work' },
  { id: 'remembership', name: 'Remembership', price: '$40 a month', line: 'The deeper room. Live gatherings, the guided experiences, shared conversations, Oriya around more.', cta: 'Come further in' },
]

function Membership() {
  const { s, d } = useStore()
  const [thanks, setThanks] = useState<Tier | null>(null)
  return (
    <Sheet title="Support">
      <div className="pt-8">
        <h1 className="display text-[36px] leading-tight">This is free to sit in.</h1>
        <p className="font-serif text-[17px] leading-relaxed text-soft mt-3">
          If it helps, you can support the work, or participate more deeply. Either is enough. Neither is required.
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-3">
        {TIERS.map((t) => {
          const current = s.tier === t.id
          return (
            <div key={t.id} className={`rounded-2xl border px-5 py-4 ${current ? 'border-fg' : 'border-line'}`}>
              <div className="flex items-baseline gap-3">
                <span className="display text-[21px]">{t.name}</span>
                <span className="text-[13px] text-hush">{t.price}</span>
              </div>
              <p className="text-[14px] text-soft mt-1 leading-relaxed">{t.line}</p>
              <div className="mt-3">
                {current ? (
                  <span className="text-[13px] text-moss">Where you are now</span>
                ) : (
                  <button
                    onClick={() => {
                      d({ type: 'tier', tier: t.id })
                      setThanks(t.id)
                    }}
                    className="rounded-full border border-line px-4 py-1.5 text-[14px]"
                  >
                    {t.cta}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {thanks && thanks !== 'free' && (
        <p className="fade mt-6 font-serif italic text-soft">Thank you. (Prototype: no payment happened.)</p>
      )}
    </Sheet>
  )
}

// ---------------------------------------------------------------- leaving

function Leave() {
  const { close } = useOverlay()
  useEscape(close)
  return (
    <div className="fixed inset-0 z-50 bg-bg grain grid place-items-center px-8 text-center" role="dialog" aria-modal="true">
      <div>
        <p className="display fade-slow text-[clamp(34px,8vw,64px)] leading-[1.05]">
          Close the app.
          <br />
          Go live your life.
        </p>
        <p className="fade-slow text-[14px] text-hush mt-8" style={{ animationDelay: '1.2s' }}>
          Nothing will pile up while you’re gone.
        </p>
        <button onClick={close} className="fade-slow mt-16 text-[13px] text-hush underline underline-offset-4" style={{ animationDelay: '3s' }}>
          I’m back
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- sitting

function Sit({ seconds, line }: { seconds: number; line: string }) {
  const { close } = useOverlay()
  useEscape(close)
  const [left, setLeft] = useState(seconds)
  useEffect(() => {
    if (left <= 0) return
    const t = setTimeout(() => setLeft((l) => l - 1), 1000)
    return () => clearTimeout(t)
  }, [left])
  const done = left <= 0
  return (
    <div className="fixed inset-0 z-50 tone-night bg-bg text-fg grid place-items-center px-8 text-center fade" role="dialog" aria-modal="true">
      <div>
        <div className="relative mx-auto size-56 grid place-items-center">
          <span className={`absolute inset-0 rounded-full border border-accent/50 ${done ? '' : 'breathe'}`} />
          <span className={`absolute inset-8 rounded-full bg-wash ${done ? '' : 'breathe'}`} style={{ animationDelay: '-0.4s' }} />
          <span className="relative text-[13px] tabular-nums text-hush">{done ? '' : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`}</span>
        </div>
        <p className="display text-[24px] leading-snug mt-10 max-w-sm mx-auto">{done ? 'That’s it. Notice what’s here now.' : line}</p>
        <button onClick={close} className="mt-10 text-[14px] text-soft underline underline-offset-4">
          {done ? 'Back' : 'Stop here'}
        </button>
      </div>
    </div>
  )
}

