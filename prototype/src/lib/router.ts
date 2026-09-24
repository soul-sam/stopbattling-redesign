import { useEffect, useState } from 'react'

// Hash routes (#/room, #/radio, #/remembership) so it works on GitHub Pages with no server config.

export type Route = 'room' | 'radio' | 'remembership'
const ROUTES: Route[] = ['room', 'radio', 'remembership']

const read = (): Route => {
  const r = window.location.hash.replace(/^#\/?/, '').split('/')[0] as Route
  return ROUTES.includes(r) ? r : 'room'
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(read)
  useEffect(() => {
    const on = () => setRoute(read())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}

export const go = (r: Route) => {
  window.location.hash = `/${r}`
  window.scrollTo(0, 0)
}
