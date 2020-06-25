import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

declare var global: any;

const selector = "[data-testid='link-item']";

describe('<LinkItem />', () => {
  it('should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'menu',
      'link-item',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url);
    await page.waitForSelector(selector);

    expect(
      await takeElementScreenShot(global.page, selector),
    ).toMatchProdImageSnapshot();
  });
});
