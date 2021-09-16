import {
  getExampleUrl,
  pageSelector,
} from '@atlaskit/visual-regression/helper';

async function setup() {
  const url = getExampleUrl(
    'media',
    'media-card',
    'media-inline-vr',
    global.__BASEURL__,
  );

  const { page } = global;
  await page.goto(url);
  await page.waitForSelector(pageSelector);

  return { page };
}

describe('Media Inline', () => {
  const mediaInlineLoadedViewSelector =
    '[data-testid="media-inline-card-loaded-view"]';

  it('should render different UI states', async () => {
    const { page } = await setup();
    await page.waitForSelector(mediaInlineLoadedViewSelector, {
      visible: true,
    });
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
