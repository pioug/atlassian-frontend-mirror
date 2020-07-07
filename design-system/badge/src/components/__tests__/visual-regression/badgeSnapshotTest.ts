import {
  getExampleUrl,
  loadPage,
  waitForElementCount,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('badge basic example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'badge',
      'basic',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url);
    // Move the mouse away from the first button to avoid
    // the hover effect from triggering.
    await page.mouse.move(400, 0);

    // Wait for 10 list items
    await waitForElementCount(page, 'span[data-testid="badge"]', 9);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
