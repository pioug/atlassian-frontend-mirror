import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it(`Progress-tracker example should match prod`, async () => {
    const url = getExampleUrl(
      'design-system',
      'progress-tracker',
      'progressTrackerDefault',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('div[data-testid="progress-tracker"]');
    await page.waitForSelector('.fade-exit-done');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
