import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'content-scripts/text-selection-handler': resolve(__dirname, 'src/content-scripts/text-selection-handler.ts'),
        'background/background': resolve(__dirname, 'src/background/background.ts')
      },
      output: {
        entryFileNames: '[name].js'
      }
    }
  }
})
