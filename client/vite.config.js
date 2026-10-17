import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  root: fileURLToPath(new URL('.', import.meta.url)),
  server: { host: '0.0.0.0', port: 5173 },
  build: { outDir: 'dist', emptyOutDir: true }
});
