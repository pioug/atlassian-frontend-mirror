import type { InteractionMetrics } from '../../common';
import { setUFOConfig } from '../../config';
import { unpackResourceTimings } from '../../resource-timing/common/utils/compact-resource-timing';
import { configure } from '../../resource-timing/common/utils/config';
import { createPayloads } from '../index';

Object.defineProperty(global, 'window', {
	value: {
		location: { hostname: 'test-host' },
		__UFO_COMPACT_PAYLOAD__: false,
	},
	writable: true,
});

const originalPerformance = global.performance;
const originalPerformanceObserver = global.PerformanceObserver;

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
};

function getInteractionMetrics(payloads: Awaited<ReturnType<typeof createPayloads>>) {
	const mainPayload = payloads.find(
		(payload: any) =>
			payload.actionSubject === 'experience' &&
			payload.action === 'measured' &&
			payload.attributes?.properties?.interactionMetrics,
	);

	return (mainPayload?.attributes?.properties as any)?.interactionMetrics;
}

describe('resource timing compression payload', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers();

		Object.defineProperty(document, 'visibilityState', {
			value: 'visible',
			writable: true,
		});
		Object.defineProperty(document, 'hidden', {
			value: false,
			writable: true,
		});

		configure({
			sanitiseEndpoints: (url: string) => url,
			mapResources: (url: string) => url,
		});
		setUFOConfig({
			enabled: true,
			product: 'test-product',
			region: 'test-region',
		});

		global.PerformanceObserver = jest.fn().mockImplementation((callback) => {
			Promise.resolve().then(() => {
				callback({
					getEntries: () => [],
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
				if (type === 'paint' || type === 'largest-contentful-paint' || type === 'navigation') {
					return [];
				}
				if (type === 'resource') {
					return [
						{
							name: 'https://example.com/static/app.js',
							initiatorType: 'script',
							startTime: 1010,
							duration: 40,
							workerStart: 1000,
							fetchStart: 1010,
							responseStart: 1030,
							requestStart: 1020,
							transferSize: 1024,
							encodedBodySize: 900,
							decodedBodySize: 1800,
							serverTiming: [{ name: 'atl-edge', duration: 12 }],
						},
						{
							name: 'https://example.com/gateway/api?operationName=GetIssue',
							initiatorType: 'fetch',
							startTime: 1020,
							duration: 70,
							workerStart: 1000,
							fetchStart: 1020,
							responseStart: 1050,
							requestStart: 1025,
							transferSize: 2048,
							encodedBodySize: 1500,
							decodedBodySize: 3000,
							serverTiming: [{ name: 'atl-edge', duration: 30 }],
						},
					];
				}
				return [];
			}),
		} as any;
		(window as any).performance = global.performance;
		(window as any).PerformanceObserver = global.PerformanceObserver;
	});

	afterEach(() => {
		jest.useRealTimers();
		global.performance = originalPerformance;
		global.PerformanceObserver = originalPerformanceObserver;
	});
	it('emits compact resource timing entries', async () => {
		const payloads = await createPayloads('test-interaction', interaction);
		const interactionMetrics = getInteractionMetrics(payloads);

		expect(interactionMetrics.resourceTimings).toEqual({
			v: 1,
			r: [
				expect.objectContaining({
					l: 'https://example.com/static/app.js',
					rt: 0,
					st: 10,
					du: 40,
					ws: 0,
					fs: 10,
					tb: 30,
					tr: 0,
					sz: 1024,
				}),
				expect.objectContaining({
					l: 'https://example.com/gateway/api?operationName=GetIssue',
					rt: 2,
					st: 20,
					du: 70,
					ws: 0,
					fs: 20,
					tb: 50,
					rq: 25,
					sz: 2048,
				}),
			],
		});
		expect(unpackResourceTimings(interactionMetrics.resourceTimings)).toEqual([
			{
				label: 'https://example.com/static/app.js',
				data: {
					startTime: 10,
					duration: 40,
					workerStart: 0,
					fetchStart: 10,
					type: 'script',
					ttfb: 30,
					transferType: 'network',
					size: 1024,
				},
			},
			{
				label: 'https://example.com/gateway/api?operationName=GetIssue',
				data: {
					startTime: 20,
					duration: 70,
					workerStart: 0,
					fetchStart: 20,
					type: 'fetch',
					ttfb: 50,
					requestStart: 25,
					size: 2048,
				},
			},
		]);
	});
});
