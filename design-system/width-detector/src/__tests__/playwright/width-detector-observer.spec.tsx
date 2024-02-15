import { expect, test } from '@af/integration-testing';

test('width-detector-observer.ts: resizes when sentinel is offscreen for offscreen=true', async ({
  page,
}) => {
  await page.visitExample('design-system', 'width-detector', 'scrolling');

  await page.locator('input[name="offscreen"]').check();
  await page.keyboard.press('PageDown');
  await page.setViewportSize({ width: 480, height: 1000 });

  await expect(page.locator('output[name="width"]')).toHaveText('480');
});
