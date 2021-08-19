import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const tabs = "[data-testid='default']";
const tab = `div[aria-controls="default-2-tab"]`;

describe('Snapshot Test', () => {
  it(`Basic example should match prod`, async () => {
    const url = getExampleUrl(
      'design-system',
      'tabs',
      'defaultTabs',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('div[role="tablist"]');
    await page.waitForSelector('div[role="tabpanel"]');
    const tabsImage = await takeElementScreenShot(page, tabs);
    expect(tabsImage).toMatchProdImageSnapshot();
  });

  it(`On hovered tab should match prod example`, async () => {
    const url = getExampleUrl(
      'design-system',
      'tabs',
      'defaultTabs',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector(tab);
    await page.hover(tab);
    const tabsImage = await takeElementScreenShot(page, tabs);
    expect(tabsImage).toMatchProdImageSnapshot();
  });

  it(`On hovered tab in light mode should match prod example`, async () => {
    const url = getExampleUrl(
      'design-system',
      'tabs',
      'defaultTabs',
      global.__BASEURL__,
      'light',
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector(tab);
    await page.hover(tab);
    const tabsImage = await takeElementScreenShot(page, tabs);
    expect(tabsImage).toMatchProdImageSnapshot();
  });

  it(`Content should be visible only on the focused tab`, async () => {
    const url = getExampleUrl(
      'design-system',
      'tabs',
      'defaultTabs',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('div[role="tablist"]');
    await page.waitForSelector('div[role="tabpanel"]');
    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    const tabsImage = await takeElementScreenShot(page, tabs);
    expect(tabsImage).toMatchProdImageSnapshot();
  });

  it(`Tab panel should have correct focus ring styles`, async () => {
    const url = getExampleUrl(
      'design-system',
      'tabs',
      'defaultTabs',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('div[role="tablist"]');
    await page.waitForSelector('div[role="tabpanel"]');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const tabsImage = await takeElementScreenShot(page, tabs);
    expect(tabsImage).toMatchProdImageSnapshot();
  });
});
