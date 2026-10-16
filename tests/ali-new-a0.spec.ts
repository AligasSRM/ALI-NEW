import { test, expect } from '@playwright/test';

test.describe('ALI-NEW control panel', () => {
  test('loads the panel and expands tree rows with synchronized ARIA state', async ({ page }) => {
    await page.goto('/control-panel/');
    await expect(page).toHaveTitle(/ALI-NEW.*Engineering Control Panel/i);

    const row = page.locator('.tree-item').filter({ has: page.getByText('Product definition', { exact: true }) }).locator('.tree-row');
    await expect(row).toHaveAttribute('aria-expanded', 'false');
    await row.click();
    await expect(row).toHaveAttribute('aria-expanded', 'true');
    await expect(row.locator('xpath=..')).toHaveClass(/open/);
    await row.click();
    await expect(row).toHaveAttribute('aria-expanded', 'false');
  });

  test('search filters the build tree and clearing restores it', async ({ page }) => {
    await page.goto('/control-panel/');
    const search = page.getByRole('searchbox', { name: 'Filter build levels' });
    await search.fill('security');
    await expect(page.locator('.tree-item:visible')).toHaveCount(1);
    await expect(page.locator('.tree-item:visible')).toContainText('Security, privacy & quality');
    await search.fill('');
    await expect(page.locator('.tree-item:visible')).toHaveCount(13);
  });
});

test.describe('ALI-NEW design preview', () => {
  test('age notice can decline and return, without opening the demo', async ({ page }) => {
    await page.goto('/design-preview/');
    await expect(page.getByRole('heading', { name: 'Are you 18 or older?' })).toBeVisible();
    await page.getByRole('button', { name: 'No, leave this preview' }).click();
    await expect(page.getByRole('heading', { name: 'Preview not opened' })).toBeVisible();
    await page.getByRole('button', { name: 'Return to age notice' }).click();
    await expect(page.getByRole('heading', { name: 'Are you 18 or older?' })).toBeVisible();
  });

  test('continuing opens the design preview and search filters cards', async ({ page }) => {
    await page.goto('/design-preview/');
    await page.getByRole('button', { name: 'Yes, continue to preview' }).click();
    await expect(page.getByRole('heading', { name: /Discover something/i })).toBeVisible();

    const search = page.getByRole('searchbox', { name: 'Search preview' });
    await search.fill('ocean');
    await expect(page.locator('.video-card:visible')).toHaveCount(1);
    await expect(page.locator('.video-card:visible').first()).toContainText(/ocean/i);
    await search.fill('no-such-demo-result');
    await expect(page.locator('#no-results')).toBeVisible();
    await search.fill('');
    await expect(page.locator('.video-card:visible').count()).resolves.toBeGreaterThan(1);
  });

  test('login and registration are clearly demo-only and empty forms stay blocked', async ({ page }) => {
    await page.goto('/design-preview/');
    await page.getByRole('button', { name: 'Yes, continue to preview' }).click();
    await page.getByRole('button', { name: 'Log in', exact: true }).click();
    await expect(page.getByText(/Authentication is not connected/i)).toBeVisible();
    await page.getByRole('button', { name: 'Create an account' }).click();
    const form = page.locator('form[data-form="register"]');
    await expect(form).toBeVisible();
    await expect(form.locator('input:invalid')).toHaveCount(3);
    await expect(page.getByText(/No account will be created/i)).toBeVisible();
  });

  for (const width of [360, 390, 768, 1280]) {
    test(`design preview fits viewport at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/design-preview/');
      await page.getByRole('button', { name: 'Yes, continue to preview' }).click();
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        page: document.documentElement.scrollWidth
      }));
      expect(dimensions.page, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(dimensions.viewport + 1);
    });
  }
});
