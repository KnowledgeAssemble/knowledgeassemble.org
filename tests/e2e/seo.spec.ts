import { expect, test } from '@playwright/test';

const ROUTES = ['/', '/projects', '/principles', '/community', '/about'];

test.describe('SEO and performance pass (implementation plan §10)', () => {
  test('canonical and og:url are absolute on every route', async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route);
      const expected = `https://knowledgeassemble.org${route}`;
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', expected);
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', expected);
    }
  });

  test('OpenGraph and Twitter images are absolute', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      'https://knowledgeassemble.org/og-image.png',
    );
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
      'content',
      'https://knowledgeassemble.org/og-image.png',
    );
  });

  test('makes no third-party runtime requests', async ({ page, baseURL }) => {
    const external: string[] = [];
    page.on('request', (request) => {
      const url = request.url();
      if (baseURL && !url.startsWith(baseURL) && !url.startsWith('data:')) external.push(url);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(external, `third-party requests: ${external.join(', ')}`).toEqual([]);
  });

  test('honours prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const matches = await page.evaluate(
      () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );
    expect(matches).toBe(true);

    const duration = await page
      .locator('main a, main button')
      .first()
      .evaluate((element) => getComputedStyle(element).transitionDuration);
    const seconds = duration.endsWith('ms')
      ? Number.parseFloat(duration) / 1000
      : Number.parseFloat(duration);
    expect(seconds).toBeLessThan(0.01);
  });
});
