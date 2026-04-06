import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
import fs from 'fs';
//import viteCompression from 'vite-plugin-compression';
import { compression, defineAlgorithm } from 'vite-plugin-compression2'
import zlib from "zlib";


export default defineConfig({
  server: {
    port: 5175,
    https: {
      key: fs.readFileSync('C:/Users/shuya/Desktop/webcad/backend/oda/cert/key.pem'),
      cert: fs.readFileSync('C:/Users/shuya/Desktop/webcad/backend/oda/cert/cert.pem'),
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
  compression({
    threshold: 1024, // 1KB minimum - recommended
    //include: [//.(html|xml|css|json|js|mjs|svg|yaml|yml|toml|shx|pb)$/],
    include: [//.(html|xml|css|json|js|mjs|svg|yaml|yml|toml)$/],
    exclude: [//.(dxf|dwg|bak|png|jpg|jpeg|gif|webp|woff|woff2|shx|pb)$/, /MstnFontConfig.xml$/],
    algorithms: [ // Production: slower builds, better compression
      defineAlgorithm('gzip', { level: 9 }), // Maximum compression

      // Brotli: quality 10-11 recommended for static assets
      defineAlgorithm('brotliCompress', {
        params: {
          [require('zlib').constants.BROTLI_PARAM_QUALITY]: 11
        }
      })]
  }),

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
