import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Basic should match production example', async () => {
    const url = getExampleUrl(
      'core',
      'empty-state',
      'basic',
      global.__BASEURL__,
    );

    const image = await takeScreenShot(global.page, url);
    // Allow two percent tolerance for comparison
    // @ts-ignore - Expected 0 arguments, but got 1.
    expect(image).toMatchProdImageSnapshot({
      failureThreshold: '0.02',
      failureThresholdType: 'percent',
    });
  });
});
