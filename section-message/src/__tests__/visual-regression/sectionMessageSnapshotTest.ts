import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Appearance variations should match production example', async () => {
    const url = getExampleUrl(
      'core',
      'section-message',
      'appearance-variations',

      global.__BASEURL__,
    );

    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });
});
