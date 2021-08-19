import {
  compareScreenshot,
  getExampleUrl,
  loadPage,
} from '@atlaskit/visual-regression/helper';

async function waitForPageFrame(page) {
  await page.waitForSelector('div[data-testid="Navigation"]');
  await page.waitForSelector('div[data-testid="Content"]');
}

describe('Snapshot Test', () => {
  afterEach(async () => {
    const { page } = global;

    await page.evaluate(() => {
      localStorage.setItem(
        'ATLASKIT_NAVIGATION_UI_STATE',
        '{"isCollapsed":false,"productNavWidth":240}',
      );
    });
  });

  it('Should match product nav', async () => {
    const url = getExampleUrl(
      'design-system',
      'navigation-next',
      'navigation-with-switcher',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await waitForPageFrame(page);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot(); // Snapshot of product nav
  });

  it('Should match With Banner', async () => {
    const url = getExampleUrl(
      'design-system',
      'navigation-next',
      'with-banner',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    const pageContent = "[class$='LayoutContainer']";
    await page.waitForSelector(pageContent);
    await page.evaluate(
      (selector) => document.querySelector(selector).scrollBy(0, 500),
      pageContent,
    );
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  // FIXME These tests were flakey in the Puppeteer v10 Upgrade
  it.skip('Should match switcher', async () => {
    const url = getExampleUrl(
      'design-system',
      'navigation-next',
      'navigation-with-switcher',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url);

    // This matches all buttons, but will resolve the first one.
    const button = `[data-testid="NavigationItem"]`;
    await page.waitForSelector(button);
    await page.click(button);
    // Wait for list search which gets added to the DOM afterwards
    await page.waitForSelector('input[aria-autocomplete="list"]');

    const imageWithProjectSwitcher = await page.screenshot();
    expect(imageWithProjectSwitcher).toMatchProdImageSnapshot();
  });

  it('Should match Global nav', async () => {
    const url = getExampleUrl(
      'design-system',
      'navigation-next',
      'global-nav',
      global.__BASEURL__,
    );
    const { page } = global;
    await page.setViewport({ width: 1500, height: 700 });
    await loadPage(page, url);
    await page.waitForSelector('div[class*="PrimaryItemsList"]');

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should match Theming', async () => {
    const url = getExampleUrl(
      'design-system',
      'navigation-next',
      'theming',
      global.__BASEURL__,
    );
    const { page } = global;
    await page.setViewport({ width: 1500, height: 1700 });
    await loadPage(page, url);
    await page.waitForSelector('button[data-testid="NavigationItem"]');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should match dynamic theme styles', async () => {
    const url = getExampleUrl(
      'design-system',
      'navigation-next',
      'navigation-with-dynamic-theme-styles',
      global.__BASEURL__,
    );
    const { page } = global;
    const button = '#toggle-shadow';
    const shadow = 'div[data-testid="GlobalNavigation"] > div[class*="Shadow"]';

    await loadPage(page, url);
    // Ensure the shadow element exists
    await page.waitForSelector(shadow);
    await page.waitForSelector(button);
    await page.click(button);
    // Ensure the shadow element is removed
    await page.waitForFunction(
      (selector) => document.querySelector(selector) === null,
      shadow,
    );

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
    await page.click(button);
  });

  it('Should match item', async () => {
    const url = getExampleUrl(
      'design-system',
      'navigation-next',
      'item',
      global.__BASEURL__,
    );

    const { page } = global;
    await page.setViewport({ width: 900, height: 1350 });
    await loadPage(page, url);
    await page.waitForSelector('button[data-testid="NavigationItem"]');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should match collapsed nav screenshot', async () => {
    const url = getExampleUrl(
      'design-system',
      'navigation-next',
      'navigation-app',
      global.__BASEURL__,
    );
    const { page } = global;
    const button = '.ak-navigation-resize-button';

    await page.setViewport({ width: 750, height: 700 });
    await loadPage(page, url);
    await page.waitForSelector(button);
    await page.click(button);
    // Wait for collapsed state
    await page.waitForSelector(`${button}[aria-expanded="false"]`);

    const image = await page.screenshot();
    // Using percentage based tolerance instead of the default pixel based,
    // because the rounded edges of the navigation bar icons cause flaky results.
    await compareScreenshot(image);
  });
});
