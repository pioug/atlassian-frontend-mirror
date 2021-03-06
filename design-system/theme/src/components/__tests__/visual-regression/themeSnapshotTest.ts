import {
  getExampleUrl,
  loadPage,
  waitForElementCount,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Theme colors should match production example', async () => {
    const { page, __BASEURL__ } = global;
    const url = getExampleUrl('design-system', 'theme', 'colors', __BASEURL__);
    await loadPage(page, url);
    await waitForElementCount(page, 'div[data-testid="color-palette"]', 9);
    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchProdImageSnapshot();
  });

  describe('with emotion provider', () => {
    it('Components with light theme should match production example', async () => {
      const lightThemeDatePicker =
        "[data-testid='picker-1--datepicker--container']";

      const { page, __BASEURL__ } = global;
      const url = getExampleUrl(
        'design-system',
        'theme',
        'with-emotion-theme-provider',
        __BASEURL__,
      );
      await loadPage(page, url);

      await page.waitForSelector(lightThemeDatePicker);
      await page.click(lightThemeDatePicker);
      const image = await page.screenshot({ fullPage: true });

      expect(image).toMatchProdImageSnapshot();
    });

    it('Components with dark theme should match production example', async () => {
      const darkThemeDatePicker =
        "[data-testid='picker-2--datepicker--container']";

      const { page, __BASEURL__ } = global;
      const url = getExampleUrl(
        'design-system',
        'theme',
        'with-emotion-theme-provider',
        __BASEURL__,
      );
      await loadPage(page, url);

      await page.waitForSelector(darkThemeDatePicker);
      await page.click(darkThemeDatePicker);
      const image = await page.screenshot({ fullPage: true });

      expect(image).toMatchProdImageSnapshot();
    });

    it('Components with some other theme should match production example', async () => {
      const otherThemeDatePicker =
        "[data-testid='picker-3--datepicker--container']";

      const { page, __BASEURL__ } = global;
      const url = getExampleUrl(
        'design-system',
        'theme',
        'with-emotion-theme-provider',
        __BASEURL__,
      );
      await loadPage(page, url);

      await page.waitForSelector(otherThemeDatePicker);
      await page.click(otherThemeDatePicker);
      const image = await page.screenshot({ fullPage: true });

      expect(image).toMatchProdImageSnapshot();
    });
  });
});
