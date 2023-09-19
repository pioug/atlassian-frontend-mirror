// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  waitForBrowseMenuIcons,
  waitForInsertMenuIcons,
} from '@atlaskit/editor-test-helpers/page-objects/element-browser';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

let page: PuppeteerPage;
let url: string;

const getElementBrowserPage = async () => {
  url = getExampleUrl(
    'editor',
    'editor-plugin-quick-insert',
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
});

describe('InlineElementBrowser', () => {
  beforeEach(getElementBrowserPage);
  it('should match InlineElementBrowser snapshot', async () => {
    await shouldMatchSnapshotFor('InlineElementBrowser__example__open_button', {
      width: 800,
      height: 600,
    });
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

  await page.waitForSelector(`[data-testid='${testId}']`);
  await page.click(`[data-testid='${testId}']`);

  // Wait for the ElementBrowser to be loaded on page
  if (testId === 'ModalElementBrowser__example__open_button') {
    await waitForBrowseMenuIcons(page);
  } else if (testId === 'InlineElementBrowser__example__open_button') {
    await waitForInsertMenuIcons(page);
  }

  const image = await page.screenshot({ captureBeyondViewport: false });
  expect(image).toMatchProdImageSnapshot();
};
