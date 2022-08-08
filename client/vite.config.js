import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression';
import { resolve } from "path";

export default {
  plugins: [vue(), viteCompression(), viteCompression({algorithm: 'brotliCompress'})],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: '../dist'
  }
}
