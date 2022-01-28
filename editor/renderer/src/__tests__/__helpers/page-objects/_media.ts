import {
  PuppeteerPage,
  waitForElementCount,
  waitForLoadedImageElements,
} from '@atlaskit/visual-regression/helper';

export const selectors = {
  mediaErrorLoading: '.rich-media-item .wrapper',
  caption: '[data-testid="media-caption"]',
  captionPlaceholder: '[data-testid="caption-placeholder"]',
  mediaInlineCardSelector: (status = 'loaded') =>
    `[data-testid="media-inline-card-${status.replace(/_/g, '-')}-view"]`,
};

export const waitForAllMedia = async (
  page: PuppeteerPage,
  mediaItemsNum: number,
) => {
  await waitForElementCount(
    page,
    '[data-testid="media-file-card-view"][data-test-status="complete"]',
    mediaItemsNum,
  );
  // FIXME These tests were flakey in the Puppeteer v10 Upgrade
  await waitForLoadedImageElements(page, 5000);
};

export const waitForLoadedMediaInlineCard = async (
  page: PuppeteerPage,
  status: 'loading' | 'loaded' | 'errored' = 'loaded',
) => {
  await page.waitForSelector(selectors.mediaInlineCardSelector(status), {
    visible: true,
    timeout: 10000,
  });
  if (status === 'loading') {
    await page.waitForSelector('.inline-loading-spinner');
  } else if (status === 'loaded') {
    await page.waitForSelector(
      '[data-testid="media-inline-card-file-type-icon"]',
      { timeout: 10000 },
    );
  }
};
