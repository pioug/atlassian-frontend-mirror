import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it(`Basic usage example should match prod`, async () => {
    const url = getExampleUrl(
      'design-system',
      'radio',
      'radioDefault',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('input[name="color"]');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
