/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test, viewports } from './fixtures';

test.describe('TTVC: basic page (10 congruent sections)', () => {
	const requiredFeatureFlags = ['ufo_payload_use_idle_callback', 'platform_ufo_rev_ratios'];
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
						expect(ttvcV2Revision!.vcDetails?.['90'].e).toContainEqual('div[testid=sectionNine]');
						expect(ttvcV2Revision!.vcDetails?.['90'].t).toMatchTimestamp(sectionNineVisibleAt);
					});

					test(`VC90 should matches when the section nine was visible`, async ({
						page,
						waitForReactUFOPayload,
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
							expect(revision!.ratios).toBeDefined();

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
