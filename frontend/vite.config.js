import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    // Ensure static files in public folder are served correctly
    middlewareMode: false,
  },
  // Ensure public folder files are copied and accessible
  publicDir: 'public',
})




