/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import type { RootSegment } from '../../src/common/react-ufo-payload-schema';
import type { SegmentItem } from '../../src/create-payload/common/utils';

import { expect, test } from './fixtures';

type MetricWindow = {
	start: number;
	end: number;
	includeCategories: string[];
	excludeCategories: string[];
	__exampleName?: keyof typeof import('../../examples/41-gen-ai-segment');
};

const findSegment = (node: SegmentItem, targetName: string): SegmentItem | null => {
	if (!node) {
		return null;
	}
	if (node.n === targetName) {
		return node;
	}
	if (node.c) {
		for (const child of Object.values(node.c)) {
			const result = findSegment(child, targetName);
			if (result) {
				return result;
			}
		}
	}
	return null;
};

test.describe('ReactUFO: GenAI Segment', () => {
	test.use({
		examplePage: 'gen-ai-segment',
		featureFlags: ['platform_ufo_metric_variants', 'platform_ufo_gen_ai_segment'],
		viewport: { width: 1920, height: 1080 },
	});

	test('GenAI segment should be present in the UFO payload and emit include-gen-ai metric window', async ({
		waitForReactUFOPayload,
	}) => {
		const reactUFOPayload = await waitForReactUFOPayload();
		expect(reactUFOPayload).toBeDefined();

		expect(typeof reactUFOPayload!.attributes.properties).toBe('object');
		const ufoProperties = reactUFOPayload!.attributes.properties;

		expect(typeof ufoProperties.interactionMetrics).toBe('object');
		const interactionMetrics =
			ufoProperties.interactionMetrics as typeof ufoProperties.interactionMetrics & {
				metricWindows: Record<string, MetricWindow>;
			};

		const { segments, holdInfo } = interactionMetrics;
		const metricWindows = interactionMetrics.metricWindows;
		expect(segments).toBeDefined();
		expect(typeof segments).toBe('object');

		const genAISegment = findSegment((segments as RootSegment).r, 'gen-ai-segment-example');
		const coreSegment = findSegment((segments as RootSegment).r, 'section-two-segment');
		const segmentWithinGenAISegment = findSegment(
			(segments as RootSegment).r,
			'section-three-segment',
		);

		expect(genAISegment).not.toBeNull();
		expect(genAISegment!.n).toBe('gen-ai-segment-example');
		expect(genAISegment!.t).toBe('gen-ai');
		expect(coreSegment).not.toBeNull();
		expect(coreSegment!.n).toBe('section-two-segment');
		expect(coreSegment!.t).toBeUndefined();
		expect(segmentWithinGenAISegment).not.toBeNull();
		expect(segmentWithinGenAISegment!.n).toBe('section-three-segment');
		expect(segmentWithinGenAISegment!.t).toBeUndefined();

		expect(holdInfo).toBeDefined();
		expect(holdInfo.some((hold) => hold.labelStack.indexOf('section-two') > -1)).toBe(true);
		expect(holdInfo.some((hold) => hold.labelStack.indexOf('section-three') > -1)).toBe(false);

		expect(metricWindows?.standard).toEqual({
			start: interactionMetrics.start,
			end: interactionMetrics.end,
			includeCategories: [],
			excludeCategories: ['third-party', 'gen-ai'],
		});
		const includeGenAIWindow = metricWindows['include-gen-ai'];
		expect(includeGenAIWindow).toBeDefined();
		expect(includeGenAIWindow.start).toBe(interactionMetrics.start);
		expect(includeGenAIWindow.end).toBeGreaterThan(interactionMetrics.end);
		expect(includeGenAIWindow.includeCategories).toEqual(['gen-ai']);
		expect(includeGenAIWindow.excludeCategories).toEqual([]);
		expect(metricWindows?.['include-third-party']).toBeUndefined();
	});
});
