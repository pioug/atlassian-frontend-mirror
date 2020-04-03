import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Theme colors should match production example', async () => {
    const { page, __BASEURL__ } = global;
    const url = getExampleUrl('core', 'theme', 'colors', __BASEURL__);

    const image = await takeScreenShot(page, url, { fullPage: true });

    expect(image).toMatchProdImageSnapshot();
  });
});
