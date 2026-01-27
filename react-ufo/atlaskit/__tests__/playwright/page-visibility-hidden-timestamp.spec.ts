/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test } from './fixtures';

test.describe('React UFO: pageVisibilityHiddenTimestamp field', () => {
	test.describe('when feature flag is enabled and page stays visible', () => {
		test.use({
			examplePage: 'basic',
			viewport: {
				width: 1920,
				height: 1080,
			},
			featureFlags: ['platform_ufo_browser_backgrounded_abort_timestamp'],
		});

		test('should have undefined timestamp when page was never backgrounded', async ({
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
			// Since the page was never hidden during the interaction, it should be undefined
			expect('ufo:pageVisibilityHiddenTimestamp' in ufoProperties).toBe(true);
			expect(ufoProperties['ufo:pageVisibilityHiddenTimestamp']).toBeUndefined();
		});
	});

	test.describe('when feature flag is enabled and page is backgrounded', () => {
		test.use({
			examplePage: 'interactions-simple-button',
			viewport: {
				width: 1920,
				height: 1080,
			},
			featureFlags: ['platform_ufo_browser_backgrounded_abort_timestamp'],
		});

		test('should capture hidden timestamp when page is backgrounded during interaction', async ({
			page,
			waitForReactUFOInteractionPayload,
		}) => {
			const mainDiv = page.locator('[id="app-main"]');
			await expect(mainDiv).toBeVisible();

			// Click to start a new interaction
			await page.getByText('new interaction button').click();

			// Simulate the page going to background by:
			// 1. Overriding document.visibilityState to return 'hidden'
			// 2. Dispatching the visibilitychange event
			await page.evaluate(() => {
				// Store the original descriptor
				const originalDescriptor = Object.getOwnPropertyDescriptor(
					Document.prototype,
					'visibilityState',
				);

				// Override visibilityState to return 'hidden'
				Object.defineProperty(document, 'visibilityState', {
					configurable: true,
					get: () => 'hidden',
				});

				// Dispatch visibilitychange event to trigger the hidden-timing handler
				document.dispatchEvent(new Event('visibilitychange'));

				// Restore visibilityState to 'visible' after a short delay
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
				}, 50);
			});

			const reactUFOPayload = await waitForReactUFOInteractionPayload();
			expect(reactUFOPayload).toBeDefined();

			const ufoProperties = reactUFOPayload!.attributes.properties;

			// The field should be present and contain the hidden timing offset from interaction start
			expect('ufo:pageVisibilityHiddenTimestamp' in ufoProperties).toBe(true);

			const hiddenTimestamp = ufoProperties['ufo:pageVisibilityHiddenTimestamp'];
			expect(hiddenTimestamp).toBeDefined();
			expect(typeof hiddenTimestamp).toBe('number');
			// The value should be a non-negative offset from the interaction start time
			expect(hiddenTimestamp).toBeGreaterThanOrEqual(0);
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

		test('should not include ufo:pageVisibilityHiddenTimestamp in payload', async ({
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
			expect('ufo:pageVisibilityHiddenTimestamp' in ufoProperties).toBe(false);
		});
	});
});
