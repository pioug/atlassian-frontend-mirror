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

test.describe('ReactUFO: Third Party Segment Extra Metrics', () => {
	const requiredFeatureFlags = [
		'platform_ufo_exclude_3p_elements_from_ttai',
		'platform_ufo_exclude_3p_elements_from_ttvc',
		'platform_ufo_enable_ttai_with_3p',
		'platform_ufo_reenable_3p_tracking',
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
						waitForInteractionExtraMetricsPayload,
					}) => {
						const reactUFOPayload = await waitForInteractionExtraMetricsPayload();
						expect(reactUFOPayload).toBeDefined();
						expect(typeof reactUFOPayload!.attributes.properties).toBe('object');
						const ufoProperties = reactUFOPayload!.attributes.properties;

						expect(typeof ufoProperties.interactionMetrics).toBe('object');
						const { interactionMetrics } = ufoProperties;

						const { segments, holdInfo, start, end } = interactionMetrics;
						expect((interactionMetrics as Record<string, any>)['metric:ttai:3p']).toBe(end - start);
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
						expect(
							holdInfo.some((hold) => hold.labelStack.indexOf('section-two') > -1),
						).toBeTruthy();
					});
				});
			}
		});
	}

	test.describe('with ufo_update_and_enforce_ttvc_v4_default_version FG enabled', () => {
		const featureFlags = [
			'platform_ufo_exclude_3p_elements_from_ttai',
			'platform_ufo_exclude_3p_elements_from_ttvc',
			'platform_ufo_enable_ttai_with_3p',
			'ufo_update_and_enforce_ttvc_v4_default_version',
		];

		test.use({
			examplePage: 'third-party-segment',
			featureFlags,
		});

		test.use({
			viewport: { width: 1920, height: 1080 },
		});

		test('should produce both interaction-metrics and interaction-extra-metrics payloads', async ({
			waitForReactUFOPayload,
			waitForInteractionExtraMetricsPayload,
		}) => {
			// Verify the main interaction-metrics payload is produced
			const mainPayload = await waitForReactUFOPayload();
			expect(mainPayload).toBeDefined();
			expect(mainPayload!.attributes.properties.interactionMetrics).toBeDefined();

			// Verify the interaction-extra-metrics payload is also produced
			const extraPayload = await waitForInteractionExtraMetricsPayload();
			expect(extraPayload).toBeDefined();
			expect(extraPayload!.attributes.properties.interactionMetrics).toBeDefined();
		});

		test('extra metrics payload should have correct vc:effective:revision', async ({
			waitForInteractionExtraMetricsPayload,
		}) => {
			const reactUFOPayload = await waitForInteractionExtraMetricsPayload();
			expect(reactUFOPayload).toBeDefined();

			const ufoProperties = reactUFOPayload!.attributes.properties as Record<string, unknown>;
			// vc:effective:revision should be dynamically resolved (not hardcoded fy25.03)
			expect(ufoProperties['vc:effective:revision']).toBeDefined();
			expect(typeof ufoProperties['vc:effective:revision']).toBe('string');
		});

		test('extra metrics payload should contain 3P segment data with FG enabled', async ({
			waitForInteractionExtraMetricsPayload,
		}) => {
			const reactUFOPayload = await waitForInteractionExtraMetricsPayload();
			expect(reactUFOPayload).toBeDefined();

			const ufoProperties = reactUFOPayload!.attributes.properties;
			const { interactionMetrics } = ufoProperties;

			const { segments, holdInfo, start, end } = interactionMetrics;

			// Verify metric:ttai:3p is present and correct
			expect((interactionMetrics as Record<string, any>)['metric:ttai:3p']).toBe(end - start);

			// Verify segments contain 3P data
			expect(segments).toBeDefined();
			const thirdPartySegment = findThirdPartySegment(
				(segments as RootSegment).r,
				'third-party-segment-example',
			);
			expect(thirdPartySegment).not.toBeNull();
			expect(thirdPartySegment!.t).toBe('third-party');

			// Verify holds within 3P segment are tracked
			expect(holdInfo).toBeDefined();
			expect(holdInfo.some((hold) => hold.labelStack.indexOf('section-two') > -1)).toBeTruthy();
		});
	});
});
