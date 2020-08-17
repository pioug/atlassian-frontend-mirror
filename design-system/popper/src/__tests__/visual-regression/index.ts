import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('it should match visual snapshot for popper', async () => {
    const url = getExampleUrl(
      'design-system',
      'popper',
      'advanced-behaviors',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
