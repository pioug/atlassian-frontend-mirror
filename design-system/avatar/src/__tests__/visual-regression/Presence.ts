import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Presence', () => {
  it('should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'avatar',
      'basicPresence',
      global.__BASEURL__,
    );
    await global.page.setViewport({ width: 500, height: 400 });
    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });
});
