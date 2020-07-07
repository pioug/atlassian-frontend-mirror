import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

declare var global: any;

describe('Snapshot Test', () => {
  it('Textfield variations should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'textfield',
      'variations',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('input[disabled]');
    await page.waitForSelector('input[required]');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
