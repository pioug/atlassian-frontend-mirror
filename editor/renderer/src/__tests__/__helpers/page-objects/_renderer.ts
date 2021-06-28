import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

export const selectors = {
  document: '.ak-renderer-document',
  container: '.ak-renderer-wrapper',
  sentinelBefore: '[data-sentinel="before"]',
  sentinelAfter: '[data-sentinel="after"]',
  editor: '.ProseMirror[contenteditable=true]',
};

export const setSelection = async (
  page: PuppeteerPage,
  from: { x: number; y: number },
  to: { x: number; y: number },
) => {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await animationFrame(page);
  await page.mouse.move(to.x, to.y);
  await animationFrame(page);
  await page.mouse.up();
  await animationFrame(page);
};

export async function animationFrame(page: any) {
  // Give browser time to render, waitForFunction by default fires on RAF.
  await page.waitForFunction('1 === 1');
}

export const addSentinels = async (page: Page) => {
  return page.evaluate((selector) => {
    const el = document.querySelector<HTMLElement>(selector);
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
  }, selectors.document);
};
