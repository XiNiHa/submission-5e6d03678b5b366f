import { defineConfig } from 'vite'
import unocss from 'unocss/vite'
import { presetUno, presetAttributify, presetIcons } from 'unocss'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    unocss({
      presets: [
        presetUno(),
        presetAttributify({ prefix: 'uno-' }),
        presetIcons(),
      ],
    }),
    react(),
  ],
})
