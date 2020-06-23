import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

declare var global: any;

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

    await page.goto(url);

    const screenshot = await takeScreenShot(page, url);
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

    await page.goto(url);

    const screenshot = await takeScreenShot(page, url);
    expect(screenshot).toMatchProdImageSnapshot();

    // await page.evaluate(async () => {
    //   window.scrollBy(0, 300);
    // });

    await page.$eval('body', () => window.scrollBy(0, 300));
    const screenshotWithSticky = await takeScreenShot(page, url);
    expect(screenshotWithSticky).toMatchProdImageSnapshot();
  });
});
