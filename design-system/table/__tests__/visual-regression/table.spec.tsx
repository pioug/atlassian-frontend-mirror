import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const selector = '[data-testid="table"]';

describe('@af/table', () => {
  it.each(['light', 'dark'] as const)(
    'Table basic example should match production example (%s)',
    async mode => {
      const { __BASEURL__, page } = global;
      const url = getExampleUrl(
        'design-system',
        'table',
        'basic',
        __BASEURL__,
        mode,
      );

      await loadPage(page, url);
      const image = await takeElementScreenShot(page, selector);

      expect(image).toMatchProdImageSnapshot();
    },
  );

  it('actions overlay should match production example', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl(
      'design-system',
      'table',
      'basic-with-actions',
      __BASEURL__,
    );

    await loadPage(page, url);
    const handle = await page.waitForSelector('input[type="checkbox"]');
    await handle?.click();
    const image = await takeElementScreenShot(page, selector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('multi direction header should match production example', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl(
      'design-system',
      'table',
      'multi-header',
      __BASEURL__,
    );

    await loadPage(page, url);
    const image = await takeElementScreenShot(page, selector);

    expect(image).toMatchProdImageSnapshot();
  });
});
