import {
  getExampleUrl,
  takeElementScreenShot,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

declare var global: any;
const moreIndicator = `[data-testid="grid--overflow-menu--trigger"]`;

describe('Snapshot Test', () => {
  const openExamplesAndWaitFor = async () => {
    const url = getExampleUrl(
      'core',
      'avatar-group',
      'avatarGroupPlayground',
      global.__BASEURL__,
    );
    const { page } = global;

    await page.goto(url);

    return url;
  };

  it('Playground avatar group example should match production example', async () => {
    const url = await openExamplesAndWaitFor();

    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });

  it('More indicator should get opacity onHover', async () => {
    await openExamplesAndWaitFor();

    const { page } = global;

    await page.hover(moreIndicator);
    await page.waitFor(250);

    const image = await takeElementScreenShot(page, moreIndicator);
    expect(image).toMatchProdImageSnapshot();
  });
});
