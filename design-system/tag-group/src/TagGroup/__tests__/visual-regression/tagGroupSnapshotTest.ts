import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Tag group basic should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'tag-group',
      'basic',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('div[color="standard"]');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
