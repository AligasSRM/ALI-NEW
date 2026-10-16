import { test, expect } from '@playwright/test';

const pages = {
  control: 'https://aligassrm.github.io/ALI-NEW/control-panel/',
  preview: 'https://aligassrm.github.io/ALI-NEW/design-preview/'
};

test.describe('ALI-NEW deployed GitHub Pages @live', () => {
  test('published control panel has current title and YELLOW stage evidence @live', async ({ page }) => {
    const response = await page.goto(pages.control);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/ALI-NEW.*Engineering Control Panel/i);
    await expect(page.getByText(/Current stage: A0 · Status: YELLOW/i)).toBeVisible();
  });

  test('published control panel keeps tree disclosure and ARIA state synchronized @live', async ({ page }) => {
    await page.goto(pages.control);
    const row = page.locator('.tree-item').filter({ has: page.getByText('Product definition', { exact: true }) }).locator('.tree-row');
    await expect(row).toHaveAttribute('aria-expanded', 'false');
    await row.click();
    await expect(row).toHaveAttribute('aria-expanded', 'true');
    await expect(row.locator('xpath=..')).toHaveClass(/open/);
    await row.click();
    await expect(row).toHaveAttribute('aria-expanded', 'false');
  });

  test('published control-panel navigation targets exist and activate @live', async ({ page }) => {
    await page.goto(pages.control);
    const buttons = page.locator('.nav button[data-target]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const target = await button.getAttribute('data-target');
      expect(target).toBeTruthy();
      await expect(page.locator(`#${target}`)).toHaveCount(1);
      await button.click();
      await expect(button).toHaveClass(/active/);
    }
  });

  for (const width of [360, 390, 768, 1280]) {
    test(`published control panel has no horizontal overflow at ${width}px @live`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(pages.control);
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        page: document.documentElement.scrollWidth
      }));
      expect(dimensions.page, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(dimensions.viewport + 1);
    });
  }

  test('published design preview age notice can decline and return @live', async ({ page }) => {
    await page.goto(pages.preview);
    await expect(page.getByRole('heading', { name: 'Are you 18 or older?' })).toBeVisible();
    await page.getByRole('button', { name: 'No, leave this preview' }).click();
    await expect(page.getByRole('heading', { name: 'Preview not opened' })).toBeVisible();
    await page.getByRole('button', { name: 'Return to age notice' }).click();
    await expect(page.getByRole('heading', { name: 'Are you 18 or older?' })).toBeVisible();
  });

  test('published design preview search and demo-only account warnings work @live', async ({ page }) => {
    await page.goto(pages.preview);
    await page.getByRole('button', { name: 'Yes, continue to preview' }).click();
    const search = page.getByRole('searchbox', { name: 'Search preview' });
    await search.fill('coastal');
    await expect(page.locator('.video-card:visible')).toHaveCount(1);
    await search.fill('no-such-demo-result');
    await expect(page.locator('#no-results')).toBeVisible();
    await page.getByRole('button', { name: 'Log in', exact: true }).click();
    await expect(page.getByText(/Authentication is not connected/i)).toBeVisible();
    await page.getByRole('button', { name: 'Create an account' }).click();
    await expect(page.getByText(/No account will be created/i)).toBeVisible();
    await expect(page.locator('form[data-form="register"] input:invalid')).toHaveCount(3);
  });

  test('published design preview keyboard focus is visible @live', async ({ page }) => {
    await page.goto(pages.preview);
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
    const outline = await focused.evaluate((el) => {
      const style = getComputedStyle(el);
      return { style: style.outlineStyle, width: parseFloat(style.outlineWidth) };
    });
    expect(outline.style).not.toBe('none');
    expect(outline.width).toBeGreaterThanOrEqual(3);
  });

  test('published pages load without uncaught browser page errors @live', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(pages.control);
    await page.goto(pages.preview);
    expect(errors, 'uncaught browser page errors').toEqual([]);
  });
});
