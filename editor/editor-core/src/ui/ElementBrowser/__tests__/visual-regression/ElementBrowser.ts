import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  elementBrowserSelectors,
  waitForBrowseMenuIcons,
} from '@atlaskit/editor-test-helpers/page-objects/element-browser';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { retryUntilStablePosition } from '@atlaskit/editor-test-helpers/page-objects/toolbar';

describe('ElementBrowser', () => {
  // ED-20360
  it.skip('should match ElementBrowser snapshot', async () => {
    const url = getExampleUrl(
      'editor',
      'editor-core',
      'element-browser',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url);
    await page.waitForSelector(elementBrowserSelectors.elementItems);
    await page.waitForSelector(elementBrowserSelectors.listItems);
    await waitForBrowseMenuIcons(page);
    const elementItems = await page.$(elementBrowserSelectors.elementItems);
    const listItems = await page.$(elementBrowserSelectors.listItems);

    await retryUntilStablePosition(
      page,
      () => Promise.resolve(),
      `.ReactVirtualized__Collection`,
      1000,
    );

    expect(elementItems).not.toBeNull();
    expect(listItems).not.toBeNull();
  });
});
