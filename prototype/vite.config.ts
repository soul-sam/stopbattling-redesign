import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' so the build works under any path (GitHub Pages serves it at /remembership/)
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
