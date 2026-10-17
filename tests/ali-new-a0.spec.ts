import { test, expect } from '@playwright/test';

test.describe('ALI-NEW Ali Tree A/B/C index', () => {
  test('renders from the canonical registry instead of an embedded tree', async ({ page }) => {
    const response = await page.request.get('/core/registry.json');
    expect(response.ok()).toBeTruthy();
    const registry = await response.json();
    const phaseCount = registry.nodes.filter((node: { level: string }) => node.level === 'A').length;
    const fileCount = registry.nodes.filter((node: { level: string; path?: string }) => node.level === 'C' && node.path).length;

    await page.goto('/');
    await expect(page.locator('.tree-select')).toHaveCount(phaseCount);
    await expect(page.locator('#tree-summary')).toContainText(fileCount + ' موارد C مرتبطة');
    const inlineScripts = (await page.locator('script').allTextContents()).join('\\n');
    expect(inlineScripts).not.toContain('const aliTree = [');
  });

  test('loads the Ali Tree and drills from A to B to real C file paths', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/شجرة علي.*ALI-NEW Engineering Control Panel/);
    await expect(page.locator('h1').filter({ hasText: 'Ali Tree' })).toBeVisible();
    await expect(page.locator('.tree-select')).toHaveCount(13);

    await page.locator('.tree-select').filter({ hasText: 'A0' }).click();
    await expect(page.locator('#tree-crumbs')).toContainText('A0');
    await expect(page.locator('.tree-select')).toHaveCount(6);

    await page.locator('.tree-select').filter({ hasText: 'B2' }).click();
    await expect(page.locator('#tree-crumbs')).toContainText('B2');
    await expect(page.locator('.file-card')).toHaveCount(8);
    await expect(page.getByText('tests/ali-new-a0.spec.ts', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: /فتح الملف الفعلي على GitHub/ }).first()).toHaveAttribute('href', /github.com\/AligasSRM\/ALI-NEW\/blob\/main\//);

    await page.getByRole('button', { name: '← رجوع' }).click();
    await expect(page.locator('.tree-select')).toHaveCount(6);
    await page.getByRole('button', { name: 'كل المراحل' }).click();
    await expect(page.locator('.tree-select')).toHaveCount(13);
  });

  test('planned sections do not pretend files exist', async ({ page }) => {
    await page.goto('/');
    await page.locator('.tree-select').filter({ hasText: 'A1' }).click();
    await expect(page.locator('.tree-select')).toHaveCount(1);
    await page.locator('.tree-select').filter({ hasText: 'B0' }).click();
    await expect(page.locator('.empty-tree')).toContainText('لا يوجد ملف مخصص بعد');
    await expect(page.locator('.file-card')).toHaveCount(0);
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
    await search.fill('coastal');
    await expect(page.locator('.video-card:visible')).toHaveCount(1);
    await expect(page.locator('.video-card:visible').first()).toContainText(/Coastal Stories/i);
    await search.fill('no-such-demo-result');
    await expect(page.locator('#no-results')).toBeVisible();
    await search.fill('');
    expect(await page.locator('.video-card:visible').count()).toBeGreaterThan(1);
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

  test('keyboard focus is visible on the design preview age-gate control', async ({ page }) => {
    await page.goto('/design-preview/');
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
