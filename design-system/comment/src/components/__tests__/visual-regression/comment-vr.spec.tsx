import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
  waitForLoadedImageElements,
} from '@atlaskit/visual-regression/helper';

describe('@atlaskit/comment', () => {
  it.each(['dark', 'light', 'none', 'spacing'] as const)(
    'Comment example should match production example (%s)',
    async (mode) => {
      const url = getExampleUrl(
        'design-system',
        'comment',
        'example-comment',
        global.__BASEURL__,
        mode,
      );
      const { page } = global;
      await loadPage(page, url);

      // Wait for avatar to download
      await waitForLoadedImageElements(page, 3000);
      // Wait for lock icon and action buttons
      await page.waitForSelector('span[aria-hidden="true"] > svg');
      await page.waitForSelector('button[type="button"]');
      const element = await page.waitForSelector('[data-testid="comment"]');

      const image = await element?.screenshot();
      expect(image).toMatchProdImageSnapshot();
    },
  );

  it('Comment inline children example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'comment',
      'with-inline-children',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);

    // Wait for avatar to download
    await waitForLoadedImageElements(page, 3000);

    const image = await takeElementScreenShot(page, '[data-testid="comment"]');
    expect(image).toMatchProdImageSnapshot();
  });

  it('Highlighted comment should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'comment',
      'nested-comments',
      global.__BASEURL__,
      'light',
    );
    const { page } = global;
    await loadPage(page, url);

    // Wait for avatar to download
    await waitForLoadedImageElements(page, 3000);
    const image = await takeElementScreenShot(page, '[data-testid="nested"]');
    expect(image).toMatchProdImageSnapshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
