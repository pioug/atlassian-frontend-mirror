import {
  getExampleUrl,
  loadPage,
  waitForElementCount,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Breadcrumbs-basic should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'breadcrumbs',
      'basic',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    // Wait for links to render
    await waitForElementCount(page, 'div > a[href]', 4);
    // Wait for link icons
    await waitForElementCount(page, 'a span > svg', 2);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
