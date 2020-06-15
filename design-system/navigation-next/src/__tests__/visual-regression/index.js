import {
  compareScreenshot,
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

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

  it('Basic navigation next should match prod', async () => {
    const url = getExampleUrl(
      'design-system',
      'navigation-next',
      'navigation-app',
      global.__BASEURL__,
    );
    const index = getExampleUrl('design-system', global.__BASEURL__);
    const { page } = global;
    await page.goto(index);
    await page.evaluate(() => {
      localStorage.setItem(
        'ATLASKIT_NAVIGATION_UI_STATE',
        '{"isCollapsed":false,"productNavWidth":240}',
      );
    });

    await page.goto(url);
    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should match product nav', async () => {
    const url = getExampleUrl(
      'design-system',
      'navigation-next',
      'navigation-with-switcher',
      global.__BASEURL__,
    );
    const { page } = global;
    await page.goto(url);
    const image = await takeScreenShot(page, url);
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
    const pageContent = "[class$='LayoutContainer']";
    await page.waitForSelector(pageContent);
    await page.evaluate(
      selector => document.querySelector(selector).scrollBy(0, 500),
      pageContent,
    );
    const image = await takeScreenShot(page, url);
    expect(image).toMatchProdImageSnapshot();
  });

  xit('Should match switcher', async () => {
    const url = getExampleUrl(
      'design-system',
      'navigation-next',
      'navigation-with-switcher',
      global.__BASEURL__,
    );
    const { page } = global;
    const button = `[data-webdriver-test-key="container-header"] > div > button`;
    await page.goto(url);
    await page.waitFor(300);

    await page.waitForSelector(button);
    await page.click(button);
    await page.waitFor(300);

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
    await page.goto(url);
    await page.setViewport({ width: 1500, height: 700 });

    const image = await takeScreenShot(page, url);
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
    await page.goto(url);
    await page.setViewport({ width: 1500, height: 1700 });
    const image = await takeScreenShot(page, url);
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
    // TODO: Fix button selector
    const button = '#toggle-shadow';

    await page.goto(url);
    await page.waitForSelector(button);
    await page.click(button);

    const image = await takeScreenShot(page, url);
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
    await page.goto(url);
    await page.setViewport({ width: 900, height: 1350 });
    const image = await takeScreenShot(page, url);
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
    // TODO: Fix button selector
    const button = "[data-testid='Navigation'] > div:last-of-type button";

    await page.goto(url);
    await page.setViewport({ width: 750, height: 700 });
    await page.waitForSelector(button);
    await page.click(button);
    await page.waitFor(300);

    const image = await takeScreenShot(page, url);
    // Using percentage based tolerance instead of the default pixel based,
    // because the rounded edges of the navigation bar icons cause flaky results.
    await compareScreenshot(image);
    await page.click(button);
  });
});
