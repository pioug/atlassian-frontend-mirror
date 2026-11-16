/**
 * @jest-environment node
 */

import { FlagClient } from '../client';
import { setExposureClockFactory } from '../exposure/clock';
import { setExposureDelivery, type ExposureDelivery } from '../exposure/delivery-loader';
import { initializeExposureHash } from '../exposure/digest';
import { createExposureEnvironment, setExposureEnvironmentFactory } from '../exposure/environment';
import { createExposureLogger } from '../exposure/logger';
import { mapExposureRecord, type ExposureMappingInput } from '../exposure/mapper';
import type { ExportLogsServiceRequest, OtlpLogRecord } from '../exposure/otlp';
import { MAX_BUFFERED_EXPOSURES } from '../exposure/sink';
import type { BulkEvaluationPayload, ExposureLoggingOptions } from '../types';
import {
	deliveredFlagKeys,
	FakeExposureEnvironment,
	settle,
	type FakeRequest,
} from './_utils/exposure-fakes';
import { plainAttributes } from './_utils/exposure-test-helper';
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
function deferDelivery(delivery: ExposureDelivery = DELIVERY): {
	resolve: () => void;
	reject: (error: unknown) => void;
} {
	let resolveDelivery!: (delivery: ExposureDelivery) => void;
	let rejectDelivery!: (error: unknown) => void;
	setExposureDelivery(
		new Promise<ExposureDelivery>((resolve, reject) => {
			resolveDelivery = resolve;
			rejectDelivery = reject;
		}),
	);
	return { resolve: () => resolveDelivery(delivery), reject: rejectDelivery };
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
	it('suppresses pre-initialization diagnostics and preserves Alice/Bob counts across replacement', async () => {
		setExposureDelivery(DELIVERY);
		const client = new FlagClient({
			...TEST_CLIENT_OPTIONS,
			exposureLogging: { enabled: true, batchSize: 100, flushIntervalMs: 1000 },
		});
		for (let i = 0; i < 1000; i++) client.getBooleanValue('flag-a', false);
		const payload = (id: string) => ({
			...PAYLOAD,
			requestContext: { identifiers: { AtlassianAccountId: id } },
		});
		client.initialize(() => payload('alice'), testUser());
		for (let i = 0; i < 1000; i++) client.getBooleanValue('missing', false);
		client.replace(() => payload('bob'), testUser());
		client.getBooleanValue('missing', false);
		client.getBooleanValue('missing', false);
		environment.advance(1000);
		await settle();
		const body = JSON.parse(environment.requests[0].init.body) as ExportLogsServiceRequest;
		const attrs = body.resourceLogs.flatMap((resource) =>
			resource.scopeLogs.flatMap((scope) =>
				(scope.logRecords as OtlpLogRecord[]).map((record) => plainAttributes(record.attributes)),
			),
		);
		expect(attrs).toHaveLength(3);
		expect(attrs.map((record) => record['atl.feature_flag.sdk.dedupe.item.count'])).toEqual([
			1000, 1000, 2,
		]);
		expect(attrs.map((record) => record['atl.identifiers.AtlassianAccountId'])).toEqual([
			undefined,
			'alice',
			'bob',
		]);
		expect(
			attrs.every((record) =>
				/^ffp-exp-v1:/.test(String(record['atl.feature_flag.deduplication_key'])),
			),
		).toBe(true);
	});
	it('does not invoke JSON getters or normalize unsupported buffered defaults into hashable values', async () => {
		const loading = deferDelivery();
		const client = new FlagClient({
			...TEST_CLIENT_OPTIONS,
			exposureLogging: { enabled: true, batchSize: 1 },
		});
		expect(
			client.initialize(
				() => ({
					...PAYLOAD,
					flags: { 'flag-a': result({ returnType: 'JSON', useCodeDefault: true }) },
				}),
				testUser(),
			).initialized,
		).toBe(true);
		const getter = jest.fn(() => 1);
		const value = Object.defineProperty({}, 'version', { enumerable: true, get: getter });
		client.getObjectValue('flag-a', value);
		expect(getter).not.toHaveBeenCalled();
		loading.resolve();
		expect(await deliverAll()).toEqual(['flag-a']);
		expect(getter).not.toHaveBeenCalled();
		const body = JSON.parse(environment.requests[0].init.body) as ExportLogsServiceRequest;
		const record = body.resourceLogs[0].scopeLogs[0].logRecords[0] as OtlpLogRecord;
		expect(plainAttributes(record.attributes)).not.toHaveProperty(
			'atl.feature_flag.deduplication_key',
		);
	});
	it('hashes caller-owned JSON defaults as observed at each buffered read', async () => {
		const captured: ExposureMappingInput[] = [];
		const loading = deferDelivery({
			...DELIVERY,
			mapExposureRecord: (input) => {
				captured.push(input);
				return mapExposureRecord(input);
			},
		});
		const client = new FlagClient({
			...TEST_CLIENT_OPTIONS,
			exposureLogging: { enabled: true, batchSize: 1 },
		});
		expect(
			client.initialize(
				() => ({
					...PAYLOAD,
					flags: { 'flag-a': result({ returnType: 'JSON', useCodeDefault: true }) },
				}),
				testUser(),
			).initialized,
		).toBe(true);
		const value = { nested: { version: 1 } };
		client.getObjectValue('flag-a', value);
		value.nested.version = 2;
		client.getObjectValue('flag-a', value);
		value.nested.version = 3;
		loading.resolve();
		expect(await deliverAll()).toEqual(['flag-a', 'flag-a']);
		const keys = environment.requests.flatMap((request) => {
			const body = JSON.parse(request.init.body) as ExportLogsServiceRequest;
			return body.resourceLogs.flatMap((resource) =>
				resource.scopeLogs.flatMap((scope) =>
					(scope.logRecords as OtlpLogRecord[]).map(
						(record) => plainAttributes(record.attributes)['atl.feature_flag.deduplication_key'],
					),
				),
			);
		});
		expect(keys[0]).not.toBe(keys[1]);
		expect(captured.map((input) => input.details.value)).toEqual([
			{ nested: { version: 1 } },
			{ nested: { version: 2 } },
		]);
		expect(value.nested.version).toBe(3);
		expect(Object.isFrozen(value.nested)).toBe(false);
	});

	it('captures nested supplied counterfactual metadata before delayed manual replay', async () => {
		const captured: ExposureMappingInput[] = [];
		const loading = deferDelivery({
			...DELIVERY,
			mapExposureRecord: (input) => {
				captured.push(input);
				return mapExposureRecord(input);
			},
		});
		const client = initializedWith();
		const details = client.getBooleanDetails('flag-a', false, { disableExposureLogging: true });
		const supplied = {
			...details,
			metadata: {
				...details.metadata,
				stableSplitOutcome: {
					variationId: 'control',
					matchReason: 'ss_holdout_withheld',
					holdoutAllocation: {
						holdoutKey: 'holdout-a',
						identifierType: 'AtlassianAccountId',
						allocationReason: 'withheld',
					},
				},
			},
		};
		client.logExposure(supplied);
		supplied.metadata.stableSplitOutcome.holdoutAllocation.holdoutKey = 'holdout-b';
		client.logExposure(supplied);
		loading.resolve();
		expect(await deliverAll()).toEqual(['flag-a', 'flag-a']);
		expect(
			captured.map(
				(input) => input.details.metadata.stableSplitOutcome?.holdoutAllocation?.holdoutKey,
			),
		).toEqual(['holdout-a', 'holdout-b']);
	});
	it.each([false, true])(
		'preserves separate queued counts across replacement while loading is pending: %s',
		async (pending) => {
			const loading = pending ? deferDelivery() : null;
			if (!pending) setExposureDelivery(DELIVERY);
			const client = initializedWith();
			for (let i = 0; i < 3; i++) client.getBooleanValue('flag-a', false);
			expect(client.replace(() => PAYLOAD, testUser())).toEqual({ replaced: true });
			for (let i = 0; i < 2; i++) client.getBooleanValue('flag-a', false);
			loading?.resolve();
			expect(await deliverAll()).toEqual(['flag-a', 'flag-a']);
			const counts = environment.requests.flatMap((request) => {
				const body = JSON.parse(request.init.body) as ExportLogsServiceRequest;
				return body.resourceLogs.flatMap((resource) =>
					resource.scopeLogs.flatMap((scope) =>
						(scope.logRecords as OtlpLogRecord[]).map(
							(record) =>
								plainAttributes(record.attributes)['atl.feature_flag.sdk.dedupe.item.count'],
						),
					),
				);
			});
			expect(counts).toEqual([3, 2]);
		},
	);
	it.each([false, true])(
		'clears admission without dropping exposures when loading is pending: %s',
		async (pending) => {
			const loading = pending ? deferDelivery() : null;
			if (!pending) setExposureDelivery(DELIVERY);
			const client = initializedWith();
			client.getBooleanValue('flag-a', false);
			client.getBooleanValue('flag-a', false);
			client.clearExposureDeduplicationCache();
			client.getBooleanValue('flag-a', false);
			loading?.resolve();
			expect(await deliverAll()).toEqual(['flag-a', 'flag-a']);
		},
	);

	it('allows clearing a disabled client without starting delivery', () => {
		const client = initializedWith({ enabled: false });
		expect(() => client.clearExposureDeduplicationCache()).not.toThrow();
		expect(environment.listeners).toHaveLength(0);
		expect(environment.pendingTimers).toBe(0);
	});
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

beforeAll(async () => initializeExposureHash());
