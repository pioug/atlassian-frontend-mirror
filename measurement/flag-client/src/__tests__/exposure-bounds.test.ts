/**
 * @jest-environment node
 */

/**
 * The bounds that hold while delivery keeps failing: the client's queue, and the `localStorage`
 * budget every instance on an origin shares. Each test keeps delivery failing until the bound is
 * reached, then lets delivery recover to show which exposures survived.
 */
import {
	BREAKER_PROBE_INTERVAL_MS,
	createExposureLogger,
	MAX_QUEUED_WHILE_FAILING,
} from '../exposure/logger';
import type { ExposureRecord, OtlpKeyValue } from '../exposure/otlp';
import {
	DELIVERY_MARKER_FRESH_MS,
	DELIVERY_MARKER_KEY,
	DELIVERY_MARKER_REFRESH_MS,
	MAX_PERSISTED_CODE_UNITS,
	parseExposures,
	serializeExposures,
	serializeExposuresWithinBudget,
	STORAGE_KEY_PREFIX,
	UNDELIVERED_ORIGIN_CODE_UNITS,
	type QueuedExposure,
} from '../exposure/persistence';
import {
	deliveredFlagKeys,
	exposure,
	FakeExposureEnvironment,
	FakeStorage,
	settle,
	type FakeRequest,
} from './_utils/exposure-fakes';

const ENDPOINT = 'https://xp.atlassian.com/ft/v1/logs';
const OWN_KEY = `${STORAGE_KEY_PREFIX}instance-1`;
/** Covers the longest retry delay, the flush interval, and a probe of the open breaker. */
const RETRY_WINDOW_MS = BREAKER_PROBE_INTERVAL_MS * 1.25;

/** An exposure whose persisted entry is about `padding` code units longer than `exposure`'s. */
function sizedExposure(flagKey: string, padding: number): ExposureRecord {
	const record = exposure(flagKey);
	return {
		...record,
		logRecord: {
			...record.logRecord,
			attributes: [
				...record.logRecord.attributes,
				{ key: 'atl.attributes.padding', value: { stringValue: 'x'.repeat(padding) } },
			],
		},
	};
}

function flagKeys(prefix: string, from: number, to: number): string[] {
	return Array.from({ length: to - from }, (_, index) => `${prefix}-${from + index}`);
}

function setup(environment: FakeExposureEnvironment, padding = 0, endpoint = ENDPOINT) {
	const logger = createExposureLogger(
		{ endpoint, batchSize: 100, flushIntervalMs: 10_000 },
		environment,
	);
	const handled = new Set<FakeRequest>();
	const pending = (): FakeRequest[] =>
		environment.requests.filter((request) => !handled.has(request));
	/**
	 * Advance a second at a time until a delivery is sent, so it is answered long before its
	 * delivery timeout, for at most the longest wait before one is due.
	 */
	const advanceToDelivery = async (): Promise<void> => {
		for (let elapsed = 0; elapsed < RETRY_WINDOW_MS && pending().length === 0; elapsed += 1_000) {
			environment.advance(1_000);
			await settle();
		}
	};
	return {
		log: (flagKey: string, size = padding) =>
			logger.log(flagKey, () => (size === 0 ? exposure(flagKey) : sizedExposure(flagKey, size))),
		/** Let any due delivery start, then fail every pending one as a blocked `fetch` would. */
		async failDeliveries(): Promise<void> {
			await advanceToDelivery();
			for (const request of pending()) {
				handled.add(request);
				request.fail();
			}
			await settle();
		},
		/** Let delivery recover, and return the flag keys it delivers until the queue is empty. */
		async deliverAll(): Promise<string[]> {
			const delivered: string[] = [];
			for (;;) {
				await advanceToDelivery();
				const requests = pending();
				if (requests.length === 0) return delivered;
				for (const request of requests) {
					handled.add(request);
					delivered.push(...deliveredFlagKeys(request));
					request.respond(200);
				}
				await settle();
			}
		},
	};
}

function persistedFlagKeys(storage: FakeStorage, key = OWN_KEY): string[] | null {
	const text = storage.items.get(key);
	if (text === undefined) return null;
	return parseExposures(text).map((entry) => {
		const attributes = entry.record.logRecord.attributes as readonly OtlpKeyValue[];
		const value = attributes.find((attribute) => attribute.key === 'feature_flag.key')?.value;
		return value !== undefined && 'stringValue' in value ? value.stringValue : '';
	});
}

/** Code units the exposure keys and values of every instance occupy together. */
function persistedCodeUnits(storage: FakeStorage): number {
	let total = 0;
	for (const [key, value] of storage.items) {
		if (key.startsWith(STORAGE_KEY_PREFIX)) total += key.length + value.length;
	}
	return total;
}

/** Storage for an origin that delivered just now, so failing deliveries keep the full budget. */
function recentlyDelivered(): FakeStorage {
	const storage = new FakeStorage();
	storage.items.set(DELIVERY_MARKER_KEY, '0');
	return storage;
}

function sorted(values: readonly string[]): string[] {
	return [...values].sort();
}

describe('queue bound while deliveries are failing', () => {
	it('keeps only the 1,000 exposures queued most recently, however many are queued', async () => {
		const environment = new FakeExposureEnvironment();
		const { log, failDeliveries, deliverAll } = setup(environment);
		const logged: string[] = [];
		const logAll = (keys: readonly string[]) => {
			for (const flagKey of keys) {
				log(flagKey);
				logged.push(flagKey);
			}
		};

		logAll(flagKeys('flag', 0, 100));
		await failDeliveries();
		// The retry is pending, so all of these wait in the queue of a failing client.
		logAll(flagKeys('flag', 100, 1_200));
		// A steady rate, while every delivery fails and the breaker opens.
		for (let round = 0; round < 5; round += 1) {
			logAll(flagKeys('round', round * 100, (round + 1) * 100));
			await failDeliveries();
		}

		const delivered = await deliverAll();

		expect(MAX_QUEUED_WHILE_FAILING).toBe(1_000);
		expect(delivered).toHaveLength(MAX_QUEUED_WHILE_FAILING);
		expect(sorted(delivered)).toEqual(sorted(logged.slice(-MAX_QUEUED_WHILE_FAILING)));
	});

	it('applies from the first retryable failure, before the breaker opens', async () => {
		const environment = new FakeExposureEnvironment();
		const { log, failDeliveries, deliverAll } = setup(environment);
		for (const flagKey of flagKeys('flag', 0, 100)) log(flagKey);
		await failDeliveries();
		const later = flagKeys('later', 0, 1_000);
		for (const flagKey of later) log(flagKey);

		// The first retry succeeds, so the breaker never opened.
		expect(await deliverAll()).toEqual(later);
	});

	it('still waits for the backoff after the bound drops the batch being retried', async () => {
		const environment = new FakeExposureEnvironment();
		const { log } = setup(environment);
		for (const flagKey of flagKeys('flag', 0, 100)) log(flagKey);
		environment.advance(0);
		// 1,000 newer exposures queue behind the batch in flight, so its retry would exceed the bound.
		for (const flagKey of flagKeys('flag', 100, 1_100)) log(flagKey);
		environment.requests[0]!.fail();
		await settle();

		expect(environment.requests).toHaveLength(1);
		environment.advance(999);
		expect(environment.requests).toHaveLength(1);
		environment.advance(1);
		expect(environment.requests).toHaveLength(2);
		expect(deliveredFlagKeys(environment.requests[1]!)).toEqual(flagKeys('flag', 100, 200));
	});

	it('does not bound the queue once a delivery succeeds', async () => {
		const environment = new FakeExposureEnvironment();
		const { log, failDeliveries, deliverAll } = setup(environment);
		for (const flagKey of flagKeys('flag', 0, 100)) log(flagKey);
		await failDeliveries();
		expect(sorted(await deliverAll())).toEqual(sorted(flagKeys('flag', 0, 100)));

		const burst = flagKeys('burst', 0, 1_500);
		for (const flagKey of burst) log(flagKey);

		expect(sorted(await deliverAll())).toEqual(sorted(burst));
	});
});

describe('persisted storage budget', () => {
	/** About 10,000 code units per entry, so 20 entries exceed the budget. */
	const PADDING = 9_900;

	it('is 131,072 code units', () => {
		expect(MAX_PERSISTED_CODE_UNITS).toBe(131_072);
	});

	it('serializes exactly as before when every entry fits', () => {
		const entries: QueuedExposure[] = flagKeys('flag', 0, 3).map((flagKey, index) => ({
			record: exposure(flagKey, '1.2.3'),
			attempts: index,
		}));

		const budgeted = serializeExposuresWithinBudget(
			new FakeStorage(),
			OWN_KEY,
			entries,
			() => 0,
			ENDPOINT,
		);

		expect(budgeted.entries).toEqual(entries);
		expect(budgeted.text).toBe(serializeExposures(entries, ENDPOINT));
	});

	it('limits only by size, so more than 1,000 small exposures persist when they fit', () => {
		const storage = new FakeStorage();
		// Records small enough that 1,200 entries fit within the budget.
		const taken: QueuedExposure[] = flagKeys('flag', 0, 1_200).map(() => ({
			record: { resource: { serviceName: 's' }, scopeVersion: '1', logRecord: {} },
			attempts: 0,
		}));
		storage.items.set(`${STORAGE_KEY_PREFIX}earlier-page`, serializeExposures(taken, '/l'));
		const environment = new FakeExposureEnvironment(storage);
		createExposureLogger(
			{ endpoint: '/l', batchSize: 2_000, flushIntervalMs: 10_000 },
			environment,
		);

		environment.hide();

		const text = storage.items.get(OWN_KEY) ?? '';
		expect(parseExposures(text)).toHaveLength(1_200);
		expect(OWN_KEY.length + text.length).toBeLessThanOrEqual(MAX_PERSISTED_CODE_UNITS);
	});

	it('writes the newest exposures that fit while delivery keeps failing, and keeps the rest', async () => {
		const storage = recentlyDelivered();
		const environment = new FakeExposureEnvironment(storage);
		const { log, failDeliveries, deliverAll } = setup(environment, PADDING);
		const logged = flagKeys('flag', 0, 20);
		for (const flagKey of logged) log(flagKey);
		await failDeliveries();

		environment.hide();
		const persisted = persistedFlagKeys(storage) ?? [];
		const entryLength = serializeExposures(
			[{ record: sizedExposure('flag-19', PADDING), attempts: 1 }],
			ENDPOINT,
		).length;

		expect(persisted.length).toBeGreaterThan(0);
		expect(persisted).toEqual(logged.slice(-persisted.length));
		expect(persistedCodeUnits(storage)).toBeLessThanOrEqual(MAX_PERSISTED_CODE_UNITS);
		// One more entry would not have fit.
		expect(persistedCodeUnits(storage) + entryLength).toBeGreaterThan(MAX_PERSISTED_CODE_UNITS);

		// Every failed retry rewrites the key within the budget, including exposures queued meanwhile.
		for (const flagKey of flagKeys('hidden', 0, 5)) {
			log(flagKey);
			await failDeliveries();
			expect(persistedCodeUnits(storage)).toBeLessThanOrEqual(MAX_PERSISTED_CODE_UNITS);
		}

		environment.show();
		expect(sorted(await deliverAll())).toEqual(sorted([...logged, ...flagKeys('hidden', 0, 5)]));
	});

	it('shares the budget with entries other tabs wrote first', async () => {
		const storage = recentlyDelivered();
		const tabA = new FakeExposureEnvironment(storage, 'tab-a');
		const tabB = new FakeExposureEnvironment(storage, 'tab-b');
		const a = setup(tabA, PADDING);
		const b = setup(tabB, PADDING);
		const keyA = `${STORAGE_KEY_PREFIX}tab-a-1`;
		const keyB = `${STORAGE_KEY_PREFIX}tab-b-1`;
		const loggedA = flagKeys('a', 0, 8);
		const loggedB = flagKeys('b', 0, 8);
		for (const flagKey of loggedA) a.log(flagKey);
		for (const flagKey of loggedB) b.log(flagKey);
		await a.failDeliveries();
		await b.failDeliveries();

		tabA.hide();
		tabB.hide();

		expect(persistedFlagKeys(storage, keyA)).toEqual(loggedA);
		const persistedB = persistedFlagKeys(storage, keyB) ?? [];
		expect(persistedB.length).toBeGreaterThan(0);
		expect(persistedB.length).toBeLessThan(loggedB.length);
		expect(persistedB).toEqual(loggedB.slice(-persistedB.length));
		expect(persistedCodeUnits(storage)).toBeLessThanOrEqual(MAX_PERSISTED_CODE_UNITS);

		// Once tab A is back and removes its key, tab B's next write has the whole budget.
		tabA.show();
		b.log('b-8');
		await settle();

		expect(persistedFlagKeys(storage, keyB)).toEqual([...loggedB, 'b-8']);
		expect(persistedCodeUnits(storage)).toBeLessThanOrEqual(MAX_PERSISTED_CODE_UNITS);
	});

	it('writes nothing when another tab entry cannot be read, and still delivers', async () => {
		const storage = new FakeStorage();
		const environment = new FakeExposureEnvironment(storage);
		const { log, deliverAll } = setup(environment);
		storage.items.set(`${STORAGE_KEY_PREFIX}other-tab`, serializeExposures([], ENDPOINT));
		log('flag-a');

		storage.failReads = true;
		environment.hide();

		expect(storage.items.has(OWN_KEY)).toBe(false);
		storage.failReads = false;
		environment.show();
		expect(await deliverAll()).toEqual(['flag-a']);
	});

	it('counts a malformed entry from another tab toward the budget by its length', () => {
		const storage = new FakeStorage();
		const environment = new FakeExposureEnvironment(storage);
		const { log } = setup(environment);
		storage.items.set(`${STORAGE_KEY_PREFIX}small-tab`, 'not json');
		log('flag-a');

		environment.hide();
		expect(persistedFlagKeys(storage)).toEqual(['flag-a']);

		environment.show();
		storage.items.set(`${STORAGE_KEY_PREFIX}large-tab`, 'x'.repeat(MAX_PERSISTED_CODE_UNITS));
		environment.hide();
		expect(storage.items.has(OWN_KEY)).toBe(false);
	});

	it('removes its earlier entry when another tab entry cannot be read, so nothing is taken twice', async () => {
		const storage = new FakeStorage();
		const environment = new FakeExposureEnvironment(storage);
		const { log, failDeliveries } = setup(environment);
		log('flag-a');
		log('flag-b');
		await failDeliveries();
		environment.hide();
		expect(persistedFlagKeys(storage)).toEqual(['flag-a', 'flag-b']);
		storage.items.set(`${STORAGE_KEY_PREFIX}other-tab`, serializeExposures([], ENDPOINT));

		// The failed retry rewrites the key, but the other tab's entry cannot be measured.
		storage.failReads = true;
		await failDeliveries();

		expect(storage.items.has(OWN_KEY)).toBe(false);
		storage.failReads = false;
		const laterTab = new FakeExposureEnvironment(storage, 'later-tab');
		setup(laterTab);
		laterTab.advance(RETRY_WINDOW_MS);
		await settle();
		expect(laterTab.requests).toHaveLength(0);
	});

	it('stops at the newest exposure that does not fit rather than writing older ones', async () => {
		const storage = recentlyDelivered();
		const environment = new FakeExposureEnvironment(storage);
		const { log, failDeliveries, deliverAll } = setup(environment);
		const small = flagKeys('flag', 0, 3);
		for (const flagKey of small) log(flagKey);
		await failDeliveries();
		environment.hide();
		expect(persistedFlagKeys(storage)).toEqual(small);
		// Another tab's entry leaves 2,000 code units: room for the three small exposures, but not for
		// a newer one of about 5,000.
		const otherKey = `${STORAGE_KEY_PREFIX}other-tab`;
		storage.items.set(
			otherKey,
			'x'.repeat(MAX_PERSISTED_CODE_UNITS - otherKey.length - OWN_KEY.length - 2_000),
		);

		log('flag-large', 5_000);
		await settle();

		expect(storage.items.has(OWN_KEY)).toBe(false);
		storage.items.delete(otherKey);
		environment.show();
		expect(sorted(await deliverAll())).toEqual(sorted([...small, 'flag-large']));
	});
});

describe('storage on an origin with no recent delivery', () => {
	const DAY_MS = 24 * 60 * 60 * 1000;
	/** A clock well past the epoch, so markers days earlier are valid times. */
	const NOW_MS = 30 * DAY_MS;

	/** A client whose deliveries fail, with 20 exposures that together exceed 4,096 code units. */
	async function failingClient(marker?: number) {
		const storage = new FakeStorage();
		if (marker !== undefined) storage.items.set(DELIVERY_MARKER_KEY, String(marker));
		const environment = new FakeExposureEnvironment(storage);
		environment.nowMs = NOW_MS;
		const client = setup(environment);
		const logged = flagKeys('flag', 0, 20);
		for (const flagKey of logged) client.log(flagKey);
		await client.failDeliveries();
		environment.hide();
		return { ...client, storage, environment, logged };
	}

	it('persists at most 4,096 code units while deliveries fail and no delivery was ever recorded', async () => {
		const { storage, environment, logged, deliverAll } = await failingClient();

		const persisted = persistedFlagKeys(storage) ?? [];
		expect(UNDELIVERED_ORIGIN_CODE_UNITS).toBe(4_096);
		expect(persisted.length).toBeGreaterThan(0);
		expect(persisted).toEqual(logged.slice(-persisted.length));
		expect(persistedCodeUnits(storage)).toBeLessThanOrEqual(UNDELIVERED_ORIGIN_CODE_UNITS);
		// The others stay in memory and are delivered once delivery recovers.
		environment.show();
		expect(sorted(await deliverAll())).toEqual(sorted(logged));
	});

	it('persists at most 4,096 code units when the last recorded delivery is over 7 days old', async () => {
		const { storage } = await failingClient(NOW_MS - DELIVERY_MARKER_FRESH_MS - 1);

		expect(DELIVERY_MARKER_FRESH_MS).toBe(7 * DAY_MS);
		expect(persistedCodeUnits(storage)).toBeGreaterThan(0);
		expect(persistedCodeUnits(storage)).toBeLessThanOrEqual(UNDELIVERED_ORIGIN_CODE_UNITS);
	});

	it('treats a marker that records a later time as absent', async () => {
		const { storage } = await failingClient(NOW_MS + DAY_MS);

		expect(persistedCodeUnits(storage)).toBeLessThanOrEqual(UNDELIVERED_ORIGIN_CODE_UNITS);
	});

	it('keeps the full budget when the origin delivered within 7 days', async () => {
		const { storage, logged } = await failingClient(NOW_MS - DAY_MS);

		expect(persistedFlagKeys(storage)).toEqual(logged);
		expect(persistedCodeUnits(storage)).toBeGreaterThan(UNDELIVERED_ORIGIN_CODE_UNITS);
	});

	it('keeps the full budget while deliveries are not failing, even with no marker', () => {
		const storage = new FakeStorage();
		const environment = new FakeExposureEnvironment(storage);
		const { log } = setup(environment);
		const logged = flagKeys('flag', 0, 20);
		for (const flagKey of logged) log(flagKey);

		environment.hide();

		expect(persistedFlagKeys(storage)).toEqual(logged);
		expect(persistedCodeUnits(storage)).toBeGreaterThan(UNDELIVERED_ORIGIN_CODE_UNITS);
	});

	it('records a successful delivery at most once an hour, and not for other outcomes', async () => {
		const storage = new FakeStorage();
		const environment = new FakeExposureEnvironment(storage);
		environment.nowMs = NOW_MS;
		const logger = createExposureLogger(
			{ endpoint: ENDPOINT, batchSize: 1, flushIntervalMs: 10_000 },
			environment,
		);
		const deliver = async (flagKey: string, status: number): Promise<void> => {
			logger.log(flagKey, () => exposure(flagKey));
			environment.advance(0);
			environment.requests.at(-1)!.respond(status);
			await settle();
		};

		await deliver('flag-rejected', 400);
		expect(storage.items.has(DELIVERY_MARKER_KEY)).toBe(false);
		await deliver('flag-a', 200);
		const first = environment.nowMs;
		expect(storage.items.get(DELIVERY_MARKER_KEY)).toBe(String(first));

		environment.advance(DELIVERY_MARKER_REFRESH_MS - 1);
		await deliver('flag-b', 200);
		expect(storage.items.get(DELIVERY_MARKER_KEY)).toBe(String(first));

		environment.advance(1);
		await deliver('flag-c', 200);
		expect(DELIVERY_MARKER_REFRESH_MS).toBe(60 * 60 * 1000);
		expect(storage.items.get(DELIVERY_MARKER_KEY)).toBe(String(environment.nowMs));
	});

	it('restores the full budget once a delivery succeeds', async () => {
		const { storage, environment, log, deliverAll, logged } = await failingClient();
		environment.show();
		expect(sorted(await deliverAll())).toEqual(sorted(logged));
		expect(Number(storage.items.get(DELIVERY_MARKER_KEY))).toBeGreaterThan(NOW_MS);
		const later = flagKeys('later', 0, 20);
		for (const flagKey of later) log(flagKey);
		environment.hide();

		expect(persistedFlagKeys(storage)).toEqual(later);
	});
});
