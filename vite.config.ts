import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  // base: '/recipe-react/',
  plugins: [react()],
});
