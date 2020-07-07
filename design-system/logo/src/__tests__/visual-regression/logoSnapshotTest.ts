import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Logo basic example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'logo',
      'basic',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('td > span[role="presentation"] > svg');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
