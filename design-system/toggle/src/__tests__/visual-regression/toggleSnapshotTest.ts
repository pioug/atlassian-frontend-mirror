import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

declare var global: any;

describe('Snapshot Test', () => {
  it('Stateful example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'toggle',
      'stateful',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('input[type="checkbox"]');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
