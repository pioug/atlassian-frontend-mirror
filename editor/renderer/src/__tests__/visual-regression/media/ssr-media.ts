import { getExampleUrl } from '@atlaskit/visual-regression/helper';
import { retryUntilStablePosition } from '@atlaskit/editor-test-helpers/page-objects/toolbar';

function getURL(): string {
  return getExampleUrl('editor', 'renderer', 'media-ssr', global.__BASEURL__);
}

const mediaSSROnlySelector = `[data-testid="media-file-card-view"][data-test-status="loading"]`;
const mediaHydrationSelector = `[data-testid="media-file-card-view"][data-test-status="complete"]`;

async function setup(url: string) {
  const { page } = global;
  await page.goto(url);
  await page.evaluate(() => window.scrollTo(0, Number.MAX_SAFE_INTEGER));
  await retryUntilStablePosition(
    page,
    async () => {
      await page.waitForSelector(mediaSSROnlySelector);
    },
    mediaSSROnlySelector,
  );
  await retryUntilStablePosition(
    page,
    async () => {
      await page.waitForSelector(mediaHydrationSelector);
    },
    mediaHydrationSelector,
  );

  const image = await page.screenshot({
    fullPage: true,
    captureBeyondViewport: true,
  });

  return { image };
}

describe('Media SSR Renderer', () => {
  it('Media SSR Renderer tests', async () => {
    const url = getURL();
    const { image } = await setup(url);

    expect(image).toMatchProdImageSnapshot();
  });
});
