import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
        outDir: 'dist',
        rollupOptions: {
          // Rollup options
        }
      },
  server: {
    port: 3000
  },
  assetsInclude: ['**/*.PNG']
}) 

