import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Appearance variations should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'section-message',
      'appearance-variations',

      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('section > div > span[role="presentation"]');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
