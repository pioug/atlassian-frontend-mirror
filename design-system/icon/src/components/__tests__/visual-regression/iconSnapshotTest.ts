import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Icon size example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'icon',
      'size-example',
      global.__BASEURL__,
    );

    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });
});
