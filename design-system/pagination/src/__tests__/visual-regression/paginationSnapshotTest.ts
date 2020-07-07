import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

declare var global: any;

describe('Snapshot Test', () => {
  it('Basic should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'pagination',
      'basic#',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    // Wait for next & prev buttons (and their inner icons)
    await page.waitForSelector('button[aria-label="previous"][disabled]');
    await page.waitForSelector('button[aria-label="next"]:not([disabled])');
    await page.waitForSelector('span[role="presentation"] > svg');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
