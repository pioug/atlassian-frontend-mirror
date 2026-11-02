/**
 * @jest-environment node
 */

/**
 * A client that takes persisted exposures as it is constructed sends them at once rather than after
 * the flush interval, so a page whose deliveries fail knows it moments after it loads.
 */
import { BREAKER_PROBE_INTERVAL_MS, createExposureLogger } from '../exposure/logger';
import {
	DELIVERY_MARKER_KEY,
	serializeExposures,
	STORAGE_KEY_PREFIX,
	UNDELIVERED_ORIGIN_CODE_UNITS,
} from '../exposure/persistence';
import {
	deliveredFlagKeys,
	exposure,
	FakeExposureEnvironment,
	FakeStorage,
	settle,
} from './_utils/exposure-fakes';

const ENDPOINT = 'https://xp.atlassian.com/ft/v1/logs';
const FLUSH_INTERVAL_MS = 10_000;

function storageWith(...flagKeys: string[]): FakeStorage {
	const storage = new FakeStorage();
	storage.items.set(
		`${STORAGE_KEY_PREFIX}earlier-page`,
		serializeExposures(
			flagKeys.map((flagKey) => ({ record: exposure(flagKey), attempts: 0 })),
			ENDPOINT,
		),
	);
	return storage;
}

function setup(environment: FakeExposureEnvironment) {
	const logger = createExposureLogger(
		{ endpoint: ENDPOINT, batchSize: 100, flushIntervalMs: FLUSH_INTERVAL_MS },
		environment,
	);
	return { log: (flagKey: string) => logger.log(flagKey, () => exposure(flagKey)) };
}

describe('delivery of exposures taken at construction', () => {
	it('sends taken exposures without waiting for the flush interval', () => {
		const environment = new FakeExposureEnvironment(storageWith('flag-a', 'flag-b'));

		setup(environment);

		expect(environment.requests).toHaveLength(1);
		expect(deliveredFlagKeys(environment.requests[0]!)).toEqual(['flag-a', 'flag-b']);
	});

	it('sends taken exposures at once when constructed in a hidden page, and persists them', () => {
		const storage = storageWith('flag-a');
		const environment = new FakeExposureEnvironment(storage);
		environment.hide();

		setup(environment);

		expect(deliveredFlagKeys(environment.requests[0]!)).toEqual(['flag-a']);
		expect(storage.items.has(`${STORAGE_KEY_PREFIX}instance-1`)).toBe(true);
	});

	it('waits for the flush interval as before when nothing is taken', () => {
		const environment = new FakeExposureEnvironment();
		const { log } = setup(environment);
		log('flag-a');

		environment.advance(FLUSH_INTERVAL_MS - 1);
		expect(environment.requests).toHaveLength(0);
		environment.advance(1);

		expect(environment.requests).toHaveLength(1);
		expect(deliveredFlagKeys(environment.requests[0]!)).toEqual(['flag-a']);
	});

	it('sends exposures queued after the take on the usual schedule', async () => {
		const environment = new FakeExposureEnvironment(storageWith('flag-taken'));
		const { log } = setup(environment);
		log('flag-new');
		environment.requests[0]!.respond(200);
		await settle();

		environment.advance(FLUSH_INTERVAL_MS - 1);
		expect(environment.requests).toHaveLength(1);
		environment.advance(1);

		expect(deliveredFlagKeys(environment.requests[1]!)).toEqual(['flag-new']);
	});

	it('knows deliveries are failing moments after construction, so the breaker opens within seconds', async () => {
		const environment = new FakeExposureEnvironment(storageWith('flag-a'));
		setup(environment);

		// A blocked request fails at once, and so do its two retries after 1 and 2 seconds.
		environment.requests[0]!.fail();
		await settle();
		environment.advance(1_000);
		environment.requests[1]!.fail();
		await settle();
		environment.advance(2_000);
		environment.requests[2]!.fail();
		await settle();

		expect(environment.nowMs).toBeLessThan(FLUSH_INTERVAL_MS);
		// The breaker is open, so the next attempt is the probe.
		environment.advance(BREAKER_PROBE_INTERVAL_MS - 1);
		expect(environment.requests).toHaveLength(3);
		environment.advance(1);
		expect(deliveredFlagKeys(environment.requests[3]!)).toEqual(['flag-a']);
	});
});

describe('with the never-delivered guard', () => {
	it('caps the next write at 4,096 code units once the first delivery after a take fails', async () => {
		// 20 taken exposures together exceed 4,096 code units.
		const taken = Array.from({ length: 20 }, (_, index) => `flag-${index}`);
		const storage = storageWith(...taken);
		const environment = new FakeExposureEnvironment(storage);
		setup(environment);
		environment.requests[0]!.fail();
		await settle();

		// The page is hidden before the flush interval would have sent anything.
		environment.hide();

		const key = `${STORAGE_KEY_PREFIX}instance-1`;
		const value = storage.items.get(key) ?? '';
		expect(environment.nowMs).toBe(0);
		expect(storage.items.has(DELIVERY_MARKER_KEY)).toBe(false);
		expect(value.length).toBeGreaterThan(0);
		expect(key.length + value.length).toBeLessThanOrEqual(UNDELIVERED_ORIGIN_CODE_UNITS);
	});
});
