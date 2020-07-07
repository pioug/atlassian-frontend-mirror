import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it(`Basic example should match prod`, async () => {
    const url = getExampleUrl(
      'design-system',
      'size-detector',
      'basic',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('[class*="sc-0-basic__ResultBox"]');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
