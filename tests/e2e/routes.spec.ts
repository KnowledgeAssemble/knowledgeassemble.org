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

  // The static shell is the §4.2 no-JS mitigation, and it is scoped to <noscript>
  // precisely so that a JavaScript visitor never renders it before hydration.
  // These two tests are the browser-side half of that contract; src/test/
  // staticShell.test.ts asserts the same thing statically.
  test.describe('static shell', () => {
    test('paints nothing before hydration when JavaScript is enabled', async ({ page }) => {
      // Block the bundle so the pre-hydration state is observable instead of
      // being replaced a few tens of milliseconds after load.
      await page.route('**/*.js', (route) => route.abort());
      await page.route('**/*.css', (route) => route.abort());
      await page.goto('/', { waitUntil: 'domcontentloaded' });

      const painted = await page.evaluate(() => ({
        children: document.getElementById('root')?.children.length ?? -1,
        text: document.body.innerText.trim(),
      }));

      expect(painted.children).toBe(0);
      expect(painted.text).toBe('');
    });

    test('gives no-JS visitors real landmarks and a GitHub route out', async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto('/', { waitUntil: 'load' });

      await expect(page.locator('header')).toHaveCount(1);
      await expect(page.locator('main#main-content')).toHaveCount(1);
      await expect(page.locator('nav[aria-label="Primary"]')).toHaveCount(1);
      await expect(page.locator('footer')).toHaveCount(1);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('a[href*="github.com/KnowledgeAssembly"]')).toHaveCount(1);

      await context.close();
    });
  });

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
