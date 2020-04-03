import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Basic should match production example', async () => {
    const url = getExampleUrl(
      'core',
      'page',
      'basic-usage',
      //@ts-ignore - global usage
      global.__BASEURL__,
    );
    //@ts-ignore - global usage
    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });
});
