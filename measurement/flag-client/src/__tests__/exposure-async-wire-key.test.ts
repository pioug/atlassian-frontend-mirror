/** @jest-environment node */

import { serializeExposureIdentity } from '../exposure/deduplication';
import { exposureDigest, initializeExposureHash, type ExposureHasher } from '../exposure/digest';
import { createExposureLogger, type ExposureDeliveryOptions } from '../exposure/logger';
import { mapExposureRecord, type ExposureMappingInput } from '../exposure/mapper';
import type { ExportLogsServiceRequest, OtlpLogRecord } from '../exposure/otlp';
import { FakeExposureEnvironment, FakeStorage, settle } from './_utils/exposure-fakes';
import { flagResult, plainAttributes, resultInput } from './_utils/exposure-test-helper';

beforeAll(async () => initializeExposureHash());

function input(): ExposureMappingInput {
	return resultInput(flagResult({ randomizationIdentifierName: 'TenantId' }), {
		requestContext: { identifiers: { TenantId: 'tenant-7' }, attributes: {} },
	});
}

function setup(
	options: Partial<ExposureDeliveryOptions> = {},
	hash: ExposureHasher = exposureDigest,
) {
	const environment = new FakeExposureEnvironment();
	const logger = createExposureLogger(
		{
			endpoint: 'https://example.test/v1/logs',
			batchSize: 100,
			flushIntervalMs: 1_000,
			...options,
		},
		environment,
		hash,
	);
	const log = (attempt: ExposureMappingInput = input()) =>
		logger.log(attempt, () => mapExposureRecord(attempt));
	return { environment, logger, log };
}

function records(environment: FakeExposureEnvironment): OtlpLogRecord[] {
	return environment.requests.flatMap((request) => {
		const body = JSON.parse(request.init.body) as ExportLogsServiceRequest;
		return body.resourceLogs.flatMap((resource) =>
			resource.scopeLogs.flatMap((scope) => scope.logRecords as OtlpLogRecord[]),
		);
	});
}

function attributes(environment: FakeExposureEnvironment, index = 0) {
	return plainAttributes(records(environment)[index].attributes);
}

describe('WASM admission and pre-export dedupe counts', () => {
	it('clears the cache while preserving queued counts, identity and delivery timing', async () => {
		const { environment, logger, log } = setup();
		log();
		log();
		log();
		const timers = environment.pendingTimers;
		logger.clearExposureDeduplicationCache();
		logger.clearExposureDeduplicationCache();
		expect(environment.requests).toHaveLength(0);
		expect(environment.pendingTimers).toBe(timers);
		expect(environment.listeners).toHaveLength(1);
		log();
		log();
		environment.advance(1_000);
		await settle();
		expect(records(environment)).toHaveLength(2);
		expect(attributes(environment)['atl.feature_flag.sdk.dedupe.item.count']).toBe(3);
		expect(attributes(environment, 1)['atl.feature_flag.sdk.dedupe.item.count']).toBe(2);
		expect(attributes(environment)['atl.feature_flag.deduplication_key']).toBe(
			attributes(environment, 1)['atl.feature_flag.deduplication_key'],
		);
	});

	it('keeps an in-flight request and its retry count when the cache is cleared', async () => {
		const { environment, logger, log } = setup();
		log();
		log();
		environment.advance(1_000);
		await settle();
		const request = environment.requests[0];
		logger.clearExposureDeduplicationCache();
		expect(request.init.signal?.aborted).toBe(false);
		request.respond(503);
		await settle();
		environment.advance(2_000);
		await settle();
		expect(environment.requests).toHaveLength(2);
		expect(attributes(environment, 1)['atl.feature_flag.sdk.dedupe.item.count']).toBe(2);
	});

	it('preserves persisted counts and Alice attribution when later reads use Bob', async () => {
		const { environment, logger, log } = setup();
		const alice = {
			...input(),
			requestContext: { attributes: {}, identifiers: { TenantId: 'alice' } },
		};
		log(alice);
		log(alice);
		environment.hide();
		await settle();
		logger.clearExposureDeduplicationCache();
		log({ ...input(), requestContext: { attributes: {}, identifiers: { TenantId: 'bob' } } });
		environment.advance(1_000);
		await settle();
		expect(attributes(environment)['atl.identifiers.TenantId']).toBe('alice');
		expect(attributes(environment)['atl.feature_flag.sdk.dedupe.item.count']).toBe(2);
		expect(attributes(environment, 1)['atl.identifiers.TenantId']).toBe('bob');
	});
	it('suppresses synchronously and snapshots all pre-export attempts separately from sampling', async () => {
		const { environment, log } = setup();
		for (let index = 0; index < 100; index++) log();
		expect(environment.requests).toHaveLength(0);
		environment.advance(1_000);
		await settle();
		expect(records(environment)).toHaveLength(1);
		expect(attributes(environment)['atl.feature_flag.sdk.dedupe.item.count']).toBe(100);
		expect(attributes(environment)['atl.feature_flag.sampling.item.count']).toBe(1);
		expect(attributes(environment)['atl.feature_flag.deduplication_key']).toBe(
			exposureDigest(serializeExposureIdentity(input())!),
		);
	});

	it('shares automatic and manual admission and counting', async () => {
		const { environment, log } = setup();
		log();
		log({ ...input(), manual: true });
		log();
		environment.advance(1_000);
		await settle();
		expect(records(environment)).toHaveLength(1);
		expect(attributes(environment)['atl.feature_flag.sdk.dedupe.item.count']).toBe(3);
	});

	it.each(['throws', 'returns NaN', 'returns Infinity'] as const)(
		'resumes admission on the same elapsed clock after it %s, preserving its existing window',
		(failure) => {
			const environment = new FakeExposureEnvironment();
			let elapsed = 0;
			let unavailable = false;
			Object.assign(environment, {
				elapsedNow: () => {
					if (!unavailable) return elapsed;
					if (failure === 'throws') throw new Error('Clock unavailable');
					return failure === 'returns NaN' ? NaN : Infinity;
				},
			});
			const clockLogger = createExposureLogger(
				{ endpoint: '/logs', batchSize: 100, flushIntervalMs: 1_000, dedupeWindowMs: 100 },
				environment,
			);
			const produce = jest.fn(() => mapExposureRecord(input()));
			const attempt = () => clockLogger.log(input(), produce);
			attempt();
			elapsed = 10;
			attempt();
			expect(produce).toHaveBeenCalledTimes(1);
			unavailable = true;
			environment.nowMs = 1_700_000_000_000;
			attempt(); // ordinary logging survives without advancing the cached admission time
			expect(produce).toHaveBeenCalledTimes(2);
			unavailable = false;
			elapsed = 20;
			attempt(); // the original entry/window still applies
			expect(produce).toHaveBeenCalledTimes(2);
			elapsed = 100;
			attempt();
			expect(produce).toHaveBeenCalledTimes(3);
		},
	);

	it('bypasses a failed epoch clock and resumes without switching to the host clock', () => {
		const environment = new FakeExposureEnvironment();
		let now = 0;
		let unavailable = false;
		Object.assign(environment, {
			now: () => {
				if (unavailable) throw new Error('Clock unavailable');
				return now;
			},
		});
		const logger = createExposureLogger(
			{ endpoint: '/logs', batchSize: 100, flushIntervalMs: 1_000, dedupeWindowMs: 100 },
			environment,
		);
		const produce = jest.fn(() => mapExposureRecord(input()));
		const attempt = () => logger.log(input(), produce);
		attempt();
		unavailable = true;
		attempt();
		expect(produce).toHaveBeenCalledTimes(2);
		unavailable = false;
		now = 20;
		attempt();
		expect(produce).toHaveBeenCalledTimes(2);
		now = 100;
		attempt();
		expect(produce).toHaveBeenCalledTimes(3);
	});

	it('freezes the first export count for retries', async () => {
		const { environment, log } = setup();
		log();
		log();
		environment.advance(1_000);
		await settle();
		const first = environment.requests[0].init.body;
		log();
		log();
		environment.requests[0].respond(503);
		await settle();
		environment.advance(2_000);
		await settle();
		expect(environment.requests).toHaveLength(2);
		expect(environment.requests[1].init.body).toBe(first);
		expect(attributes(environment, 1)['atl.feature_flag.sdk.dedupe.item.count']).toBe(2);
	});

	it('suppresses repeated errors and exports their ordinary dedupe key', async () => {
		const { environment, log } = setup();
		const attempt = input();
		const error = {
			...attempt,
			details: {
				...attempt.details,
				metadata: { ...attempt.details.metadata, matchReason: 'general_error' },
			},
		};
		for (let i = 0; i < 1000; i++) log(error);
		environment.advance(1_000);
		await settle();
		expect(records(environment)).toHaveLength(1);
		for (const record of records(environment)) {
			const attrs = plainAttributes(record.attributes);
			expect(attrs['atl.feature_flag.sdk.dedupe.item.count']).toBe(1000);
			expect(attrs['atl.feature_flag.deduplication_key']).toBe(
				exposureDigest(serializeExposureIdentity(error)!),
			);
		}
	});

	it.each([
		() => undefined,
		() => {
			throw new Error('WASM unavailable');
		},
	])('suppresses ordinary records locally when portable hashing is unavailable', async (hash) => {
		const portable = jest.fn(hash);
		const { environment, log } = setup({}, portable);
		for (let i = 0; i < 1000; i++) log();
		environment.advance(1_000);
		await settle();
		expect(records(environment)).toHaveLength(1);
		expect(attributes(environment)['atl.feature_flag.sdk.dedupe.item.count']).toBe(1000);
		expect(portable).toHaveBeenCalledTimes(1);
		expect(attributes(environment)['atl.feature_flag.deduplication_key']).toMatch(
			/^ffp-exp-v1:[0-9a-f]{16}$/,
		);
	});

	it('keeps diagnostic reasons, flags, assignment fields and captured users distinct', async () => {
		const { environment, log } = setup();
		const base = input();
		const diagnostic = {
			...base,
			details: {
				...base.details,
				metadata: { ...base.details.metadata, matchReason: 'general_error' },
			},
		};
		log(diagnostic);
		log({ ...diagnostic, manual: true });
		log({
			...diagnostic,
			details: {
				...diagnostic.details,
				metadata: { ...diagnostic.details.metadata, matchReason: 'invalid_context' },
			},
		});
		log({
			...diagnostic,
			details: {
				...diagnostic.details,
				metadata: { ...diagnostic.details.metadata, flagKey: 'other' },
			},
		});
		log({
			...diagnostic,
			details: {
				...diagnostic.details,
				metadata: { ...diagnostic.details.metadata, ruleId: 'other-rule' },
			},
		});
		log({
			...diagnostic,
			requestContext: { identifiers: { TenantId: 'other-user' }, attributes: {} },
		});
		environment.advance(1000);
		await settle();
		expect(records(environment)).toHaveLength(5);
		expect(attributes(environment)['atl.feature_flag.sdk.dedupe.item.count']).toBe(2);
		expect(
			records(environment).every((record) =>
				/^ffp-exp-v1:/.test(
					String(plainAttributes(record.attributes)['atl.feature_flag.deduplication_key']),
				),
			),
		).toBe(true);
	});

	it('shares the bounded LRU for diagnostics and starts fresh admission after explicit clearing', async () => {
		const { environment, logger, log } = setup({ dedupeMaxKeys: 2 });
		const base = input();
		const attempt = (id: string) =>
			log({
				...base,
				requestContext: { identifiers: { TenantId: id }, attributes: {} },
				details: {
					...base.details,
					metadata: { ...base.details.metadata, matchReason: 'general_error' },
				},
			});
		attempt('alice');
		attempt('bob');
		attempt('alice');
		attempt('carol');
		attempt('bob');
		logger.clearExposureDeduplicationCache();
		attempt('bob');
		environment.advance(1000);
		await settle();
		expect(records(environment)).toHaveLength(5);
		expect(attributes(environment)['atl.identifiers.TenantId']).toBe('alice');
	});

	it('drops only telemetry when both portable and local hashing cannot run', () => {
		const { logger, environment } = setup({}, () => undefined);
		const encode = jest.spyOn(TextEncoder.prototype, 'encode').mockImplementation(() => {
			throw new Error('encoding unavailable');
		});
		const produce = jest.fn(() => mapExposureRecord(input()));
		try {
			expect(() => logger.log(input(), produce)).not.toThrow();
			expect(produce).not.toHaveBeenCalled();
			expect(environment.pendingTimers).toBe(0);
		} finally {
			encode.mockRestore();
		}
	});

	it('keeps separate counts when two records outlive an explicit cache clear', async () => {
		const { environment, logger, log } = setup();
		log();
		logger.clearExposureDeduplicationCache();
		log();
		log();
		log();
		environment.advance(1_000);
		await settle();
		expect(records(environment)).toHaveLength(2);
		expect(attributes(environment)['atl.feature_flag.sdk.dedupe.item.count']).toBe(1);
		expect(attributes(environment, 1)['atl.feature_flag.sdk.dedupe.item.count']).toBe(3);
	});

	it('does not recover counts from an evicted key or recreate its entry at export', async () => {
		const { environment, log } = setup({ dedupeMaxKeys: 1 });
		log();
		log();
		const other = input();
		log({
			...other,
			details: { ...other.details, metadata: { ...other.details.metadata, flagKey: 'flag-b' } },
		});
		environment.advance(1_000);
		await settle();
		expect(attributes(environment)['atl.feature_flag.sdk.dedupe.item.count']).toBe(1);
		expect(attributes(environment, 1)['atl.feature_flag.sdk.dedupe.item.count']).toBe(1);
	});

	it('retains pending counts when export occurs at the admission-window boundary', async () => {
		const { environment, log } = setup({ dedupeWindowMs: 100, flushIntervalMs: 100 });
		log();
		environment.advance(99);
		log();
		environment.advance(1);
		await settle();
		expect(attributes(environment)['atl.feature_flag.sdk.dedupe.item.count']).toBe(2);
		environment.requests[0].respond(200);
		await settle();
		log();
		environment.advance(100);
		await settle();
		expect(records(environment)).toHaveLength(2);
	});

	it('drains once when two carriers share a retained entry across window rollover', async () => {
		const { environment, log } = setup({ dedupeWindowMs: 100 });
		for (let index = 0; index < 10; index++) log();
		environment.advance(100);
		log();
		environment.advance(900);
		await settle();
		expect(records(environment)).toHaveLength(2);
		expect(attributes(environment)['atl.feature_flag.sdk.dedupe.item.count']).toBe(10);
		expect(attributes(environment, 1)['atl.feature_flag.sdk.dedupe.item.count']).toBe(1);
	});

	it('uses admission hits to choose the LRU victim without touching recency on export', async () => {
		const { environment, log } = setup({ dedupeMaxKeys: 2 });
		const attempt = input();
		const other = {
			...attempt,
			details: { ...attempt.details, metadata: { ...attempt.details.metadata, flagKey: 'flag-b' } },
		};
		log();
		log(other);
		log(); // first key is MRU, even though this attempt is suppressed
		environment.advance(1_000);
		await settle();
		environment.requests[0].respond(200);
		await settle();
		log({
			...attempt,
			details: { ...attempt.details, metadata: { ...attempt.details.metadata, flagKey: 'flag-c' } },
		});
		log(); // retained
		log(other); // evicted, so admitted again
		environment.advance(1_000);
		await settle();
		expect(records(environment)).toHaveLength(4);
		expect(attributes(environment, 2)['feature_flag.key']).toBe('flag-c');
		expect(attributes(environment, 3)['feature_flag.key']).toBe('flag-b');
	});

	it('preserves the original identity, value, timestamp, and record order', async () => {
		const { environment, log } = setup();
		const value = { theme: 'original' };
		const attempt = { ...input(), epochMillis: 1_000, details: { ...input().details, value } };
		log(attempt);
		const expected = exposureDigest(serializeExposureIdentity(attempt)!);
		value.theme = 'later';
		log({
			...input(),
			epochMillis: 2_000,
			details: { ...input().details, metadata: { ...input().details.metadata, flagKey: 'flag-b' } },
		});
		environment.advance(1_000);
		await settle();
		expect(attributes(environment)['atl.feature_flag.deduplication_key']).toBe(expected);
		expect(records(environment).map((record) => record.timeUnixNano)).toEqual([
			'1000000000',
			'2000000000',
		]);
	});

	it('persists only the fixed-size wire key and freezes a finalized count across recovery', async () => {
		const storage = new FakeStorage();
		const first = new FakeExposureEnvironment(storage, 'first');
		const logger = createExposureLogger(
			{ endpoint: '/logs', batchSize: 1, flushIntervalMs: 1_000 },
			first,
		);
		const attempt = input();
		logger.log(attempt, () => mapExposureRecord(attempt));
		logger.log(attempt, () => mapExposureRecord(attempt));
		first.advance(0);
		await settle();
		first.hide();
		await settle();
		const serialized = [...storage.items.values()].join('');
		expect(serialized).not.toContain('randomizationIdentifierValue');
		const second = new FakeExposureEnvironment(storage, 'second');
		createExposureLogger({ endpoint: '/logs', batchSize: 1, flushIntervalMs: 1_000 }, second);
		await settle();
		expect(attributes(second)['atl.feature_flag.sdk.dedupe.item.count']).toBe(2);
	});
});

const options = { endpoint: '/logs', batchSize: 100, flushIntervalMs: 1_000 };
it('recovered pending new ordinary record has count1', async () => {
	const storage = new FakeStorage();
	const first = new FakeExposureEnvironment(storage, 'first');
	const logger = createExposureLogger(options, first);
	const a = input();
	logger.log(a, () => mapExposureRecord(a));
	first.hide();
	const second = new FakeExposureEnvironment(storage, 'second');
	createExposureLogger(options, second);
	await settle();
	expect(attributes(second)['atl.feature_flag.sdk.dedupe.item.count']).toBe(1);
});
it('does not send after finalization detects ownership transfer', async () => {
	const storage = new FakeStorage();
	const first = new FakeExposureEnvironment(storage, 'first');
	const logger = createExposureLogger(options, first);
	const a = input();
	logger.log(a, () => mapExposureRecord(a));
	first.hide();
	const second = new FakeExposureEnvironment(storage, 'second');
	const getItem = storage.getItem.bind(storage);
	let reads = 0;
	storage.getItem = (key) => {
		reads += 1;
		// Transfer after deliver's ownership check, during post-finalization synchronization.
		if (reads === 2) createExposureLogger(options, second);
		return getItem(key);
	};
	first.advance(1000);
	await settle();
	expect(second.requests).toHaveLength(1);
	expect(first.requests).toHaveLength(0);
});
