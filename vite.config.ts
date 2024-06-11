import { defineConfig } from 'vite'
// @ts-ignore
import eslint from 'vite-plugin-eslint';
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  resolve: {
    alias: {
      ".prisma/client/index-browser": "./node_modules/.prisma/client/index-browser.js"
    }
  }
})
