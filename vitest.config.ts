import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// A separate file rather than a `test` block in vite.config.ts: importing
// defineConfig from vitest/config keeps the production build config untouched.
// The Tailwind plugin is deliberately absent — components do not import CSS, so
// CSS processing is irrelevant under jsdom and would only slow the suite.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/test/**', '**/*.d.ts'],
    },
  },
});
