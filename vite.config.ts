import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
import viteCompression from 'vite-plugin-compression';
import mkcert from "vite-plugin-mkcert";
// https://vitejs.dev/config/
export default defineConfig({
  //base: "/SyncfusionRibbonDemo/",
  preview: {
    port: 5173,
  },
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag) => {
          return tag === 'drawing' || tag === 'view'
        }
      }
    }
  }),

  viteCompression({
    algorithm: 'brotliCompress'


  }),
  mkcert(),
  
  ],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src") },
      { find: "@@", replacement: path.resolve(__dirname) },
    ],
  },
  build: {
    target: "esnext",
    minify: 'terser',
    sourcemap: true,
    terserOptions: {
      format: { comments: false },
      compress: {
        //drop_console: true,
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
