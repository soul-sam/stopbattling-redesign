import { useRoute } from './lib/router'
import { Room } from './prototypes/Room'
import { Radio } from './prototypes/Radio'
import { Remembership } from './prototypes/Remembership'
import { Overlays } from './components/Overlays'
import { Switcher } from './components/Switcher'

export function App() {
  const route = useRoute()
  return (
    <div className="grain relative min-h-dvh">
      <div className="relative">
        {route === 'room' && <Room />}
        {route === 'radio' && <Radio />}
        {route === 'remembership' && <Remembership />}
      </div>
      <Overlays />
      <Switcher route={route} />
    </div>
  )
}
