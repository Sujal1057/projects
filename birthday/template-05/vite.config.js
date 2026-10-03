import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: './',
  plugins: [react()],
  // assets/ is imported from JS (bundled by Vite), so it must NOT be the public dir
  publicDir: false,
  server: {
    port: 3000,
    open: true,
    fs: {
      allow: ['.', '..', 'assets']
    }
  }
});
