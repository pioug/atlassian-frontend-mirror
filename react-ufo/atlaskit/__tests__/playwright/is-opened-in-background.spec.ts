/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
/* eslint-disable playwright/no-standalone-expect */
import { expect, test, testWithBackgroundTab } from './fixtures';

test.describe('React UFO: isOpenedInBackground detection', () => {
	test.describe('when feature flag is enabled and page is opened in foreground', () => {
		test.use({
			examplePage: 'basic',
			viewport: {
				width: 1920,
				height: 1080,
			},
			featureFlags: ['platform_ufo_is_opened_in_background'],
		});

		test('should report isOpenedInBackground as false when page is always visible', async ({
			page,
			waitForReactUFOPayload,
		}) => {
			const mainDiv = page.locator('[data-testid="main"]');
			const sections = page.locator('[data-testid="main"] > div');

			await expect(mainDiv).toBeVisible();
			await expect(sections.nth(9)).toBeVisible();

			const reactUFOPayload = await waitForReactUFOPayload();
			expect(reactUFOPayload).toBeDefined();

			const ufoProperties = reactUFOPayload!.attributes.properties;

			// The field should be present when feature flag is enabled
			expect('ufo:isOpenedInBackground' in ufoProperties).toBe(true);
			// Page was opened in foreground and stayed visible
			expect(ufoProperties['ufo:isOpenedInBackground']).toBe(false);
		});
	});

	test.describe('when feature flag is enabled and user switches tabs after page load', () => {
		test.use({
			examplePage: 'interactions-simple-button',
			viewport: {
				width: 1920,
				height: 1080,
			},
			featureFlags: ['platform_ufo_is_opened_in_background'],
		});

		test('should report isOpenedInBackground as false when user switches tabs after page loads (tab switching scenario)', async ({
			page,
			waitForReactUFOPayload,
		}) => {
			const mainDiv = page.locator('[id="app-main"]');
			await expect(mainDiv).toBeVisible();

			// Wait for the initial page load payload first
			const pageLoadPayload = await waitForReactUFOPayload();
			expect(pageLoadPayload).toBeDefined();

			const pageLoadProperties = pageLoadPayload!.attributes.properties;

			// The page load should NOT be detected as opened in background
			// because the page was visible when it first loaded
			expect('ufo:isOpenedInBackground' in pageLoadProperties).toBe(true);
			expect(pageLoadProperties['ufo:isOpenedInBackground']).toBe(false);
		});

		test('tab switching after page load does not affect isOpenedInBackground for subsequent interactions', async ({
			page,
			waitForReactUFOPayload,
			waitForReactUFOInteractionPayload,
		}) => {
			const mainDiv = page.locator('[id="app-main"]');
			await expect(mainDiv).toBeVisible();

			// Wait for the initial page load to complete
			await waitForReactUFOPayload();

			// Simulate the user switching to another tab and coming back
			// This simulates: user opens page normally, then switches tabs, then switches back
			await page.evaluate(() => {
				return new Promise<void>((resolve) => {
					// Store the original descriptor
					const originalDescriptor = Object.getOwnPropertyDescriptor(
						Document.prototype,
						'visibilityState',
					);

					// Simulate going to background (user switches to another tab)
					Object.defineProperty(document, 'visibilityState', {
						configurable: true,
						get: () => 'hidden',
					});
					document.dispatchEvent(new Event('visibilitychange'));

					// Simulate coming back (user switches back to this tab) after 100ms
					setTimeout(() => {
						Object.defineProperty(document, 'visibilityState', {
							configurable: true,
							get: () => 'visible',
						});
						document.dispatchEvent(new Event('visibilitychange'));

						// Restore original descriptor if it existed
						if (originalDescriptor) {
							Object.defineProperty(Document.prototype, 'visibilityState', originalDescriptor);
						}

						// Resolve after the visibility state is restored
						setTimeout(resolve, 50);
					}, 100);
				});
			});

			// Click to start a new interaction after the tab switch
			await page.getByText('new interaction button').click();

			const interactionPayload = await waitForReactUFOInteractionPayload();
			expect(interactionPayload).toBeDefined();

			const interactionProperties = interactionPayload!.attributes.properties;
			const interactionType = interactionProperties.interactionMetrics.type;

			// For press interactions, isOpenedInBackground should be false
			// (it only applies to page_load interactions)
			expect(interactionType).toBe('press');
			expect('ufo:isOpenedInBackground' in interactionProperties).toBe(true);
			expect(interactionProperties['ufo:isOpenedInBackground']).toBe(false);
		});
	});

	test.describe('when feature flag is disabled', () => {
		test.use({
			examplePage: 'basic',
			viewport: {
				width: 1920,
				height: 1080,
			},
			featureFlags: [],
		});

		test('should not include ufo:isOpenedInBackground in payload', async ({
			page,
			waitForReactUFOPayload,
		}) => {
			const mainDiv = page.locator('[data-testid="main"]');
			const sections = page.locator('[data-testid="main"] > div');

			await expect(mainDiv).toBeVisible();
			await expect(sections.nth(9)).toBeVisible();

			const reactUFOPayload = await waitForReactUFOPayload();
			expect(reactUFOPayload).toBeDefined();

			const ufoProperties = reactUFOPayload!.attributes.properties;

			// The field should not be present when feature flag is disabled
			expect('ufo:isOpenedInBackground' in ufoProperties).toBe(false);
		});
	});

	test.describe('interaction type handling', () => {
		test.use({
			examplePage: 'interactions-simple-button',
			viewport: {
				width: 1920,
				height: 1080,
			},
			featureFlags: ['platform_ufo_is_opened_in_background'],
		});

		test('should report isOpenedInBackground as false for press interactions (non-page_load)', async ({
			page,
			waitForReactUFOPayload,
			waitForReactUFOInteractionPayload,
		}) => {
			const mainDiv = page.locator('[id="app-main"]');
			await expect(mainDiv).toBeVisible();

			// Wait for the initial page load to complete
			await waitForReactUFOPayload();

			// Click to start a press interaction
			await page.getByText('new interaction button').click();

			const interactionPayload = await waitForReactUFOInteractionPayload();
			expect(interactionPayload).toBeDefined();

			const interactionProperties = interactionPayload!.attributes.properties;

			// Verify it's a press interaction
			expect(interactionProperties.interactionMetrics.type).toBe('press');

			// For non-page_load interactions, isOpenedInBackground should always be false
			expect('ufo:isOpenedInBackground' in interactionProperties).toBe(true);
			expect(interactionProperties['ufo:isOpenedInBackground']).toBe(false);
		});
	});
});

/**
 * Tests for detecting when a page is opened in a new background tab.
 * These tests use a custom fixture that simulates the page being hidden from the very start.
 */
testWithBackgroundTab.describe('React UFO: isOpenedInBackground detection - background tab scenario', () => {
	testWithBackgroundTab.describe('when page is opened in a new background tab (simulated)', () => {
		testWithBackgroundTab.use({
			simulateBackgroundTab: true,
			featureFlags: ['platform_ufo_is_opened_in_background'],
		});

		testWithBackgroundTab('should report isOpenedInBackground as true when page is hidden from the start', async ({
			page,
			waitForReactUFOPayload,
		}) => {
			// The page was "opened in background" via the init script that sets visibilityState to hidden
			// Wait for the page to render (even though it's "hidden")
			const mainDiv = page.locator('[data-testid="main"]');
			await expect(mainDiv).toBeVisible({ timeout: 20000 });

			const reactUFOPayload = await waitForReactUFOPayload();
			expect(reactUFOPayload).toBeDefined();

			const ufoProperties = reactUFOPayload!.attributes.properties;

			// The field should be present when feature flag is enabled
			expect('ufo:isOpenedInBackground' in ufoProperties).toBe(true);
			// Page was opened in background tab (hidden from start)
			expect(ufoProperties['ufo:isOpenedInBackground']).toBe(true);
		});
	});

	testWithBackgroundTab.describe('control case: when page is opened normally (not in background)', () => {
		testWithBackgroundTab.use({
			simulateBackgroundTab: false,
			featureFlags: ['platform_ufo_is_opened_in_background'],
		});

		testWithBackgroundTab('should report isOpenedInBackground as false when page is visible from the start', async ({
			page,
			waitForReactUFOPayload,
		}) => {
			const mainDiv = page.locator('[data-testid="main"]');
			await expect(mainDiv).toBeVisible({ timeout: 20000 });

			const reactUFOPayload = await waitForReactUFOPayload();
			expect(reactUFOPayload).toBeDefined();

			const ufoProperties = reactUFOPayload!.attributes.properties;

			// The field should be present when feature flag is enabled
			expect('ufo:isOpenedInBackground' in ufoProperties).toBe(true);
			// Page was opened in foreground (visible from start)
			expect(ufoProperties['ufo:isOpenedInBackground']).toBe(false);
		});
	});
});
