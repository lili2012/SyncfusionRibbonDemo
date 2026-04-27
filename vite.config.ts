import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
import fs from 'fs';

export default defineConfig({
  server: {
    port: 5175,
    https: {
      key: fs.readFileSync(process.env.USERPROFILE + '/Desktop/webcad/backend/cert/key.pem'),
      cert: fs.readFileSync(process.env.USERPROFILE + '/Desktop/webcad/backend/cert/cert.pem'),
    },

  },
  plugins: [vue({
    template: {
      compilerOptions: {
      }
    }
  }),
  {
    name: "Cleaning assets folder",
    async buildStart() {
      fs.rmSync(path.resolve(__dirname, './dist/assets'), { recursive: true, force: true });
    }
  },


  ],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src/") },
      { find: "@@", replacement: path.resolve(__dirname) },
    ],
  },
  build: {

    target: "esnext",
    minify: true,
    sourcemap: false,
    commonjsOptions: { transformMixedEsModules: true },

    emptyOutDir: false,
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
