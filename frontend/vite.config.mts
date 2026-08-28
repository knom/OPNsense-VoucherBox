import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint2';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return {
    plugins: [
      react(),
      tailwindcss(),
      eslint(),
    ],
    root: '.',
    build: {
      outDir: 'dist',
    },
    base: process.env.VITE_BASEPATH || '',
    server: {
      port: 5173,
      proxy: {
        '/wifi/api': 'http://localhost:3000',
      },
    },
  };
});
