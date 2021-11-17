import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const pageSelector = '[data-testid="page"]';
const toggleSelector = '[data-testid="toggle"]';

describe('@atlaskit/page', () => {
  it('should display a basic example correctly', async () => {
    const url = getExampleUrl(
      'design-system',
      'page',
      'basic-usage',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    const image = await takeElementScreenShot(page, pageSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('should display navigation correctly', async () => {
    const url = getExampleUrl(
      'design-system',
      'page',
      'navigation-and-banner-integration',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('should display banners correctly', async () => {
    const url = getExampleUrl(
      'design-system',
      'page',
      'navigation-and-banner-integration',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url, { disabledSideEffects: { animation: true } });
    await page.click(toggleSelector);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('should display columns correctly', async () => {
    const url = getExampleUrl(
      'design-system',
      'page',
      'columns',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    const image = await takeElementScreenShot(page, pageSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('should display basic grid layouts correctly', async () => {
    const url = getExampleUrl(
      'design-system',
      'page',
      'layout-example',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    const image = await takeElementScreenShot(page, pageSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('should display fixed layout grids correctly', async () => {
    const url = getExampleUrl(
      'design-system',
      'page',
      'fixed-layout',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    const image = await takeElementScreenShot(page, pageSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('should display fluid layout grids correctly', async () => {
    const url = getExampleUrl(
      'design-system',
      'page',
      'fluid-layout',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    const image = await takeElementScreenShot(page, pageSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('should display grid spacing correctly', async () => {
    const url = getExampleUrl(
      'design-system',
      'page',
      'spacing-example',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    const image = await takeElementScreenShot(page, pageSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('should display nested grids correctly', async () => {
    const url = getExampleUrl(
      'design-system',
      'page',
      'nested-grid-example',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    const image = await takeElementScreenShot(page, pageSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('should display correctly on compressed viewports', async () => {
    const url = getExampleUrl(
      'design-system',
      'page',
      'layout-example',
      global.__BASEURL__,
    );
    const { page } = global;
    await page.setViewport({ width: 400, height: 400 });
    await loadPage(page, url);
    const image = await takeElementScreenShot(page, pageSelector);
    expect(image).toMatchProdImageSnapshot();
  });
});
