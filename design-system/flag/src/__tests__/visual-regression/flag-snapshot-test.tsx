import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
    await page.setViewport({ width: 600, height: 400 });
  });

  it.each(['light', 'dark', 'none'] as const)(
    'Flag (%s) should match production example',
    async (theme) => {
      const url = getExampleUrl(
        'design-system',
        'flag',
        'all-flags',
        global.__BASEURL__,
        theme,
      );

      await loadPage(page, url);
      await page.waitForSelector('span[aria-label="Normal success"] > svg');
      await page.waitForSelector('span[aria-label="Error"] > svg');
      await page.waitForSelector('span[aria-label="Info"] > svg');
      await page.waitForSelector('span[aria-label="Success"] > svg');
      await page.waitForSelector('span[aria-label="Warning"] > svg');
      const image = await page.screenshot();

      expect(image).toMatchProdImageSnapshot();
    },
  );

  it('shows up the focus ring on the button', async () => {
    const url = getExampleUrl(
      'design-system',
      'flag',
      'all-flags',
      global.__BASEURL__,
    );

    await loadPage(page, url);
    await page.waitForSelector('span[aria-label="Normal success"]');

    // navigate to button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });

  it('shows up the focus ring on the entire flag container', async () => {
    const url = getExampleUrl(
      'design-system',
      'flag',
      'all-flags',
      global.__BASEURL__,
    );

    await loadPage(page, url);
    await page.waitForSelector('span[aria-label="Normal success"]');

    // navigate to button
    await page.keyboard.press('Tab');

    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });

  it('Flag with long title should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'flag',
      'flag-long-title',
      global.__BASEURL__,
    );

    await loadPage(page, url);
    await page.waitForSelector('span[aria-label="Success"]');
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });

  it('Flag with long content should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'flag',
      'flag-long-content',
      global.__BASEURL__,
    );

    await loadPage(page, url);
    await page.waitForSelector('span[aria-label="Success"]');
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });

  it('Flag with description and link should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'flag',
      'flag-with-a-description-containing-a-link',
      global.__BASEURL__,
    );

    await loadPage(page, url);
    await page.waitForSelector('span[aria-label="Success"]');
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });
});
