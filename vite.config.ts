import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    target:"esnext",
    minify: 'terser',
    terserOptions: {
      format: { comments: false },
      compress: {
          drop_console: true,
          drop_debugger: true,
      },
      ecma: 2020,
      mangle: true,
      module: true,
      toplevel: true,
     
    },
    emptyOutDir: true,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("@syncfusion")) {
            return "syncfusion";
          }
        }
      }
    }
  }
})
