import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
  takeElementScreenShot,
  waitForNoTooltip,
} from '@atlaskit/visual-regression/helper';
import {
  ToolbarMenuItem,
  toolbarMenuItemsSelectors,
} from '../../../../__tests__/__helpers/page-objects/_toolbar';
import {
  elementBrowserSelectors,
  waitForInsertMenuIcons,
} from '../../../../__tests__/__helpers/page-objects/_element-browser';
import { clickEditableContent } from '../../../../__tests__/__helpers/page-objects/_editor';

let page: PuppeteerPage;
let url: string;

describe('InsertMenu', () => {
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
    // Move mouse away to avoid the tooltip from the clicked button
    await page.mouse.move(0, 0);
    await waitForNoTooltip(page);
  });

  // FIXME: This test was automatically skipped due to failure on 9/5/2021: https://product-fabric.atlassian.net/browse/ED-13701
  it.skip('should match InsertMenu snapshot', async () => {
    await waitForInsertMenuIcons(page);
    const image = await takeElementScreenShot(
      page,
      elementBrowserSelectors.elementBrowser,
    );
    expect(image).toMatchProdImageSnapshot();
  });

  it('should correctly render view more element', async () => {
    // Wait for loaded SVG icon
    await page.waitForSelector(`${elementBrowserSelectors.viewMore} svg`);
    const image = await takeElementScreenShot(
      page,
      elementBrowserSelectors.viewMore,
    );
    expect(image).toMatchProdImageSnapshot();
  });
});
