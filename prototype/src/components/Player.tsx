import { Pause, Play } from 'lucide-react'
import { fmt, track } from '../lib/content'
import { useTrack } from '../lib/audio'

/** Quiet inline player: round button, timeline, time. Title is optional because most screens already say it. */
export function Player({ id, showTitle = false, big = false }: { id: string; showTitle?: boolean; big?: boolean }) {
  const t = track(id)
  const a = useTrack(id)
  const pct = (a.pos / t.seconds) * 100
  const size = big ? 'size-16' : 'size-12'
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={a.toggle}
        aria-label={a.playing ? 'Pause' : 'Play'}
        className={`${size} shrink-0 rounded-full bg-fg text-bg grid place-items-center transition-transform active:scale-95`}
      >
        {a.playing ? <Pause size={big ? 22 : 18} fill="currentColor" strokeWidth={0} /> : <Play size={big ? 22 : 18} fill="currentColor" strokeWidth={0} className="translate-x-[1px]" />}
      </button>
      <div className="min-w-0 flex-1">
        {showTitle && <p className="display text-[17px] leading-snug text-fg mb-0.5 truncate">{t.title}</p>}
        <input
          type="range"
          className="timeline"
          min={0}
          max={t.seconds}
          step={1}
          value={a.pos}
          onChange={(e) => a.seek(Number(e.target.value))}
          aria-label="Timeline"
          style={{ ['--p' as string]: `${pct}%` }}
        />
        <div className="flex justify-between text-[12px] tabular-nums text-hush -mt-0.5">
          <span>{a.pos > 0 ? fmt(a.pos) : 'Oriya'}</span>
          <span>{a.pos > 0 ? `-${fmt(t.seconds - a.pos)}` : fmt(t.seconds)}</span>
        </div>
      </div>
    </div>
  )
}
