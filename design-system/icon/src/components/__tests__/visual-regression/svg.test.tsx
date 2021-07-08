import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('SVGPrimitive', () => {
  it('should match the primitve snapshots', async () => {
    const url = getExampleUrl(
      'design-system',
      'icon',
      'svg',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url);

    const element = await page.$('#svg');
    const image = await element?.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
