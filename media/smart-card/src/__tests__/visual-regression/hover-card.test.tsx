import { getURL, setup, takeSnapshot } from '../__utils__/vr-helpers';

describe('Hover Card', () => {
  const renderHoverCard = async (height: number = 800) => {
    const url = getURL('vr-hover-cards');
    const page = await setup(url);

    await page.setViewport({
      width: 800,
      height: height,
    });

    await page.waitForSelector('[data-testid="inline-card-resolved-view"]');
    await page.hover('[data-testid="inline-card-resolved-view"]');
    await page.waitForSelector('[data-testid="hover-card"]');
    await page.waitForSelector(
      '[data-testid="smart-element-icon-icon--wrapper"]',
    );

    const image = await takeSnapshot(page, height);
    expect(image).toMatchProdImageSnapshot();
  };

  it('should open below trigger component when there is room below in viewport', async () => {
    await renderHoverCard(650);
  });

  it('should open on top of trigger component when there is no room below and there is room above in viewport', async () => {
    await renderHoverCard(350);
  });
});
