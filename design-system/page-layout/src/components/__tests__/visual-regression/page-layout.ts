import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

const diff = (arr1: string[], arr2: string[]): string[] =>
  arr1.filter((x) => !arr2.includes(x));

describe('<PageLayout />', () => {
  it('should match the basic page-layout', async () => {
    const url = getExampleUrl(
      'design-system',
      'page-layout',
      'customizable-page-layout',
      global.__BASEURL__,
    );
    const { page } = global;
    await page.setViewport({
      height: 800,
      width: 1200,
    });

    await loadPage(page, url);
    await page.waitForSelector('div[data-testid="leftPanel"]');
    await page.waitForSelector('div[data-testid="rightPanel"]');
    await page.waitForSelector('div[data-testid="main"]');

    const screenshot = await page.screenshot();
    expect(screenshot).toMatchProdImageSnapshot();
  });

  it('should display the skip links panel', async () => {
    const url = getExampleUrl(
      'design-system',
      'page-layout',
      'customizable-page-layout',
      global.__BASEURL__,
    );
    const { page } = global;
    await page.setViewport({
      height: 800,
      width: 1200,
    });

    await loadPage(page, url);
    await page.waitForSelector('#banner');
    await page.keyboard.press('Tab');

    const screenshot = await page.screenshot();
    expect(screenshot).toMatchProdImageSnapshot();
  });

  it('should navigate by using the skip links panel', async () => {
    const url = getExampleUrl(
      'design-system',
      'page-layout',
      'customizable-page-layout',
      global.__BASEURL__,
    );
    const { page } = global;
    await page.setViewport({
      height: 800,
      width: 1200,
    });

    await loadPage(page, url);
    await page.waitForSelector('#banner');
    await page.keyboard.press('Tab');
    await page.waitForSelector('div[data-skip-link-wrapper="true"]');
    await page.keyboard.press('Enter');

    const element = await page.evaluateHandle(() => document.activeElement);
    const id = await page.evaluate((el: HTMLElement) => {
      return el.getAttribute('id');
    }, element);

    expect(id).toEqual('banner');
  });

  it('should hide link when panel is disabled', async () => {
    const url = getExampleUrl(
      'design-system',
      'page-layout',
      'customizable-page-layout',
      global.__BASEURL__,
    );

    const { page } = global;
    await page.setViewport({
      height: 800,
      width: 1200,
    });

    await loadPage(page, url);
    await page.waitForSelector('#banner');
    await page.keyboard.press('Tab');
    await page.waitForSelector('div[data-skip-link-wrapper="true"] ol li a');

    const links = await page.evaluate(() => {
      const elements = Array.from(
        document.querySelectorAll('div[data-skip-link-wrapper="true"] ol li a'),
      );
      return elements.map((e) => e.getAttribute('href'));
    });

    expect(links.length).toEqual(7);

    // close the main panel
    await page.waitForSelector('#toggle-main');
    await page.evaluate(() => {
      const toggle = document.querySelector('#toggle-main') as HTMLElement;
      toggle.click();
    });

    await page.focus('body');
    await page.keyboard.press('Tab');

    await page.waitForSelector('div[data-skip-link-wrapper="true"] ol li a');

    const newLinks = await page.evaluate(() => {
      const elements = Array.from(
        document.querySelectorAll('div[data-skip-link-wrapper="true"] ol li a'),
      );
      return elements.map((e) => e.getAttribute('href'));
    });

    expect(newLinks.length).toEqual(6);

    const difference = diff(links as string[], newLinks as string[]);

    expect(difference.length).toEqual(1);
    expect(difference[0]).toEqual('#main');
  });

  it('should close the skip links panel by escape', async () => {
    const url = getExampleUrl(
      'design-system',
      'page-layout',
      'customizable-page-layout',
      global.__BASEURL__,
    );
    const { page } = global;
    await page.setViewport({
      height: 800,
      width: 1200,
    });

    await loadPage(page, url);
    await page.waitForSelector('#banner');
    await page.keyboard.press('Tab');
    await page.waitForSelector('div[data-skip-link-wrapper="true"]');
    await page.keyboard.press('Escape');

    await page.waitForSelector('div[data-skip-link-wrapper="true"]', {
      visible: false,
    });

    const screenshot = await page.screenshot();
    expect(screenshot).toMatchProdImageSnapshot();
  });

  it('should match the position stickied', async () => {
    const url = getExampleUrl(
      'design-system',
      'page-layout',
      'stickied-element',
      global.__BASEURL__,
    );
    const { page } = global;
    await page.setViewport({
      height: 800,
      width: 1200,
    });

    await loadPage(page, url);
    await page.waitForSelector('div[data-testid="leftSidebar"]');
    await page.waitForSelector('div[data-testid="main"]');

    const screenshot = await page.screenshot();
    expect(screenshot).toMatchProdImageSnapshot();

    // await page.evaluate(async () => {
    //   window.scrollBy(0, 300);
    // });

    await page.$eval('body', () => window.scrollBy(0, 300));
    const screenshotWithSticky = await page.screenshot();
    expect(screenshotWithSticky).toMatchProdImageSnapshot();
  });
});
