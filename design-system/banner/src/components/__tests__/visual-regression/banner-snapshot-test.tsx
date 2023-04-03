import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
} from '@atlaskit/visual-regression/helper';

async function waitForBannerVisible(page: PuppeteerPage) {
  return page.waitForSelector('div[role="alert"]', {
    visible: true,
  });
}

describe('@atlaskit/banner visual regression', () => {
  it.each(['none', 'light', 'dark'] as const)(
    'Announcement banner example should match production example (tokens %s)',
    async (token) => {
      const url = getExampleUrl(
        'design-system',
        'banner',
        'announcement-banner',
        global.__BASEURL__,
        token,
      );
      const { page } = global;
      await loadPage(page, url);
      const element = await waitForBannerVisible(page);
      const image = await element?.screenshot();
      expect(image).toMatchProdImageSnapshot();
    },
  );

  it.each(['none', 'light', 'dark'] as const)(
    'basic-usage example should match production example (tokens %s)',
    async (token) => {
      const url = getExampleUrl(
        'design-system',
        'banner',
        'basic-usage',
        global.__BASEURL__,
        token,
      );
      const { page } = global;
      await loadPage(page, url);
      const element = await waitForBannerVisible(page);
      const image = await element?.screenshot();
      expect(image).toMatchProdImageSnapshot();
    },
  );

  it('error banner example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'banner',
      'error-banner',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    const element = await waitForBannerVisible(page);
    const image = await element?.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('open/close behavior should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'banner',
      'open-close-example',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);

    await page.waitForSelector('button');
    let image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();

    await page.click('button');
    await waitForBannerVisible(page);
    image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Announcement banner example with long text should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'banner',
      'announcement-banner-with-long-text',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    const element = await waitForBannerVisible(page);
    const image = await element?.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
