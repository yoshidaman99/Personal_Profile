import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, '../app'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../app'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../.output'),
    emptyOutDir: true,
  },
  test: {
    root: path.resolve(__dirname, '..'),
    environment: 'jsdom',
    setupFiles: ['./.test/setup.js'],
    include: ['./.test/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    globals: true,
  },
});
