import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

const showButtonSelector = "[data-testid='show-button']";
const toggleThemeButtonSelector = "[data-testid='toggle-theme']";
const blanketSelector = "[data-testid='basic-blanket']";

describe('Snapshot Test', () => {
  it(`should match tinted blanket example with production`, async () => {
    const url = getExampleUrl(
      'design-system',
      'blanket',
      'basic-usage',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);

    await page.waitForSelector(showButtonSelector);
    const showBlanketButton = await page.$(showButtonSelector);
    await showBlanketButton?.click();

    await page.waitForSelector(blanketSelector);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
  it('should match tinted blanket example with production for dark theme', async () => {
    const url = getExampleUrl(
      'design-system',
      'blanket',
      'basic-usage',

      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);

    await page.waitForSelector(toggleThemeButtonSelector);
    const toggleThemeButton = await page.$(toggleThemeButtonSelector);
    await toggleThemeButton?.click();

    await page.waitForSelector(showButtonSelector);
    const showBlanketButton = await page.$(showButtonSelector);
    await showBlanketButton?.click();

    await page.waitForSelector(blanketSelector);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
