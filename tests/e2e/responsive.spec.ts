import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

const ROUTES = ['/', '/projects', '/principles', '/community', '/about'];
const WIDTHS = [320, 375, 414, 768, 834, 1024, 1280, 1440];

async function columnCount(page: Page, selector: string): Promise<number> {
  return page
    .locator(selector)
    .first()
    .evaluate((element) => {
      const value = getComputedStyle(element).gridTemplateColumns.trim();
      return value === 'none' ? 0 : value.split(/\s+/).length;
    });
}

test.describe('responsive pass (implementation plan §6.4)', () => {
  for (const route of ROUTES) {
    for (const width of WIDTHS) {
      test(`${route} has no horizontal overflow at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(route);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(1);
      });
    }
  }

  test('knowledge flow reflows 1 → 2 → 6 columns', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto('/');
    expect(await columnCount(page, 'main ol')).toBe(1);

    await page.setViewportSize({ width: 768, height: 900 });
    expect(await columnCount(page, 'main ol')).toBe(2);

    await page.setViewportSize({ width: 1280, height: 900 });
    expect(await columnCount(page, 'main ol')).toBe(6);
  });

  test('umbrella tree switches from ASCII to nested cards below 768px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/projects');
    await expect(page.locator('main pre').first()).toBeVisible();

    await page.setViewportSize({ width: 320, height: 900 });
    await expect(page.locator('main pre').first()).toBeHidden();
  });

  test('primary controls meet the 44px touch target', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto('/');

    // The convention is min-h-11 (44px) or h-11/w-11. sr-only elements (the skip
    // link) are exempt and excluded.
    const controls = page.locator(
      '[class*="min-h-11"]:not([class*="sr-only"]), [class*="h-11"]:not([class*="sr-only"])',
    );
    const count = await controls.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const box = await controls.nth(i).boundingBox();
      if (!box) continue; // hidden at this viewport (e.g. desktop nav)
      expect(
        box.height >= 44 || box.width >= 44,
        `control ${i} is ${Math.round(box.width)}x${Math.round(box.height)}`,
      ).toBe(true);
    }
  });
});
