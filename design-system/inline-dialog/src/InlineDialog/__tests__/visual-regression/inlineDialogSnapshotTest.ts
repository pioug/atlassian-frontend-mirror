import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

declare var global: any;

describe('Snapshot Test', () => {
  it('Basic should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'inline-dialog',
      'basic',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('button + div');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
