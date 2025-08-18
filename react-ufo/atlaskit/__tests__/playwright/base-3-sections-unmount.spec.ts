/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */

import { expect, test, viewports } from './fixtures';

test.describe('ReactUFO: UFOSegment unmount', () => {
	const requiredFeatureFlags = ['platform_ufo_segment_unmount_count'];
	const featureFlagsCombos = [[...requiredFeatureFlags]];
	for (const featureFlags of featureFlagsCombos) {
		test.describe(`with feature flags ${featureFlags.join(', ')}`, () => {
			test.use({
				examplePage: 'basic-section-unmount',
				featureFlags,
			});

			for (const viewport of viewports) {
				test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
					test.use({
						viewport,
					});

					test('unmountCount should be present in the UFO payload', async ({
						waitForReactUFOPayload,
					}) => {
						const reactUFOPayload = await waitForReactUFOPayload();
						expect(reactUFOPayload).toBeDefined();

						expect(typeof reactUFOPayload!.attributes.properties).toBe('object');
						const ufoProperties = reactUFOPayload!.attributes.properties;

						expect(typeof ufoProperties.interactionMetrics).toBe('object');
						const { interactionMetrics } = ufoProperties;

						const { reactProfilerTimings } = interactionMetrics;
						expect(reactProfilerTimings).toBeDefined();

						const unmountTimings = reactProfilerTimings.filter(
							(item) => typeof item.unmountCount === 'number' && item.unmountCount > 0,
						);
						// Check unmountCount for section-one-segment
						expect(unmountTimings.length).toBe(1);
					});
				});
			}
		});
	}
});
