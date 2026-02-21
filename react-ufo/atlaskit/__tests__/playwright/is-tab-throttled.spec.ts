/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
/* eslint-disable playwright/no-standalone-expect */
import { expect, test } from './fixtures';

test.describe('React UFO: isTabThrottled detection', () => {
	test.describe('page load interaction', () => {
		test.use({
			examplePage: 'basic',
			viewport: {
				width: 1920,
				height: 1080,
			},
		});

		test('should report isTabThrottled as false when page loads normally without throttling', async ({
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

			// The field should be present
			expect('ufo:isTabThrottled' in ufoProperties).toBe(true);
			// Page loaded normally without throttling
			expect(ufoProperties['ufo:isTabThrottled']).toBe(false);
		});
	});

	test.describe('interaction type handling', () => {
		test.use({
			examplePage: 'interactions-simple-button',
			viewport: {
				width: 1920,
				height: 1080,
			},
		});

		test('should report isTabThrottled for press interactions as well', async ({
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

			// The field should be present for press interactions too
			expect('ufo:isTabThrottled' in interactionProperties).toBe(true);
			// Normal interaction should not be throttled
			expect(interactionProperties['ufo:isTabThrottled']).toBe(false);
		});
	});
});

/**
 * Tests for detecting when the browser tab is throttled.
 * These tests use a custom fixture that simulates throttling by injecting fake throttle measurements.
 */
test.describe('React UFO: isTabThrottled detection - throttled tab scenario with injection', () => {
	test.describe('when tab is throttled (simulated via injected measurement)', () => {
		test.use({
			examplePage: 'interactions-simple-button',
			viewport: {
				width: 1920,
				height: 1080,
			},
		});

		test('should report isTabThrottled as true when throttle measurements indicate throttling', async ({
			page,
			waitForReactUFOPayload,
			waitForReactUFOInteractionPayload,
		}) => {
			// Wait for the page to load first
			const mainDiv = page.locator('[id="app-main"]');
			await expect(mainDiv).toBeVisible({ timeout: 20000 });

			// Consume the initial page load payload
			await waitForReactUFOPayload();

			// Get the current time and inject a fake throttle measurement
			const now = await page.evaluate(() => performance.now());

			// Inject a fake throttle measurement that indicates the tab was throttled
			await page.evaluate((currentTime) => {
				const hiddenTiming = (window as any).__reactUfoHiddenTiming;
				if (
					hiddenTiming &&
					typeof hiddenTiming.__injectThrottleMeasurementForTesting === 'function'
				) {
					// Inject a measurement at a time that will be within the next interaction's time window
					hiddenTiming.__injectThrottleMeasurementForTesting({
						time: currentTime + 100, // slightly in the future to be within the upcoming interaction
						expectedElapsed: 1000,
						actualElapsed: 5000, // 5x drift, well above 1.5x threshold
						isThrottled: true,
					});
				}
			}, now);

			// Click to start a press interaction - this will pick up our injected measurement
			await page.getByText('new interaction button').click();

			const interactionPayload = await waitForReactUFOInteractionPayload();
			expect(interactionPayload).toBeDefined();

			const interactionProperties = interactionPayload!.attributes.properties;

			// Verify it's a press interaction
			expect(interactionProperties.interactionMetrics.type).toBe('press');

			// The field should be present
			expect('ufo:isTabThrottled' in interactionProperties).toBe(true);
			// Tab was throttled (simulated via injected measurement)
			expect(interactionProperties['ufo:isTabThrottled']).toBe(true);
		});
	});

	test.describe('control case: when tab is not throttled', () => {
		test.use({
			examplePage: 'basic',
			viewport: {
				width: 1920,
				height: 1080,
			},
		});

		test('should report isTabThrottled as false when no throttling is detected', async ({
			page,
			waitForReactUFOPayload,
		}) => {
			const mainDiv = page.locator('[data-testid="main"]');
			await expect(mainDiv).toBeVisible({ timeout: 20000 });

			const reactUFOPayload = await waitForReactUFOPayload();
			expect(reactUFOPayload).toBeDefined();

			const ufoProperties = reactUFOPayload!.attributes.properties;

			// The field should be present
			expect('ufo:isTabThrottled' in ufoProperties).toBe(true);
			// Tab was not throttled
			expect(ufoProperties['ufo:isTabThrottled']).toBe(false);
		});
	});
});
