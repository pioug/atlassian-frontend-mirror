import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

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
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
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
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
