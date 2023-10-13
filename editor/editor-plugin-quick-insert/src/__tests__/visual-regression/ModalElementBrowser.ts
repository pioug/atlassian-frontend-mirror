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
    // FIXME: flaky test - failed on https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/1792686/steps/%7B8ddb5459-2fd0-477c-bd38-15eef630fb73%7D/test-report
    it.skip('should match ModalElementBrowser snapshot for breakpoint: 768 x 1024', async () => {
      await shouldMatchSnapshotFor(
        'ModalElementBrowser__example__open_button',
        {
          height: 1024,
          width: 768,
        },
      );
    });
    // FIXME: flaky test - failed on https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/1793378/steps/%7Beb84d54b-1213-43d5-ae98-ebde42d5469d%7D/test-report
    it.skip('should match ModalElementBrowser snapshot for breakpoint: 1920 x 1080', async () => {
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
  // FIXME: flaky test - failed on https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/1794142/steps/%7B74783f8e-d735-47d5-bc42-54adb6ea6c43%7D/test-report
  it.skip('should match InlineElementBrowser snapshot', async () => {
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
