/**
 * Tests for B3: cross-segment deduplication in addIframeSegmentData.
 *
 * B3 rejects iframe timing entries that are identical by content to one already stored
 * on the same interaction. Shared CSS/JS resources dedupe across segments, while backend
 * fetch/XHR resource timings include segment scope so independent iframe requests are retained.
 */
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { setUFOConfig } from '../../config';
import { DefaultInteractionID } from '../../interaction-id-context';
import { interactions } from '../common/constants';
import { addIframeSegmentData, addNewInteraction } from '../index';

const mockPerformanceNow = jest.fn(() => 1000);
Object.defineProperty(global.performance, 'now', {
	writable: true,
	value: mockPerformanceNow,
});

const mockSetTimeout = jest.fn();
const mockClearTimeout = jest.fn();
global.setTimeout = mockSetTimeout as any;
global.clearTimeout = mockClearTimeout as any;

function setupInteraction(interactionId: string, isSegmentTimingsGateEnabled = true) {
	if (isSegmentTimingsGateEnabled) {
		passGate('platform_ufo_3p_segment_timings');
	} else {
		failGate('platform_ufo_3p_segment_timings');
	}

	mockSetTimeout.mockImplementation((fn: () => void, delay: number) => ({
		id: 'timer',
		fn,
		delay,
	}));
	mockClearTimeout.mockImplementation(() => {});
	addNewInteraction(interactionId, 'test-ufo', 'page_load', 1000, 1, null, null, null);
}

describe('addIframeSegmentData — B3 cross-segment deduplication', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		interactions.clear();
		DefaultInteractionID.current = null;
		mockPerformanceNow.mockReturnValue(1000);

		setUFOConfig({
			enabled: true,
			product: 'test-product',
			region: 'test-region',
		});
	});

	afterEach(() => {
		interactions.clear();
		DefaultInteractionID.current = null;
	});

	it('stores the first entry from a segment normally', () => {
		const id = 'b3-test-1';
		setupInteraction(id);

		addIframeSegmentData(id, 'seg-a', {
			label: 'resource-timing',
			data: { label: 'forge-ui-kit.js', startTime: 100, duration: 50 },
		});

		const interaction = interactions.get(id)!;
		expect(interaction.segment3pTimings?.['seg-a']).toHaveLength(1);
	});

	it('stores the same entry from the same segment twice (within-segment dedup is handled elsewhere)', () => {
		const id = 'b3-test-2';
		setupInteraction(id);

		const entry = {
			label: 'resource-timing',
			data: { label: 'forge-ui-kit.js', startTime: 100, duration: 50 },
		};
		addIframeSegmentData(id, 'seg-a', entry);
		addIframeSegmentData(id, 'seg-a', entry);

		// B3 dedup key doesn't include segmentId, so second call hits the seen Set and is rejected
		const interaction = interactions.get(id)!;
		expect(interaction.segment3pTimings?.['seg-a']).toHaveLength(1);
	});

	it('rejects identical resource-timing from a second segment (cross-segment dedup)', () => {
		const id = 'b3-test-3';
		setupInteraction(id);

		const sharedResource = {
			label: 'resource-timing',
			data: { label: 'forge-ui-kit.js', startTime: 100, duration: 50 },
		};

		addIframeSegmentData(id, 'seg-a', sharedResource);
		addIframeSegmentData(id, 'seg-b', sharedResource); // should be rejected

		const interaction = interactions.get(id)!;
		// seg-a gets the entry; seg-b's entry is deduplicated away
		expect(interaction.segment3pTimings?.['seg-a']).toHaveLength(1);
		expect(interaction.segment3pTimings?.['seg-b']).toBeUndefined();
	});

	it('keeps resource-timing entries with different shaped labels or timings across segments', () => {
		const id = 'b3-test-4';
		setupInteraction(id);

		addIframeSegmentData(id, 'seg-a', {
			label: 'resource-timing',
			data: { label: 'forge-ui-kit.js', startTime: 100, duration: 50 },
		});
		addIframeSegmentData(id, 'seg-b', {
			label: 'resource-timing',
			data: { label: 'forge-bridge.js', startTime: 200, duration: 80 }, // different asset label
		});
		addIframeSegmentData(id, 'seg-c', {
			label: 'resource-timing',
			data: {
				label: 'https://api.example.com/rest/api/content/123',
				type: 'fetch',
				startTime: 200,
				duration: 80,
				fetchStart: 205,
				requestStart: 220,
				ttfb: 260,
			},
		});
		addIframeSegmentData(id, 'seg-d', {
			label: 'resource-timing',
			data: {
				label: 'https://api.example.com/rest/api/content/456',
				type: 'fetch',
				startTime: 200,
				duration: 80,
				fetchStart: 210,
				requestStart: 230,
				ttfb: 270,
			},
		});

		const interaction = interactions.get(id)!;
		expect(interaction.segment3pTimings?.['seg-a']).toHaveLength(1);
		expect(interaction.segment3pTimings?.['seg-b']).toHaveLength(1);
		expect(interaction.segment3pTimings?.['seg-c']).toHaveLength(1);
		expect(interaction.segment3pTimings?.['seg-d']).toHaveLength(1);
	});

	it('keeps identical backend resource-timing entries from different segments', () => {
		const id = 'b3-test-4-backend';
		setupInteraction(id);

		const backendResource = {
			label: 'resource-timing',
			data: {
				label: 'https://api.example.com/rest/api/content/123',
				type: 'fetch',
				startTime: 200,
				duration: 80,
				fetchStart: 205,
				requestStart: 220,
				ttfb: 260,
			},
		};

		addIframeSegmentData(id, 'seg-a', backendResource);
		addIframeSegmentData(id, 'seg-b', backendResource);

		const interaction = interactions.get(id)!;
		expect(interaction.segment3pTimings?.['seg-a']).toHaveLength(1);
		expect(interaction.segment3pTimings?.['seg-b']).toHaveLength(1);
	});

	it('dedupes shared CSS/JS assets across segments without using backend-only timing fields', () => {
		const id = 'b3-test-4-assets';
		setupInteraction(id);

		addIframeSegmentData(id, 'seg-a', {
			label: 'resource-timing',
			data: {
				label: 'forge-ui-kit.js',
				type: 'script',
				startTime: 100,
				duration: 50,
				fetchStart: 110,
				requestStart: 120,
				ttfb: 150,
			},
		});
		addIframeSegmentData(id, 'seg-b', {
			label: 'resource-timing',
			data: {
				label: 'forge-ui-kit.js',
				type: 'script',
				startTime: 100,
				duration: 50,
				fetchStart: 210,
				requestStart: 220,
				ttfb: 250,
			},
		});

		const interaction = interactions.get(id)!;
		expect(interaction.segment3pTimings?.['seg-a']).toHaveLength(1);
		expect(interaction.segment3pTimings?.['seg-b']).toBeUndefined();
	});

	it('rejects identical non-resource entries (e.g. navigation-timing) across segments', () => {
		const id = 'b3-test-5';
		setupInteraction(id);

		const navEntry = {
			label: 'navigation-timing',
			data: { fetchStart: 0, responseEnd: 300, label: 'app' },
		};

		addIframeSegmentData(id, 'seg-a', navEntry);
		addIframeSegmentData(id, 'seg-b', navEntry); // same data → deduplicated

		const interaction = interactions.get(id)!;
		expect(interaction.segment3pTimings?.['seg-a']).toHaveLength(1);
		expect(interaction.segment3pTimings?.['seg-b']).toBeUndefined();
	});

	it('keeps distinct non-resource entries from different segments', () => {
		const id = 'b3-test-6';
		setupInteraction(id);

		addIframeSegmentData(id, 'seg-a', {
			label: 'paint-timing',
			data: { name: 'first-contentful-paint', startTime: 400 },
		});
		addIframeSegmentData(id, 'seg-b', {
			label: 'paint-timing',
			data: { name: 'first-contentful-paint', startTime: 600 }, // different startTime
		});

		const interaction = interactions.get(id)!;
		expect(interaction.segment3pTimings?.['seg-a']).toHaveLength(1);
		expect(interaction.segment3pTimings?.['seg-b']).toHaveLength(1);
	});

	it('always stores segment-timing-abort entries, bypassing cross-segment dedup', () => {
		const id = 'b3-test-7';
		setupInteraction(id);

		const abortEntry = {
			label: 'segment-timing-abort',
			data: { reason: 'timeout', abortAfterMs: 6000 },
		};

		addIframeSegmentData(id, 'seg-a', abortEntry);
		addIframeSegmentData(id, 'seg-b', abortEntry); // must NOT be deduped

		const interaction = interactions.get(id)!;
		expect(interaction.segment3pTimings?.['seg-a']).toHaveLength(1);
		expect(interaction.segment3pTimings?.['seg-b']).toHaveLength(1);
	});

	it('does nothing when feature gate platform_ufo_3p_segment_timings is off', () => {
		const id = 'b3-test-8';
		setupInteraction(id, false);

		addIframeSegmentData(id, 'seg-a', {
			label: 'resource-timing',
			data: { label: 'forge-ui-kit.js', startTime: 100, duration: 50 },
		});

		const interaction = interactions.get(id)!;
		expect(interaction.segment3pTimings).toBeUndefined();
		expect(interaction.segment3pCrossSegmentSeen).toBeUndefined();
	});

	it('initialises segment3pCrossSegmentSeen lazily on first entry', () => {
		const id = 'b3-test-9';
		setupInteraction(id);

		// Before any call, the Set should not exist
		expect(interactions.get(id)!.segment3pCrossSegmentSeen).toBeUndefined();

		addIframeSegmentData(id, 'seg-a', {
			label: 'resource-timing',
			data: { label: 'forge-ui-kit.js', startTime: 100, duration: 50 },
		});

		expect(interactions.get(id)!.segment3pCrossSegmentSeen).toBeInstanceOf(Set);
		expect(interactions.get(id)!.segment3pCrossSegmentSeen!.size).toBe(1);
	});

	it('handles N iframes sharing the same CDN resources — only first stored per resource', () => {
		const id = 'b3-test-10';
		setupInteraction(id);

		const sharedResources = [
			{
				label: 'resource-timing',
				data: { label: 'forge-ui-kit.js', startTime: 100, duration: 50 },
			},
			{
				label: 'resource-timing',
				data: { label: 'forge-bridge.js', startTime: 110, duration: 30 },
			},
			{ label: 'resource-timing', data: { label: 'react.js', startTime: 120, duration: 20 } },
		];

		const segments = ['seg-a', 'seg-b', 'seg-c', 'seg-d']; // 4 iframes

		for (const seg of segments) {
			for (const resource of sharedResources) {
				addIframeSegmentData(id, seg, resource);
			}
		}

		const interaction = interactions.get(id)!;
		const allEntries = Object.values(interaction.segment3pTimings ?? {}).flat();

		// Only 3 unique resources stored total, not 3 × 4 = 12
		expect(allEntries).toHaveLength(3);
		// All stored under the first segment that reported each resource
		expect(interaction.segment3pTimings?.['seg-a']).toHaveLength(3);
		expect(interaction.segment3pTimings?.['seg-b']).toBeUndefined();
		expect(interaction.segment3pTimings?.['seg-c']).toBeUndefined();
		expect(interaction.segment3pTimings?.['seg-d']).toBeUndefined();
	});
});
