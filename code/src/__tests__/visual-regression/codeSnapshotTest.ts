import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

declare var global: any;

describe('Snapshot Test', () => {
  it('Inline code basic example should match production example', async () => {
    const url = getExampleUrl(
      'core',
      'code',
      'inline-code-basic',
      global.__BASEURL__,
    );
    const image = await takeScreenShot(global.page, url);

    expect(image).toMatchProdImageSnapshot();
  });
  it('Code block example should match production example', async () => {
    const url = getExampleUrl(
      'core',
      'code',
      'code-block-basic',
      global.__BASEURL__,
    );
    const image = await takeScreenShot(global.page, url);

    expect(image).toMatchProdImageSnapshot();
  });
});
