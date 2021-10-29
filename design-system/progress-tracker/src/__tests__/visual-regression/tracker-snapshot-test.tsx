import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it(`Progress-tracker example should match prod`, async () => {
    const url = getExampleUrl(
      'design-system',
      'progress-tracker',
      'progress-tracker-default',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url, {
      disabledSideEffects: { animation: true, transition: true },
    });
    await page.waitForSelector('[data-testid="progress-tracker"]');
    await page.waitForSelector('.fade-exit-done');
    const image = await takeElementScreenShot(
      page,
      '[data-testid="progress-tracker"]',
    );
    expect(image).toMatchProdImageSnapshot();
  });
});
