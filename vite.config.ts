import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
import fs from 'fs';
//import viteCompression from 'vite-plugin-compression';
import { compression } from 'vite-plugin-compression2'
import mkcert from "vite-plugin-mkcert";
import zlib from "zlib";


export default defineConfig({
  //base: "/SyncfusionRibbonDemo/",
  server: {
    port: 5175,
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
    //   algorithm: 'brotliCompress',
    //   include: /\.(html|xml|css|json|js|mjs|svg|yaml|yml|toml|shx|pb)$/,
    //   compressionOptions: {
    //     params: {
    //       [zlib.constants.BROTLI_PARAM_QUALITY]:
    //         zlib.constants.BROTLI_MAX_QUALITY,
    //       [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_GENERIC,
    //     },
    //   }
    // }),
    // compression({
    //   algorithm: 'gzip',
    //   include: /\.(html|xml|css|json|js|mjs|svg|yaml|yml|toml|shx|pb)$/,
    //   compressionOptions: {
    //     level: zlib.constants.Z_BEST_COMPRESSION,
    //     strategy: zlib.constants.Z_DEFAULT_STRATEGY,
    //   },
    // }),
    // mkcert({
    //   mkcertPath: path.resolve(__dirname, "cert/mkcert.exe"),
    //   savePath: path.resolve(__dirname, "cert"),
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
    minify: 'terser',
    sourcemap: false,
    commonjsOptions: { transformMixedEsModules: true },
    terserOptions: {
      format: { comments: false },
      compress: {
        //unsafe: true,
        //drop_console: true,
        drop_debugger: true,
      },
      ecma: 2020,
      mangle: true,
      module: true,
      toplevel: true,
    },
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
