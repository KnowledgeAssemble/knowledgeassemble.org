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

// The host serves dist/404.html for any unknown URL. It is prerendered from
// NotFoundPage, so it must carry the same document furniture as every other
// route: real content, the built stylesheet, and noindex with no canonical.
test.describe('prerendered 404 (spec §10)', () => {
  test('is a real document, not a bare error page', async ({ request }) => {
    const response = await request.get('/this-route-does-not-exist');
    expect(response.status()).toBe(404);

    const html = await response.text();
    expect(html).toContain('Page not found');
    expect(html).toContain('<link rel="stylesheet"');
    expect(html).toContain('id="root"');
  });

  test('is styled with the site stylesheet, not browser defaults', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');

    const font = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    expect(font, '404 fell back to a browser default serif').not.toBe('Times');

    // The site header is part of the document, so a 404 must still offer the
    // primary navigation rather than stranding the visitor.
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('is noindex and claims no canonical', async ({ request }) => {
    const html = await (await request.get('/this-route-does-not-exist')).text();

    expect(html).toContain('<meta name="robots" content="noindex" />');
    expect(html).not.toContain('rel="canonical"');
    expect(html).not.toContain('property="og:url"');
  });
});
