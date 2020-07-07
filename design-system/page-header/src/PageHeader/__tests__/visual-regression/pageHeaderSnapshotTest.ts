import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Basic should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'page-header',
      'BasicExample',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('a[href="#"][type="button"]');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
