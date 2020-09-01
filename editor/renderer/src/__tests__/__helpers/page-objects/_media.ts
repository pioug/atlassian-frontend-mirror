import {
  waitForElementCount,
  waitForLoadedImageElements,
  PuppeteerPage,
} from '@atlaskit/visual-regression/helper';

export const selectors = {
  errorLoading: '.rich-media-item .wrapper',
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
  await waitForLoadedImageElements(page, 3000);
};
