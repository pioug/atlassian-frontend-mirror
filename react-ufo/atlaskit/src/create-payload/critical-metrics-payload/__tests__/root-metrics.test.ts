import type { InteractionMetrics } from '../../../common';
import { createRootCriticalMetricsPayload } from '../root-metrics';

jest.mock('../../../config', () => ({
	getConfig: () => ({ product: 'jira', region: 'us' }),
}));
jest.mock('../../../hidden-timing', () => ({
	getPageVisibilityState: jest.fn(() => 'visible'),
}));
jest.mock('../../utils/get-page-visibility-up-to-ttai', () => jest.fn(() => 'visible'));
jest.mock('../../utils/get-interaction-status', () =>
	jest.fn(() => ({ originalInteractionStatus: 'SUCCEEDED' })),
);
jest.mock('../../common/utils', () => ({ sanitizeUfoName: (name: string) => name }));
jest.mock('../../utils/get-ttai', () => jest.fn(() => 1234));
jest.mock('../../utils/get-paint-metrics', () => jest.fn(async () => ({ fp: 1, fcp: 2, lcp: 3 })));
jest.mock('../../utils/get-navigation-metrics', () => jest.fn(() => ({ nav: true })));
jest.mock('../../utils/get-ssr-success', () => jest.fn(() => true));
jest.mock('../../utils/get-tti', () => ({ getTTI: jest.fn(() => 5678) }));
jest.mock('../../utils/get-fmp', () => ({ getFMP: jest.fn(() => 4321) }));
jest.mock('../../utils/get-browser-metadata', () =>
	jest.fn(() => ({
		browser: { name: 'chrome', version: '1.0' },
		device: { cpus: 4, memory: 8 },
		network: { effectiveType: '4g', rtt: 50, downlink: 10 },
		time: { localHour: 12, localDayOfWeek: 1, localTimezoneOffset: -480 },
	})),
);
jest.mock('../../../additional-payload', () => ({
	getLighthouseMetrics: () => ({ 'metric:tbt': 10, 'metric:tbt:observed': 11, 'metric:cls': 0.1 }),
}));
jest.mock('../../utils/get-vc-metrics', () => jest.fn(async () => ({ 'ufo:vc:rev': [] })));
jest.mock('../../utils/get-react-ufo-payload-version', () => ({
	LATEST_REACT_UFO_PAYLOAD_VERSION: '1.2.3',
}));

const baseInteraction: InteractionMetrics = {
	id: 'id1',
	start: 1000,
	end: 2000,
	ufoName: 'test-ufo',
	previousInteractionName: undefined,
	isPreviousInteractionAborted: false,
	type: 'page_load',
	marks: [],
	customData: [],
	cohortingCustomData: new Map(),
	customTimings: [],
	spans: [],
	requestInfo: [],
	holdInfo: [],
	holdExpInfo: [],
	holdActive: new Map(),
	holdExpActive: new Map(),
	reactProfilerTimings: [],
	measureStart: 0,
	rate: 1,
	cancelCallbacks: [],
	cleanupCallbacks: [],
	metaData: {},
	errors: [],
	apdex: [],
	labelStack: null,
	routeName: null,
	knownSegments: [],
	awaitReactProfilerCount: 0,
	redirects: [],
	timerID: undefined,
	changeTimeout: () => {},
	trace: null,
};

describe('createRootCriticalMetricsPayload', () => {
	it('should create a valid payload with expected properties', async () => {
		const payload = await createRootCriticalMetricsPayload('id1', baseInteraction);
		expect(payload).not.toBeNull();
		expect(payload).toHaveProperty('actionSubject', 'experience');
		expect(payload).toHaveProperty('action', 'measured');
		expect(payload).toHaveProperty('eventType', 'operational');
		expect(payload).toHaveProperty('source', 'measured');
		expect(payload).toHaveProperty('tags');
		expect(payload!.attributes.properties['event:product']).toBe('jira');
		expect(payload!.attributes.properties['event:region']).toBe('us');
		expect(payload!.attributes.properties['experience:name']).toBe('test-ufo');
		expect(payload!.attributes.properties.metrics).toMatchObject({
			fp: 1,
			fcp: 2,
			lcp: 3,
			ttai: 1234,
			tti: 5678,
			fmp: 4321,
			tbt: 10,
			tbtObserved: 11,
			cls: 0.1,
		});
		expect(payload!.attributes.properties.status).toBe('SUCCEEDED');
		expect(payload!.attributes.properties.errorCount).toBe(0);
	});

	it('should throw if config is missing', async () => {
		jest.resetModules();
		jest.doMock('../../../config', () => ({ getConfig: () => undefined }));
		const { createRootCriticalMetricsPayload: createWithNoConfig } = require('../root-metrics');
		await expect(createWithNoConfig('id1', baseInteraction)).rejects.toThrow(
			'UFO Configuration not provided',
		);
	});

	it('should include cohortingCustomData if present', async () => {
		const interaction = {
			...baseInteraction,
			cohortingCustomData: new Map([
				['foo', 'bar'],
				['baz', '123'],
			]),
		};
		const payload = await createRootCriticalMetricsPayload('id1', interaction);
		expect(payload!.attributes.properties.cohortingCustomData).toEqual({ foo: 'bar', baz: '123' });
	});

	it('should include errorCount if errors are present', async () => {
		const interaction = {
			...baseInteraction,
			errors: [
				{ name: 'err', labelStack: null, errorType: 'type', errorMessage: 'msg' },
				{ name: 'err2', labelStack: null, errorType: 'type2', errorMessage: 'msg2' },
			],
		};
		const payload = await createRootCriticalMetricsPayload('id1', interaction);
		expect(payload!.attributes.properties.errorCount).toBe(2);
	});

	it('should include hold info metrics when holds are present', async () => {
		const interaction = {
			...baseInteraction,
			holdInfo: [
				{ labelStack: [], name: 'hold1', start: 1100, end: 1200 },
				{ labelStack: [], name: 'hold2', start: 1050, end: 1150 },
			],
		};
		const payload = await createRootCriticalMetricsPayload('id1', interaction);
		// Earliest hold should be hold2 (start: 1050), so earliestHoldStart = 1050 - 1000 = 50
		expect(payload!.attributes.properties.metrics.earliestHoldStart).toBe(50);
	});

	it('should include responsiveness metrics when present', async () => {
		const interaction = {
			...baseInteraction,
			responsiveness: {
				inputDelay: 25.7,
				experimentalInputToNextPaint: 150.3,
			},
		};
		const payload = await createRootCriticalMetricsPayload('id1', interaction);
		expect(payload!.attributes.properties.metrics.inputDelay).toBe(26); // rounded
		expect(payload!.attributes.properties.metrics.inp).toBe(150); // rounded
	});

	it('should handle different interaction types', async () => {
		const interaction = {
			...baseInteraction,
			type: 'press' as const,
			routeName: 'test-route',
		};
		const payload = await createRootCriticalMetricsPayload('id1', interaction);
		expect(payload!.attributes.properties.type).toBe('press');
		expect(payload!.attributes.properties.routeName).toBe('test-route');
	});

	it('should include TTVC metrics when provided', async () => {
		const mockVCMetrics = {
			'ufo:vc:rev': [
				{ revision: 'fy25.01', 'metric:vc90': 1500, clean: true },
				{ revision: 'fy25.02', 'metric:vc90': null, clean: true }, // should be filtered out
				{ revision: 'fy25.03', 'metric:vc90': 1600, clean: false }, // should be filtered out
			],
		};

		const payload = await createRootCriticalMetricsPayload('id1', baseInteraction, mockVCMetrics);
		expect(payload!.attributes.properties.metrics.ttvc).toEqual([
			{ revision: 'fy25.01', vc90: 1500 },
		]);
	});

	it('should handle abort reason and related fields', async () => {
		const interaction = {
			...baseInteraction,
			abortReason: 'timeout' as const,
			previousInteractionName: 'previous-interaction',
			isPreviousInteractionAborted: true,
			abortedByInteractionName: 'next-interaction',
		};
		const payload = await createRootCriticalMetricsPayload('id1', interaction);
		expect(payload!.attributes.properties.abortReason).toBe('timeout');
		expect(payload!.attributes.properties.previousInteractionName).toBe('previous-interaction');
		expect(payload!.attributes.properties.isPreviousInteractionAborted).toBe(true);
		expect(payload!.attributes.properties.abortedByInteractionName).toBe('next-interaction');
	});

	it('should include timing information', async () => {
		const payload = await createRootCriticalMetricsPayload('id1', baseInteraction);
		expect(payload!.attributes.properties.start).toBe(1000);
		expect(payload!.attributes.properties.end).toBe(2000);
		expect(payload!.attributes.properties.interactionId).toBe('id1');
		expect(payload!.attributes.properties.rate).toBe(1);
	});

	it('should include event metadata', async () => {
		const payload = await createRootCriticalMetricsPayload('id1', baseInteraction);
		expect(payload!.attributes.properties['event:schema']).toBe('1.0.0');
		expect(payload!.attributes.properties['event:source']).toEqual({
			name: 'react-ufo/web',
			version: '1.2.3',
		});
		expect(payload!.attributes.properties['experience:key']).toBe('custom.ufo.critical-metrics');
	});
});
