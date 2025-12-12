import { fg } from '@atlaskit/platform-feature-flags';

import type { InteractionMetrics } from '../../common';
import { setUFOConfig, shouldUseRawDataThirdPartyBehavior } from '../../config';
import { createPayloads } from '../index';

jest.mock('@atlaskit/platform-feature-flags');
const mockFg = fg as jest.Mock;

// Mock window
Object.defineProperty(global, 'window', {
	value: {
		location: { hostname: 'test-host' },
		__UFO_COMPACT_PAYLOAD__: false,
	},
	writable: true,
});

const originalPerformance = global.performance;
const originalPerformanceObserver = global.PerformanceObserver;

describe('Payload Creation with Third-Party Holds', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers();

		// Mock PerformanceObserver
		const mockObserver = {
			observe: jest.fn(),
			disconnect: jest.fn(),
		};

		const mockPerformanceObserverConstructor = jest.fn().mockImplementation((callback) => {
			// Immediately call the callback to simulate LCP entry
			Promise.resolve().then(() => {
				callback({
					getEntries: () => [{ name: 'largest-contentful-paint', startTime: 1200 }],
				});
			});
			return mockObserver;
		});

		global.PerformanceObserver = mockPerformanceObserverConstructor as any;

		// Mock the full performance object with all required methods
		global.performance = {
			...originalPerformance,
			now: jest.fn(() => 1000),
			mark: jest.fn(),
			measure: jest.fn(),
			getEntriesByType: jest.fn().mockImplementation((type) => {
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

		// Set default config
		setUFOConfig({
			enabled: true,
			product: 'test-product',
			region: 'test-region',
			enableVCRawDataRates: {
				enabled: true,
				rates: { 'test-ufo-name': 0.5 },
			},
		});

		// Mock feature flags
		mockFg.mockImplementation((flag: string) => {
			if (flag === 'platform_ufo_raw_data_thirdparty') {
				return true;
			}
			return false;
		});
	});

	afterEach(() => {
		jest.useRealTimers();
		global.performance = originalPerformance;
		global.PerformanceObserver = originalPerformanceObserver;
	});

	it('should include hold3pActive and hold3pInfo in payload when feature flag is active', async () => {
		const interaction: InteractionMetrics = {
			id: 'test-interaction',
			start: 1000,
			end: 2000,
			ufoName: 'test-ufo-name',
			type: 'page_load',
			marks: [],
			customData: [],
			cohortingCustomData: new Map(),
			customTimings: [],
			spans: [],
			requestInfo: [],
			reactProfilerTimings: [],
			holdInfo: [],
			holdExpInfo: [],
			holdActive: new Map(),
			holdExpActive: new Map(),
			hold3pActive: new Map([
				[
					'hold-id-1',
					{
						labelStack: [{ name: 'segment1', type: 'third-party' as const }],
						name: '3p-hold',
						start: 1500,
					},
				],
			]),
			hold3pInfo: [
				{
					labelStack: [{ name: 'segment1', type: 'third-party' as const }],
					name: '3p-hold-completed',
					start: 1200,
					end: 1800,
				},
			],
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
		};

		// Mock page visibility to ensure detailed payload is created
		Object.defineProperty(document, 'visibilityState', {
			value: 'visible',
			writable: true,
		});
		Object.defineProperty(document, 'hidden', {
			value: false,
			writable: true,
		});

		const payloads = await createPayloads('test-interaction', interaction);

		// Find the main interaction metrics payload
		const mainPayload = payloads.find(
			(payload: any) =>
				payload.actionSubject === 'experience' &&
				payload.action === 'measured' &&
				payload.attributes?.properties?.interactionMetrics,
		);

		expect(mainPayload).toBeDefined();

		// Verify that hold3pActive and hold3pInfo are included in the payload
		const interactionMetrics = (mainPayload?.attributes?.properties as any)?.interactionMetrics;
		if (shouldUseRawDataThirdPartyBehavior('test-ufo-name', 'page_load')) {
			expect(interactionMetrics?.hold3pActive).toBeDefined();
			expect(Array.isArray(interactionMetrics?.hold3pActive)).toBe(true);
			expect(interactionMetrics?.hold3pInfo).toBeDefined();
		}

		expect(Array.isArray(interactionMetrics?.hold3pInfo)).toBe(true);
	});

	it('should not include hold3pActive and hold3pInfo when feature flag is disabled', async () => {
		mockFg.mockImplementation((flag: string) => {
			if (flag === 'platform_ufo_raw_data_thirdparty') {
				return false;
			}
			return false;
		});

		const interaction: InteractionMetrics = {
			id: 'test-interaction',
			start: 1000,
			end: 2000,
			ufoName: 'test-ufo-name',
			type: 'page_load',
			marks: [],
			customData: [],
			cohortingCustomData: new Map(),
			customTimings: [],
			spans: [],
			requestInfo: [],
			reactProfilerTimings: [],
			holdInfo: [],
			holdExpInfo: [],
			holdActive: new Map(),
			holdExpActive: new Map(),
			hold3pActive: new Map([
				[
					'hold-id-1',
					{
						labelStack: [{ name: 'segment1', type: 'third-party' as const }],
						name: '3p-hold',
						start: 1500,
					},
				],
			]),
			hold3pInfo: [
				{
					labelStack: [{ name: 'segment1', type: 'third-party' as const }],
					name: '3p-hold-completed',
					start: 1200,
					end: 1800,
				},
			],
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
		};

		// Mock page visibility to ensure detailed payload is created
		Object.defineProperty(document, 'visibilityState', {
			value: 'visible',
			writable: true,
		});
		Object.defineProperty(document, 'hidden', {
			value: false,
			writable: true,
		});

		const payloads = await createPayloads('test-interaction', interaction);

		// Find the main interaction metrics payload
		const mainPayload = payloads.find(
			(payload: any) =>
				payload.actionSubject === 'experience' &&
				payload.action === 'measured' &&
				payload.attributes?.properties?.interactionMetrics,
		);

		expect(mainPayload).toBeDefined();

		// When feature flag is disabled, hold3pActive and hold3pInfo should not be in the detailed metrics
		const interactionMetrics = (mainPayload?.attributes?.properties as any)?.interactionMetrics;
		expect(interactionMetrics?.hold3pActive).toBeUndefined();
		expect(interactionMetrics?.hold3pInfo).toBeUndefined();
	});
});
