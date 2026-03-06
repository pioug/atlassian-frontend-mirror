import { fg } from '@atlaskit/platform-feature-flags';

import type { InteractionMetrics } from '../../common';
import { setUFOConfig } from '../../config';
import { createPayloads } from '../index';

jest.mock('@atlaskit/platform-feature-flags');
const mockFg = fg as jest.Mock;

const minimalInteraction: InteractionMetrics = {
	id: 'test-interaction',
	start: 1000,
	end: 2000,
	ufoName: 'disabled-experience',
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

describe('createPayloads – platform_ufo_disable_ufo_names_config', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		setUFOConfig({
			enabled: true,
			product: 'test-product',
			region: 'test-region',
		});
	});

	it('returns empty array when feature flag is on and interaction ufo name is in config.disabledUfoNames', async () => {
		mockFg.mockImplementation((flag: string) => flag === 'platform_ufo_disable_ufo_names_config');
		setUFOConfig({
			enabled: true,
			product: 'test-product',
			region: 'test-region',
			disabledUfoNames: ['disabled-experience'],
		});

		const payloads = await createPayloads('test-interaction', minimalInteraction);

		expect(payloads).toEqual([]);
	});

	it('returns empty array when feature flag is on and ufo name override is in config.disabledUfoNames', async () => {
		mockFg.mockImplementation((flag: string) => flag === 'platform_ufo_disable_ufo_names_config');
		setUFOConfig({
			enabled: true,
			product: 'test-product',
			region: 'test-region',
			disabledUfoNames: ['overridden-name'],
			ufoNameOverrides: {
				'original-name': { '': 'overridden-name' },
			},
		});

		const interaction: InteractionMetrics = {
			...minimalInteraction,
			ufoName: 'original-name',
		};
		const payloads = await createPayloads('test-interaction', interaction);

		expect(payloads).toEqual([]);
	});

	describe('when feature flag is on but config.disabledUfoNames is not defined or empty', () => {
		const originalPerformance = global.performance;
		const originalPerformanceObserver = global.PerformanceObserver;

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
					if (type === 'largest-contentful-paint') return [];
					if (type === 'navigation') return [];
					return [];
				}),
			} as any;
		});

		afterEach(() => {
			jest.useRealTimers();
			global.performance = originalPerformance;
			global.PerformanceObserver = originalPerformanceObserver;
		});

		it('does not return early when disabledUfoNames is undefined', async () => {
			mockFg.mockImplementation((flag: string) => flag === 'platform_ufo_disable_ufo_names_config');
			setUFOConfig({
				enabled: true,
				product: 'test-product',
				region: 'test-region',
				// disabledUfoNames omitted (undefined)
			});

			const payloads = await createPayloads('test-interaction', minimalInteraction);

			expect(Array.isArray(payloads)).toBe(true);
			expect(payloads.length).toBeGreaterThan(0);
		});

		it('does not return early when disabledUfoNames is empty array', async () => {
			mockFg.mockImplementation((flag: string) => flag === 'platform_ufo_disable_ufo_names_config');
			setUFOConfig({
				enabled: true,
				product: 'test-product',
				region: 'test-region',
				disabledUfoNames: [],
			});

			const payloads = await createPayloads('test-interaction', minimalInteraction);

			expect(Array.isArray(payloads)).toBe(true);
			expect(payloads.length).toBeGreaterThan(0);
		});
	});
});
