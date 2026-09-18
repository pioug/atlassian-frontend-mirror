import { expect, test } from '@af/integration-testing';

import { MediaCardPageObject } from '../utils/_mediaCardPageObject';

const cardStandardSelector = '[data-testid="media-card-standard"]';
const cardStandardLoadingSelector = '[data-testid="media-card-loading"]';
const cardWithContextIdSelector = '[data-testid="media-card-with-context-id"]';
const cardStandardSelectorWithMediaViewer = `[data-testid="media-card-standard-with-media-viewer"]`;
const cardStandardLoading = '[data-testid="media-card-loading-card"]';
const cardHiddenWithCacheSelector = '[data-testid="media-card-hidden-card-with-cache"]';
const cardHiddenWithoutCacheSelector = '[data-testid="media-card-hidden-card-without-cache"]';
const mediaViewerImage = '[data-testid="media-viewer-image"]';
const cardWithLoadingMotionSelector = '[data-testid="card-with-loading-motion"]';
const cardWithoutLoadingMotionSelector = '[data-testid="card-without-loading-motion"]';

test.describe('MediaCard', () => {
	test('load image', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../examples/Test-Integration-card-files-mocked.tsx')
		>('media', 'media-card', 'Test-Integration-card-files-mocked');
		const img = page.locator(`${cardStandardSelector} img`);

		// https://github.com/microsoft/playwright/issues/6046#issuecomment-1803609118
		await expect(img).toHaveJSProperty('complete', true);
		await expect(img).not.toHaveJSProperty('naturalWidth', 0);
	});

	test('load image with contextId', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../examples/Test-Integration-card-files-mocked.tsx')
		>('media', 'media-card', 'Test-Integration-card-files-mocked');
		const img = page.locator(`${cardWithContextIdSelector} img`);
		await expect(img).toHaveJSProperty('complete', true);
		await expect(img).not.toHaveJSProperty('naturalWidth', 0);
	});

	test('load image and launch media viewer', async ({ page }) => {
		const card = new MediaCardPageObject(page);
		await page.visitExample<
			typeof import('../../../examples/Test-Integration-card-files-mocked.tsx')
		>('media', 'media-card', 'Test-Integration-card-files-mocked');
		const img = page.locator(`${cardStandardSelector} img`);

		// https://github.com/microsoft/playwright/issues/6046#issuecomment-1803609118
		await expect(img).toHaveJSProperty('complete', true);
		await expect(img).not.toHaveJSProperty('naturalWidth', 0);
		await card.launchMediaViewer(cardStandardSelectorWithMediaViewer);
		await expect(page.locator(mediaViewerImage)).toBeVisible();
	});

	test('renders loading card', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../examples/Test-Integration-card-files-mocked.tsx')
		>('media', 'media-card', 'Test-Integration-card-files-mocked');
		await expect(page.locator(cardStandardLoading)).toBeVisible();
	});

	test('cards that is not in the viewport but is available in local cache', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../examples/Test-Integration-card-files-mocked.tsx')
		>('media', 'media-card', 'Test-Integration-card-files-mocked');
		const img = page.locator(`${cardHiddenWithCacheSelector} img`);
		await expect(img).toHaveJSProperty('complete', true);
		await expect(img).not.toHaveJSProperty('naturalWidth', 0);
	});

	test('cards that is not in the viewport and no local cache available', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../examples/Test-Integration-card-files-mocked.tsx')
		>('media', 'media-card', 'Test-Integration-card-files-mocked');

		await expect(
			page.locator(`${cardHiddenWithoutCacheSelector} ${cardStandardLoadingSelector}`),
		).toBeVisible();
	});

	test('should capture and report a11y violations', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../examples/Test-Integration-card-files-mocked.tsx')
		>('media', 'media-card', 'Test-Integration-card-files-mocked');

		await expect(page).toBeAccessible({ violationCount: 1 });
	});

	test('expresses loading through motion instead of an indicator', async ({ page }) => {
		// `hasLoadingMotion` is inert unless this gate is on. The examples harness installs its
		// own resolver from this query param, so it is the only reliable way to force it.
		await page.visitExample<
			typeof import('../../../examples/Test-Integration-card-loading-motion.tsx')
		>('media', 'media-card', 'Test-Integration-card-loading-motion', {
			featureFlag: 'aifc_page_create_defer_generated_visuals',
		});

		const motionImg = page.locator(`${cardWithLoadingMotionSelector} img`);
		const defaultImg = page.locator(`${cardWithoutLoadingMotionSelector} img`);

		// Waiting on both previews first pins that each card actually resolved, so the absence
		// asserted below cannot pass because the card errored or never loaded.
		// https://github.com/microsoft/playwright/issues/6046#issuecomment-1803609118
		await expect(motionImg).toHaveJSProperty('complete', true);
		await expect(motionImg).not.toHaveJSProperty('naturalWidth', 0);
		await expect(defaultImg).toHaveJSProperty('complete', true);

		// The card with the motion never draws an indicator, in any state; the default one uses
		// the indicator as usual.
		await expect(
			page.locator(`${cardWithLoadingMotionSelector} ${cardStandardLoadingSelector}`),
		).toHaveCount(0);
	});
});
