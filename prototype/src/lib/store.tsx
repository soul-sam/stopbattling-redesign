import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react'
import { SEED_JOURNAL, SEED_REFLECTIONS, type JournalEntry, type Reflection, type Theme } from './content'

export type Tier = 'free' | 'supporter' | 'remembership'

export type Overlay =
  | { kind: 'journal'; focus?: string }
  | { kind: 'topics'; topic?: string }
  | { kind: 'gathering' }
  | { kind: 'membership' }
  | { kind: 'leave' }
  | { kind: 'sit'; seconds: number; line: string }
  | null

type State = {
  reflections: Reflection[]
  journal: JournalEntry[]
  sat: string[] // tracks the user has sat with
  tier: Tier
  dayUnlocked: number
  dayDone: number[]
  overlay: Overlay
}

const KEY = 'remembership-proto-v1'

const initial = (): State => ({
  reflections: SEED_REFLECTIONS,
  journal: SEED_JOURNAL,
  sat: [],
  tier: 'free',
  dayUnlocked: 4, // the prototype opens mid-journey so day 4 matches the brief
  dayDone: [1, 2, 3],
  overlay: null,
})

type Action =
  | { type: 'reflect'; r: Reflection }
  | { type: 'reply'; id: string; text: string }
  | { type: 'journal'; e: JournalEntry }
  | { type: 'sat'; track: string }
  | { type: 'tier'; tier: Tier }
  | { type: 'finishDay'; n: number }
  | { type: 'unlockNext' }
  | { type: 'overlay'; o: Overlay }
  | { type: 'reset' }

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'reflect':
      return { ...s, reflections: [a.r, ...s.reflections] }
    case 'reply':
      return {
        ...s,
        reflections: s.reflections.map((r) =>
          r.id === a.id ? { ...r, replies: [...r.replies, { id: uid(), author: 'You', text: a.text, when: 'just now' }] } : r,
        ),
      }
    case 'journal':
      return { ...s, journal: [...s.journal, a.e] }
    case 'sat':
      return s.sat.includes(a.track) ? s : { ...s, sat: [...s.sat, a.track] }
    case 'tier':
      return { ...s, tier: a.tier }
    case 'finishDay':
      return { ...s, dayDone: s.dayDone.includes(a.n) ? s.dayDone : [...s.dayDone, a.n] }
    case 'unlockNext':
      return { ...s, dayUnlocked: Math.min(7, s.dayUnlocked + 1) }
    case 'overlay':
      return { ...s, overlay: a.o }
    case 'reset':
      return initial()
  }
}

export const uid = () => Math.random().toString(36).slice(2, 10)
export const todayISO = () => new Date().toISOString().slice(0, 10)

const Ctx = createContext<{ s: State; d: React.Dispatch<Action> } | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, d] = useReducer(reducer, undefined, () => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) return { ...initial(), ...JSON.parse(raw), overlay: null }
    } catch {
      /* private mode, fine */
    }
    return initial()
  })
  useEffect(() => {
    try {
      const { overlay: _o, ...rest } = s
      localStorage.setItem(KEY, JSON.stringify(rest))
    } catch {
      /* ignore */
    }
  }, [s])
  return <Ctx.Provider value={{ s, d }}>{children}</Ctx.Provider>
}

export function useStore() {
  const c = useContext(Ctx)
  if (!c) throw new Error('no store')
  return c
}

export const useOverlay = () => {
  const { s, d } = useStore()
  return { overlay: s.overlay, open: (o: Overlay) => d({ type: 'overlay', o }), close: () => d({ type: 'overlay', o: null }) }
}

/**
 * "You wrote about something similar three months ago."
 * Mocked: same theme, written at least ~6 weeks before. No AI.
 */
export function findEcho(journal: JournalEntry[], theme: Theme, notId?: string): JournalEntry | undefined {
  if (theme === 'free') return undefined
  const cutoff = Date.now() - 45 * 864e5
  return journal
    .filter((e) => e.id !== notId && e.theme === theme && new Date(e.date).getTime() < cutoff)
    .sort((a, b) => a.date.localeCompare(b.date))[0]
}

export function agoLabel(iso: string) {
  const days = Math.round((Date.now() - new Date(iso).getTime()) / 864e5)
  if (days < 45) return 'a few weeks ago'
  const months = Math.round(days / 30)
  return months <= 1 ? 'a month ago' : `${['', 'one', 'two', 'three', 'four', 'five', 'six'][months] ?? months} months ago`
}
