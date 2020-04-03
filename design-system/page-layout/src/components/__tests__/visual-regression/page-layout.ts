import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

declare var global: any;

describe('<PageLayout />', () => {
  it('should match the basic page-layout', async () => {
    const url = getExampleUrl(
      'core',
      'page-layout',
      'basic-page-layout',
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
});
