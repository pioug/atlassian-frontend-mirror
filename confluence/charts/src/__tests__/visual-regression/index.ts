import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Charts basic example should match production example', async () => {
    const url = getExampleUrl(
      'confluence',
      'charts',
      'basic',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('[data-testid="charts"]');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
