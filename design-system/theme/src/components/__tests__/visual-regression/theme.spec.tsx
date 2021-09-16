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
    const example = await page.waitForSelector('#colors');
    const image = await example?.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('AKProvider (light) should provide compatibility between styled-components or @emotion', async () => {
    const { page, __BASEURL__ } = global;
    const url = getExampleUrl(
      'design-system',
      'theme',
      'atlaskit-theme-provider',
      __BASEURL__,
    );
    await loadPage(page, url);
    const element = await page.waitForSelector('[data-testid="provider"]');
    const image = await element?.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('AKProvider (dark) should provide compatibility between styled-components or @emotion', async () => {
    const { page, __BASEURL__ } = global;
    const url = getExampleUrl(
      'design-system',
      'theme',
      'atlaskit-theme-provider',
      __BASEURL__,
    );
    await loadPage(page, url);
    const themeToggle = await page.waitForSelector(
      '[data-testid="themeSwitch"',
    );
    await themeToggle?.click();
    const element = await page.waitForSelector('[data-testid="provider"]');
    const image = await element?.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
