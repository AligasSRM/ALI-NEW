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

  test('all control-panel navigation targets exist and activate their section', async ({ page }) => {
    await page.goto('/control-panel/');
    const navButtons = page.locator('.nav button[data-target]');
    const count = await navButtons.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const button = navButtons.nth(i);
      const target = await button.getAttribute('data-target');
      expect(target, 'navigation button must declare a target').toBeTruthy();
      await expect(page.locator(`#${target}`), `missing navigation target #${target}`).toHaveCount(1);
      await button.click();
      await expect(button).toHaveClass(/active/);
    }
  });

  for (const width of [360, 390, 768, 1280]) {
    test(`control panel fits viewport at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/control-panel/');
      const dimensions = await page.evaluate(() => {
        const viewport = document.documentElement.clientWidth;
        const page = document.documentElement.scrollWidth;
        const offenders = [...document.querySelectorAll('body *')].map(el => {
          const r = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          return {tag: el.tagName, id: el.id, className: typeof el.className === 'string' ? el.className : '', left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), overflowX: style.overflowX};
        }).filter(el => el.right > viewport + 1 || el.left < -1).slice(0, 12);
        return {viewport, page, offenders};
      });
      expect(dimensions.page, 'horizontal overflow at ' + width + 'px; offenders=' + JSON.stringify(dimensions.offenders)).toBeLessThanOrEqual(dimensions.viewport + 1);
    });
  }

  test('both static pages load without uncaught page errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/control-panel/');
    await page.goto('/design-preview/');
    expect(errors, 'uncaught browser page errors').toEqual([]);
  });


  test('all control-panel buttons declare an explicit type and links have safe destinations', async ({ page }) => {
    await page.goto('/control-panel/');
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
    for (let i = 0; i < buttonCount; i++) {
      await expect(buttons.nth(i), `button ${i} must declare type`).toHaveAttribute('type', 'button');
    }

    const links = page.locator('a[href]');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const href = await link.getAttribute('href');
      expect(href?.trim(), `link ${i} must have a non-empty href`).toBeTruthy();
      if (href?.startsWith('#')) {
        await expect(page.locator(href), `missing in-page destination ${href}`).toHaveCount(1);
      }
      if (await link.getAttribute('target') === '_blank') {
        await expect(link).toHaveAttribute('rel', /noopener/);
      }
    }
  });

  test('keyboard focus is visible on the control panel', async ({ page }) => {
    await page.goto('/control-panel/');
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
