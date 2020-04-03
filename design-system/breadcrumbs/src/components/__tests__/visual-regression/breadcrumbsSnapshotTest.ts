declare var global: any;

import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Breadcrumbs-basic should match production example', async () => {
    const url = getExampleUrl(
      'core',
      'breadcrumbs',
      'basic',
      global.__BASEURL__,
    );
    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });
});
