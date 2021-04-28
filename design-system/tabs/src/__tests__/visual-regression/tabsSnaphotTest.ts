import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const tabs = "[data-testid='default']";

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
