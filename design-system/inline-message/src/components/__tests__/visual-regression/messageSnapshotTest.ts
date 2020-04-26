import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Inline message basic should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'inline-message',
      'basic',

      global.__BASEURL__,
    );

    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });
  it('Inline message different-types should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'inline-message',
      'different-types',

      global.__BASEURL__,
    );

    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });
});
