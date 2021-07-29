import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Heading basic example should match production example', async () => {
    const { page, __BASEURL__ } = global;
    const url = getExampleUrl(
      'design-system',
      'focus-ring',
      'basic',
      __BASEURL__,
    );
    await loadPage(page, url);
    const element = await page.waitForSelector('[data-testid="outerDiv"]');
    const image = await element?.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
