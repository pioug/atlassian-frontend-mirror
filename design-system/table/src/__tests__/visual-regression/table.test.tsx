import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const selector = '[data-testid="table"]';

describe('@atlaskit/table', () => {
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
  //Skipping because of failing master: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/3009772/steps/%7B39355714-9eff-4753-bdae-829e409e2ab1%7D/test-report
  it.skip('complex row should match production example', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl('design-system', 'table', 'row', __BASEURL__);

    await loadPage(page, url);
    const unselectedRowImage = await takeElementScreenShot(page, selector);
    expect(unselectedRowImage).toMatchProdImageSnapshot();

    const handle = await page.waitForSelector('input[type="checkbox"]');
    await handle?.click();
    const selectedRowImage = await takeElementScreenShot(page, selector);
    expect(selectedRowImage).toMatchProdImageSnapshot();
  });

  it('table with sortable columns should match production example', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl(
      'design-system',
      'table',
      'basic-with-actions',
      __BASEURL__,
    );

    await loadPage(page, url);
    const button = await page.waitForSelector(
      '[data-testid="column-name--button"]',
    );
    await button?.click();
    const image = await takeElementScreenShot(page, selector);
    expect(image).toMatchProdImageSnapshot();
  });
});
