import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
  waitForElementCount,
} from '@atlaskit/visual-regression/helper';

let page: PuppeteerPage;
let url: string;

beforeEach(async () => {
  url = getExampleUrl(
    'editor',
    'editor-core',
    'element-browser-modal-dialog',
    global.__BASEURL__,
  );
  page = global.page;
  await loadPage(page, url);
});

describe('ModalElementBrowser', () => {
  afterEach(async () => {
    await page.click("[data-testid='ModalElementBrowser__close-button']");
  });
  it('should match ModalElementBrowser snapshot for breakpoint: 768 x 1024', async () => {
    await shouldMatchSnapshotFor('ModalElementBrowser__example__open_button', {
      height: 1024,
      width: 768,
    });
  });
  it('should match ModalElementBrowser snapshot for breakpoint: 1920 x 1080', async () => {
    await shouldMatchSnapshotFor('ModalElementBrowser__example__open_button', {
      height: 1080,
      width: 1920,
    });
  });
});

describe('InlineElementBrowser', () => {
  it('should match InlineElementBrowser snapshot', async () => {
    await shouldMatchSnapshotFor(
      'InlineElementBrowser__example__open_button',
      undefined,
    );
    await page.keyboard.press('Escape');
  });
});

const shouldMatchSnapshotFor = async (
  testId:
    | 'ModalElementBrowser__example__open_button'
    | 'InlineElementBrowser__example__open_button',
  viewportConfig?: { height: number; width: number },
) => {
  if (viewportConfig) {
    const { height, width } = viewportConfig;
    await page.setViewport({ height, width });
  }

  await waitForElementCount(page, `[data-testid='${testId}']`, 1);

  await page.click(`[data-testid='${testId}']`);
  /**
   * using waitForLoadedImageElements fails the test in CI/CD with Evaluation failed: Error, so using page.waitFor(ms)
   * 'waitForLoadedImageElements' was used, but no images existed on the page within the time threshold.
   */
  await page.waitFor(5000);

  // Wait for the ElementBrowser to be loaded on page
  await waitForElementCount(page, "[data-testid='element-browser']", 1);
  await waitForElementCount(page, "[data-testid='element-items']", 1);
  const image = await page.screenshot();
  expect(image).toMatchProdImageSnapshot();
};
