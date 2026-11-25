/** @jest-environment node */
import { FlagClient } from '../client';
import { setExposureClockFactory } from '../exposure/clock';
import { setExposureDelivery, type ExposureDelivery } from '../exposure/delivery-loader';
import { initializeExposureHash, exposureDigest } from '../exposure/digest';
import { createExposureEnvironment, setExposureEnvironmentFactory } from '../exposure/environment';
import { createExposureLogger } from '../exposure/logger';
import { mapExposureRecord } from '../exposure/mapper';
import type { ExportLogsServiceRequest, OtlpLogRecord } from '../exposure/otlp';
import { FakeExposureEnvironment, FakeStorage, settle } from './_utils/exposure-fakes';
import { resultInput, flagResult, plainAttributes } from './_utils/exposure-test-helper';
import { TEST_CLIENT_OPTIONS, result, testUser } from './_utils/test-payload-helper';

let compile: { mock: { calls: unknown[][] }; mockRestore(): void };
beforeAll(async () => {
	compile = jest.spyOn(WebAssembly, 'compile').mockRejectedValue(new Error('WASM blocked'));
	await initializeExposureHash();
});
afterAll(() => compile.mockRestore());
afterEach(() => {
	setExposureDelivery();
	setExposureClockFactory();
	setExposureEnvironmentFactory();
});

function records(environment: FakeExposureEnvironment) {
	return environment.requests.flatMap((request) => {
		const body = JSON.parse(request.init.body) as ExportLogsServiceRequest;
		return body.resourceLogs.flatMap((resource) =>
			resource.scopeLogs.flatMap((scope) =>
				(scope.logRecords as OtlpLogRecord[]).map((record) => plainAttributes(record.attributes)),
			),
		);
	});
}

it('keeps a fixed fallback fingerprint and never retries failed WASM initialization', async () => {
	const attempts = compile.mock.calls.length;
	const first = exposureDigest('identity');
	expect(first).toBe('ffp-exp-v1:a98202858f0967e0');
	expect(exposureDigest('identity')).toBe(first);
	expect(exposureDigest('different')).not.toBe(first);
	await initializeExposureHash();
	expect(compile).toHaveBeenCalledTimes(attempts);
});

it('contains unavailable native fallback capabilities without switching modes', () => {
	const expected = exposureDigest('identity');
	const encode = jest.spyOn(TextEncoder.prototype, 'encode').mockImplementation(() => {
		throw new Error('encoding unavailable');
	});
	try {
		expect(exposureDigest('identity')).toBeUndefined();
	} finally {
		encode.mockRestore();
	}
	expect(exposureDigest('identity')).toBe(expected);
});

it('does not require DataView.getBigUint64', () => {
	const expected = exposureDigest('identity');
	const read = jest.spyOn(DataView.prototype, 'getBigUint64').mockImplementation(() => {
		throw new Error('getBigUint64 unavailable');
	});
	try {
		expect(exposureDigest('identity')).toBe(expected);
	} finally {
		read.mockRestore();
	}
});

it('suppresses 1000 buffered SDK reads after failed WASM and exports a fallback key', async () => {
	const environment = new FakeExposureEnvironment();
	setExposureClockFactory(() => environment);
	setExposureEnvironmentFactory(() => environment);
	let resolve!: (delivery: ExposureDelivery) => void;
	setExposureDelivery(
		new Promise<ExposureDelivery>((done) => {
			resolve = done;
		}),
	);
	const client = new FlagClient({
		...TEST_CLIENT_OPTIONS,
		exposureLogging: { enabled: true, batchSize: 100, flushIntervalMs: 100 },
	});
	expect(
		client.initialize(
			() => ({
				flags: { 'flag-a': result() },
				requestContext: { identifiers: { AtlassianAccountId: 'alice' } },
			}),
			testUser(),
		).initialized,
	).toBe(true);
	for (let i = 0; i < 1000; i++) client.getBooleanValue('flag-a', false);
	resolve({ createExposureEnvironment, createExposureLogger, mapExposureRecord });
	await settle();
	expect(environment.listeners).toHaveLength(1);
	environment.advance(100);
	await settle();
	expect(records(environment)).toHaveLength(1);
	// @ts-expect-error - TS2532 - Object is possibly 'undefined'.
	expect(records(environment)[0]['atl.feature_flag.sdk.dedupe.item.count']).toBe(1000);
	// @ts-expect-error - TS2532 - Object is possibly 'undefined'.
	expect(records(environment)[0]['atl.identifiers.AtlassianAccountId']).toBe('alice');
	// @ts-expect-error - TS2532 - Object is possibly 'undefined'.
	expect(records(environment)[0]['atl.feature_flag.deduplication_key']).toMatch(
		/^ffp-exp-v1:[0-9a-f]{16}$/,
	);
});

it('uses the same bounded LRU and preserves queued counts when clearing fallback entries', async () => {
	const environment = new FakeExposureEnvironment();
	const logger = createExposureLogger(
		{ endpoint: '/logs', batchSize: 100, flushIntervalMs: 100, dedupeMaxKeys: 2 },
		environment,
	);
	const attempt = (id: string) => {
		const input = resultInput(flagResult({ identifierType: 'TenantId' }), {
			requestContext: { identifiers: { TenantId: id }, attributes: {} },
		});
		logger.log(input, () => mapExposureRecord(input));
	};
	attempt('alice');
	attempt('alice');
	logger.clearExposureDeduplicationCache();
	attempt('bob');
	attempt('carol');
	attempt('dave');
	attempt('bob');
	environment.advance(100);
	await settle();
	const received = records(environment);
	expect(received).toHaveLength(5);
	// @ts-expect-error - TS2532 - Object is possibly 'undefined'.
	expect(received[0]['atl.feature_flag.sdk.dedupe.item.count']).toBe(2);
	expect(
		received.every((record) =>
			/^ffp-exp-v1:[0-9a-f]{16}$/.test(String(record['atl.feature_flag.deduplication_key'])),
		),
	).toBe(true);
});

it('preserves the fallback wire key across persistence and ownership transfer', async () => {
	const storage = new FakeStorage();
	const first = new FakeExposureEnvironment(storage, 'first');
	const options = { endpoint: '/logs', batchSize: 100, flushIntervalMs: 100 };
	const logger = createExposureLogger(options, first);
	const input = resultInput(flagResult({ identifierType: 'TenantId' }), {
		requestContext: { identifiers: { TenantId: 'alice' }, attributes: {} },
	});
	logger.log(input, () => mapExposureRecord(input));
	first.hide();
	const second = new FakeExposureEnvironment(storage, 'second');
	createExposureLogger(options, second);
	await settle();
	expect(records(second)).toHaveLength(1);
	// @ts-expect-error - TS2532 - Object is possibly 'undefined'.
	expect(records(second)[0]['atl.feature_flag.deduplication_key']).toMatch(
		/^ffp-exp-v1:[0-9a-f]{16}$/,
	);
	first.advance(100);
	await settle();
	expect(first.requests).toHaveLength(0);
});
