import {
  getExampleUrl,
  loadPage,
  waitForLoadedBackgroundImages,
} from '@atlaskit/visual-regression/helper';

declare var global: any;

describe('Snapshot Test', () => {
  it('Comment example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'comment',
      'example-comment',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);

    // Wait for avatar to download
    await waitForLoadedBackgroundImages(page, 'span[role="img"]');
    // Wait for lock icon and action buttons
    await page.waitForSelector('span[role="presentation"] > svg');
    await page.waitForSelector('button[type="button"]');

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
