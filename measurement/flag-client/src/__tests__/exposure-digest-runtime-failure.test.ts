/** @jest-environment node */
import type { IHasher } from 'hash-wasm';

import { mapExposureRecord } from '../exposure/mapper';
import type { ExportLogsServiceRequest, OtlpLogRecord } from '../exposure/otlp';
import { createXXHash3 } from '../exposure/xxhash3';
import { FakeExposureEnvironment, settle } from './_utils/exposure-fakes';
import { flagResult, resultInput, plainAttributes } from './_utils/exposure-test-helper';

jest.mock('../exposure/xxhash3', () => ({ createXXHash3: jest.fn() }));

it('stays on the local fallback after a runtime WASM error without retrying initialization', async () => {
	let broken = false;
	const actual = jest.requireActual<typeof import('hash-wasm')>('hash-wasm');
	const hasher = await actual.createXXHash3(0, 0);
	const update = hasher.update.bind(hasher);
	jest.spyOn(hasher, 'update').mockImplementation((value) => {
		if (broken) throw new Error('runtime hash failure');
		return update(value);
	});
	const create = jest.mocked(createXXHash3).mockResolvedValue(hasher as unknown as IHasher);
	try {
		const { initializeExposureHash, exposureDigest } = await import('../exposure/digest');
		await initializeExposureHash();
		const beforeFailure = exposureDigest('identity');
		expect(beforeFailure).toBe('ffp-exp-v1:a98202858f0967e0');
		const { createExposureLogger } = await import('../exposure/logger');
		const environment = new FakeExposureEnvironment();
		const logger = createExposureLogger(
			{ endpoint: '/logs', batchSize: 100, flushIntervalMs: 100 },
			environment,
		);
		const input = resultInput(flagResult({ identifierType: 'TenantId' }), {
			requestContext: { identifiers: { TenantId: 'alice' }, attributes: {} },
		});
		const log = () => logger.log(input, () => mapExposureRecord(input));
		log();
		environment.advance(100);
		await settle();
		environment.requests[0].respond(200);
		await settle();
		broken = true;
		for (let i = 0; i < 1000; i++) log();
		const fallback = exposureDigest('identity');
		expect(fallback).toBe(beforeFailure);
		environment.advance(100);
		await settle();
		expect(environment.requests).toHaveLength(1);
		logger.clearExposureDeduplicationCache();
		for (let i = 0; i < 1000; i++) log();
		environment.advance(100);
		await settle();
		expect(environment.requests).toHaveLength(2);
		const body = JSON.parse(environment.requests[1].init.body) as ExportLogsServiceRequest;
		const record = body.resourceLogs[0].scopeLogs[0].logRecords[0] as OtlpLogRecord;
		expect(plainAttributes(record.attributes)['atl.feature_flag.sdk.dedupe.item.count']).toBe(1000);
		expect(plainAttributes(record.attributes)['atl.feature_flag.deduplication_key']).toMatch(
			/^ffp-exp-v1:[0-9a-f]{16}$/,
		);
		await initializeExposureHash();
		expect(create).toHaveBeenCalledTimes(1);
		broken = false;
		expect(exposureDigest('identity')).toBe(fallback);
	} finally {
		create.mockReset();
	}
});
