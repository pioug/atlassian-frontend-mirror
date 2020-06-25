import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Skeleton', () => {
  let page: any;
  beforeEach(async () => {
    page = global.page;
    await page.setViewport({ width: 500, height: 850 });
  });

  it('should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'avatar',
      'skeleton',
      global.__BASEURL__,
    );
    const image = await takeScreenShot(page, url);
    expect(image).toMatchProdImageSnapshot();
  });
});
