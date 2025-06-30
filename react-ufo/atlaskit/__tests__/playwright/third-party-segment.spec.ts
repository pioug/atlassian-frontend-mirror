/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import type { RootSegment } from '../../src/common/react-ufo-payload-schema';
import type { SegmentItem } from '../../src/create-payload/common/utils';

import { expect, test, viewports } from './fixtures';

// Find a third-party segment with target segment name in the segment tree
const findThirdPartySegment = (node: SegmentItem, targetName: string): SegmentItem | null => {
	if (!node) {
		return null;
	}
	if (node.n === targetName) {
		return node;
	}
	if (node.c) {
		// Recursively search in children
		for (const child of Object.values(node.c)) {
			const result = findThirdPartySegment(child, targetName);
			if (result) {
				return result;
			}
		}
	}
	return null;
};

test.describe('ReactUFO: Third Party Segment', () => {
	const requiredFeatureFlags = [
		'platform_ufo_exclude_3p_elements_from_ttai',
		'platform_ufo_exclude_3p_elements_from_ttvc',
		'platform_ufo_add_type_for_3p_segments',
	];
	const featureFlagsCombos = [[...requiredFeatureFlags]];
	for (const featureFlags of featureFlagsCombos) {
		test.describe(`with feature flags ${featureFlags.join(', ')}`, () => {
			test.use({
				examplePage: 'third-party-segment',
				featureFlags,
			});

			for (const viewport of viewports) {
				test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
					test.use({
						viewport,
					});

					test('third party segment should be present in the UFO payload', async ({
						waitForReactUFOPayload,
					}) => {
						const reactUFOPayload = await waitForReactUFOPayload();
						expect(reactUFOPayload).toBeDefined();

						expect(typeof reactUFOPayload!.attributes.properties).toBe('object');
						const ufoProperties = reactUFOPayload!.attributes.properties;

						expect(typeof ufoProperties.interactionMetrics).toBe('object');
						const { interactionMetrics } = ufoProperties;

						const { segments, holdInfo } = interactionMetrics;
						expect(segments).toBeDefined();
						expect(typeof segments).toBe('object');

						// Find the third-party segment in the segment tree
						const thirdPartySegment = findThirdPartySegment(
							(segments as RootSegment).r,
							'third-party-segment-example',
						);
						const segmentWithin3pSegment = findThirdPartySegment(
							(segments as RootSegment).r,
							'section-two-segment',
						);
						// Verify that the UFOThirdPartySegment's name is present in the segment tree
						expect(thirdPartySegment).not.toBeNull();
						expect(thirdPartySegment!.n).toBe('third-party-segment-example');
						expect(thirdPartySegment!.t).toBe('third-party');
						expect(segmentWithin3pSegment!.n).toBe('section-two-segment');
						expect(segmentWithin3pSegment!.t).toBeUndefined();

						// Verify holds within UFOThirdPartySegment should be empty (ignored)
						expect(holdInfo).toBeDefined();
						holdInfo.forEach((hold) => expect(hold.labelStack.indexOf('section-two')).toBe(-1));
					});
				});
			}
		});
	}
});
