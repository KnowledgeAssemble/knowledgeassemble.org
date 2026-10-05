import { expect, test } from '@playwright/test';

const ROUTES = ['/', '/projects', '/principles', '/community', '/about'];

test.describe('motion visuals (spec §10–§28)', () => {
  test('the hero visual renders on the homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-hero-seq]:visible').first()).toBeVisible();
  });

  test('reduced motion settles everything immediately and removes continuous motion', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    await expect(page.locator('[data-hero-seq]:visible').first()).toHaveCSS('opacity', '1');
    await expect(page.locator('.vis-draw').first()).toHaveCSS('stroke-dashoffset', '0px');

    const hasInfinite = await page.evaluate(() =>
      Array.from(document.querySelectorAll('*')).some(
        (element) => getComputedStyle(element).animationIterationCount === 'infinite',
      ),
    );
    expect(hasInfinite).toBe(false);

    const particle = page.locator('.vis-particle');
    if ((await particle.count()) > 0) {
      await expect(particle.first()).toHaveCSS('display', 'none');
    }
  });

  test('the hero plays once per session and does not restart on SPA return', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/hero-played/, { timeout: 5000 });

    await page.getByRole('link', { name: 'Projects' }).first().click();
    await expect(page).toHaveURL(/\/projects$/);

    await page.locator('header').getByRole('link', { name: 'KnowledgeAssemble' }).click();
    await expect(page).toHaveURL(/\/$/);

    await expect(page.locator('[data-hero-seq]:visible').first()).toHaveCSS('animation-name', 'none');
  });

  test('below-the-fold sections reveal when scrolled into view', async ({ page }) => {
    await page.goto('/');
    await page.locator('.vis-draw').first().scrollIntoViewIfNeeded();
    await expect(page.locator('[data-reveal="visible"]').first()).toBeAttached();
  });

  test('the flagship project visual responds to keyboard focus', async ({ page }) => {
    await page.goto('/projects');
    const panel = page.locator('section', { hasText: 'Flagship project' });
    const visual = panel.locator('.vis-project').first();

    await panel.getByRole('link', { name: 'OpenEdu repository' }).focus();
    await expect
      .poll(() => visual.evaluate((element) => getComputedStyle(element).translate))
      .not.toBe('none');
  });

  test.describe('cumulative layout shift', () => {
    for (const route of ROUTES) {
      test(`${route} has CLS below 0.1`, async ({ page }) => {
        await page.addInitScript(() => {
          const store = window as unknown as { __cls: number };
          store.__cls = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries() as PerformanceEntry[]) {
              const shift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
              if (!shift.hadRecentInput) store.__cls += shift.value;
            }
          }).observe({ type: 'layout-shift', buffered: true });
        });

        await page.goto(route);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(400);

        const cls = await page.evaluate(
          () => (window as unknown as { __cls: number }).__cls,
        );
        expect(cls).toBeLessThan(0.1);
      });
    }
  });

  test('the flow particle travels once the diagram is revealed', async ({ page }) => {
    await page.goto('/');
    const particle = page.locator('.vis-particle');
    test.skip((await particle.count()) === 0, 'particle not implemented');

    await particle.scrollIntoViewIfNeeded();
    await expect(page.locator('[data-reveal="visible"]').first()).toBeAttached();

    const first = await particle.evaluate((element) =>
      getComputedStyle(element).getPropertyValue('offset-distance'),
    );
    await page.waitForTimeout(400);
    const second = await particle.evaluate((element) =>
      getComputedStyle(element).getPropertyValue('offset-distance'),
    );
    expect(first).not.toBe(second);
  });
});
