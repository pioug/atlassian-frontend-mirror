import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Flag-without-flagGroup should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'flag',
      'flag-without-flagGroup',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('span[aria-label="Info"]');
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });

  it('should match flags snapshot', async () => {
    const url = getExampleUrl(
      'design-system',
      'flag',
      'bold-flag-component',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('span[aria-label="Error icon"] > svg');
    await page.waitForSelector('span[aria-label="Info icon"] > svg');
    await page.waitForSelector('span[aria-label="Success"] > svg');
    await page.waitForSelector('span[aria-label="Warning icon"] > svg');
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });
});
