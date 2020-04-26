import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

declare var global: any;

describe('Snapshot Test', () => {
  it('Tag-basic should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'tag',
      'basicTag',
      global.__BASEURL__,
    );
    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });
  it('Tag-colors should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'tag',
      'colors',
      global.__BASEURL__,
    );
    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });
});
