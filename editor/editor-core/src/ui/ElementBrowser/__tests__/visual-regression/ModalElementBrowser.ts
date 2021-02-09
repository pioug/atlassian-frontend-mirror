import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
  waitForElementCount,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';
import {
  ToolbarMenuItem,
  toolbarMenuItemsSelectors,
} from '../../../../__tests__/__helpers/page-objects/_toolbar';
import { clickEditableContent } from '../../../../__tests__/__helpers/page-objects/_editor';
import { elementBrowserSelectors } from '../../../../__tests__/__helpers/page-objects/_element-browser';

let page: PuppeteerPage;
let url: string;

const getElementBrowserPage = async () => {
  url = getExampleUrl(
    'editor',
    'editor-core',
    'element-browser-modal-dialog',
    global.__BASEURL__,
  );
  page = global.page;
  await loadPage(page, url);
};

describe('ModalElementBrowser', () => {
  describe('ModalElementBrowser without help link', () => {
    beforeEach(getElementBrowserPage);
    afterEach(async () => {
      await page.click("[data-testid='ModalElementBrowser__close-button']");
    });
    it('should match ModalElementBrowser snapshot for breakpoint: 768 x 1024', async () => {
      await shouldMatchSnapshotFor(
        'ModalElementBrowser__example__open_button',
        {
          height: 1024,
          width: 768,
        },
      );
    });
    it('should match ModalElementBrowser snapshot for breakpoint: 1920 x 1080', async () => {
      await shouldMatchSnapshotFor(
        'ModalElementBrowser__example__open_button',
        {
          height: 1080,
          width: 1920,
        },
      );
    });
  });
  describe('ModalElementBrowser with help link', () => {
    beforeEach(async () => {
      url = getExampleUrl(
        'editor',
        'editor-core',
        'full-page-with-x-extensions',
        global.__BASEURL__,
      );
      page = global.page;

      await loadPage(page, url);
      await clickEditableContent(page);
      await page.click(toolbarMenuItemsSelectors[ToolbarMenuItem.insertMenu]);
      await page.waitForSelector(elementBrowserSelectors.elementBrowser);
      await page.click(elementBrowserSelectors.viewMore);
    });
    it('should match ModalElementBrowser with help link snapshot', async () => {
      const image = await takeElementScreenShot(
        page,
        elementBrowserSelectors.modalBrowser,
      );
      expect(image).toMatchProdImageSnapshot();
    });
  });
});

describe('InlineElementBrowser', () => {
  beforeEach(getElementBrowserPage);
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
    | 'InlineElementBrowser__example__open_button'
    | 'ModalElementBrowser__help-button',
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
