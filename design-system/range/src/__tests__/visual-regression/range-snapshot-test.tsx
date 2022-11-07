import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it.each(['light', 'dark', 'none'] as const)(
    'Basic example should match prod',
    async (mode) => {
      const url = getExampleUrl(
        'design-system',
        'range',
        'basic-example-uncontrolled',
        global.__BASEURL__,
        mode,
      );
      const { page } = global;
      await loadPage(page, url);
      const element = await page.waitForSelector('input[type="range"]');
      const image = await takeElementScreenShot(page, 'input[type="range"]');
      expect(image).toMatchProdImageSnapshot();
      await element?.focus();
      const elementImage = await element?.screenshot();
      expect(elementImage).toMatchProdImageSnapshot();
    },
  );

  it.each(['light', 'dark', 'none'] as const)(
    'disabled example should match prod',
    async (mode) => {
      const url = getExampleUrl(
        'design-system',
        'range',
        'disabled-display',
        global.__BASEURL__,
        mode,
      );
      const { page } = global;
      await loadPage(page, url);
      const image = await takeElementScreenShot(page, 'input[type="range"]');
      expect(image).toMatchProdImageSnapshot();
    },
  );

  it('Should display correctly with different values', async () => {
    const url = getExampleUrl(
      'design-system',
      'range',
      'different-values',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('[data-testid="container"]');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
