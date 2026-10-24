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

  test('renders registry labels as text rather than executable HTML', async ({ page }) => {
    const payload = '<img src=x data-injected="true">';
    await page.route('**/core/registry.json', async (route) => {
      const response = await route.fetch();
      const registry = await response.json();
      const phase = registry.nodes.find((node: { level: string; id: string; name: string; notes?: string }) => node.level === 'A' && node.id === 'A0');
      if (!phase) throw new Error('A0 phase is missing from the registry fixture');
      phase.name = payload;
      phase.notes = payload;
      await route.fulfill({ response, json: registry });
    });

    await page.goto('/');
    await expect(page.locator('#ali-tree-list img[data-injected="true"]')).toHaveCount(0);
    await expect(page.getByText(payload, { exact: true }).first()).toBeVisible();
    await page.locator('.tree-select').filter({ hasText: 'A0' }).click();
    await expect(page.locator('#tree-crumbs img[data-injected="true"]')).toHaveCount(0);
    await expect(page.locator('#tree-crumbs')).toContainText(payload);
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
    const registryResponse = await page.request.get('/core/registry.json');
    expect(registryResponse.ok()).toBeTruthy();
    const registry = await registryResponse.json();
    const expectedFileCount = registry.nodes.filter((node: { level: string; parentId?: string; path?: string }) =>
      node.level === 'C' && node.parentId === 'A0/B2' && Boolean(node.path)
    ).length;
    await expect(page.locator('.file-card')).toHaveCount(expectedFileCount);
    await expect(page.getByText('tests/ali-new-a0.spec.ts', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: /فتح الملف الفعلي على GitHub/ }).first()).toHaveAttribute('href', /github.com\/AligasSRM\/ALI-NEW\/blob\/main\//);

    await page.getByRole('button', { name: '← رجوع' }).click();
    await expect(page.locator('.tree-select')).toHaveCount(6);
    await page.getByRole('button', { name: 'كل المراحل' }).click();
    await expect(page.locator('.tree-select')).toHaveCount(13);
  });

  test('incident console routes exact paths and exposes no write action', async ({ page }) => {
    await page.goto('/core/incidents.html');
    await expect(page.getByRole('heading', { name: 'CORE Incident Router' })).toBeVisible();
    await page.locator('#changed-paths').fill('tests/ali-new-a0.spec.ts');
    await page.getByRole('button', { name: 'تحليل الأدلة وتحديد المسار' }).click();
    await expect(page.getByText('ROUTED · HIGH')).toBeVisible();
    await expect(page.getByText('A0 → B2 → C0')).toBeVisible();
    await expect(page.getByRole('link', { name: 'فتح الملف الدقيق على GitHub ↗' })).toHaveAttribute('href', /tests\/ali-new-a0\.spec\.ts$/);
    await expect(page.getByText(/لم يتم تنفيذ أي تغيير/)).toHaveCount(0);
  });

  test('incident console correlates mocked run, commit paths, and failed step metadata', async ({ page }) => {
    const sha = 'a'.repeat(40);
    await page.route('https://api.github.com/**', async (route) => {
      const url = new URL(route.request().url());
      let body: unknown;
      if (url.pathname.endsWith('/actions/runs/12345/jobs')) {
        body = { jobs: [{ name: 'Browser acceptance', conclusion: 'failure', steps: [{ name: 'Run browser acceptance tests', conclusion: 'failure' }] }] };
      } else if (url.pathname.endsWith('/actions/runs/12345')) {
        body = { name: 'ALI-NEW Playwright Acceptance', status: 'completed', conclusion: 'failure', head_sha: sha, html_url: 'https://github.com/AligasSRM/ALI-NEW/actions/runs/12345' };
      } else if (url.pathname.endsWith('/commits/' + sha)) {
        body = { files: [{ filename: 'tests/ali-new-a0.spec.ts' }] };
      } else {
        await route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ message: 'Not found in test mock' }) });
        return;
      }
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
    });

    await page.goto('/core/incidents.html');
    await page.locator('#run-id').fill('12345');
    await page.getByRole('button', { name: 'تحليل الأدلة وتحديد المسار' }).click();
    await expect(page.getByText('ROUTED · HIGH')).toBeVisible();
    await expect(page.getByText('A0 → B2 → C0')).toBeVisible();
    await expect(page.getByText('Browser acceptance / Run browser acceptance tests')).toBeVisible();
  });

  test('planned sections do not pretend files exist', async ({ page }) => {
    await page.goto('/');
    await page.locator('.tree-select').filter({ hasText: /^A1\b/ }).click();
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

  test('switches all 25 locales, applies RTL/LTR, and restores the selected locale after reload', async ({ page }) => {
    const locales = [
      ['ar', 'rtl'], ['en', 'ltr'], ['es', 'ltr'], ['fr', 'ltr'], ['pt', 'ltr'],
      ['de', 'ltr'], ['it', 'ltr'], ['nl', 'ltr'], ['pl', 'ltr'], ['uk', 'ltr'],
      ['ru', 'ltr'], ['tr', 'ltr'], ['fa', 'rtl'], ['ur', 'rtl'], ['hi', 'ltr'],
      ['bn', 'ltr'], ['zh-CN', 'ltr'], ['zh-TW', 'ltr'], ['ja', 'ltr'], ['ko', 'ltr'],
      ['id', 'ltr'], ['ms', 'ltr'], ['vi', 'ltr'], ['th', 'ltr'], ['sw', 'ltr']
    ] as const;

    await page.goto('/design-preview/');
    await page.getByRole('button', { name: 'Yes, continue to preview' }).click();
    const selector = page.locator('#locale-select');
    await expect(selector.locator('option')).toHaveCount(25);

    for (const [locale, direction] of locales) {
      await selector.selectOption(locale);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('html')).toHaveAttribute('dir', direction);
      await expect(selector).toHaveValue(locale);
      expect(await page.evaluate(() => localStorage.getItem('ali-new-locale'))).toBe(locale);

      const loginLabel = (await page.locator('.nav-actions button[data-page="sign-in"]').innerText()).trim();
      const languageLabel = (await page.locator('label[for="locale-select"]').innerText()).trim();
      const exploreLabel = (await page.locator('.hero .actions button[data-page="home"]').innerText()).trim();
      const registrationLink = (await page.locator('button[data-page="sign-in"].text-button').innerText()).trim();
      const accountSignIn = (await page.locator('#page-account button[data-page="sign-in"]').innerText()).trim();
      const backToDiscovery = (await page.locator('#page-watch button[data-page="home"]').innerText()).trim();
      if (locale === 'en') {
        expect(loginLabel).toBe('Log in');
        expect(languageLabel).toBe('Language');
        expect(exploreLabel).toBe('Explore videos ↓');
        expect(registrationLink).toBe('Already registered? Log in');
        expect(accountSignIn).toBe('Sign in');
        expect(backToDiscovery).toBe('← Back to discovery');
      } else {
        expect(loginLabel).not.toBe('Log in');
        expect(languageLabel).not.toBe('Language');
        expect(exploreLabel).not.toBe('Explore videos ↓');
        expect(registrationLink).not.toBe('Already registered? Log in');
        expect(accountSignIn).not.toBe('Sign in');
        expect(backToDiscovery).not.toBe('← Back to discovery');
      }
    }

    await selector.selectOption('ar');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('#locale-select')).toHaveValue('ar');
    await expect(page.locator('.nav-actions button[data-page="sign-in"]')).toHaveText('تسجيل الدخول');
    await expect(page.locator('.hero .actions button[data-page="home"]')).toHaveText('استكشف الفيديوهات ↓');
    await expect(page.locator('button[data-page="sign-in"].text-button')).toHaveText('هل لديك حساب بالفعل؟ تسجيل الدخول');
    await expect(page.locator('#page-account button[data-page="sign-in"]')).toHaveText('تسجيل الدخول');
    await expect(page.locator('#page-watch button[data-page="home"]')).toHaveText('← العودة إلى الاكتشاف');
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
