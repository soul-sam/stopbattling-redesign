import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { StoreProvider } from './lib/store'
import { AudioProvider } from './lib/audio'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <AudioProvider>
        <App />
      </AudioProvider>
    </StoreProvider>
  </StrictMode>,
)
