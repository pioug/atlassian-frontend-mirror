// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { clickEditableContent } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  elementBrowserSelectors,
  waitForBrowseMenuIcons,
} from '@atlaskit/editor-test-helpers/page-objects/element-browser';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  ToolbarMenuItem,
  toolbarMenuItemsSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

let page: PuppeteerPage;
let url: string;

describe('ModalElementBrowser', () => {
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
    // TODO: Fix and restore test - was failing on master
    // See https://product-fabric.atlassian.net/jira/servicedesk/projects/DTR/queues/issue/DTR-1948
    it.skip('should match ModalElementBrowser with help link snapshot', async () => {
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
