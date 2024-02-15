import { getURL, setup, takeSnapshot } from '../__utils__/vr-helpers';

describe('Flexible UI elements', () => {
  it('Renders icon', async () => {
    const url = getURL('vr-flexible-ui-element-icon');
    const page = await setup(url);
    await page.waitForSelector(`[data-testid="vr-test-icon-0-0"]`);

    await page.evaluate(() => {
      // @ts-ignore TS2339: Property 'setLoadingIconUrl' does not exist on type 'Window & typeof globalThis'
      setLoadingIconUrl();
    });
    await page.waitForSelector('[data-testid="vr-test-image-icon-loading"]');

    const image = await takeSnapshot(page, 650);

    expect(image).toMatchProdImageSnapshot();
  });
});
