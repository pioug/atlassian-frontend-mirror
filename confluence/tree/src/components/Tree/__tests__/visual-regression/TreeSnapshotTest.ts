import { loadPage, getExampleUrl } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Static tree should match production example', async () => {
    const url = getExampleUrl(
      'confluence',
      'tree',
      'static-tree',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    // Wait for sidebar
    await page.waitForSelector(
      'div[class^="NavigationContainerNavigationWrapper"]',
    );
    // wait for nested page tree items
    await page.waitForSelector('span[class^="ItemParts__ContentWrapper"]');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
