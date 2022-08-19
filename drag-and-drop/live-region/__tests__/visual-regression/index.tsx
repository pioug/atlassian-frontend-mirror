import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('live region', () => {
  it('should be visually hidden', async () => {
    const url = getExampleUrl(
      'drag-and-drop',
      'live-region',
      'basic',
      global.__BASEURL__,
      'light',
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('[role="alert"]');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
