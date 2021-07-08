import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Inline message basic should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'inline-message',
      'basic',

      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('span[data-testid=inline-message-icon] > svg');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
  it('Inline message different-types should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'inline-message',
      'different-types',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('span[data-testid=inline-message-icon] > svg');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
