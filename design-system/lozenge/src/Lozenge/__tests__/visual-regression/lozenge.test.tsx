import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it.each(['dark', 'light', 'none'] as const)(
    'Lozenge (%s) basic example should match production example',
    async (theme) => {
      const url = getExampleUrl(
        'design-system',
        'lozenge',
        'basic',
        global.__BASEURL__,
        theme,
      );
      const { page } = global;
      await loadPage(page, url);
      await page.waitForSelector('span[data-testid="lozenge-subtle"]');
      await page.waitForSelector('span[data-testid="lozenge-bold"]');
      await page.waitForSelector('span[data-testid="lozenge-truncated"]');
      await page.waitForSelector(
        'span[data-testid="lozenge-truncated-custom-width"]',
      );
      await page.waitForSelector('span[data-testid="lozenge-defaults"]');
      const containerSelector = "[data-testid='test-container']";
      const image = await takeElementScreenShot(page, containerSelector);
      expect(image).toMatchProdImageSnapshot();
    },
  );

  it('Lozenge width handling examples should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'lozenge',
      'width-handling',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);

    await page.waitForSelector(
      'span[data-testid="lozenge-truncated-default-short"]',
    );
    await page.waitForSelector(
      'span[data-testid="lozenge-truncated-default-long"]',
    );
    await page.waitForSelector(
      'span[data-testid="lozenge-truncated-override-100"]',
    );
    await page.waitForSelector(
      'span[data-testid="lozenge-truncated-override-none"]',
    );
    await page.waitForSelector(
      'span[data-testid="lozenge-truncated-override-100%"]',
    );
    await page.waitForSelector(
      'span[data-testid="lozenge-truncated-override-90%"]',
    );
    await page.waitForSelector(
      'span[data-testid="lozenge-truncated-override-50%"]',
    );
    await page.waitForSelector(
      'span[data-testid="lozenge-truncated-by-maxWidth"]',
    );
    await page.waitForSelector(
      'span[data-testid="lozenge-truncated-by-container-size"]',
    );
    await page.waitForSelector(
      'span[data-testid="lozenge-truncated-by-container-pc"]',
    );

    const containerSelector = "[data-testid='test-container']";
    const image = await takeElementScreenShot(page, containerSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Lozenge with custom color should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'lozenge',
      'custom-color',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('span[data-testid="lozenge-custom-color1"]');
    await page.waitForSelector('span[data-testid="lozenge-custom-color2"]');
    const containerSelector = "[data-testid='test-container']";
    const image = await takeElementScreenShot(page, containerSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Lozenge with custom theme should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'lozenge',
      'with-custom-theme',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('span[data-testid="custom-lozenge-new"]');
    await page.waitForSelector('span[data-testid="custom-lozenge-default"]');
    const containerSelector = "[data-testid='test-container']";
    const image = await takeElementScreenShot(page, containerSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Lozenge baseline alignment should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'lozenge',
      'baseline-alignment',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector(
      'span[data-testid="lozenge-baseline-alignment-heading"]',
    );
    await page.waitForSelector(
      'span[data-testid="lozenge-baseline-alignment-11px"]',
    );
    await page.waitForSelector(
      'span[data-testid="lozenge-baseline-alignment-12px"]',
    );
    await page.waitForSelector(
      'span[data-testid="lozenge-baseline-alignment-14px"]',
    );
    const containerSelector = "[data-testid='test-container']";
    const image = await takeElementScreenShot(page, containerSelector);
    expect(image).toMatchProdImageSnapshot();
  });
});
