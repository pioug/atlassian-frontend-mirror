import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';
import { waitForBrowseMenuIcons } from '@atlaskit/editor-test-helpers/page-objects/element-browser';
import { retryUntilStablePosition } from '@atlaskit/editor-test-helpers/page-objects/toolbar';

describe('ElementBrowser', () => {
  // FIXME: This test was automatically skipped due to failure on 30/09/2022: https://product-fabric.atlassian.net/browse/ED-15752
  it.skip('should match ElementBrowser snapshot', async () => {
    const url = getExampleUrl(
      'editor',
      'editor-core',
      'element-browser',
      global.__BASEURL__,
    );
    const { page } = global;
    const selector = "[data-testid='element-browser']";

    await loadPage(page, url);
    await waitForBrowseMenuIcons(page);
    await retryUntilStablePosition(
      page,
      () => Promise.resolve(),
      `.ReactVirtualized__Collection`,
      1000,
    );

    const image = await takeElementScreenShot(page, selector);
    expect(image).toMatchProdImageSnapshot();
  });
});
