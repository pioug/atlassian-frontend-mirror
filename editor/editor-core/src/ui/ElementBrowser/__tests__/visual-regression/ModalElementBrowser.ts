import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  ToolbarMenuItem,
  toolbarMenuItemsSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { clickEditableContent } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  elementBrowserSelectors,
  waitForBrowseMenuIcons,
  waitForInsertMenuIcons,
} from '@atlaskit/editor-test-helpers/page-objects/element-browser';

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

      await page.waitForSelector(
        toolbarMenuItemsSelectors[ToolbarMenuItem.insertMenu],
      );
      await page.setViewport({ width: 800, height: 600 });
      await page.click(toolbarMenuItemsSelectors[ToolbarMenuItem.insertMenu]);
      await page.waitForSelector(elementBrowserSelectors.elementBrowser);
      await page.click(elementBrowserSelectors.viewMore);
      // Move mouse away to avoid hover selection on the browse modal
      await page.mouse.move(0, 0);
      await waitForBrowseMenuIcons(page);
      await page.waitForSelector('[data-testid="element-items"] svg', {
        visible: true,
      });
    });
    it('should match ModalElementBrowser with help link snapshot', async () => {
      const element = await page.waitForSelector(
        elementBrowserSelectors.modalBrowser,
        {
          visible: true,
        },
      );
      if (!element) {
        throw new Error(
          `Element with selector ${elementBrowserSelectors.modalBrowser} does not exist to take a screenshot of`,
        );
      }
      const image = await element.screenshot({ captureBeyondViewport: false });
      expect(image).toMatchProdImageSnapshot();
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
