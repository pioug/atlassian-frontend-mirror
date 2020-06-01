import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Skeleton', () => {
  it('should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'avatar',
      'skeleton',
      global.__BASEURL__,
    );
    await global.page.setViewport({ width: 500, height: 850 });
    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });
});
