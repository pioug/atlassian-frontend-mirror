import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';

export const waitForMedia = async (page: Page, status = 'complete') => {
  await page.waitForSelector(mediaCardSelector(status));
};

export const mediaCardSelector = (status = 'complete') =>
  `[data-testid="media-file-card-view"][data-test-status="${status}"]`;

/**
 * Verify that a specific number of file card is available on page
 */
export async function waitForAtLeastNumFileCards(page: Page, n: number) {
  await page.waitUntil(async () => {
    const fileCards = await page.$$(mediaCardSelector());
    return fileCards.length >= n;
  }, 'waitForAtLeastNumFileCards failed');

  return await page.$$(mediaCardSelector());
}

interface ResizeMediaSingleOptions {
  amount: number;
  units:
    | 'pixels' // Resize using px value (for resizing down - negative number)
    | 'percent'; // Resizing using % of initial size (for resizing down - negative value)
}

export interface ResizeMediaSingleResult {
  startWidth: number;
  endWidth: number;
}

export const resizeMediaSingle = async (
  page: Page,
  { amount, units }: ResizeMediaSingleOptions,
): Promise<ResizeMediaSingleResult> => {
  const mediaSingleSelector = '.mediaSingleView-content-wrap';
  await page.waitForSelector(mediaSingleSelector);
  const mediaSingleElement = await page.$(mediaSingleSelector);

  const mediaCardInMediaSingleSelector = `${mediaSingleSelector} [data-testid="media-card-view"]`;
  await page.waitForSelector(mediaCardInMediaSingleSelector);
  const cardViewElement = await page.$(mediaCardInMediaSingleSelector);

  await page.click(mediaCardInMediaSingleSelector);
  await page.waitForSelector(
    '[data-testid="media-card-view"] [data-test-selected]',
  );

  const startWidth = await cardViewElement.getSize('width');
  if (units === 'pixels') {
    await moveRightResizeHandler(page, mediaSingleElement, amount);
  } else if (units === 'percent' && amount >= -1 && amount <= 1) {
    const delta = Math.floor(startWidth * amount);
    await moveRightResizeHandler(page, mediaSingleElement, delta);
  } else {
    throw new Error(
      'resizeByPx or resizeByPt should be defined, where resizeByPt is between -1 and 1',
    );
  }

  let endWidth = await cardViewElement.getSize('width');
  await page.waitUntil(async () => {
    const latestWidth = await cardViewElement.getSize('width');
    const isTheSameAsPrevious = latestWidth === endWidth;
    endWidth = latestWidth;
    return isTheSameAsPrevious;
  });

  return {
    startWidth,
    endWidth,
  };
};

const moveRightResizeHandler = async (
  page: Page,
  mediaSingle: WebdriverIO.Element,
  offset: number,
) => {
  // TODO add data-testid for handlers
  const handleElement = await mediaSingle.$('.richMedia-resize-handle-right');
  await handleElement.waitForDisplayed();

  const location = await handleElement.getLocation();
  const size = await handleElement.getSize();

  const startX = location.x + size.width / 2;
  const startY = location.y + size.height / 2;

  return page.simulateWebViewUserDragAndDrop(
    startX,
    startY,
    startX + offset,
    startY,
    100,
  );
};
