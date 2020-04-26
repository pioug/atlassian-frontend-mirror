import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it(`Progress-indicator example should match prod`, async () => {
    const url = getExampleUrl(
      'design-system',
      'progress-indicator',
      'progressIndicatorDefault',
      global.__BASEURL__,
    );
    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });
});
