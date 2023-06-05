import {
  disableAllAnimations,
  getExampleUrl,
} from '@atlaskit/visual-regression/helper';

function getURL(): string {
  return getExampleUrl(
    'media',
    'media-card',
    'Test-VR-SSR-cases',
    global.__BASEURL__,
  );
}

export const mediaCardSelector = `[data-testid="media-file-card-view"][data-test-status="complete"]`;

async function setup(url: string) {
  const { page } = global;
  await page.goto(url);
  await disableAllAnimations(page);
  await page.evaluate(() => window.scrollTo(0, Number.MAX_SAFE_INTEGER));
  await page.waitForSelector(mediaCardSelector);
  // need to wait for widths to be adjusted
  await page.waitForTimeout(5000);

  const image = await page.screenshot({
    fullPage: true,
    captureBeyondViewport: true,
  });

  return { image };
}

describe('Card SSR Cases', () => {
  // FIXME: This test was automatically skipped due to failure on 24/07/2022: https://product-fabric.atlassian.net/browse/MEX-1824
  it.skip('Card SSR Cases tests', async () => {
    const url = getURL();
    const { image } = await setup(url);
    expect(image).toMatchProdImageSnapshot();
  });
});
