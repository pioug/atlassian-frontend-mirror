import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it(`Progress-indicator example should match prod`, async () => {
    const url = getExampleUrl(
      'design-system',
      'progress-indicator',
      'progress-indicator-size-spacing',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    const image = await takeElementScreenShot(page, '[data-testid=vr-hook]');
    expect(image).toMatchProdImageSnapshot();
  });
});
