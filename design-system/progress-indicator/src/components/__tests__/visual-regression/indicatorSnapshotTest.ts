import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it(`Progress-indicator example should match prod`, async () => {
    const url = getExampleUrl(
      'design-system',
      'progress-indicator',
      'progressIndicatorDefault',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('button[aria-controls="panel1"]');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
