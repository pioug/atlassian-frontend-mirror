import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('line drawing', () => {
  it('should render a line on the specified edge (without gap)', async () => {
    const { page } = global;
    const url = getExampleUrl(
      'drag-and-drop',
      'indicator',
      'closest-edge',
      global.__BASEURL__,
      'light',
    );
    const selector = '[data-testid="layout--without-gap"]';

    await loadPage(page, url);

    await page.waitForSelector(selector);
    const image = await takeElementScreenShot(page, selector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('should render a line on the specified edge (with gap)', async () => {
    const { page } = global;
    const url = getExampleUrl(
      'drag-and-drop',
      'indicator',
      'closest-edge',
      global.__BASEURL__,
      'light',
    );
    const selector = '[data-testid="layout--with-gap"]';

    await loadPage(page, url);

    await page.waitForSelector(selector);
    const image = await takeElementScreenShot(page, selector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('should position the line using the specified gap', async () => {
    const { page } = global;
    const url = getExampleUrl(
      'drag-and-drop',
      'indicator',
      'gap',
      global.__BASEURL__,
      'light',
    );
    const selector = '[data-testid="layout"]';

    await loadPage(page, url);
    await page.waitForSelector(selector);

    const image = await takeElementScreenShot(page, selector);
    expect(image).toMatchProdImageSnapshot();
  });
});
