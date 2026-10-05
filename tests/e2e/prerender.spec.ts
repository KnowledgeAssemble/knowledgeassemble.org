import { expect, test } from '@playwright/test';

const ROUTES = ['/', '/projects', '/principles', '/community', '/about'];

// This is the assertion that the *served HTML itself* — not the hydrated DOM —
// carries the content and absolute metadata. It runs against `vite preview`
// after `npm run build`, so the prerendered files are what it sees.
test.describe('prerendered HTML (spec §5–§7)', () => {
  for (const route of ROUTES) {
    test(`${route} HTML carries content and absolute metadata`, async ({ request }) => {
      // Trailing-slash form is the subdirectory index for a static file server.
      const url = route === '/' ? '/' : `${route}/`;
      const response = await request.get(url);
      expect(response.status()).toBe(200);

      const html = await response.text();
      expect(html, `${route} has no canonical`).toContain(
        `<link rel="canonical" href="https://knowledgeassemble.org${route}"`,
      );
      expect(html, `${route} has no og:url`).toContain(
        `property="og:url" content="https://knowledgeassemble.org${route}"`,
      );
      expect(html, `${route} has no og:image`).toContain(
        'content="https://knowledgeassemble.org/og-image.png"',
      );
      // The document must not be the empty SPA shell.
      expect(html).not.toContain('JavaScript application');
    });
  }

  test('/ HTML is not an empty #root shell', async ({ request }) => {
    const response = await request.get('/');
    const html = await response.text();
    expect(html).toContain('Building open systems for assembling knowledge.');
  });
});
