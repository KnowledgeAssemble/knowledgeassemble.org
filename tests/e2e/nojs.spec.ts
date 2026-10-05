import { expect, test } from '@playwright/test';

const ROUTES: { path: string; heading: string }[] = [
  { path: '/', heading: 'Building open systems for assembling knowledge.' },
  { path: '/projects', heading: 'Projects' },
  { path: '/principles', heading: 'Principles' },
  { path: '/community', heading: 'Build with us.' },
  { path: '/about', heading: 'About KnowledgeAssemble' },
];

// Spec §4, §23: each route must be a real document without JavaScript.
test.describe('no-JS content', () => {
  for (const { path, heading } of ROUTES) {
    test(`${path} exposes real content with JavaScript disabled`, async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto(path);

      await expect(page.locator('h1')).toHaveText(heading);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('body')).not.toContainText('JavaScript application');

      await context.close();
    });
  }

  test('navigation works without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');

    await page.getByRole('link', { name: 'Projects' }).first().click();
    await expect(page.locator('h1')).toHaveText('Projects');

    await context.close();
  });

  // Spec §40: the visuals' resting state is their final state, so with no
  // JavaScript (and so no reveal hook, no session script) they are fully
  // visible. This is the assertion that would catch a hidden-by-default
  // implementation that the h1-text checks cannot.
  test('visuals are fully visible without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');

    await expect(page.locator('[data-hero-seq]:visible').first()).toHaveCSS('opacity', '1');
    await expect(page.locator('.vis-draw').first()).toHaveCSS('stroke-dashoffset', '0px');

    await context.close();
  });
});
