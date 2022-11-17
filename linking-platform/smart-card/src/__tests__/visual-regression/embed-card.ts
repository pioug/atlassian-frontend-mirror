import { getURL, setup, takeSnapshot } from '../__utils__/vr-helpers';

describe('Embed Card', () => {
  it('shows unresolved views', async () => {
    const url = getURL('vr-embed-card-unresolved-views');
    const page = await setup(url);
    await page.waitForSelector(
      '[data-testid="embed-card-forbidden-view-unresolved-image"]',
    );

    const image = await takeSnapshot(page, 2050);
    expect(image).toMatchProdImageSnapshot();
  });
});
