import {
  getExampleUrl,
  loadPage,
  waitForElementCount,
} from '@atlaskit/visual-regression/helper';

describe('Custom Badge Snapshot Test', () => {
  it('badge customization example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'badge',
      'customization',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url);

    // Wait for item
    await waitForElementCount(page, 'span[data-testid="badge"]', 8);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
