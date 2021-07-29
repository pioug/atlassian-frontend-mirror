import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('VisuallyHidden basic example should match production example', async () => {
    const { page, __BASEURL__ } = global;
    const url = getExampleUrl(
      'design-system',
      'visually-hidden',
      'basic',
      __BASEURL__,
    );
    await loadPage(page, url);
    const element = await page.waitForSelector(
      '[data-testid="visually-hidden"]',
    );
    const image = await element?.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
