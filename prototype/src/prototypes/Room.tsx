import { useState } from 'react'
import { PenLine, StickyNote, Users } from 'lucide-react'
import { track } from '../lib/content'
import { useOverlay, useStore } from '../lib/store'
import { Player } from '../components/Player'
import { Composer } from '../components/Composer'
import { Notes } from '../components/Notes'
import { Quiet, Top } from '../components/Chrome'

const TODAY = 't1'

export function Room() {
  const { s } = useStore()
  const { open } = useOverlay()
  const t = track(TODAY)
  const [mode, setMode] = useState<null | 'private' | 'public'>(null)
  const [seeing, setSeeing] = useState(false)
  const sat = t.sitting + (s.sat.includes(TODAY) ? 1 : 0)

  return (
    <main className="mx-auto max-w-[36rem] px-5">
      <Top />

      <section className="pt-10 sm:pt-16">
        <p className="text-[14px] text-hush">Today we’re sitting with</p>
        <h1 className="display font-light text-[clamp(40px,10.5vw,62px)] leading-[1.02] mt-4 text-balance">{t.title}</h1>

        <div className="mt-9">
          <Player id={TODAY} big />
        </div>
        <p className="mt-5 text-[14px] text-soft">
          {sat} people sat with this{s.sat.includes(TODAY) ? ', including you' : ''}.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="display text-[28px] leading-tight">What came up for you?</h2>
        {!mode && (
          <div className="mt-5 flex flex-col">
            <Action icon={<PenLine size={18} strokeWidth={1.6} />} onClick={() => setMode('private')} label="Write privately" hint="Goes to your journal. Nobody else sees it." />
            <Action icon={<StickyNote size={18} strokeWidth={1.6} />} onClick={() => setMode('public')} label="Share a reflection" hint="Leave it on the table. With or without your name." />
            <Action icon={<Users size={18} strokeWidth={1.6} />} onClick={() => setSeeing(true)} label="See what others are sitting with" hint={seeing ? 'Below.' : 'Their notes are here when you want them.'} />
          </div>
        )}
        {mode && (
          <div className="mt-5">
            <Composer
              on={TODAY}
              theme={t.theme}
              source={t.title}
              intent={mode}
              autoFocus
              placeholder={mode === 'private' ? 'Just for you.' : 'What came up. It doesn’t have to be profound.'}
              onDone={() => setSeeing(true)}
            />
            <button onClick={() => setMode(null)} className="mt-3 text-[13px] text-hush hover:text-fg">
              Never mind
            </button>
          </div>
        )}
      </section>

      {seeing && (
        <section className="mt-14 fade">
          <p className="text-[14px] text-hush mb-6">Left around the table</p>
          <Notes on={TODAY} theme={t.theme} />
        </section>
      )}

      <section className="mt-20 rounded-[22px] bg-moss text-[#eef0e4] px-6 py-7">
        <p className="text-[13px] opacity-75">The room is open</p>
        <p className="display text-[30px] leading-tight mt-2">Thursday, 8 PM</p>
        <p className="text-[15px] leading-relaxed opacity-85 mt-2 max-w-[26rem]">An informal live conversation with Oriya and whoever shows up. Nothing to prepare.</p>
        <button onClick={() => open({ kind: 'gathering' })} className="mt-5 rounded-full bg-[#eef0e4] text-moss px-4 py-2 text-[14px]">
          Join when open
        </button>
      </section>

      <p className="mt-20 display italic text-[22px] text-soft leading-snug">Nothing to catch up on. This is everything that’s here today.</p>
      <Quiet />
    </main>
  )
}

function Action({ icon, label, hint, onClick }: { icon: React.ReactNode; label: string; hint: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group flex items-start gap-4 text-left py-4 border-b border-line last:border-0">
      <span className="relative mt-0.5 w-5 grid place-items-center text-soft group-hover:text-fg">{icon}</span>
      <span>
        <span className="block text-[17px] text-fg">{label}</span>
        <span className="block text-[14px] text-hush mt-0.5">{hint}</span>
      </span>
    </button>
  )
}
