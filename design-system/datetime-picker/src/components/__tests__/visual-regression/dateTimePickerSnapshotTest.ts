import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

declare var global: any;

describe('Snapshot Test', () => {
  it('Appearance example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'datetime-picker',
      'basic',
      global.__BASEURL__,
    );
    const { page } = global;

    await page.setViewport({ width: 800, height: 1100 });

    const image = await takeScreenShot(page, url);
    expect(image).toMatchProdImageSnapshot();
  });
});
