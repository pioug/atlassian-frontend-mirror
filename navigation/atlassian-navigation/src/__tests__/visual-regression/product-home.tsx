import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

import { PRODUCT_HOME_BREAKPOINT } from '../../common/constants';

describe('<ProductHome />', () => {
  it('should correctly apply logoMaxWidth', async () => {
    const url = getExampleUrl(
      'navigation',
      'atlassian-navigation',
      'logo-max-width',
    );
    const selector = '[data-testid="product-home-header"]';

    const { page } = global;
    await page.setViewport({
      width: PRODUCT_HOME_BREAKPOINT,
      height: 800,
    });
    await loadPage(page, url);

    await page.waitForSelector(selector);
    const snapshot = await takeElementScreenShot(page, selector);
    expect(snapshot).toMatchProdImageSnapshot();
  });
});
