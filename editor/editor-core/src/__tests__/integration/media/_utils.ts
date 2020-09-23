import Page from '@atlaskit/webdriver-runner/wd-wrapper';

export async function waitForNumImages(page: Page, n: number) {
  await page.waitUntil(async () => {
    const images = await page.$$('.ProseMirror [data-testid="media-image"]');
    return images.length >= n;
  }, 'waitForNumImages failed');

  return await page.$$('.ProseMirror [data-testid="media-image"]');
}

export async function waitForAtLeastNumFileCards(page: Page, n: number) {
  await page.waitUntil(async () => {
    const fileCards = await page.$$(
      '.ProseMirror [data-testid="media-file-card-view"][data-test-status="complete"]',
    );
    return fileCards.length >= n;
  }, 'waitForAtLeastNumFileCards failed');

  return await page.$$(
    '.ProseMirror [data-testid="media-file-card-view"][data-test-status="complete"]',
  );
}
