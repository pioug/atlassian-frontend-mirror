import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import type { InteractionMetrics } from '../../common';
import { setUFOConfig } from '../../config';
import { buildSegmentTree } from '../../create-payload/common/utils/build-segment-tree';
import { getOldSegmentsLabelStack } from '../../create-payload/common/utils/get-old-segments-label-stack';
import { stringifyLabelStackFully } from '../../create-payload/common/utils/stringify-label-stack-fully';
import type { LabelStack } from '../../interaction-context';

describe('segment cache lifecycle', () => {
	let metrics: typeof import('../index');
	let interactions: Map<string, InteractionMetrics>;

	beforeEach(() => {
		jest.useFakeTimers();
		// Removal is the behavior under test, so it cannot also provide cache isolation.
		jest.isolateModules(() => {
			metrics = require('../index');
			interactions = require('../common/constants').interactions;
			require('../../config').setUFOConfig({
				enabled: true,
				product: 'test-product',
				region: 'test-region',
			});
		});
		setUFOConfig({ enabled: true, product: 'test-product', region: 'test-region' });
	});

	afterEach(() => {
		interactions.forEach((interaction) => {
			interaction.cleanupCallbacks.forEach((cleanup) => cleanup());
		});
		interactions.clear();
		jest.clearAllTimers();
		jest.useRealTimers();
	});

	function startInteraction(id: string) {
		metrics.addNewInteraction(id, id, 'transition', 1000, 1, null, null, null);
		return interactions.get(id)!;
	}

	const inbox: LabelStack = [{ name: 'inbox', segmentId: 'inbox' }];
	const shell: LabelStack = [{ name: 'shell', segmentId: 'shell' }];
	const home: LabelStack = [{ name: 'home', segmentId: 'home' }];

	it('preserves legacy cache replay when the gate is disabled', () => {
		failGate('platform_ufo_fix_stale_segment_cache');
		metrics.addSegment(inbox);
		const current = startInteraction('current');
		metrics.removeSegment(inbox);

		expect(current.knownSegments).toEqual([{ labelStack: inbox }]);
		expect(startInteraction('next').knownSegments).toEqual([{ labelStack: inbox }]);
		expect(metrics.segmentUnmountCache.get(stringifyLabelStackFully(inbox))).toBe(1);
	});

	it('excludes removed segments while recording mounted and destination segments', () => {
		passGate('platform_ufo_fix_stale_segment_cache');
		metrics.addSegment(inbox);
		metrics.addSegment(shell);
		metrics.removeSegment(inbox);

		const interaction = startInteraction('home');
		metrics.addSegment(home);

		expect(interaction.knownSegments).toEqual([{ labelStack: shell }, { labelStack: home }]);
		expect(getOldSegmentsLabelStack(interaction.knownSegments, interaction.type)).toEqual([
			{ labelStack: [{ n: 'shell', s: 'shell' }] },
			{ labelStack: [{ n: 'home', s: 'home' }] },
		]);
		expect(
			buildSegmentTree(interaction.knownSegments.map((segment) => segment.labelStack)),
		).toEqual({
			r: { n: 'segment-tree-root', c: { shell: { n: 'shell' }, home: { n: 'home' } } },
		});
	});

	it('removes nested stacks containing plain labels and distinct segment identities', () => {
		passGate('platform_ufo_fix_stale_segment_cache');
		const nested: LabelStack = [
			{ name: 'shell', segmentId: 'shell' },
			{ name: 'content' },
			{ name: 'inbox', segmentId: 'old-inbox' },
		];
		const mounted: LabelStack = [...nested.slice(0, -1), { name: 'inbox', segmentId: 'new-inbox' }];
		metrics.addSegment(nested);
		metrics.addSegment(mounted);
		metrics.removeSegment(nested);

		expect(startInteraction('nested').knownSegments).toEqual([{ labelStack: mounted }]);
	});

	it('does not accumulate identities over repeated mount and unmount cycles', () => {
		passGate('platform_ufo_fix_stale_segment_cache');
		for (let index = 0; index < 3; index++) {
			const stack: LabelStack = [{ name: 'inbox', segmentId: `inbox-${index}` }];
			metrics.addSegment(stack);
			metrics.removeSegment(stack);
		}

		expect(startInteraction('later').knownSegments).toEqual([]);
	});

	it('notifies an active interaction when the same stack is mounted again', () => {
		passGate('platform_ufo_fix_stale_segment_cache');
		metrics.addSegment(inbox);
		metrics.removeSegment(inbox);
		const interaction = startInteraction('remount');

		metrics.addSegment(inbox);
		expect(interaction.knownSegments).toEqual([{ labelStack: inbox }]);
		metrics.removeSegment(inbox);
		metrics.addSegment(inbox);
		expect(interaction.knownSegments).toEqual([{ labelStack: inbox }, { labelStack: inbox }]);
	});

	it('counts each unmount once and ignores removal of an absent segment', () => {
		passGate('platform_ufo_fix_stale_segment_cache');
		const key = stringifyLabelStackFully(inbox);
		metrics.removeSegment(inbox);
		expect(metrics.segmentUnmountCache.has(key)).toBe(false);
		metrics.addSegment(inbox);
		metrics.removeSegment(inbox);
		metrics.removeSegment(inbox);
		expect(metrics.segmentUnmountCache.get(key)).toBe(1);
		metrics.addSegment(inbox);
		metrics.removeSegment(inbox);
		expect(metrics.segmentUnmountCache.get(key)).toBe(2);
	});

	it('retains interaction history after unmount but excludes it from a later interaction', () => {
		passGate('platform_ufo_fix_stale_segment_cache');
		metrics.addSegment(inbox);
		const current = startInteraction('current');
		metrics.removeSegment(inbox);

		expect(current.knownSegments).toEqual([{ labelStack: inbox }]);
		expect(startInteraction('next').knownSegments).toEqual([]);
	});
});
