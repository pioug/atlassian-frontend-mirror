/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test, viewports } from './fixtures';

test.describe('ReactUFO: css display:contents', () => {
	const requiredFeatureFlags = ['platform_ufo_display_content_resolution_ttvc_v3'];
	const featureFlagsCombos = [[...requiredFeatureFlags]];
	for (const featureFlags of featureFlagsCombos) {
		test.describe(`with feature flags ${featureFlags.join(', ')}`, () => {
			test.use({
				examplePage: 'css-display-contents',
				featureFlags,
			});

			for (const viewport of viewports) {
				test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
					test.use({
						viewport,
					});

					test('elements with display: contents css should be included in vc90', async ({
						waitForReactUFOPayload,
					}) => {
						const reactUFOPayload = await waitForReactUFOPayload();
						expect(reactUFOPayload).toBeDefined();

						expect(typeof reactUFOPayload!.attributes.properties).toBe('object');
						const ufoProperties = reactUFOPayload!.attributes.properties;

						expect(typeof ufoProperties.interactionMetrics).toBe('object');
						const ufoVCRev = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
						const ttvcV3Revision = ufoVCRev?.find(({ revision }) => revision === 'fy25.03');

						expect(ttvcV3Revision).toBeTruthy();
						expect(ttvcV3Revision!.vcDetails?.['90'].e).toContainEqual(
							'div[data-testid="sectionThree"]',
						);
						expect(Object.keys(ttvcV3Revision!.ratios!)).toContain(
							'div[data-testid="sectionThree"]',
						);
					});
				});
			}
		});
	}
});
