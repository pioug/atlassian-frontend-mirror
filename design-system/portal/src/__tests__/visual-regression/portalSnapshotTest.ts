import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it(`Portal stacking context should match prod`, async () => {
    const url = getExampleUrl(
      'design-system',
      'portal',
      'stacking-context',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('.atlaskit-portal');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
