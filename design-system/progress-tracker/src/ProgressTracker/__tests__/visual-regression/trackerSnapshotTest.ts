import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it(`Progress-tracker example should match prod`, async () => {
    const url = getExampleUrl(
      'design-system',
      'progress-tracker',
      'progressTrackerDefault',
      //@ts-ignore
      global.__BASEURL__,
    );
    //@ts-ignore
    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });
});
