import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const avatarSelector = `div[data-testid="grid--avatar-0"] > a[data-testid="grid--avatar-0--inner"]`;
const moreIndicator = `[data-testid="grid--overflow-menu--trigger"]`;
const inputSelector = 'input[type="range"]';

async function waitForPageRendered(page: PuppeteerPage) {
  await page.waitForSelector(avatarSelector);
  await page.waitForSelector(moreIndicator);
  await page.waitForSelector(inputSelector);
  await page.waitForSelector(`${avatarSelector} svg[role="presentation"]`);
}

describe('Snapshot Test', () => {
  let page: PuppeteerPage;

  const url = getExampleUrl(
    'design-system',
    'avatar-group',
    'avatar-group-playground',
    global.__BASEURL__,
  );

  beforeEach(async () => {
    page = global.page;
    await loadPage(page, url);
    await waitForPageRendered(page);
  });

  it('Playground avatar group example should match production example', async () => {
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('More indicator should match with screenshot', async () => {
    const image = await takeElementScreenShot(page, moreIndicator);
    expect(image).toMatchProdImageSnapshot();
  });

  it('More indicator should get opacity onHover', async () => {
    await page.hover(moreIndicator);
    const image = await takeElementScreenShot(page, moreIndicator);
    expect(image).toMatchProdImageSnapshot();
  });

  it('More indicator should get outline on focus', async () => {
    await page.focus(moreIndicator);
    const image = await takeElementScreenShot(page, moreIndicator);
    expect(image).toMatchProdImageSnapshot();
  });
});
