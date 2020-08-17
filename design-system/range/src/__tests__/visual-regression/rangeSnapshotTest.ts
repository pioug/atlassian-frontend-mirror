import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it(`Basic example should match prod`, async () => {
    const url = getExampleUrl(
      'design-system',
      'range',
      'basic-example-uncontrolled',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('input[type="range"]');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
