import { expect, test } from '@af/integration-testing';
import { MediaCardPageObject } from '../utils/_mediaCardPageObject';

const cardStandardSelector = '[data-testid="media-card-standard"]';
const cardStandardLoadingSelector = '[data-testid="media-card-loading"]';
const cardWithContextIdSelector = '[data-testid="media-card-with-context-id"]';
const cardStandardSelectorWithMediaViewer = `[data-testid="media-card-standard-with-media-viewer"]`;
const cardStandardLoading = '[data-testid="media-card-loading-card"]';
const cardHiddenWithCacheSelector =
  '[data-testid="media-card-hidden-card-with-cache"]';
const cardHiddenWithoutCacheSelector =
  '[data-testid="media-card-hidden-card-without-cache"]';
const mediaViewerImage = '[data-testid="media-viewer-image"]';

test.describe('MediaCard', () => {
  test('load image', async ({ page }) => {
    const card = new MediaCardPageObject(page);
    await card.init('Test-Integration-card-files-mocked');
    const img = page.locator(`${cardStandardSelector} img`);

    // https://github.com/microsoft/playwright/issues/6046#issuecomment-1803609118
    await expect(img).toHaveJSProperty('complete', true);
    await expect(img).not.toHaveJSProperty('naturalWidth', 0);
  });

  test('load image with contextId', async ({ page }) => {
    const card = new MediaCardPageObject(page);
    await card.init('Test-Integration-card-files-mocked');
    const img = page.locator(`${cardWithContextIdSelector} img`);
    await expect(img).toHaveJSProperty('complete', true);
    await expect(img).not.toHaveJSProperty('naturalWidth', 0);
  });

  test('load image and launch media viewer', async ({ page }) => {
    const card = new MediaCardPageObject(page);
    await card.init('Test-Integration-card-files-mocked');
    const img = page.locator(`${cardStandardSelector} img`);

    // https://github.com/microsoft/playwright/issues/6046#issuecomment-1803609118
    await expect(img).toHaveJSProperty('complete', true);
    await expect(img).not.toHaveJSProperty('naturalWidth', 0);
    await card.launchMediaViewer(cardStandardSelectorWithMediaViewer);
    await expect(page.locator(mediaViewerImage)).toBeVisible();
  });

  test('renders loading card', async ({ page }) => {
    const card = new MediaCardPageObject(page);
    await card.init('Test-Integration-card-files-mocked');
    await expect(page.locator(cardStandardLoading)).toBeVisible();
  });

  test('cards that is not in the viewport but is available in local cache', async ({
    page,
  }) => {
    const card = new MediaCardPageObject(page);
    await card.init('Test-Integration-card-files-mocked');
    const img = page.locator(`${cardHiddenWithCacheSelector} img`);
    await expect(img).toHaveJSProperty('complete', true);
    await expect(img).not.toHaveJSProperty('naturalWidth', 0);
  });

  test('cards that is not in the viewport and no local cache available', async ({
    page,
  }) => {
    const card = new MediaCardPageObject(page);
    await card.init('Test-Integration-card-files-mocked');

    await expect(
      page.locator(
        `${cardHiddenWithoutCacheSelector} ${cardStandardLoadingSelector}`,
      ),
    ).toBeVisible();
  });
});
