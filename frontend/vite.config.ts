import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// El backend no habilita CORS: en desarrollo se proxea /api hacia Express.
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:3000' } },
})
