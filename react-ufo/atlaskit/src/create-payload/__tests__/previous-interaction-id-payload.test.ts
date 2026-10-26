import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import type { InteractionMetrics } from '../../common';
import { setUFOConfig } from '../../config';
import { createPayloads } from '../createPayloads';

const originalPerformance = global.performance;
const originalPerformanceObserver = global.PerformanceObserver;

function createMinimalInteraction(overrides: Partial<InteractionMetrics> = {}): InteractionMetrics {
	return {
		id: 'test-interaction',
		start: 1000,
		end: 2000,
		ufoName: 'inline-edit',
		type: 'press',
		marks: [],
		customData: [],
		cohortingCustomData: new Map(),
		customTimings: [],
		spans: [],
		requestInfo: [],
		reactProfilerTimings: [],
		holdInfo: [],
		holdActive: new Map(),
		preloadInfo: [],
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
		previousInteractionName: 'work-item',
		previousInteractionId: 'previous-page-load-id',
		isPreviousInteractionAborted: false,
		abortReason: undefined,
		minorInteractions: [],
		...overrides,
	};
}

async function getInteractionMetrics(interaction: InteractionMetrics) {
	const payloads = await createPayloads('test-interaction', interaction);
	const mainPayload = payloads.find(
		(payload) =>
			payload.actionSubject === 'experience' &&
			payload.action === 'measured' &&
			payload.attributes?.properties?.interactionMetrics,
	);
	return mainPayload?.attributes?.properties?.interactionMetrics as Record<string, unknown>;
}

describe('createPayloads previous interaction id', () => {
	beforeEach(() => {
		jest.useFakeTimers();
		Object.defineProperty(global, 'window', {
			value: {
				location: { hostname: 'test-host' },
				__UFO_COMPACT_PAYLOAD__: false,
			},
			writable: true,
		});
		global.PerformanceObserver = jest.fn().mockImplementation(() => ({
			observe: jest.fn(),
			disconnect: jest.fn(),
		})) as any;
		global.performance = {
			...originalPerformance,
			now: jest.fn(() => 1000),
			mark: jest.fn(),
			measure: jest.fn(),
			getEntriesByType: jest.fn(() => []),
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

	it('emits previousInteractionId when the gate is enabled and the id is present', async () => {
		passGate('platform_ufo_emit_previous_interaction_id');
		const interactionMetrics = await getInteractionMetrics(createMinimalInteraction());

		expect(interactionMetrics.previousInteractionName).toBe('work-item');
		expect(interactionMetrics.previousInteractionId).toBe('previous-page-load-id');
	});

	it('leaves previousInteractionId undefined when absent from the interaction', async () => {
		passGate('platform_ufo_emit_previous_interaction_id');
		const interaction = createMinimalInteraction();
		delete interaction.previousInteractionId;

		const interactionMetrics = await getInteractionMetrics(interaction);

		expect(interactionMetrics.previousInteractionName).toBe('work-item');
		expect(interactionMetrics.previousInteractionId).toBeUndefined();
	});

	it('omits previousInteractionId when the gate is disabled', async () => {
		failGate('platform_ufo_emit_previous_interaction_id');
		const interactionMetrics = await getInteractionMetrics(createMinimalInteraction());

		expect(interactionMetrics.previousInteractionName).toBe('work-item');
		expect(interactionMetrics).not.toHaveProperty('previousInteractionId');
	});
});
