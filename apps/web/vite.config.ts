import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  // The e2e run points the proxy at its own API through TASKLANE_API_URL.
  server: { proxy: { '/api': process.env.TASKLANE_API_URL ?? 'http://127.0.0.1:3001' } },
  test: { include: ['test/**/*.test.ts'], passWithNoTests: true },
});
