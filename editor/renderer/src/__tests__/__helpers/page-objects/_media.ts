import {
  PuppeteerPage,
  waitForElementCount,
  waitForLoadedImageElements,
} from '@atlaskit/visual-regression/helper';

export const selectors = {
  mediaErrorLoading: '.rich-media-item .wrapper',
  caption: '[data-testid="media-caption"]',
  captionPlaceholder: '[data-testid="caption-placeholder"]',
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
