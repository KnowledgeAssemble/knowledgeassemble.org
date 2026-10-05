import { defineConfig, devices } from '@playwright/test';

// Chromium only: the constraints under test (heading counts, overflow,
// landmarks, axe) are not engine-specific, so adding WebKit and Firefox would
// triple CI time for no coverage gain on a static site.
//
// E2E runs against `npm run preview`, not `npm run dev`: the production build
// is the artifact that deploys, and it has no dev-server FOUC.
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
});
