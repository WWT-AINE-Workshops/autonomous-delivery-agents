import { resolve } from 'node:path';
import { defineConfig } from '@playwright/test';

// The e2e run is isolated from `npm run dev`: its own ports (API 3101, web 5174), its own throwaway
// database under test-results/ (reset at the start of every run), and no reuse of running servers.
// The ports are internal. Walkthrough and check-setup keep using the dev ports 3001 and 5173.
const API_PORT = 3101;
const WEB_PORT = 5174;
const E2E_DB = resolve('test-results', 'e2e.db'); // absolute: npm -w runs with cwd apps/api

export default defineConfig({
  testDir: 'e2e',
  testMatch: '*.spec.ts',
  // Playwright empties outputDir on every run, so it must not contain the database.
  outputDir: 'test-results/artifacts',
  use: { baseURL: `http://localhost:${WEB_PORT}` },
  webServer: [
    {
      command: 'npm run db:reset -w @tasklane/api && npm run start -w @tasklane/api',
      url: `http://127.0.0.1:${API_PORT}/api/health`,
      reuseExistingServer: false,
      env: { TASKLANE_DB: E2E_DB, PORT: String(API_PORT) },
    },
    {
      command: `npx vite --port ${WEB_PORT} --strictPort`,
      cwd: 'apps/web',
      url: `http://localhost:${WEB_PORT}`,
      reuseExistingServer: false,
      env: { TASKLANE_API_URL: `http://127.0.0.1:${API_PORT}` },
    },
  ],
});
