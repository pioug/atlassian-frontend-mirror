import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it(`Controlled expanded state example should match prod`, async () => {
    const url = getExampleUrl(
      'design-system',
      'table-tree',
      'controlled-expanded-state',
      global.__BASEURL__,
    );
    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });
});
