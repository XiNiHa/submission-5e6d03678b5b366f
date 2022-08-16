import { defineConfig } from 'vite'
import unocss from 'unocss/vite'
import { presetUno, presetAttributify, presetIcons } from 'unocss'
import react from '@vitejs/plugin-react'

export default defineConfig({
  resolve: {
    alias: {
      '@': 'src',
    },
  },
  plugins: [
    unocss({
      shortcuts: {
        'flex-col-center': 'flex flex-col items-center justify-center',
        'input': 'px-4 py-2 border border-gray-300 rounded',
      },
      presets: [
        presetUno(),
        presetAttributify({ prefix: 'uno-' }),
        presetIcons(),
      ],
    }),
    react(),
  ],
})
