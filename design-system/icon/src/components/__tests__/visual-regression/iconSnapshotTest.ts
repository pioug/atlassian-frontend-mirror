import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Icon size example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'icon',
      'size-example',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitFor('span[aria-label="Icon 0"] > svg');
    await page.waitFor('span[aria-label="Icon 10"] > svg');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
