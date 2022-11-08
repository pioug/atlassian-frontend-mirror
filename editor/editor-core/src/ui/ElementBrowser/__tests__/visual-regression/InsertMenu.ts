import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
  waitForNoTooltip,
} from '@atlaskit/visual-regression/helper';
import {
  ToolbarMenuItem,
  toolbarMenuItemsSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
import {
  elementBrowserSelectors,
  waitForInsertMenuIcons,
} from '@atlaskit/editor-test-helpers/page-objects/element-browser';
import {
  clickEditableContent,
  animationFrame,
} from '@atlaskit/editor-test-helpers/page-objects/editor';
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
    // Move mouse away to avoid the tooltip from the clicked button
    await page.mouse.move(0, 0);
    await animationFrame(page);
    await waitForNoTooltip(page);
  });

  it('should match the InsertMenu item snapshot', async () => {
    await animationFrame(page);
    await waitForInsertMenuIcons(page);
    await animationFrame(page);
    await waitForNoTooltip(page);
    await snapshot(
      page,
      { tolerance: 0.0005 },
      elementBrowserSelectors.elementBrowser,
      {
        captureBeyondViewport: false,
      },
    );
  });

  it('should correctly render the View More menu item', async () => {
    await animationFrame(page);
    // Wait for loaded SVG icon
    await page.waitForSelector(`${elementBrowserSelectors.viewMore} svg`);
    await animationFrame(page);
    await snapshot(
      page,
      { tolerance: 0.0005 },
      elementBrowserSelectors.viewMore,
      {
        captureBeyondViewport: false,
      },
    );
  });
});
