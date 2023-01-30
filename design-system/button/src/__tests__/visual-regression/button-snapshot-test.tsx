import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
  waitForElementCount,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Button appearance should match snapshot', async () => {
    const url = getExampleUrl(
      'design-system',
      'button',
      'appearances',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    // Wait for page content
    await waitForElementCount(page, 'button[type="button"]', 21);
    await waitForElementCount(page, 'button[type="button"][disabled]', 7);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('focus should match snapshot', async () => {
    const url = getExampleUrl(
      'design-system',
      'button',
      'button-focus',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    // Wait for page content
    const image = await takeElementScreenShot(page, '[data-testid="button"]');
    expect(image).toMatchProdImageSnapshot();
  });

  it.each(Array.from({ length: 26 }).map((_, i) => i))(
    'other configurations should match snapshot %s',
    async (i) => {
      const url = getExampleUrl(
        'design-system',
        'button',
        'more-options',
        global.__BASEURL__,
        'light',
      );
      const { page } = global;
      await loadPage(page, url);
      // Wait for page content
      const image = await takeElementScreenShot(
        page,
        `[data-testid="combinations"] > :nth-child(${i + 1})`,
      );
      expect(image).toMatchProdImageSnapshot();
    },
  );

  it('Should not show a gap for empty/null items', async () => {
    const url = getExampleUrl(
      'design-system',
      'button',
      'button-group',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    // Wait for page content
    await waitForElementCount(page, 'button[type="button"]', 10);
    const image = await page.screenshot({
      clip: {
        x: 0,
        y: 0,
        width: 420,
        height: 180,
      },
    });
    expect(image).toMatchProdImageSnapshot();
  });
});
