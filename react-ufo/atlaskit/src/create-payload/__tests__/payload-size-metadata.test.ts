import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import type { InteractionMetrics } from '../../common';
import { setUFOConfig } from '../../config';
import { createPayloads } from '../index';
import { SAFE_PAYLOAD_SIZE_GATE } from '../utils/get-payload-size';

const originalPerformance = global.performance;
const originalPerformanceObserver = global.PerformanceObserver;

function createMinimalInteraction(
	customData: InteractionMetrics['customData'] = [],
): InteractionMetrics {
	return {
		id: 'test-interaction',
		start: 1000,
		end: 2000,
		ufoName: 'test-ufo-name',
		type: 'page_load',
		marks: [],
		customData,
		cohortingCustomData: new Map(),
		customTimings: [],
		spans: [],
		requestInfo: [],
		reactProfilerTimings: [],
		holdInfo: [],
		holdActive: new Map(),
		hold3pActive: new Map(),
		hold3pInfo: [],
		measureStart: 1000,
		rate: 1,
		cancelCallbacks: [],
		metaData: {},
		errors: [],
		apdex: [],
		labelStack: null,
		routeName: null,
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
	};
}

function getMainPayload(payloads: Awaited<ReturnType<typeof createPayloads>>) {
	return payloads.find(
		(payload) =>
			payload.actionSubject === 'experience' &&
			payload.action === 'measured' &&
			payload.attributes?.properties?.interactionMetrics,
	);
}

describe('createPayloads payload size serialization metadata', () => {
	beforeEach(() => {
		jest.useFakeTimers();
		Object.defineProperty(global, 'window', {
			value: {
				location: { hostname: 'test-host' },
				__UFO_COMPACT_PAYLOAD__: false,
			},
			writable: true,
		});
		global.PerformanceObserver = jest.fn().mockImplementation((callback: (list: any) => void) => {
			Promise.resolve().then(() => {
				callback({
					getEntries: () => [{ name: 'largest-contentful-paint', startTime: 1200 }],
				});
			});
			return { observe: jest.fn(), disconnect: jest.fn() };
		}) as any;
		global.performance = {
			...originalPerformance,
			now: jest.fn(() => 1000),
			mark: jest.fn(),
			measure: jest.fn(),
			getEntriesByType: jest.fn().mockImplementation((type: string) => {
				if (type === 'paint') {
					return [
						{ name: 'first-paint', startTime: 500 },
						{ name: 'first-contentful-paint', startTime: 750 },
					];
				}
				if (type === 'largest-contentful-paint') {
					return [];
				}
				if (type === 'navigation') {
					return [];
				}
				return [];
			}),
		} as any;

		setUFOConfig({
			enabled: true,
			product: 'test-product',
			region: 'test-region',
		});
	});

	afterEach(() => {
		jest.useRealTimers();
		global.performance = originalPerformance;
		global.PerformanceObserver = originalPerformanceObserver;
	});

	it('emits safe serializer metadata when payload sizing replaces unsafe values', async () => {
		passGate(SAFE_PAYLOAD_SIZE_GATE);
		const circular: any = {};
		circular.self = circular;
		const interaction = createMinimalInteraction([
			{ labelStack: [{ name: 'unsafe-custom-data' }], data: circular },
		]);

		const payloads = await createPayloads('test-interaction', interaction);
		const properties = getMainPayload(payloads)?.attributes?.properties as Record<string, unknown>;

		expect(properties['event:payloadSizeUsedSafeSerializer']).toBe(true);
		expect(properties['event:payloadSizeSerializationFailed']).toBeUndefined();
	});

	it('preserves legacy sizing behavior when the safe serializer gate is off', async () => {
		failGate(SAFE_PAYLOAD_SIZE_GATE);
		const circular: any = {};
		circular.self = circular;
		const interaction = createMinimalInteraction([
			{ labelStack: [{ name: 'unsafe-custom-data' }], data: circular },
		]);

		await expect(createPayloads('test-interaction', interaction)).rejects.toThrow(
			'Converting circular structure to JSON',
		);
	});
});
