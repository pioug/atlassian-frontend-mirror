import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  ToolbarMenuItem,
  toolbarMenuItemsSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  elementBrowserSelectors,
  waitForInsertMenuIcons,
} from '@atlaskit/editor-test-helpers/page-objects/element-browser';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickEditableContent,
  animationFrame,
} from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { snapshot } from '@atlaskit/editor-test-helpers/vr-utils/base-utils';

let page: PuppeteerPage;
let url: string;

describe('InsertMenu Button', () => {
  beforeEach(async () => {
    url = getExampleUrl(
      'editor',
      'editor-core',
      'full-page-with-x-extensions',
      global.__BASEURL__,
    );
    page = global.page;
    await loadPage(page, url);
    await animationFrame(page);
    await clickEditableContent(page);
    await animationFrame(page);
    await page.click(toolbarMenuItemsSelectors[ToolbarMenuItem.insertMenu]);
    await page.waitForSelector(elementBrowserSelectors.elementBrowser);
    await animationFrame(page);
  });

  // ED-20360
  it.skip('should match the InsertMenu item snapshot', async () => {
    await animationFrame(page);
    await waitForInsertMenuIcons(page);
    // Wait for loaded SVG icon
    await page.waitForSelector(`${elementBrowserSelectors.viewMore} svg`);
    await animationFrame(page);
    await snapshot(
      page,
      { tolerance: 0.0005 },
      elementBrowserSelectors.elementBrowser,
      {
        captureBeyondViewport: false,
      },
    );
  });
});
