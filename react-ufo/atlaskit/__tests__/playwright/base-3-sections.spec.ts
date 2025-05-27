/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test, viewports } from './fixtures';

test.describe('TTVC: basic page (3 congruent sections)', () => {
	const requiredFeatureFlags = ['ufo_payload_use_idle_callback'];
	const featureFlagsCombos = [
		[...requiredFeatureFlags],
		[...requiredFeatureFlags, 'platform_ufo_ttvc_v3_devtool'],
	];
	for (const featureFlags of featureFlagsCombos) {
		test.describe(`with feature flags ${featureFlags.join(', ')}`, () => {
			test.use({
				examplePage: 'basic-three-sections',
				featureFlags,
			});

			for (const viewport of viewports) {
				test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
					test.use({
						viewport,
					});

					test('section three should exist inside the ufo:vc:rev', async ({
						page,
						waitForReactUFOPayload,
						getSectionDOMAddedAt,
					}) => {
						const mainDiv = page.locator('[data-testid="main"]');
						const sections = page.locator('[data-testid="main"] > div');

						await expect(mainDiv).toBeVisible();
						await expect(sections.nth(2)).toBeVisible();

						const sectionThreeVisibleAt = await getSectionDOMAddedAt('sectionThree');
						expect(sectionThreeVisibleAt).toBeDefined();

						const reactUFOPayload = await waitForReactUFOPayload();
						expect(reactUFOPayload).toBeDefined();

						const ufoVCRev = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
						const ttvcV2Revision = ufoVCRev?.find(({ revision }) => revision === 'fy25.02');

						expect(ttvcV2Revision).toBeTruthy();
						expect(ttvcV2Revision!.vcDetails?.['90'].e).toContainEqual('div[testid=sectionThree]');
						expect(ttvcV2Revision!.vcDetails?.['90'].t).toMatchTimestamp(sectionThreeVisibleAt);
					});

					test('VC90 should matches when the section three was visible', async ({
						page,
						waitForReactUFOPayload,
						getSectionDOMAddedAt,
					}) => {
						const mainDiv = page.locator('[data-testid="main"]');
						const sections = page.locator('[data-testid="main"] > div');

						await expect(mainDiv).toBeVisible();
						await expect(sections.nth(2)).toBeVisible();

						const sectionThreeVisibleAt = await getSectionDOMAddedAt('sectionThree');
						expect(sectionThreeVisibleAt).toBeDefined();
						const reactUFOPayload = await waitForReactUFOPayload();
						expect(reactUFOPayload).toBeDefined();

						const ufoVCRev = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
						const ttvcV2Revision = ufoVCRev?.find(({ revision }) => revision === 'fy25.02');

						expect(ttvcV2Revision).toBeTruthy();
						const vc90Result = ttvcV2Revision!['metric:vc90'];
						expect(vc90Result).toBeDefined();
						expect(vc90Result).toMatchTimestamp(sectionThreeVisibleAt);
					});
				});
			}
		});
	}
});
