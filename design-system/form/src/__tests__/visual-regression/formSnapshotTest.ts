import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

declare var global: any;

describe('Snapshot Test', () => {
  it('Create repository should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'form',
      'create-repository',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('#react-select-2-input');
    await page.waitForSelector('#create-repo-button');
    await page.waitForSelector('#repo-name-uid1');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
