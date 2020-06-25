import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

const moreIndicator = `[data-testid="grid--overflow-menu--trigger"]`;

describe('Snapshot Test', () => {
  let page: any;

  const url = getExampleUrl(
    'design-system',
    'avatar-group',
    'avatarGroupPlayground',
    global.__BASEURL__,
  );

  beforeEach(() => {
    page = global.page;
  });

  it('Playground avatar group example should match production example', async () => {
    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });

  it('More indicator should get opacity onHover', async () => {
    await loadPage(page, url);

    await page.waitForSelector(moreIndicator);
    await page.hover(moreIndicator);

    const image = await takeElementScreenShot(page, moreIndicator);
    expect(image).toMatchProdImageSnapshot();
  });
});
