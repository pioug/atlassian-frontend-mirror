import Page from '@atlaskit/webdriver-runner/wd-wrapper';

export async function waitForNumImages(page: Page, n: number) {
  await page.waitUntil(async () => {
    const images = await page.$$('.ProseMirror [data-testid="media-image"]');
    return images.length >= n;
  });

  return await page.$$('.ProseMirror [data-testid="media-image"]');
}
