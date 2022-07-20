import { getURL, setup, takeSnapshot } from '../__utils__/vr-helpers';

describe('Hover Card', () => {
  const snapshotOptions = {
    // set tolerance to 0.1% to reduce false positives
    failureThreshold: '0.001',
    failureThresholdType: 'percent',
  };

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
    await page.waitForSelector(
      '[data-testid="authorgroup-metadata-element--avatar-0--person"]',
    );

    return page;
  };

  it('should open below trigger component when there is room below in viewport', async () => {
    const height = 650;

    const page = await renderHoverCard(height);

    const image = await takeSnapshot(page, height);
    expect(image).toMatchProdImageSnapshot(snapshotOptions);
  });

  it('should open on top of trigger component when there is no room below and there is room above in viewport', async () => {
    const height = 350;

    const page = await renderHoverCard(height);

    const image = await takeSnapshot(page, height);
    expect(image).toMatchProdImageSnapshot(snapshotOptions);
  });

  // FIXME: This test was automatically skipped due to failure on 19/07/2022: https://product-fabric.atlassian.net/browse/EDM-3923
  it.skip('should open preview modal', async () => {
    const page = await renderHoverCard();

    await page.click('[data-testid="preview-content"]');
    await page.waitForSelector('[data-testid="smart-links-preview-modal"]');
    await page.waitForSelector('[data-testid="hover-card"]', {
      hidden: true,
    });

    const image = await takeSnapshot(page, 800, 0);
    expect(image).toMatchProdImageSnapshot(snapshotOptions);
  });
});
