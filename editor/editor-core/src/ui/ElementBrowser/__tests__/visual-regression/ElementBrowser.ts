import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';
import { waitForBrowseMenuIcons } from '../../../../__tests__/__helpers/page-objects/_element-browser';
import { retryUntilStablePosition } from '../../../../__tests__/__helpers/page-objects/_toolbar';

describe('ElementBrowser', () => {
  it('should match ElementBrowser snapshot', async () => {
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
