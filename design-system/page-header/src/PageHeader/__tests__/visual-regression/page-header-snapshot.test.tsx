import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Basic should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'page-header',
      'default',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);
    const element = await page.waitForSelector('[data-testid="page-header"]');
    const image = await element?.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
