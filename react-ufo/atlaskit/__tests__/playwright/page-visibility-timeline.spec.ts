/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test } from './fixtures';

test.describe('React UFO: pageVisibilityTimeline field', () => {
	test.describe('when feature flag is enabled and page stays visible', () => {
		test.use({
			examplePage: 'basic',
			viewport: {
				width: 1920,
				height: 1080,
			},
			featureFlags: ['platform_ufo_page_visibility_timeline'],
		});

		test('should include pageVisibilityTimeline in payload with initial visible state', async ({
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

			// The field should be present when the feature flag is enabled
			expect('ufo:pageVisibilityTimeline' in ufoProperties).toBe(true);

			const timeline = ufoProperties['ufo:pageVisibilityTimeline'];
			expect(Array.isArray(timeline)).toBe(true);

			// Page was visible the whole time, so timeline should have at least the initial state
			expect(timeline!.length).toBeGreaterThanOrEqual(1);

			// The first entry should be at time 0 (relative to interaction start) and visible (not hidden)
			expect(timeline![0]).toMatchObject({
				time: 0,
				hidden: false,
			});

			// All entries should have valid structure
			for (const entry of timeline!) {
				expect(typeof entry.time).toBe('number');
				expect(typeof entry.hidden).toBe('boolean');
				expect(entry.time).toBeGreaterThanOrEqual(0);
			}
		});
	});

	test.describe('when feature flag is disabled', () => {
		test.use({
			examplePage: 'basic',
			viewport: {
				width: 1920,
				height: 1080,
			},
			// No feature flag enabled
		});

		test('should not include pageVisibilityTimeline in payload', async ({
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

			// The field should NOT be present when the feature flag is disabled
			expect('ufo:pageVisibilityTimeline' in ufoProperties).toBe(false);
		});
	});

	test.describe('when page is backgrounded during interaction', () => {
		test.use({
			examplePage: 'interactions-simple-button',
			viewport: {
				width: 1920,
				height: 1080,
			},
			featureFlags: ['platform_ufo_page_visibility_timeline'],
		});

		test('should capture visibility transitions in the timeline', async ({
			page,
			waitForReactUFOInteractionPayload,
		}) => {
			const mainDiv = page.locator('[id="app-main"]');
			await expect(mainDiv).toBeVisible();

			// Click to start a new interaction
			await page.getByText('new interaction button').click();

			// Simulate the page going to background and coming back
			await page.evaluate(() => {
				// Override visibilityState to 'hidden'
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
				}, 50);
			});

			const reactUFOPayload = await waitForReactUFOInteractionPayload();
			expect(reactUFOPayload).toBeDefined();

			const ufoProperties = reactUFOPayload!.attributes.properties;

			// The field should be present when the feature flag is enabled
			expect('ufo:pageVisibilityTimeline' in ufoProperties).toBe(true);

			const timeline = ufoProperties['ufo:pageVisibilityTimeline'];
			expect(Array.isArray(timeline)).toBe(true);

			// Timeline should have at least the initial state plus the hidden and visible transitions
			expect(timeline!.length).toBeGreaterThanOrEqual(2);

			// All entries should have valid structure
			for (const entry of timeline!) {
				expect(typeof entry.time).toBe('number');
				expect(typeof entry.hidden).toBe('boolean');
				expect(entry.time).toBeGreaterThanOrEqual(0);
			}

			// There should be at least one hidden entry in the timeline
			const hasHiddenEntry = timeline!.some((entry) => entry.hidden === true);
			expect(hasHiddenEntry).toBe(true);

			// Timeline should be in chronological order
			for (let i = 1; i < timeline!.length; i++) {
				expect(timeline![i].time).toBeGreaterThanOrEqual(timeline![i - 1].time);
			}
		});
	});

	test.describe('press interaction with feature flag enabled', () => {
		test.use({
			examplePage: 'interactions-simple-button',
			viewport: {
				width: 1920,
				height: 1080,
			},
			featureFlags: ['platform_ufo_page_visibility_timeline'],
		});

		test('should include pageVisibilityTimeline for press interactions', async ({
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
			expect('ufo:pageVisibilityTimeline' in interactionProperties).toBe(true);

			const timeline = interactionProperties['ufo:pageVisibilityTimeline'];
			expect(Array.isArray(timeline)).toBe(true);

			// Page was visible during the interaction, so should have at least initial state
			expect(timeline!.length).toBeGreaterThanOrEqual(1);

			// First entry should indicate visible
			expect(timeline![0]).toMatchObject({
				time: 0,
				hidden: false,
			});
		});
	});
});
