import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Basic should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'inline-dialog',
      'default',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    const selector = '[data-testid="inline-dialog"]';
    const element = await page.waitForSelector(selector);
    const image = await element?.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
