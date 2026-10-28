/**
 * @jest-environment node
 */

import { FlagClient } from '../client';
import { setExposureClockFactory } from '../exposure/clock';
import { setExposureDelivery, type ExposureDelivery } from '../exposure/delivery-loader';
import { createExposureEnvironment, setExposureEnvironmentFactory } from '../exposure/environment';
import { createExposureLogger } from '../exposure/logger';
import { mapExposureRecord } from '../exposure/mapper';
import { MAX_BUFFERED_EXPOSURES } from '../exposure/sink';
import type { BulkEvaluationPayload, ExposureLoggingOptions } from '../types';
import {
	deliveredFlagKeys,
	FakeExposureEnvironment,
	settle,
	type FakeRequest,
} from './_utils/exposure-fakes';
import { result, testUser, TEST_CLIENT_OPTIONS } from './_utils/test-payload-helper';

const DELIVERY: ExposureDelivery = {
	createExposureEnvironment,
	createExposureLogger,
	mapExposureRecord,
};

const PAYLOAD: BulkEvaluationPayload = {
	requestContext: { identifiers: { AtlassianAccountId: 'abc' } },
	flags: { 'flag-a': result(), 'flag-b': result() },
};

let environment: FakeExposureEnvironment;
let factory: jest.Mock<FakeExposureEnvironment, []>;

beforeEach(() => {
	environment = new FakeExposureEnvironment();
	factory = jest.fn(() => environment);
	setExposureEnvironmentFactory(factory);
	// The clock shares the fake environment's time source, so a read's timestamp and the logger's
	// deduplication windows agree.
	setExposureClockFactory(() => environment);
});

afterEach(() => {
	setExposureDelivery();
	setExposureClockFactory();
	setExposureEnvironmentFactory();
	jest.restoreAllMocks();
});

/** Hold the delivery subsystem back, so a test decides when loading completes. */
function deferDelivery(): { resolve: () => void; reject: (error: unknown) => void } {
	let resolveDelivery!: (delivery: ExposureDelivery) => void;
	let rejectDelivery!: (error: unknown) => void;
	setExposureDelivery(
		new Promise<ExposureDelivery>((resolve, reject) => {
			resolveDelivery = resolve;
			rejectDelivery = reject;
		}),
	);
	return { resolve: () => resolveDelivery(DELIVERY), reject: rejectDelivery };
}

function initializedWith(
	exposureLogging: ExposureLoggingOptions = { enabled: true, batchSize: 1 },
): FlagClient {
	const client = new FlagClient({ ...TEST_CLIENT_OPTIONS, exposureLogging });
	expect(client.initialize(() => PAYLOAD, testUser())).toEqual({ initialized: true });
	return client;
}

/**
 * Respond `200` to every request until none remain, then every delivered flag key in delivery order.
 * A batch a read fills is sent from a zero-delay timer, so each round first runs that timer.
 *
 * Each round settles before running timers, because a subsystem that resolved since the last round
 * replays its buffer in a microtask and only arms its flush timer then.
 */
async function deliverAll(): Promise<string[]> {
	const handled = new Set<FakeRequest>();
	for (;;) {
		await settle();
		environment.advance(0);
		await settle();
		const pending = environment.requests.filter((request) => !handled.has(request));
		if (pending.length === 0) return environment.requests.flatMap(deliveredFlagKeys);
		for (const request of pending) {
			handled.add(request);
			request.respond(200);
		}
	}
}

/** The `timeUnixNano` of every delivered record, in delivery order. */
function deliveredTimestamps(): string[] {
	return environment.requests.flatMap((request) => {
		const body = JSON.parse(request.init.body) as {
			resourceLogs: { scopeLogs: { logRecords: { timeUnixNano: string }[] }[] }[];
		};
		return body.resourceLogs.flatMap((resource) =>
			resource.scopeLogs.flatMap((scope) => scope.logRecords.map((record) => record.timeUnixNano)),
		);
	});
}

describe('on-demand exposure delivery loading', () => {
	it('delivers exposures that were read before the subsystem loaded', async () => {
		const loading = deferDelivery();
		const client = initializedWith();

		client.getBooleanValue('flag-a', false);
		client.getBooleanValue('flag-b', false);

		// Flags are read on the critical path, well before the subsystem arrives.
		expect(await deliverAll()).toEqual([]);

		loading.resolve();

		expect(await deliverAll()).toEqual(['flag-a', 'flag-b']);
	});

	it('stamps a buffered exposure with the time its read observed', async () => {
		const loading = deferDelivery();
		const client = initializedWith();

		environment.nowMs = 1_000;
		client.getBooleanValue('flag-a', false);
		// Time moves on while the subsystem is still arriving, and again before the replay.
		environment.nowMs = 5_000;
		loading.resolve();

		expect(await deliverAll()).toEqual(['flag-a']);
		// 1,000 ms as OTLP nanoseconds, not the 5,000 ms the replay saw.
		expect(deliveredTimestamps()).toEqual(['1000000000']);
	});

	it('keeps exposures in read order across the load boundary', async () => {
		const loading = deferDelivery();
		const client = initializedWith();

		client.getBooleanValue('flag-a', false);
		loading.resolve();
		await settle();
		client.getBooleanValue('flag-b', false);

		expect(await deliverAll()).toEqual(['flag-a', 'flag-b']);
	});

	it('still suppresses a duplicate read buffered before the subsystem loaded', async () => {
		const loading = deferDelivery();
		const client = initializedWith();

		client.getBooleanValue('flag-a', false);
		client.getBooleanValue('flag-a', false);

		loading.resolve();

		expect(await deliverAll()).toEqual(['flag-a']);
	});

	it('replays a buffered replacement that ended the deduplication windows', async () => {
		const loading = deferDelivery();
		const client = initializedWith();

		client.getBooleanValue('flag-a', false);
		// Without the replacement between them, the repeat below is suppressed as a duplicate.
		expect(client.replace(() => PAYLOAD, testUser())).toEqual({ replaced: true });
		client.getBooleanValue('flag-a', false);

		loading.resolve();

		expect(await deliverAll()).toEqual(['flag-a', 'flag-a']);
	});

	it('creates the logger during construction when the subsystem is already supplied', () => {
		setExposureDelivery(DELIVERY);

		initializedWith();

		// The logger registers for page lifecycle changes as it is constructed.
		expect(environment.listeners).toHaveLength(1);
	});

	it('creates no logger until the subsystem arrives', async () => {
		const loading = deferDelivery();

		initializedWith();
		expect(environment.listeners).toHaveLength(0);

		loading.resolve();
		await settle();

		expect(environment.listeners).toHaveLength(1);
	});

	it('logs nothing and never throws when the subsystem fails to load', async () => {
		const loading = deferDelivery();
		const client = initializedWith();

		client.getBooleanValue('flag-a', false);
		loading.reject(new Error('chunk load failed'));

		expect(await deliverAll()).toEqual([]);
		// Later reads log nothing rather than filling a buffer that will never be drained.
		expect(() => client.getBooleanValue('flag-b', false)).not.toThrow();
		expect(await deliverAll()).toEqual([]);
	});

	it('creates no environment and loads nothing when exposure logging is disabled', () => {
		deferDelivery();

		const client = new FlagClient({ ...TEST_CLIENT_OPTIONS, exposureLogging: { enabled: false } });
		expect(client.initialize(() => PAYLOAD, testUser())).toEqual({ initialized: true });
		client.getBooleanValue('flag-a', false);

		expect(factory).not.toHaveBeenCalled();
		expect(environment.listeners).toHaveLength(0);
	});

	it('drops the oldest exposure once the buffer is full', async () => {
		const loading = deferDelivery();
		const client = initializedWith({ enabled: true, batchSize: MAX_BUFFERED_EXPOSURES });

		for (let index = 0; index <= MAX_BUFFERED_EXPOSURES; index += 1) {
			client.getBooleanValue(`flag-${index}`, false);
		}

		loading.resolve();
		const keys = await deliverAll();

		expect(keys).toHaveLength(MAX_BUFFERED_EXPOSURES);
		expect(keys[0]).toBe('flag-1');
	});
});
