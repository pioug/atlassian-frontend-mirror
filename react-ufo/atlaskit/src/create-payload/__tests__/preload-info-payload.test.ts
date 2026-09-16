import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import type { InteractionMetrics } from '../../common';
import type { PreloadInfo } from '../../common/common/types';
import { setUFOConfig } from '../../config';
import { createPayloads } from '../createPayloads';

Object.defineProperty(global, 'window', {
	value: {
		location: { hostname: 'test-host' },
		__UFO_COMPACT_PAYLOAD__: false,
	},
	writable: true,
});

const originalPerformance = global.performance;
const originalPerformanceObserver = global.PerformanceObserver;

function buildInteraction(preloadInfo: PreloadInfo[] = []): InteractionMetrics {
	return {
		id: 'test-interaction',
		start: 1000,
		end: 2000,
		ufoName: 'test-ufo-name',
		type: 'transition',
		marks: [],
		customData: [],
		cohortingCustomData: new Map(),
		customTimings: [],
		spans: [],
		requestInfo: [],
		reactProfilerTimings: [],
		holdInfo: [],
		holdActive: new Map(),
		preloadInfo,
		measureStart: 1000,
		rate: 1,
		cancelCallbacks: [],
		metaData: {},
		errors: [],
		apdex: [],
		labelStack: null,
		routeName: 'test-route',
		knownSegments: [],
		cleanupCallbacks: [],
		awaitReactProfilerCount: 0,
		redirects: [],
		timerID: undefined,
		changeTimeout: jest.fn(),
		trace: null,
		previousInteractionName: undefined,
		isPreviousInteractionAborted: false,
		abortReason: undefined,
		minorInteractions: [],
	} as InteractionMetrics;
}

async function getInteractionMetricsPayload(interaction: InteractionMetrics) {
	const payloads = await createPayloads('test-interaction', interaction);
	const mainPayload = payloads.find(
		(payload: any) =>
			payload.actionSubject === 'experience' &&
			payload.action === 'measured' &&
			payload.attributes?.properties?.interactionMetrics,
	);
	return (mainPayload?.attributes?.properties as any)?.interactionMetrics;
}

describe('Payload creation with preloadInfo', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers();

		const mockObserver = { observe: jest.fn(), disconnect: jest.fn() };
		global.PerformanceObserver = jest.fn().mockImplementation(() => mockObserver) as any;
		global.performance = {
			...originalPerformance,
			now: jest.fn(() => 2000),
			mark: jest.fn(),
			measure: jest.fn(),
			getEntriesByType: jest.fn().mockReturnValue([]),
		} as any;

		Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });
		Object.defineProperty(document, 'hidden', { value: false, writable: true });

		setUFOConfig({
			enabled: true,
			product: 'test-product',
			region: 'test-region',
		} as any);
	});

	afterEach(() => {
		jest.useRealTimers();
		global.performance = originalPerformance;
		global.PerformanceObserver = originalPerformanceObserver;
	});

	it('emits preloadInfo (relativised to start) when the gate is on', async () => {
		passGate('platform_ufo_preload_hold_adoption');

		const interaction = buildInteraction([
			{
				source: 'rrr-entrypoint-test',
				preloadStartedAt: 900,
				adoptedAt: 1050,
				settledAt: 1600,
			},
		]);

		const interactionMetrics = await getInteractionMetricsPayload(interaction);

		expect(interactionMetrics.preloadInfo).toEqual([
			{
				source: 'rrr-entrypoint-test',
				preloadStartedAt: -100,
				adoptedAt: 50,
				settledAt: 600,
			},
		]);
	});

	it('emits a readable name on the corresponding optimized preload hold', async () => {
		passGate('platform_ufo_preload_hold_adoption');
		const source = 'rrr-resource-CURRENT_USER';
		const interaction = buildInteraction([
			{ source, preloadStartedAt: 900, adoptedAt: 1050, settledAt: 1600 },
		]);
		interaction.holdInfo = [
			{
				labelStack: [],
				name: `preload:${source}`,
				start: 1050,
				end: 1600,
			},
		];

		const interactionMetrics = await getInteractionMetricsPayload(interaction);

		expect(interactionMetrics.holdInfo).toEqual([
			expect.objectContaining({
				name: `preload:${source}`,
				startTime: 1050,
				endTime: 1600,
			}),
		]);
	});

	it('omits preloadInfo when the gate is off', async () => {
		failGate('platform_ufo_preload_hold_adoption');
		const interaction = buildInteraction([
			{ source: 'rrr-entrypoint-test', preloadStartedAt: 900, adoptedAt: 1050, settledAt: 1600 },
		]);

		const interactionMetrics = await getInteractionMetricsPayload(interaction);
		expect(interactionMetrics.preloadInfo).toBeUndefined();
	});

	it('omits preloadInfo when empty even if the gate is on', async () => {
		passGate('platform_ufo_preload_hold_adoption');
		const interaction = buildInteraction([]);

		const interactionMetrics = await getInteractionMetricsPayload(interaction);
		expect(interactionMetrics.preloadInfo).toBeUndefined();
	});

	it('omits settledAt for a preload that has not settled', async () => {
		passGate('platform_ufo_preload_hold_adoption');
		const interaction = buildInteraction([
			{ source: 'rrr-resource-test', preloadStartedAt: 950, adoptedAt: 1010 },
		]);

		const interactionMetrics = await getInteractionMetricsPayload(interaction);
		expect(interactionMetrics.preloadInfo).toEqual([
			{ source: 'rrr-resource-test', preloadStartedAt: -50, adoptedAt: 10 },
		]);
		expect(interactionMetrics.preloadInfo[0]).not.toHaveProperty('settledAt');
	});
});
