import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

export const selectors = {
  document: '.ak-renderer-document',
  container: '.ak-renderer-wrapper',
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
