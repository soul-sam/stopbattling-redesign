import { useEffect, useState } from 'react'
import { Pause, Play, Shuffle } from 'lucide-react'
import { MOODS, TRACKS, fmt, track, type Mood } from '../lib/content'
import { useAudio, useTrack } from '../lib/audio'
import { useStore } from '../lib/store'
import { Composer } from '../components/Composer'
import { Notes } from '../components/Notes'
import { Quiet, Top } from '../components/Chrome'

/** The system picks. You don't browse. */
function pick(mood: Mood | null, not?: string) {
  const pool = TRACKS.filter((t) => t.id !== not && (!mood || t.moods.includes(mood)))
  return pool[Math.floor(Math.random() * pool.length)].id
}

export function Radio() {
  const audio = useAudio()
  const [mood, setMood] = useState<Mood | null>(null)
  const [current, setCurrent] = useState<string | null>(null)

  useEffect(() => {
    document.body.classList.add('night')
    return () => document.body.classList.remove('night')
  }, [])

  const begin = () => {
    const id = pick(mood)
    setCurrent(id)
    audio.play(id)
  }

  return (
    <div className="tone-night bg-bg text-fg min-h-dvh">
      <main className="mx-auto max-w-[36rem] px-5">
        <Top />
        {!current ? (
          <Idle mood={mood} setMood={setMood} begin={begin} />
        ) : (
          <Listening
            key={current}
            id={current}
            next={() => {
              const id = pick(mood, current)
              setCurrent(id)
              audio.play(id)
            }}
            reset={() => {
              audio.stop()
              setCurrent(null)
            }}
          />
        )}
        <Quiet />
      </main>
    </div>
  )
}

function Idle({ mood, setMood, begin }: { mood: Mood | null; setMood: (m: Mood | null) => void; begin: () => void }) {
  return (
    <section className="min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center text-center -mt-8 pb-10">
      <h1 className="display font-light text-[clamp(40px,11vw,64px)] leading-[1.02]">Sit with something</h1>
      <button
        onClick={begin}
        aria-label="Play something"
        className="relative mt-12 size-40 sm:size-44 rounded-full bg-fg text-bg grid place-items-center active:scale-[0.97] transition-transform"
      >
        <span className="absolute -inset-5 rounded-full border border-accent/35 breathe" aria-hidden />
        <Play size={44} fill="currentColor" strokeWidth={0} className="translate-x-1" />
      </button>
      <p className="mt-10 font-serif italic text-[19px] text-soft">You don’t have to choose.</p>

      <div className="mt-16 w-full">
        <p className="text-[13px] text-hush">Or, if you want: right now I feel</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {MOODS.map((m) => (
            <button
              key={m}
              onClick={() => setMood(mood === m ? null : m)}
              className={`rounded-full px-3.5 py-1.5 text-[14px] border transition-colors ${mood === m ? 'bg-fg text-bg border-fg' : 'border-line text-soft hover:text-fg'}`}
            >
              {m.toLowerCase()}
            </button>
          ))}
          <button
            onClick={() => setMood(null)}
            className={`rounded-full px-3.5 py-1.5 text-[14px] border transition-colors ${!mood ? 'border-accent/60 text-fg' : 'border-line text-soft'}`}
          >
            give me anything
          </button>
        </div>
      </div>
      <p className="mt-14 text-[12px] text-hush">2,143 recordings in the archive. One at a time.</p>
    </section>
  )
}

function Listening({ id, next, reset }: { id: string; next: () => void; reset: () => void }) {
  const { s } = useStore()
  const t = track(id)
  const a = useTrack(id)
  const [writing, setWriting] = useState(false)
  const [others, setOthers] = useState(false)
  const [done, setDone] = useState(false)
  const pct = (a.pos / t.seconds) * 100
  // once it opens it stays open, even if you scrub back
  useEffect(() => {
    if (a.ended) setWriting(true)
  }, [a.ended])
  const showReflect = writing
  const here = t.sitting + (s.reflections.some((r) => r.on === id && r.mine) ? 1 : 0)

  return (
    <section className="pt-12 sm:pt-20 fade">
      <p className="text-[13px] text-hush">Oriya</p>
      <h1 className="display font-light text-[clamp(34px,9vw,52px)] leading-[1.06] mt-3 text-balance">{t.title}</h1>
      <p className="font-serif italic text-[16px] text-soft mt-4">{t.context}</p>

      <div className="mt-12 flex items-center gap-5">
        <button onClick={a.toggle} aria-label={a.playing ? 'Pause' : 'Play'} className="size-20 shrink-0 rounded-full bg-fg text-bg grid place-items-center active:scale-95 transition-transform">
          {a.playing ? <Pause size={28} fill="currentColor" strokeWidth={0} /> : <Play size={28} fill="currentColor" strokeWidth={0} className="translate-x-0.5" />}
        </button>
        <div className="flex-1">
          <input
            type="range"
            className="timeline"
            min={0}
            max={t.seconds}
            value={a.pos}
            onChange={(e) => a.seek(Number(e.target.value))}
            aria-label="Timeline"
            style={{ ['--p' as string]: `${pct}%` }}
          />
          <div className="flex justify-between text-[12px] tabular-nums text-hush">
            <span>{fmt(a.pos)}</span>
            <span>{fmt(t.seconds)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-5 text-[14px] text-soft">
        <button onClick={next} className="flex items-center gap-2 hover:text-fg">
          <Shuffle size={15} strokeWidth={1.6} /> Something else
        </button>
        {!showReflect && (
          <button onClick={() => setWriting(true)} className="hover:text-fg">
            Write while you listen
          </button>
        )}
      </div>

      {showReflect && (
        <div className="mt-16 arrive">
          <h2 className="display text-[30px] leading-tight">What came up?</h2>
          <div className="mt-5">
            <Composer on={id} theme={t.theme} source={t.title} intent="either" placeholder="Write something." onDone={() => setDone(true)} />
          </div>
        </div>
      )}

      <div className="mt-14">
        <button onClick={() => setOthers((o) => !o)} className="text-[15px] text-soft hover:text-fg flex items-center gap-2.5">
          <span className="size-1.5 rounded-full bg-accent" />
          {here} people are sitting with this today
        </button>
        {others && (
          <div className="mt-6 fade">
            <Notes on={id} theme={t.theme} loose={false} empty="Nobody has written anything about this one yet. You could be first, or not." />
          </div>
        )}
      </div>

      {(a.ended || done) && (
        <div className="mt-16 flex flex-col items-start gap-3 fade">
          <p className="display italic text-[22px] text-soft">That might be enough for today.</p>
          <button onClick={reset} className="text-[14px] text-hush underline underline-offset-4 hover:text-fg">
            Sit with something else
          </button>
        </div>
      )}
    </section>
  )
}
