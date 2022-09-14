import {
  getExampleUrl,
  loadPage,
  waitForElementCount,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Appearance should match snapshot', async () => {
    const url = getExampleUrl(
      'design-system',
      'button',
      'appearances',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    // Wait for page content
    await waitForElementCount(page, 'button[type="button"]', 21);
    await waitForElementCount(page, 'button[type="button"][disabled]', 7);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should not show a gap for empty/null items', async () => {
    const url = getExampleUrl(
      'design-system',
      'button',
      'button-group',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    // Wait for page content
    await waitForElementCount(page, 'button[type="button"]', 7);
    const image = await page.screenshot({
      clip: {
        x: 0,
        y: 0,
        width: 420,
        height: 110,
      },
    });
    expect(image).toMatchProdImageSnapshot();
  });
});
