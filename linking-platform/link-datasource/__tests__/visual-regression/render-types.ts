import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const allRenderTypessContainer =
  '[data-testid="link-datasource--render-all-types"]';

describe('All Render Types', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
    const url = getExampleUrl(
      'linking-platform',
      'link-datasource',
      'render-all-types',
      __BASEURL__,
    );

    await page.setViewport({
      width: 1200,
      height: 1000,
    });

    await loadPage(page, url);
    await page.waitForSelector(allRenderTypessContainer);
  });

  it('should match snapshot', async () => {
    const image = await takeElementScreenShot(page, allRenderTypessContainer);

    expect(image).toMatchProdImageSnapshot();
  });
});
