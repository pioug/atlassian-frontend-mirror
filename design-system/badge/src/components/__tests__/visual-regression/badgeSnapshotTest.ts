import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('badge basic example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'badge',
      'basic',
      global.__BASEURL__,
    );
    const image = await takeScreenShot(global.page, url);

    expect(image).toMatchProdImageSnapshot();
  });
});
