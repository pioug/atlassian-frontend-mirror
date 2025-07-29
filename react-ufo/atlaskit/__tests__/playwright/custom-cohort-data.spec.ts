/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test, viewports } from './fixtures';

test.describe('ReactUFO: Custom Cohort Data', () => {
	const requiredFeatureFlags = [
		'ufo_payload_use_idle_callback',
		'platform_ufo_critical_metrics_payload',
	];
	const featureFlagsCombos = [[...requiredFeatureFlags]];
	for (const featureFlags of featureFlagsCombos) {
		test.describe(`with feature flags ${featureFlags.join(', ')}`, () => {
			test.use({
				examplePage: 'basic-with-custom-cohort-data',
				featureFlags,
			});

			for (const viewport of viewports) {
				test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
					test.use({
						viewport,
					});

					test('debug: check payload structure', async ({
						page,
						waitForReactUFOPayload,
						getSectionVisibleAt,
					}) => {
						const mainDiv = page.locator('[data-testid="main"]');
						const sections = page.locator('[data-testid="main"] > div');

						await expect(mainDiv).toBeVisible();
						await expect(sections.nth(2)).toBeVisible();

						const sectionThreeVisibleAt = await getSectionVisibleAt('sectionThree');
						expect(sectionThreeVisibleAt).toBeDefined();

						const reactUFOPayload = await waitForReactUFOPayload();
						expect(reactUFOPayload).toBeDefined();

						expect(typeof reactUFOPayload!.attributes.properties).toBe('object');
						const ufoProperties = reactUFOPayload!.attributes.properties;

						expect(typeof ufoProperties.interactionMetrics).toBe('object');
						const { interactionMetrics } = ufoProperties;

						expect(typeof interactionMetrics.customData).toBe('object');
						expect(interactionMetrics.customData.length).toBeGreaterThanOrEqual(1);

						// Find the custom data entry that contains cohort data
						const cohortDataEntry = interactionMetrics.customData.find(
							(entry: any) =>
								entry.data &&
								entry.data.user_type === 'premium' &&
								entry.data.feature_version === 'v2.1',
						);

						expect(cohortDataEntry).toBeDefined();
						expect(cohortDataEntry!.data).toEqual({
							user_type: 'premium',
							feature_version: 'v2.1',
							experiment_group: 'control',
							session_count: 5,
							is_first_time: false,
						});
					});

					test('cohort data should be present in the UFO payload', async ({
						page,
						waitForReactUFOPayload,
						getSectionVisibleAt,
					}) => {
						const mainDiv = page.locator('[data-testid="main"]');
						const sections = page.locator('[data-testid="main"] > div');

						await expect(mainDiv).toBeVisible();
						await expect(sections.nth(2)).toBeVisible();

						const sectionThreeVisibleAt = await getSectionVisibleAt('sectionThree');
						expect(sectionThreeVisibleAt).toBeDefined();

						const reactUFOPayload = await waitForReactUFOPayload();
						expect(reactUFOPayload).toBeDefined();

						expect(typeof reactUFOPayload!.attributes.properties).toBe('object');
						const ufoProperties = reactUFOPayload!.attributes.properties;

						expect(typeof ufoProperties.interactionMetrics).toBe('object');
						const { interactionMetrics } = ufoProperties;

						// Verify custom data is present and contains cohort data
						expect(Array.isArray(interactionMetrics.customData)).toBe(true);
						expect(interactionMetrics.customData.length).toBeGreaterThanOrEqual(1);

						// Find the custom data entry that contains cohort data
						const cohortDataEntry = interactionMetrics.customData.find(
							(entry: any) =>
								entry.data &&
								entry.data.user_type === 'premium' &&
								entry.data.feature_version === 'v2.1',
						);

						expect(cohortDataEntry).toBeDefined();
						expect(cohortDataEntry!.data).toEqual({
							user_type: 'premium',
							feature_version: 'v2.1',
							experiment_group: 'control',
							session_count: 5,
							is_first_time: false,
						});
					});

					test('cohort data should be present in critical metrics', async ({
						page,
						waitForReactUFOPayload,
						waitForReactUFOPayloadCriticalMetrics,
						getSectionVisibleAt,
					}) => {
						const mainDiv = page.locator('[data-testid="main"]');
						const sections = page.locator('[data-testid="main"] > div');

						await expect(mainDiv).toBeVisible();
						await expect(sections.nth(2)).toBeVisible();

						const sectionThreeVisibleAt = await getSectionVisibleAt('sectionThree');
						expect(sectionThreeVisibleAt).toBeDefined();

						const reactUFOPayload = await waitForReactUFOPayload();
						expect(reactUFOPayload).toBeDefined();

						expect(typeof reactUFOPayload!.attributes.properties).toBe('object');
						const ufoProperties = reactUFOPayload!.attributes.properties;

						expect(typeof ufoProperties.interactionMetrics).toBe('object');
						const { interactionMetrics } = ufoProperties;

						// Check that custom data contains cohort data
						expect(Array.isArray(interactionMetrics.customData)).toBe(true);
						expect(interactionMetrics.customData.length).toBeGreaterThanOrEqual(1);

						// Find the custom data entry that contains cohort data
						const cohortDataEntry = interactionMetrics.customData.find(
							(entry: any) =>
								entry.data &&
								entry.data.user_type === 'premium' &&
								entry.data.feature_version === 'v2.1',
						);

						expect(cohortDataEntry).toBeDefined();
						expect(cohortDataEntry!.data).toEqual({
							user_type: 'premium',
							feature_version: 'v2.1',
							experiment_group: 'control',
							session_count: 5,
							is_first_time: false,
						});

						// Verify critical metrics payloads
						const criticalMetricsPayloads = await waitForReactUFOPayloadCriticalMetrics();
						expect(criticalMetricsPayloads).toBeDefined();
						expect(criticalMetricsPayloads!.length).toBeGreaterThan(0);
					});

					test('should not interfere with regular UFO functionality', async ({
						page,
						waitForReactUFOPayload,
						getSectionVisibleAt,
					}) => {
						const mainDiv = page.locator('[data-testid="main"]');
						const sections = page.locator('[data-testid="main"] > div');

						await expect(mainDiv).toBeVisible();
						await expect(sections.nth(2)).toBeVisible();

						const sectionThreeVisibleAt = await getSectionVisibleAt('sectionThree');
						expect(sectionThreeVisibleAt).toBeDefined();

						const reactUFOPayload = await waitForReactUFOPayload();
						expect(reactUFOPayload).toBeDefined();

						// Verify that the UFO payload has the correct structure
						expect(typeof reactUFOPayload!.attributes.properties).toBe('object');

						const ufoProperties = reactUFOPayload!.attributes.properties;
						expect(typeof ufoProperties.interactionMetrics).toBe('object');

						// Verify that the segment name is correct
						const segments = ufoProperties.interactionMetrics.segments as any;
						expect(segments).toBeDefined();
						expect(segments.r.c).toBeDefined();

						// Get the first segment ID and check its name
						const segmentIds = Object.keys(segments.r.c);
						expect(segmentIds.length).toBeGreaterThan(0);
						const firstSegmentId = segmentIds[0];
						expect(segments.r.c[firstSegmentId].n).toBe('app-root');

						// Verify that custom data contains cohort data but doesn't break other functionality
						expect(Array.isArray(ufoProperties.interactionMetrics.customData)).toBe(true);
						expect(ufoProperties.interactionMetrics.customData.length).toBeGreaterThanOrEqual(1);

						// Verify cohort data is present
						const cohortDataEntry = ufoProperties.interactionMetrics.customData.find(
							(entry: any) => entry.data && entry.data.user_type === 'premium',
						);
						expect(cohortDataEntry).toBeDefined();
					});

					test('should capture and report a11y violations', async ({ page }) => {
						const mainDiv = page.locator('[data-testid="main"]');
						await expect(mainDiv).toBeVisible();

						await expect(page).toBeAccessible();
					});
				});
			}
		});
	}
});
