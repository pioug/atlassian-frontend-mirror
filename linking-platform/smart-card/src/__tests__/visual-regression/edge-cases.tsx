import { getURL, setup, takeSnapshot } from '../__utils__/vr-helpers';

describe('Edge cases', () => {
  it('should fully reload links after redux store was reset', async () => {
    const url = getURL('vr-edge-case-redux-store-reset');
    const page = await setup(url);

    await page.waitForSelector('[data-testid="inline-card-resolved-view"]');
    await page.click('[data-testid="reset-redux-store-button"]');
    await page.waitForSelector('[data-testid="inline-card-resolved-view"]');
    const image = await takeSnapshot(page, 800);
    expect(image).toMatchProdImageSnapshot();
  });
});
