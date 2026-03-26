/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test, viewports } from './fixtures';

test.describe('TTVC: basic page (10 congruent sections)', () => {
	const requiredFeatureFlags = [
		'ufo_payload_use_idle_callback',
		'platform_ufo_critical_metrics_payload',
	];
	const featureFlagsCombos = [[...requiredFeatureFlags]];
	for (const featureFlags of featureFlagsCombos) {
		test.describe(`with feature flags ${featureFlags.join(', ')}`, () => {
			test.use({
				examplePage: 'basic',
				featureFlags,
			});

			for (const viewport of viewports) {
				test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
					test.use({
						viewport,
					});

					test(`section nine should exist inside the ufo:vc:rev`, async ({
						page,
						waitForReactUFOPayload,
						waitForReactUFOPayloadCriticalMetrics,
						getSectionDOMAddedAt,
					}) => {
						const mainDiv = page.locator('[data-testid="main"]');
						const sections = page.locator('[data-testid="main"] > div');

						await expect(mainDiv).toBeVisible();
						await expect(sections.nth(9)).toBeVisible();

						const sectionNineVisibleAt = await getSectionDOMAddedAt('sectionNine');
						expect(sectionNineVisibleAt).toBeDefined();

						const reactUFOPayload = await waitForReactUFOPayload();
						expect(reactUFOPayload).toBeDefined();

						const ufoVCRev = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
						const ttvcV2Revision = ufoVCRev?.find(({ revision }) => revision === 'fy25.02');

						expect(ttvcV2Revision).toBeTruthy();
						// When raw VC data is included, vcDetails is intentionally deleted from
						// revision results and the data is carried in the raw-handler entry instead.
						// eslint-disable-next-line playwright/no-conditional-in-test
						if (ttvcV2Revision!.vcDetails) {
							expect(ttvcV2Revision!.vcDetails['90']?.e).toContainEqual('div[testid=sectionNine]');
							expect(ttvcV2Revision!.vcDetails['90']?.t).toMatchTimestamp(sectionNineVisibleAt);
						} else {
							// Verify raw-handler revision carries the observation data instead
							const rawHandlerRev = ufoVCRev?.find((rev) => rev.revision === 'raw-handler');
							expect(rawHandlerRev).toBeTruthy();
							expect(rawHandlerRev!.rawData).toBeDefined();
							expect(rawHandlerRev!.rawData!.obs!.length).toBeGreaterThan(0);
							expect(rawHandlerRev!.rawData!.eid!).toBeDefined();
							// Verify that the raw data contains sectionNine element
							const eidValues = Object.values(rawHandlerRev!.rawData!.eid!) as string[];
							expect(eidValues.some((name: string) => name.includes('sectionNine'))).toBe(true);
							expect(rawHandlerRev!.viewport).toBeDefined();
							expect(rawHandlerRev!.viewport!.w).toBeGreaterThan(0);
							expect(rawHandlerRev!.viewport!.h).toBeGreaterThan(0);
						}

						const criticalMetricsPayloads = await waitForReactUFOPayloadCriticalMetrics();
						expect(criticalMetricsPayloads).toBeDefined();
						expect(criticalMetricsPayloads!.length).toBeGreaterThan(0);
					});

					test(`VC90 should matches when the section nine was visible`, async ({
						page,
						waitForReactUFOPayload,
						waitForReactUFOPayloadCriticalMetrics,
						getSectionDOMAddedAt,
					}) => {
						const mainDiv = page.locator('[data-testid="main"]');
						const sections = page.locator('[data-testid="main"] > div');

						await expect(mainDiv).toBeVisible();
						await expect(sections.nth(9)).toBeVisible();

						const sectionNineVisibleAt = await getSectionDOMAddedAt('sectionNine');
						expect(sectionNineVisibleAt).toBeDefined();

						const reactUFOPayload = await waitForReactUFOPayload();
						expect(reactUFOPayload).toBeDefined();

						const ufoVCRev = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
						const ttvcV2Revision = ufoVCRev?.find(({ revision }) => revision === 'fy25.02');

						expect(ttvcV2Revision).toBeTruthy();
						const vc90Result = ttvcV2Revision!['metric:vc90'];
						expect(vc90Result).toBeDefined();
						expect(vc90Result).toMatchTimestamp(sectionNineVisibleAt);

						const fullUFOPayload = reactUFOPayload;
						const criticalMetricsPayloads = await waitForReactUFOPayloadCriticalMetrics();
						expect(criticalMetricsPayloads).toBeDefined();
						expect(criticalMetricsPayloads!.length).toBeGreaterThan(0);

						const rootCriticalMetrics = criticalMetricsPayloads!.find(
							(c) => c.attributes.properties.type === 'page_load',
						)!;
						expect(rootCriticalMetrics).toBeTruthy();
						expect(rootCriticalMetrics.attributes.properties.interactionId).toEqual(
							fullUFOPayload!.attributes.properties.interactionMetrics.interactionId,
						);
						expect(rootCriticalMetrics.attributes.properties.type).toEqual(
							fullUFOPayload!.attributes.properties.interactionMetrics.type,
						);
						expect(rootCriticalMetrics.attributes.properties.rate).toEqual(
							fullUFOPayload!.attributes.properties.interactionMetrics.rate,
						);
						expect(rootCriticalMetrics.attributes.properties.routeName).toEqual(
							fullUFOPayload!.attributes.properties.interactionMetrics.routeName,
						);

						expect(
							rootCriticalMetrics.attributes.properties.metrics.ttvc?.length,
						).toBeGreaterThanOrEqual(1);
						// raw-handler revision is excluded from critical metrics (metric:vc90 is null)
						// so we compare against non-raw-handler revisions only
						const nonRawRevisions = fullUFOPayload!.attributes.properties['ufo:vc:rev']?.filter(
							(rev) => rev.revision !== 'raw-handler',
						);
						expect(rootCriticalMetrics.attributes.properties.metrics.ttvc?.length).toEqual(
							nonRawRevisions?.length,
						);

						const criticalPayloadVCRevs = rootCriticalMetrics.attributes.properties.metrics.ttvc;
						for (const cVCRev of criticalPayloadVCRevs!) {
							const fVCRev = fullUFOPayload!.attributes.properties['ufo:vc:rev']!.find(
								(rev) => rev.revision === cVCRev.revision,
							);
							expect(fVCRev).toBeTruthy();
							expect(cVCRev.revision).toEqual(fVCRev!.revision);
							// When raw data is included, vcDetails is deleted but metric:vc90 remains.
							// Compare against metric:vc90 which is the canonical source.
							expect(cVCRev.vc90).toEqual(fVCRev!['metric:vc90']);
						}

						expect(rootCriticalMetrics.attributes.properties.metrics.ttai).toEqual(
							fullUFOPayload!.attributes.properties.interactionMetrics.end,
						);

						expect(rootCriticalMetrics.attributes.properties.metrics.fp).toEqual(
							fullUFOPayload!.attributes.properties['metric:fp'],
						);

						expect(rootCriticalMetrics.attributes.properties.metrics.fcp).toEqual(
							fullUFOPayload!.attributes.properties['metric:fcp'],
						);

						expect(rootCriticalMetrics.attributes.properties.metrics.lcp).toEqual(
							fullUFOPayload!.attributes.properties['metric:lcp'],
						);

						expect(rootCriticalMetrics.attributes.properties.metrics.navigation).toEqual(
							fullUFOPayload!.attributes.properties['metrics:navigation'],
						);
					});

					test(`each section should have approximately 10% ratio in ratios field`, async ({
						page,
						waitForReactUFOPayload,
					}) => {
						const mainDiv = page.locator('[data-testid="main"]');
						const sections = page.locator('[data-testid="main"] > div');

						await expect(mainDiv).toBeVisible();
						// Wait for all sections to be visible
						for (let i = 0; i < 10; i++) {
							await expect(sections.nth(i)).toBeVisible();
						}

						const reactUFOPayload = await waitForReactUFOPayload();
						expect(reactUFOPayload).toBeDefined();

						const ufoVCRev = reactUFOPayload!.attributes.properties['ufo:vc:rev'];

						// Test ratios for both fy25.02 and fy25.03 revisions
						const revisionsToTest = ['fy25.02', 'fy25.03'];

						for (const revisionName of revisionsToTest) {
							const revision = ufoVCRev?.find(({ revision }) => revision === revisionName);

							expect(revision).toBeTruthy();

							// When raw VC data is included (includeRawData=true), vcDetails and ratios
							// are intentionally deleted from revision results and the data is carried
							// in the raw-handler entry instead. Verify raw-handler data in that case.
							// eslint-disable-next-line playwright/no-conditional-in-test
							if (!revision!.ratios) {
								const rawHandlerRev = ufoVCRev?.find((rev) => rev.revision === 'raw-handler');
								expect(rawHandlerRev).toBeTruthy();
								expect(rawHandlerRev!.rawData).toBeDefined();
								expect(rawHandlerRev!.rawData!.obs!.length).toBeGreaterThan(0);
								// Verify observations have valid rects (needed for ratio recalculation)
								// eslint-disable-next-line playwright/no-conditional-in-test
								for (const obs of rawHandlerRev!.rawData!.obs!) {
									expect(obs.r).toHaveLength(4);
									expect(obs.t).toBeGreaterThanOrEqual(0);
								}
								continue;
							}

							const ratios = revision!.ratios!;

							// Check that ratios exist and contain our sections
							expect(Object.keys(ratios).length).toBeGreaterThan(0);

							// Expected section names - need to handle both formats:
							// fy25.02: 'div[testid=sectionOne]'
							// fy25.03: 'div[data-testid="sectionOne"]'
							const sectionNames = [
								'sectionOne',
								'sectionTwo',
								'sectionThree',
								'sectionFour',
								'sectionFive',
								'sectionSix',
								'sectionSeven',
								'sectionEight',
								'sectionNine',
								'sectionTen',
							];

							// Filter ratios to only include our test sections
							// Check both possible formats for element names
							const sectionRatios = Object.entries(ratios)
								.filter(([elementName]) => {
									// Check if element name contains any of our section names
									return sectionNames.some(
										(sectionName) =>
											elementName.includes(sectionName) &&
											(elementName.includes('testid') || elementName.includes('data-testid')),
									);
								})
								.map(([, ratio]) => ratio);

							// Should have at least some section ratios
							expect(sectionRatios.length).toBeGreaterThan(0);

							// Each section should have approximately 10% ratio since they're arranged in 10 equal columns
							// Allow for some tolerance in CI environments where viewport calculations might vary slightly
							sectionRatios.forEach((ratio) => {
								expect(ratio).toBeGreaterThan(0.08); // At least 8%
								expect(ratio).toBeLessThan(0.12); // At most 12%
								expect(ratio).toBeCloseTo(0.1, 1); // Approximately 10% with 1 decimal place tolerance (±0.05)
							});

							// Verify that we found the expected number of sections (should be 10)
							expect(sectionRatios).toHaveLength(10);
						}
					});

					test('should capture and report a11y violations', async ({
						page,
						waitForReactUFOPayload,
						getSectionDOMAddedAt,
					}) => {
						const mainDiv = page.locator('[data-testid="main"]');
						await expect(mainDiv).toBeVisible();

						await expect(page).toBeAccessible();
					});
				});
			}
		});
	}
});
