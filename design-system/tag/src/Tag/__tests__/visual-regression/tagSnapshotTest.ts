import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Tag-basic should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'tag',
      'basicTag',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('div[color="standard"]');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
  it('Tag-colors should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'tag',
      'colors',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('div[color="standard"]');
    await page.waitForSelector('div[color="blue"]');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
