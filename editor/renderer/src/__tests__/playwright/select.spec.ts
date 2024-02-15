import type { Page } from '@af/integration-testing';

import { expect, rendererTestCase as test } from './not-libra';
import { adf } from './select.spec.ts-fixtures';

const RENDERER_CONTAINER = '.ak-renderer-document';

const addSentinels = async (page: Page) => {
  await page.evaluate(() => {
    const RENDERER_CONTAINER = '.ak-renderer-document';
    const el = document.querySelector<HTMLElement>(RENDERER_CONTAINER);
    const beforeSentinel = document.createElement('div');
    beforeSentinel.textContent = 'Α';
    beforeSentinel.dataset.sentinel = 'before';

    const afterSentinel = document.createElement('div');
    afterSentinel.textContent = 'Ω';
    afterSentinel.dataset.sentinel = 'after';

    el?.parentElement?.insertBefore(beforeSentinel, el);
    el?.parentElement?.appendChild(afterSentinel);

    const selection = window.getSelection();
    selection?.removeAllRanges();
  });
};

const shortcutSelectAll =
  process.platform === 'darwin' ? 'Meta+a' : 'Control+a';
test.use({
  adf,
  rendererProps: {
    allowSelectAllTrap: true,
  },
});

test('select.ts: Mod+a does not select before', async ({ renderer }) => {
  await addSentinels(renderer.page);

  const rendererLocator = renderer.page.locator(RENDERER_CONTAINER);
  await rendererLocator.click();
  await renderer.page.keyboard.press(shortcutSelectAll);

  const beforeSelected = await renderer.page.evaluate(() => {
    const el = document.querySelector('[data-sentinel="before"]');
    const range = window.getSelection()?.getRangeAt(0);
    return el ? range?.intersectsNode(el) : null;
  });

  expect(beforeSelected).toBe(false);
});

test('select.ts: Mod+a does not select after', async ({ renderer }) => {
  await addSentinels(renderer.page);

  const rendererLocator = renderer.page.locator(RENDERER_CONTAINER);
  await rendererLocator.click();
  await renderer.page.keyboard.press(shortcutSelectAll);

  const afterSelected = await renderer.page.evaluate(() => {
    const el = document.querySelector('[data-sentinel="after"]');
    const range = window.getSelection()?.getRangeAt(0);
    return el ? range?.intersectsNode(el) : null;
  });
  expect(afterSelected).toBe(false);
});

test('select.ts: Mod+a selects renderer', async ({ renderer }) => {
  const rendererLocator = renderer.page.locator(RENDERER_CONTAINER);
  await rendererLocator.click();
  await renderer.page.keyboard.press(shortcutSelectAll);

  await renderer.page.keyboard.press(shortcutSelectAll);
  const rendererSelected = await renderer.page.evaluate(() => {
    const RENDERER_CONTAINER = '.ak-renderer-document';
    const el = document.querySelector(RENDERER_CONTAINER);
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    return el ? range?.intersectsNode(el) : null;
  });

  expect(rendererSelected).toBe(true);
});

test('select.ts: Mod+a fires selectAllCaught event', async ({ renderer }) => {
  const rendererLocator = renderer.page.locator(RENDERER_CONTAINER);
  await rendererLocator.click();
  await renderer.page.keyboard.press(shortcutSelectAll);
  const events = await renderer.getAnalyticsEvents();
  expect(events).toContainEqual(
    expect.objectContaining({
      action: 'selectAllCaught',
      actionSubject: 'renderer',
    }),
  );
});

test('select.ts: Mod+a twice selects before', async ({ renderer }) => {
  await addSentinels(renderer.page);

  const rendererLocator = renderer.page.locator(RENDERER_CONTAINER);
  await rendererLocator.click();
  await renderer.page.keyboard.press(shortcutSelectAll);
  await renderer.page.keyboard.press(shortcutSelectAll);
  const beforeSelected = await renderer.page.evaluate(() => {
    const el = document.querySelector('[data-sentinel="before"]');
    const range = window.getSelection()?.getRangeAt(0);
    return el ? range?.intersectsNode(el) : null;
  });
  expect(beforeSelected).toBe(true);
});

test('select.ts: Mod+a twice selects after', async ({ renderer }) => {
  await addSentinels(renderer.page);

  const rendererLocator = renderer.page.locator(RENDERER_CONTAINER);
  await rendererLocator.click();
  await renderer.page.keyboard.press(shortcutSelectAll);
  await renderer.page.keyboard.press(shortcutSelectAll);
  const afterSelected = await renderer.page.evaluate(() => {
    const el = document.querySelector('[data-sentinel="after"]');
    const range = window.getSelection()?.getRangeAt(0);
    return el ? range?.intersectsNode(el) : null;
  });
  expect(afterSelected).toBe(true);
});

test('select.ts: Mod+a twice fires selectAllEscaped event', async ({
  renderer,
}) => {
  await addSentinels(renderer.page);

  const rendererLocator = renderer.page.locator(RENDERER_CONTAINER);
  await rendererLocator.click();
  await renderer.page.keyboard.press(shortcutSelectAll);
  await renderer.page.keyboard.press(shortcutSelectAll);

  const events = await renderer.getAnalyticsEvents();
  expect(events).toContainEqual(
    expect.objectContaining({
      action: 'selectAllEscaped',
      actionSubject: 'renderer',
    }),
  );
});

test('select.ts: Mod+a twice, click, Mod+a does not select before', async ({
  renderer,
}) => {
  await addSentinels(renderer.page);

  const rendererLocator = renderer.page.locator(RENDERER_CONTAINER);
  await rendererLocator.click();
  await renderer.page.keyboard.press(shortcutSelectAll);
  await renderer.page.keyboard.press(shortcutSelectAll);

  await rendererLocator.click();
  await renderer.page.keyboard.press(shortcutSelectAll);
  const afterSelected = await renderer.page.evaluate(() => {
    const el = document.querySelector('[data-sentinel="before"]');
    const range = window.getSelection()?.getRangeAt(0);
    return el ? range?.intersectsNode(el) : null;
  });
  expect(afterSelected).toBe(false);
});

test('select.ts: Mod+a twice, click, Mod+a does not select after', async ({
  renderer,
}) => {
  await addSentinels(renderer.page);

  const rendererLocator = renderer.page.locator(RENDERER_CONTAINER);
  await rendererLocator.click();
  await renderer.page.keyboard.press(shortcutSelectAll);
  await renderer.page.keyboard.press(shortcutSelectAll);

  await rendererLocator.click();
  await renderer.page.keyboard.press(shortcutSelectAll);
  const afterSelected = await renderer.page.evaluate(() => {
    const el = document.querySelector('[data-sentinel="after"]');
    const range = window.getSelection()?.getRangeAt(0);
    return el ? range?.intersectsNode(el) : null;
  });
  expect(afterSelected).toBe(false);
});

test('select.ts: Mod+a twice, click, Mod+a selects renderer', async ({
  renderer,
}) => {
  await addSentinels(renderer.page);

  const rendererLocator = renderer.page.locator(RENDERER_CONTAINER);
  await rendererLocator.click();
  await renderer.page.keyboard.press(shortcutSelectAll);
  await renderer.page.keyboard.press(shortcutSelectAll);

  await rendererLocator.click();
  await renderer.page.keyboard.press(shortcutSelectAll);
  const rendererSelected = await renderer.page.evaluate(() => {
    const RENDERER_CONTAINER = '.ak-renderer-document';
    const el = document.querySelector(RENDERER_CONTAINER);
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    return el ? range?.intersectsNode(el) : null;
  });
  expect(rendererSelected).toBe(true);
});

const shortcutSearchTabs =
  process.platform === 'darwin' ? 'Meta+Shift+a' : 'Control+Shift+a';

test("select.ts: Mod+Shift+a doesn't select all content", async ({
  renderer,
}) => {
  const rendererLocator = renderer.page.locator(RENDERER_CONTAINER);
  await rendererLocator.click();
  await renderer.page.keyboard.press(shortcutSearchTabs);
  const events = await renderer.getAnalyticsEvents();
  expect(events).not.toContainEqual(
    expect.objectContaining({
      action: 'selectAllCaught',
      actionSubject: 'renderer',
    }),
  );
});
