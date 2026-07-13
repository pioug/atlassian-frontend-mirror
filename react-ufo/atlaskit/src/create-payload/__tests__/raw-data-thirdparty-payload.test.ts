import { fg } from '@atlaskit/platform-feature-flags';

import type { InteractionMetrics } from '../../common';
import { setUFOConfig } from '../../config';
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
			vc: {
				enabled: true,
				enabledVCRevisions: {
					all: ['fy26.04'],
				},
			},
			enableVCRawDataRates: {
				enabled: true,
				rates: { 'test-ufo-name': 0.5 },
			},
		});

		// Mock feature flags
		mockFg.mockImplementation(() => false);
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
			holdActive: new Map(),
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

		const properties = mainPayload?.attributes?.properties as any;
		expect(properties?.['ufo:hasAbortingInteractionDuringSSR']).toBe(false);

		// Verify that hold3pActive and hold3pInfo are included in the payload
		const interactionMetrics = properties?.interactionMetrics;
		expect(interactionMetrics?.hold3pActive).toBeDefined();
		expect(Array.isArray(interactionMetrics?.hold3pActive)).toBe(true);
		expect(interactionMetrics?.hold3pInfo).toBeDefined();
		expect(Array.isArray(interactionMetrics?.hold3pInfo)).toBe(true);
	});

	it('should include generic metricWindows, lifecycleObservations, and window-specific profiler timings', async () => {
		const interaction: InteractionMetrics = {
			id: 'test-interaction',
			start: 1000,
			end: 2000,
			end3p: 3000,
			ufoName: 'test-ufo-name',
			type: 'page_load',
			marks: [],
			customData: [],
			cohortingCustomData: new Map(),
			customTimings: [],
			spans: [],
			requestInfo: [],
			reactProfilerTimings: [
				{
					labelStack: [{ name: 'standard-segment' }],
					type: 'mount',
					actualDuration: 10,
					baseDuration: 10,
					startTime: 1500,
					commitTime: 1600,
				},
				{
					labelStack: [{ name: 'crossing-segment' }],
					type: 'update',
					actualDuration: 15,
					baseDuration: 15,
					startTime: 1900,
					commitTime: 2100,
				},
				{
					labelStack: [{ name: 'late-segment' }],
					type: 'update',
					actualDuration: 20,
					baseDuration: 20,
					startTime: 2500,
					commitTime: 2600,
				},
			],
			holdInfo: [],
			holdActive: new Map(),
			hold3pActive: new Map(),
			hold3pInfo: [
				{
					labelStack: [{ name: 'segment1', type: 'third-party' as const }],
					name: '3p-hold-completed',
					start: 1200,
					end: 3000,
				},
			],
			metricWindows: {
				standard: {
					start: 1000,
					end: 2000,
					includeCategories: [],
					excludeCategories: ['third-party'],
				},
				'include-third-party': {
					start: 1000,
					end: 3000,
					includeCategories: ['third-party'],
					excludeCategories: [],
				},
			},
			lifecycleObservations: [
				{
					type: 'new_interaction_started',
					timestamp: 2500.4,
					triggerName: 'next-interaction',
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

		Object.defineProperty(document, 'visibilityState', {
			value: 'visible',
			writable: true,
		});
		Object.defineProperty(document, 'hidden', {
			value: false,
			writable: true,
		});

		const payloads = await createPayloads('test-interaction', interaction);
		const mainPayload = payloads.find(
			(payload: any) =>
				payload.actionSubject === 'experience' &&
				payload.action === 'measured' &&
				payload.attributes?.properties?.interactionMetrics,
		);
		const interactionMetrics = (mainPayload?.attributes?.properties as any)?.interactionMetrics;

		expect(interactionMetrics.metricWindows).toEqual({
			standard: {
				start: 1000,
				end: 2000,
				includeCategories: [],
				excludeCategories: ['third-party'],
			},
			'include-third-party': {
				start: 1000,
				end: 3000,
				includeCategories: ['third-party'],
				excludeCategories: [],
			},
		});
		expect(interactionMetrics.reactProfilerTimings).toEqual([
			expect.objectContaining({
				labelStack: 'standard-segment',
				startTime: 1500,
				endTime: 1600,
			}),
			expect.objectContaining({
				labelStack: 'crossing-segment',
				startTime: 1900,
				endTime: 2100,
			}),
		]);
		expect(interactionMetrics.reactProfilerTimingsByMetricWindow['include-third-party']).toEqual([
			expect.objectContaining({
				labelStack: 'standard-segment',
				startTime: 1500,
				endTime: 1600,
			}),
			expect.objectContaining({
				labelStack: 'crossing-segment',
				startTime: 1900,
				endTime: 2100,
			}),
			expect.objectContaining({
				labelStack: 'late-segment',
				startTime: 2500,
				endTime: 2600,
			}),
		]);

		expect(interactionMetrics.lifecycleObservations).toEqual([
			{
				type: 'new_interaction_started',
				timestamp: 2500,
				triggerName: 'next-interaction',
			},
		]);
	});

	describe('raw-handler payload size preservation', () => {
		const createLargeInteraction = (): InteractionMetrics =>
			({
				id: 'test-interaction',
				start: 1000,
				end: 2000,
				ufoName: 'test-ufo-name',
				type: 'page_load',
				marks: [],
				customData: [
					{
						labelStack: [],
						data: {
							large: 'x'.repeat(260 * 1024),
						},
					},
				],
				cohortingCustomData: new Map(),
				customTimings: [],
				spans: [],
				requestInfo: [],
				featureFlags: {
					prior: {
						preservedFlag: true,
					},
					during: {
						preservedFlag: false,
					},
				},
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
				vcObserver: {
					start: jest.fn(),
					stop: jest.fn(),
					getVCRawData: jest.fn().mockReturnValue(null),
					getVCResult: jest.fn().mockResolvedValue({
						'ufo:vc:rev': [
							{
								revision: 'raw-handler',
								clean: true,
								'metric:vc90': null,
								rawData: {
									obs: [{ t: 0, r: [0, 0, 100, 100], eid: 1, chg: 1 }],
									eid: { 1: 'div.test' },
									chg: { 1: 'mutation:element' },
								},
								viewport: { w: 100, h: 100 },
							},
						],
					}),
					setSSRElement: jest.fn(),
					setReactRootRenderStart: jest.fn(),
					setReactRootRenderStop: jest.fn(),
					collectSSRPlaceholders: jest.fn(),
				},
			}) as unknown as InteractionMetrics;

		it('should remove raw-handler when payload is over budget and always emit raw-handler gate is off', async () => {
			const payloads = await createPayloads('test-interaction', createLargeInteraction());
			const mainPayload = payloads.find(
				(payload: any) =>
					payload.actionSubject === 'experience' &&
					payload.action === 'measured' &&
					payload.attributes?.properties?.interactionMetrics,
			);
			const properties = mainPayload?.attributes?.properties as any;

			expect(properties?.['ufo:vc:raw:removed']).toBe(true);
			expect(properties?.['ufo:vc:raw:preservedOverBudget']).toBeUndefined();
			expect(properties?.interactionMetrics?.featureFlags).toEqual({
				prior: {
					preservedFlag: true,
				},
				during: {
					preservedFlag: false,
				},
			});
			expect(properties?.['event:trimmedFields']).not.toContain('interactionMetrics.featureFlags');
			expect(
				properties?.['ufo:vc:rev']?.find((rev: any) => rev.revision === 'raw-handler'),
			).toBeUndefined();
		});

		it('should preserve raw-handler when payload is over budget and always emit raw-handler gate is on', async () => {
			mockFg.mockImplementation((flag: string) => flag === 'platform_ufo_always_emit_raw_handler');

			const payloads = await createPayloads('test-interaction', createLargeInteraction());
			const mainPayload = payloads.find(
				(payload: any) =>
					payload.actionSubject === 'experience' &&
					payload.action === 'measured' &&
					payload.attributes?.properties?.interactionMetrics,
			);
			const properties = mainPayload?.attributes?.properties as any;

			expect(properties?.['ufo:vc:raw:removed']).toBeUndefined();
			expect(properties?.['ufo:vc:raw:preservedOverBudget']).toBe(true);
			expect(
				properties?.['ufo:vc:rev']?.find((rev: any) => rev.revision === 'raw-handler'),
			).toBeDefined();
		});
	});
});
