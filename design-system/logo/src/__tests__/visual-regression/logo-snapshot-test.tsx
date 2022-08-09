import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
  waitForElementCount,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Logo basic example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'logo',
      'basic',
      global.__BASEURL__,
    );
    const { page } = global;
    page.setViewport({ width: 800, height: 650 });

    await loadPage(page, url);
    await page.waitForSelector('td > span[role="img"] > svg');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Logo color example should match production example', async () => {
    const selector = '[data-testid="color"]';
    const url = getExampleUrl(
      'design-system',
      'logo',
      'color',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await waitForElementCount(page, 'svg', 8);
    const image = await takeElementScreenShot(page, selector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Logo sizes example should match production example', async () => {
    const selector = '[data-testid="sizes"]';
    const url = getExampleUrl(
      'design-system',
      'logo',
      'sizes',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await waitForElementCount(page, 'svg', 15);
    const image = await takeElementScreenShot(page, selector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('should be resilient to inherited styles', async () => {
    const selector = '[data-testid="defensive-styling"]';
    const url = getExampleUrl(
      'design-system',
      'logo',
      'defensive-styling',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await waitForElementCount(page, 'svg', 2);
    const image = await takeElementScreenShot(page, selector);
    expect(image).toMatchProdImageSnapshot();
  });
});
