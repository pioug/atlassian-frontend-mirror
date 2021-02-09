import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';
import {
  ToolbarMenuItem,
  toolbarMenuItemsSelectors,
} from '../../../../__tests__/__helpers/page-objects/_toolbar';
import { elementBrowserSelectors } from '../../../../__tests__/__helpers/page-objects/_element-browser';
import { clickEditableContent } from '../../../../__tests__/__helpers/page-objects/_editor';

let page: PuppeteerPage;
let url: string;

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
});

describe('InsertMenu', () => {
  it('should match InsertMenu snapshot', async () => {
    const image = await takeElementScreenShot(
      page,
      elementBrowserSelectors.elementBrowser,
    );
    expect(image).toMatchProdImageSnapshot();
  });

  it('should correctly render view more element', async () => {
    const image = await takeElementScreenShot(
      page,
      elementBrowserSelectors.viewMore,
    );
    expect(image).toMatchProdImageSnapshot();
  });
});
