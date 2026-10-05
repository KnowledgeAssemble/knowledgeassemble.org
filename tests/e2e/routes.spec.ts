import { expect, test } from '@playwright/test';

const ROUTES = ['/', '/projects', '/principles', '/community', '/about'];

test.describe('route smoke and structural constraints', () => {
  for (const route of ROUTES) {
    test(`${route} renders exactly one h1`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('h1')).toHaveCount(1);
    });

    test(`${route} has no horizontal overflow at 320px`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 800 });
      await page.goto(route);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });

    test(`${route} never renders a PRD section number`, async ({ page }) => {
      await page.goto(route);
      const body = await page.locator('body').innerText();
      expect(body).not.toMatch(/\b13\.\d\b/);
    });

    test(`${route} emits no canonical or og:url while siteUrl is empty`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
      await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
    });
  }

  test('titles and descriptions are distinct per route', async ({ page }) => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();

    for (const route of ROUTES) {
      await page.goto(route);
      titles.add(await page.title());
      descriptions.add(
        (await page.locator('meta[name="description"]').getAttribute('content')) ?? '',
      );
    }

    expect(titles.size).toBe(ROUTES.length);
    expect(descriptions.size).toBe(ROUTES.length);
  });
});
