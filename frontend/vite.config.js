import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // Forward API calls made by `frontend/src/api.js` to the Express backend.
      '/api': 'http://localhost:5000',
    },
  },
})