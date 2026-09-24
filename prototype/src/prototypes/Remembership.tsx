import { useState } from 'react'
import { ACTS, DAYS, fmt, track, type Day } from '../lib/content'
import { useOverlay, useStore } from '../lib/store'
import { Player } from '../components/Player'
import { Composer } from '../components/Composer'
import { Notes } from '../components/Notes'
import { Quiet, Top } from '../components/Chrome'

export function Remembership() {
  const { s } = useStore()
  const [viewing, setViewing] = useState(s.dayUnlocked)
  const day = DAYS[Math.min(viewing, s.dayUnlocked) - 1]

  return (
    <main className="mx-auto max-w-[36rem] px-5">
      <Top />
      <DayRow viewing={day.n} setViewing={setViewing} />
      <DayView key={day.n} day={day} onNext={() => setViewing(day.n + 1)} />
      <Quiet />
    </main>
  )
}

/** The seven days are a real sequence, so they get numbers. No ticks, no percent. */
function DayRow({ viewing, setViewing }: { viewing: number; setViewing: (n: number) => void }) {
  const { s } = useStore()
  return (
    <nav className="flex items-center gap-1 pt-4 text-[14px] tabular-nums" aria-label="Days">
      <span className="text-hush mr-2">Seven days</span>
      {DAYS.map((d) => {
        const open = d.n <= s.dayUnlocked
        return (
          <button
            key={d.n}
            disabled={!open}
            onClick={() => setViewing(d.n)}
            aria-current={viewing === d.n}
            className={`size-8 rounded-full grid place-items-center transition-colors ${
              viewing === d.n ? 'bg-fg text-bg' : open ? 'text-soft hover:text-fg' : 'text-line cursor-default'
            }`}
          >
            {d.n}
          </button>
        )
      })}
    </nav>
  )
}

function DayView({ day, onNext }: { day: Day; onNext: () => void }) {
  const { s, d } = useStore()
  const { open } = useOverlay()
  const t = track(day.track)
  const [others, setOthers] = useState(false)
  const finished = s.dayDone.includes(day.n)
  const isToday = day.n === s.dayUnlocked
  const on = `day${day.n}`

  return (
    <article className="fade">
      <header className="pt-12 sm:pt-16">
        <p className="display font-light text-[clamp(88px,26vw,150px)] leading-[0.85] text-accent/30 -ml-1 select-none" aria-hidden>
          {day.n}
        </p>
        <h1 className="display text-[clamp(38px,9.5vw,56px)] leading-[1.02] -mt-3 sm:-mt-5 relative">
          <span className="sr-only">Day {day.n}: </span>
          {day.title}
        </h1>
      </header>

      <Part label="Listen" meta={fmt(t.seconds)}>
        <p className="display text-[23px] leading-snug mb-5">“{t.title}”</p>
        <Player id={day.track} />
      </Part>

      <Part label="Reflect">
        <p className="display text-[23px] leading-snug mb-5">{day.question}</p>
        <Composer
          on={on}
          theme={t.theme}
          source={`Day ${day.n}: ${day.question}`}
          intent="either"
          placeholder="Take your time. Or don’t, and write one line."
        />
      </Part>

      <Part label="Practice">
        <p className="font-serif text-[19px] leading-relaxed">{day.practice}</p>
        {day.sitSeconds && (
          <button
            onClick={() => open({ kind: 'sit', seconds: day.sitSeconds!, line: 'Don’t reach for anything. Just be here.' })}
            className="mt-5 rounded-full border border-line px-4 py-2 text-[14px] hover:border-fg"
          >
            Sit for {day.sitSeconds >= 120 ? `${day.sitSeconds / 60} minutes` : `${day.sitSeconds} seconds`}
          </button>
        )}
      </Part>

      <Part label="Community" last>
        {!others ? (
          <button onClick={() => setOthers(true)} className="text-left">
            <span className="display text-[23px] leading-snug block">Want to sit with other people’s reflections?</span>
            <span className="text-[14px] text-hush mt-2 block underline underline-offset-4">Open them</span>
          </button>
        ) : (
          <div className="fade">
            <Notes on={on} theme={t.theme} empty="Nobody else has written on this day yet. The ones who walked it before you kept it to themselves." />
            <div className="mt-4">
              <Notes on={day.track} theme={t.theme} loose={false} empty="" />
            </div>
          </div>
        )}
      </Part>

      <footer className="mt-16">
        {!finished ? (
          <button onClick={() => d({ type: 'finishDay', n: day.n })} className="rounded-full bg-fg text-bg px-5 py-2.5 text-[15px]">
            That’s the day
          </button>
        ) : day.n === 7 ? (
          <Underneath />
        ) : (
          <div className="arrive">
            <p className="display italic text-[26px] leading-snug">That’s it for today. Close the app.</p>
            {isToday ? (
              <>
                <p className="text-[15px] text-soft mt-2">Day {day.n + 1} opens tomorrow morning. There’s nothing to do until then.</p>
                <button
                  onClick={() => {
                    d({ type: 'unlockNext' })
                    onNext()
                  }}
                  className="mt-6 rounded-full border border-dashed border-hush px-4 py-1.5 text-[13px] text-soft"
                >
                  Open tomorrow now (prototype)
                </button>
              </>
            ) : (
              <button onClick={onNext} className="mt-4 text-[14px] text-soft underline underline-offset-4">
                Day {day.n + 1}
              </button>
            )}
          </div>
        )}
      </footer>
    </article>
  )
}

function Part({ label, meta, children, last }: { label: string; meta?: string; children: React.ReactNode; last?: boolean }) {
  return (
    <section className={`grid grid-cols-1 sm:grid-cols-[6.5rem_1fr] gap-x-6 gap-y-3 pt-8 mt-8 ${last ? '' : ''} border-t border-line`}>
      <p className="text-[14px] text-moss sm:pt-1.5">
        {label}
        {meta && <span className="text-hush ml-2 sm:ml-0 sm:block">{meta}</span>}
      </p>
      <div>{children}</div>
    </section>
  )
}

/** Only at the end: the structure was there all along. */
function Underneath() {
  const { s } = useStore()
  const { open } = useOverlay()
  return (
    <div className="arrive">
      <p className="display text-[32px] leading-tight">There was a shape under these seven days.</p>
      <p className="font-serif text-[17px] leading-relaxed text-soft mt-3">You didn’t need to know it to walk it. Now you can see it, and then you can forget it again.</p>
      <ol className="mt-8 border-t border-line">
        {[1, 2, 3, 4].map((a) => (
          <li key={a} className="grid grid-cols-[6.5rem_1fr] gap-6 py-4 border-b border-line">
            <span className="text-[13px] text-hush pt-1 tabular-nums">
              {(() => {
                const ns = DAYS.filter((d) => d.act === a).map((d) => d.n)
                return `${ns.length > 1 ? 'Days' : 'Day'} ${ns.join(' and ')}`
              })()}
            </span>
            <span>
              <span className="display text-[20px] block">{ACTS[a].name}</span>
              <span className="text-[14px] text-soft">{ACTS[a].line}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="display italic text-[24px] leading-snug mt-10">Use the structure until you don’t need it.</p>
      <div className="mt-8 rounded-2xl border border-line p-5">
        <p className="display text-[21px]">Fourteen days, when you’re ready</p>
        <p className="text-[14px] text-soft mt-1 leading-relaxed">
          Deeper into the journey in and the long Tuesday after. Part of Remembership. Or don’t. Maybe you’re done, and that’s the point.
        </p>
        {s.tier === 'remembership' ? (
          <p className="text-[14px] text-moss mt-3">Opens next Monday. (Prototype.)</p>
        ) : (
          <button onClick={() => open({ kind: 'membership' })} className="mt-4 rounded-full border border-line px-4 py-1.5 text-[14px]">
            About Remembership
          </button>
        )}
      </div>
    </div>
  )
}
