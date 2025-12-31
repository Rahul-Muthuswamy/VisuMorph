import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    middlewareMode: false,
  },
  publicDir: 'public',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mediapipe-vendor': [
            '@mediapipe/camera_utils',
            '@mediapipe/face_detection',
            '@mediapipe/face_mesh',
            '@mediapipe/selfie_segmentation'
          ]
        }
      }
    }
  }
})




