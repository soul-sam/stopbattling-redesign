import { BookOpen } from 'lucide-react'
import { useOverlay } from '../lib/store'

/** Top: a name and the journal. That's all the navigation there is. */
export function Top({ name = 'Remembership' }: { name?: string }) {
  const { open } = useOverlay()
  return (
    <header className="flex items-center h-16">
      <span className="display text-[18px] tracking-tight">{name}</span>
      <span className="flex-1" />
      <button onClick={() => open({ kind: 'journal' })} className="flex items-center gap-2 text-[14px] text-soft hover:text-fg -mr-1 p-1">
        <BookOpen size={17} strokeWidth={1.6} />
        <span>Journal</span>
      </button>
    </header>
  )
}

/** Bottom: the quiet exits. */
export function Quiet({ rooms = true }: { rooms?: boolean }) {
  const { open } = useOverlay()
  const link = 'text-soft hover:text-fg underline decoration-line underline-offset-[5px] hover:decoration-fg'
  return (
    <footer className="mt-20 pb-16 text-[14px]">
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {rooms && (
          <button onClick={() => open({ kind: 'topics' })} className={link}>
            Other rooms
          </button>
        )}
        <button onClick={() => open({ kind: 'membership' })} className={link}>
          Support the work
        </button>
        <button onClick={() => open({ kind: 'leave' })} className={link}>
          Leave
        </button>
      </div>
    </footer>
  )
}
