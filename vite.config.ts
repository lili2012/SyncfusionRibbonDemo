import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
import fs from 'fs';
//import viteCompression from 'vite-plugin-compression';
import { compression, defineAlgorithm } from 'vite-plugin-compression2'
import zlib from "zlib";


export default defineConfig({
  //base: "/SyncfusionRibbonDemo/",
  server: {
    port: 5175,
    https: {
      key: fs.readFileSync('./cert/key.pem'),
      cert: fs.readFileSync('./cert/cert.pem'),
    },
    proxy: {
      '/dwg/127.0.0.1/': {
        target: "http://localhost:5175",
        changeOrigin: true,
        rewrite: (requestPath) => {
          const testpath = path.resolve(__dirname, `./public${requestPath}`)
          if (!fs.existsSync(testpath)) {
            const filename = path.basename(testpath)
            requestPath = `/dwg/${filename}`
          }
          return requestPath
        }
      },
    }
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
  // compression({
  //   threshold: 1024, // 1KB minimum - recommended
  //   //include: [/\.(html|xml|css|json|js|mjs|svg|yaml|yml|toml|shx|pb)$/],
  //   include: [/\.(html|xml|css|json|js|mjs|svg|yaml|yml|toml)$/],
  //   exclude: [/\.(png|jpg|jpeg|gif|webp|woff|woff2|dxf|shx|pb)$/],
  //   algorithms: [ // Production: slower builds, better compression
  //     defineAlgorithm('gzip', { level: 9 }), // Maximum compression

  //     // Brotli: quality 10-11 recommended for static assets
  //     defineAlgorithm('brotliCompress', {
  //       params: {
  //         [require('zlib').constants.BROTLI_PARAM_QUALITY]: 11
  //       }
  //     })]
  // }),

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
