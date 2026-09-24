import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { track } from './content'
import { useStore } from './store'

// A simulated player. No files: position advances on a timer, the timeline is real.

type Audio = {
  id: string | null
  playing: boolean
  pos: number
  ended: boolean
  play: (id: string) => void
  toggle: (id: string) => void
  seek: (id: string, sec: number) => void
  stop: () => void
}

const Ctx = createContext<Audio | null>(null)

export function AudioProvider({ children }: { children: ReactNode }) {
  const { d } = useStore()
  const [id, setId] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState(0)
  const [ended, setEnded] = useState(false)
  const idRef = useRef(id)
  idRef.current = id

  useEffect(() => {
    if (!playing || !id) return
    const len = track(id).seconds
    const t = setInterval(() => {
      setPos((p) => {
        const n = p + 0.25
        if (n >= len) {
          setPlaying(false)
          setEnded(true)
          return len
        }
        return n
      })
    }, 250)
    return () => clearInterval(t)
  }, [playing, id])

  const play = (next: string) => {
    if (next !== idRef.current) {
      setId(next)
      setPos(0)
    }
    setEnded(false)
    setPlaying(true)
    d({ type: 'sat', track: next })
  }

  const value: Audio = {
    id,
    playing,
    pos,
    ended,
    play,
    toggle: (t) => (t === id && playing ? setPlaying(false) : play(t)),
    seek: (t, sec) => {
      if (t !== id) {
        setId(t)
        setPlaying(false)
        d({ type: 'sat', track: t })
      }
      const len = track(t).seconds
      setPos(sec)
      if (sec >= len - 0.5) {
        setPos(len)
        setPlaying(false)
        setEnded(true)
      } else setEnded(false)
    },
    stop: () => {
      setPlaying(false)
      setId(null)
      setPos(0)
      setEnded(false)
    },
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAudio() {
  const c = useContext(Ctx)
  if (!c) throw new Error('no audio')
  return c
}

/** state for one specific track */
export function useTrack(id: string) {
  const a = useAudio()
  const mine = a.id === id
  return {
    playing: mine && a.playing,
    pos: mine ? a.pos : 0,
    ended: mine && a.ended,
    toggle: () => a.toggle(id),
    seek: (s: number) => a.seek(id, s),
  }
}
