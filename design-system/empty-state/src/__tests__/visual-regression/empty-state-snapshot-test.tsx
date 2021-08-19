import {
  getExampleUrl,
  loadPage,
  waitForLoadedImageElements,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Basic should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'empty-state',
      'basic',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    // Wait for inlined image to render
    await waitForLoadedImageElements(page, 1000);
    const image = await page.screenshot();
    // Allow two percent tolerance for comparison
    expect(image).toMatchProdImageSnapshot({
      failureThreshold: '0.02',
      failureThresholdType: 'percent',
    });
  });
});
