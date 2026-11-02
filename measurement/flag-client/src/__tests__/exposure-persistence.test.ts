/**
 * @jest-environment node
 */

import {
	BREAKER_PROBE_INTERVAL_MS,
	createExposureLogger,
	MAX_QUEUED_WHILE_FAILING,
} from '../exposure/logger';
import type { OtlpKeyValue } from '../exposure/otlp';
import { parseExposures, serializeExposures, STORAGE_KEY_PREFIX } from '../exposure/persistence';
import {
	deliveredFlagKeys,
	exposure,
	FakeExposureEnvironment,
	FakeStorage,
	settle,
} from './_utils/exposure-fakes';

const ENDPOINT = 'https://xp.atlassian.com/ft/v1/logs';
/** The endpoint of a client configured differently on the same origin. */
const OTHER_ENDPOINT = 'https://example.test/logs';
const OWN_KEY = `${STORAGE_KEY_PREFIX}instance-1`;

function setup(storage: FakeStorage | null = new FakeStorage(), batchSize = 100) {
	const environment = new FakeExposureEnvironment(storage);
	const logger = createExposureLogger(
		{ endpoint: ENDPOINT, batchSize, flushIntervalMs: 10_000 },
		environment,
	);
	const log = (flagKey: string) => logger.log(flagKey, () => exposure(flagKey));
	return { environment, logger, log, storage };
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

describe('persisted exposure format', () => {
	it('round-trips attempts, resource identity, scope version, and record, and writes the endpoint', () => {
		const entries = [{ record: exposure('flag-a', '1.2.3'), attempts: 3 }];

		expect(parseExposures(serializeExposures(entries, OTHER_ENDPOINT))).toEqual(entries);
		// Earlier versions discard an entry without a deliverable endpoint, so it is still written.
		expect(JSON.parse(serializeExposures(entries, OTHER_ENDPOINT))).toEqual({
			version: 1,
			entries: [
				{
					endpoint: OTHER_ENDPOINT,
					attempts: 3,
					resource: { serviceName: 'jira-frontend', serviceVersion: '1.2.3' },
					scopeVersion: '0.1.0',
					logRecord: exposure('flag-a').logRecord,
				},
			],
		});
	});

	it.each([['not json'], ['null'], ['{"version":2,"entries":[]}'], ['{"version":1}']])(
		'reads no entries from %s',
		(text) => {
			expect(parseExposures(text)).toEqual([]);
		},
	);

	it('ignores unreadable entries and keeps readable siblings', () => {
		const valid = JSON.parse(
			serializeExposures([{ record: exposure('flag-a'), attempts: 0 }], ENDPOINT),
		) as { entries: unknown[] };
		const text = JSON.stringify({
			version: 1,
			entries: [
				{ ...(valid.entries[0] as object), attempts: -1 },
				{ ...(valid.entries[0] as object), attempts: 1.5 },
				{ ...(valid.entries[0] as object), resource: { serviceName: 'x', environmentType: 'qa' } },
				{ ...(valid.entries[0] as object), logRecord: [] },
				valid.entries[0],
			],
		});

		expect(parseExposures(text)).toHaveLength(1);
	});

	it.each([
		['missing', undefined],
		['empty', ''],
		['a path', '/logs'],
		['not a URL', 'not a url'],
		['another protocol', 'ftp://example.test/logs'],
		['a URL with a username', 'https://user@example.test/logs'],
		['a URL with a password', 'https://:pass@example.test/logs'],
		['an array holding a URL', ['https://example.test/logs']],
	])('reads an entry whose recorded endpoint is %s, since it is not used', (_name, endpoint) => {
		const valid = JSON.parse(
			serializeExposures([{ record: exposure('flag-a'), attempts: 0 }], ENDPOINT),
		) as { entries: object[] };
		const entry = valid.entries[0]!;
		const text = JSON.stringify({ version: 1, entries: [{ ...entry, endpoint }, entry] });

		expect(parseExposures(text)).toHaveLength(2);
	});

	it.each([
		['an empty service name', { resource: { serviceName: '' } }],
		['a blank service name', { resource: { serviceName: ' ' } }],
		['a blank service version', { resource: { serviceName: 'x', serviceVersion: ' ' } }],
		['a non-string service version', { resource: { serviceName: 'x', serviceVersion: 1 } }],
		['an empty scope version', { scopeVersion: '' }],
		['a blank scope version', { scopeVersion: ' ' }],
	])('ignores an entry with %s, which this client never writes', (_name, change) => {
		const valid = JSON.parse(
			serializeExposures([{ record: exposure('flag-a'), attempts: 0 }], ENDPOINT),
		) as { entries: object[] };
		const entry = valid.entries[0]!;
		const text = JSON.stringify({ version: 1, entries: [{ ...entry, ...change }, entry] });

		expect(parseExposures(text)).toHaveLength(1);
	});

	it.each([
		['non-array attributes', { attributes: {} }],
		['a malformed trace ID', { traceId: 'zz' }],
		['a null trace ID', { traceId: null }],
		['a span ID of the wrong length', { spanId: 'eee19b7ec3c1b17' }],
		['a body that is not an AnyValue', { body: 'hi' }],
		['a severity number given by name', { severityNumber: 'SEVERITY_NUMBER_TRACE' }],
		['a non-integer severity number', { severityNumber: 1.5 }],
		['flags beyond 32 unsigned bits', { flags: 4_294_967_296 }],
		['a negative dropped attributes count', { droppedAttributesCount: -1 }],
		['a null timestamp', { timeUnixNano: null }],
		['a malformed snake_case timestamp', { time_unix_nano: 'x' }],
		['an attribute without a string key', { attributes: [{ key: 1, value: {} }] }],
		['an attribute without an object value', { attributes: [{ key: 'k', value: 'v' }] }],
		['a non-integer timestamp', { timeUnixNano: 'abc' }],
		['a timestamp beyond 64 unsigned bits', { timeUnixNano: '18446744073709551616' }],
		['a timestamp longer than 20 digits', { timeUnixNano: '018446744073709551615' }],
		[
			'an attribute with two value kinds',
			{ attributes: [{ key: 'k', value: { stringValue: 'a', boolValue: true } }] },
		],
		['a non-string string value', { attributes: [{ key: 'k', value: { stringValue: 1 } }] }],
		['a non-boolean bool value', { attributes: [{ key: 'k', value: { boolValue: 'true' } }] }],
		['a null bool value', { attributes: [{ key: 'k', value: { boolValue: null } }] }],
		['a non-decimal int value', { attributes: [{ key: 'k', value: { intValue: '1.5' } }] }],
		[
			'an int value above 64 signed bits',
			{ attributes: [{ key: 'k', value: { intValue: '9223372036854775808' } }] },
		],
		[
			'an int value below 64 signed bits',
			{ attributes: [{ key: 'k', value: { intValue: '-9223372036854775809' } }] },
		],
		[
			'an int value longer than 19 digits',
			{ attributes: [{ key: 'k', value: { intValue: '-09223372036854775808' } }] },
		],
		['a non-numeric double value', { attributes: [{ key: 'k', value: { doubleValue: 'abc' } }] }],
		['URL-safe bytes', { attributes: [{ key: 'k', value: { bytesValue: '-_8=' } }] }],
		['unpadded bytes', { attributes: [{ key: 'k', value: { bytesValue: 'AQI' } }] }],
		[
			'an array value with an invalid element',
			{ attributes: [{ key: 'k', value: { arrayValue: { values: [{ stringValue: 1 }] } } }] },
		],
		[
			'a key-value list with a non-string key',
			{ attributes: [{ key: 'k', value: { kvlistValue: { values: [{ key: 1 }] } } }] },
		],
	])('ignores an entry whose log record has %s', (_name, change) => {
		const valid = JSON.parse(
			serializeExposures([{ record: exposure('flag-a'), attempts: 0 }], ENDPOINT),
		) as { entries: { logRecord: object }[] };
		const entry = valid.entries[0]!;
		const logRecord = { ...entry.logRecord, ...change };
		const text = JSON.stringify({ version: 1, entries: [{ ...entry, logRecord }, entry] });

		expect(parseExposures(text)).toHaveLength(1);
	});

	it.each([
		['no members', null],
		['only a member OTLP does not define', { future: 1 }],
		['a JSON-number timestamp', { timeUnixNano: 1_760_000_000_000_000_000 }],
		['another severity number', { severityNumber: 9 }],
		['another severity text', { severityText: 'INFO' }],
		['another event name', { eventName: 'flag_consistency_check' }],
		[
			'trace and span IDs',
			{ traceId: '5B8EFFF798038103d269b633813fc60c', spanId: 'eee19b7ec3c1b174' },
		],
		['empty trace and span IDs', { traceId: '', spanId: '' }],
		[
			'an observed time, flags, and a dropped count',
			{ observedTimeUnixNano: '1', flags: '1', droppedAttributesCount: 2 },
		],
		['a body', { body: { stringValue: 'b' } }],
		[
			'null string, body, and attribute members',
			{ severityText: null, body: null, attributes: null },
		],
		['a valid snake_case timestamp', { time_unix_nano: '5' }],
		['a member OTLP does not define', { future: { nested: [1, { b: 2 }] } }],
		[
			'an attribute with a member OTLP does not define',
			{ attributes: [{ key: 'k', value: { stringValue: 'a' }, extra: 1 }] },
		],
		['an attribute with an empty value', { attributes: [{ key: 'k', value: {} }] }],
		['an attribute without a value', { attributes: [{ key: 'k' }] }],
		['an attribute with an unknown value kind', { attributes: [{ key: 'k', value: { foo: 1 } }] }],
		['a JSON-number int value', { attributes: [{ key: 'k', value: { intValue: 5 } }] }],
		[
			'decimal-string and non-finite double values',
			{
				attributes: [
					{ key: 'a', value: { doubleValue: '1.5' } },
					{ key: 'b', value: { doubleValue: 'NaN' } },
					{ key: 'c', value: { doubleValue: '-Infinity' } },
				],
			},
		],
		['bytes', { attributes: [{ key: 'k', value: { bytesValue: 'AQI=' } }] }],
		['an array value without values', { attributes: [{ key: 'k', value: { arrayValue: {} } }] }],
		[
			'an array value nested in an array value',
			{
				attributes: [
					{ key: 'k', value: { arrayValue: { values: [{ arrayValue: { values: [] } }] } } },
				],
			},
		],
		[
			'an array value with a member OTLP does not define',
			{ attributes: [{ key: 'k', value: { arrayValue: { values: [], extra: 1 } } }] },
		],
		[
			'a key-value list value',
			{
				attributes: [
					{
						key: 'k',
						value: { kvlistValue: { values: [{ key: 'a', value: { stringValue: 'b' } }] } },
					},
				],
			},
		],
	])('reads, unchanged, an entry whose log record has %s', (_name, change) => {
		const valid = JSON.parse(
			serializeExposures([{ record: exposure('flag-a'), attempts: 0 }], ENDPOINT),
		) as { entries: { logRecord: object }[] };
		const entry = valid.entries[0]!;
		const logRecord = change === null ? {} : { ...entry.logRecord, ...change };
		const text = JSON.stringify({ version: 1, entries: [{ ...entry, logRecord }, entry] });

		const parsed = parseExposures(text);
		expect(parsed).toHaveLength(2);
		expect(parsed[0]?.record.logRecord).toEqual(logRecord);
	});

	it('reads a stored value and entry with members it does not use', () => {
		const valid = JSON.parse(
			serializeExposures([{ record: exposure('flag-a'), attempts: 0 }], ENDPOINT),
		) as { entries: object[] };
		const text = JSON.stringify({
			version: 1,
			future: true,
			entries: [{ ...valid.entries[0]!, future: { sampled: true } }],
		});

		expect(parseExposures(text)).toHaveLength(1);
	});

	it('reads an entry whose attributes use every value kind this client writes', () => {
		const valid = JSON.parse(
			serializeExposures([{ record: exposure('flag-a'), attempts: 0 }], ENDPOINT),
		) as { entries: { logRecord: object }[] };
		const entry = valid.entries[0]!;
		const attributes = [
			{ key: 's', value: { stringValue: '' } },
			{ key: 'b', value: { boolValue: false } },
			{ key: 'i', value: { intValue: '-42' } },
			{ key: 'd', value: { doubleValue: 0.5 } },
			{ key: 'a', value: { arrayValue: { values: [{ stringValue: 'x' }] } } },
		];
		const text = JSON.stringify({
			version: 1,
			entries: [{ ...entry, logRecord: { ...entry.logRecord, attributes } }],
		});

		expect(parseExposures(text)[0]?.record.logRecord.attributes).toEqual(attributes);
	});

	it('ignores an entry whose array values are nested beyond the stack without throwing', () => {
		const valid = JSON.parse(
			serializeExposures([{ record: exposure('flag-a'), attempts: 0 }], ENDPOINT),
		) as { entries: { logRecord: object }[] };
		const entry = valid.entries[0]!;
		const depth = 100_000;
		const nested = `${'{"arrayValue":{"values":['.repeat(depth)}{"stringValue":"x"}${']}}'.repeat(depth)}`;
		const logRecord = { ...entry.logRecord, attributes: [{ key: 'k', value: 0 }] };
		const text = JSON.stringify({ version: 1, entries: [{ ...entry, logRecord }, entry] }).replace(
			'"value":0',
			`"value":${nested}`,
		);

		expect(parseExposures(text)).toHaveLength(1);
	});

	it('ignores an entry whose double value is out of range', () => {
		const valid = JSON.parse(
			serializeExposures([{ record: exposure('flag-a'), attempts: 0 }], ENDPOINT),
		) as { entries: { logRecord: object }[] };
		const entry = valid.entries[0]!;
		const attributes = [{ key: 'd', value: { doubleValue: 0.5 } }];
		const logRecord = { ...entry.logRecord, attributes };
		// `JSON.stringify` cannot write an out-of-range number, so the literal is put in the text.
		const text = JSON.stringify({ version: 1, entries: [{ ...entry, logRecord }, entry] }).replace(
			'"doubleValue":0.5',
			'"doubleValue":1e400',
		);

		expect(text).toContain('1e400');
		expect(parseExposures(text)).toHaveLength(1);
	});

	it('reads an entry whose timestamp and int values are at the 64-bit bounds', () => {
		const valid = JSON.parse(
			serializeExposures([{ record: exposure('flag-a'), attempts: 0 }], ENDPOINT),
		) as { entries: { logRecord: object }[] };
		const entry = valid.entries[0]!;
		const attributes = [
			{ key: 'max', value: { intValue: '9223372036854775807' } },
			{ key: 'min', value: { intValue: '-9223372036854775808' } },
		];
		const logRecord = { ...entry.logRecord, timeUnixNano: '18446744073709551615', attributes };
		const text = JSON.stringify({ version: 1, entries: [{ ...entry, logRecord }] });

		expect(parseExposures(text)[0]?.record.logRecord).toMatchObject({
			timeUnixNano: '18446744073709551615',
			attributes,
		});
	});
});

describe('page-lifecycle persistence', () => {
	it('writes queued and in-flight exposures when the page becomes hidden', () => {
		const { environment, log, storage } = setup();

		log('flag-a');
		environment.advance(10_000);
		log('flag-b');
		environment.hide();

		expect(environment.requests).toHaveLength(1);
		expect(persistedFlagKeys(storage!)).toEqual(['flag-a', 'flag-b']);
	});

	it('records each entry with the client’s endpoint and its failed attempts', async () => {
		const { environment, log, storage } = setup();

		log('flag-a');
		environment.advance(10_000);
		environment.requests[0]!.respond(429);
		await settle();
		environment.hide();

		const text = storage!.items.get(OWN_KEY)!;
		expect(parseExposures(text)).toEqual([{ record: exposure('flag-a'), attempts: 1 }]);
		expect(JSON.parse(text)).toMatchObject({ entries: [{ endpoint: ENDPOINT, attempts: 1 }] });
	});

	it('records a taken exposure with the client’s own endpoint, not the one it was saved with', () => {
		const storage = new FakeStorage();
		storage.items.set(
			`${STORAGE_KEY_PREFIX}earlier-page`,
			serializeExposures([{ record: exposure('flag-old'), attempts: 2 }], OTHER_ENDPOINT),
		);
		const { environment } = setup(storage);

		environment.hide();

		expect(JSON.parse(storage.items.get(OWN_KEY)!)).toMatchObject({
			entries: [{ endpoint: ENDPOINT, attempts: 2 }],
		});
	});

	it('removes the entry when it is delivered while the page stays hidden', async () => {
		const { environment, log, storage } = setup();

		log('flag-a');
		environment.hide();
		environment.advance(10_000);
		environment.requests[0]!.respond(200);
		await settle();

		expect(storage!.items.has(OWN_KEY)).toBe(false);
	});

	it('rewrites the attempt count after a retryable failure while hidden', async () => {
		const { environment, log, storage } = setup();

		log('flag-a');
		environment.hide();
		environment.advance(10_000);
		environment.requests[0]!.respond(503);
		await settle();

		expect(parseExposures(storage!.items.get(OWN_KEY)!)[0]?.attempts).toBe(1);
	});

	it('rewrites its key with every undelivered entry after a delivery outcome', async () => {
		const { environment, log, storage } = setup();

		log('flag-a');
		log('flag-b');
		environment.hide();
		environment.advance(10_000);
		log('flag-c');
		environment.requests[0]!.respond(400);
		await settle();

		expect(persistedFlagKeys(storage!)).toEqual(['flag-c']);
	});

	it('persists an exposure queued while hidden after its key was removed', async () => {
		const { environment, log, storage } = setup();

		log('flag-a');
		environment.hide();
		environment.advance(10_000);
		environment.requests[0]!.respond(200);
		await settle();
		log('flag-c');
		await settle();

		expect(persistedFlagKeys(storage!)).toEqual(['flag-c']);
	});

	it('persists an exposure queued while hidden alongside one in flight', async () => {
		const { environment, log, storage } = setup();

		log('flag-a');
		environment.hide();
		environment.advance(10_000);
		log('flag-d');
		await settle();

		expect(persistedFlagKeys(storage!)).toEqual(['flag-a', 'flag-d']);
	});

	it('persists every exposure queued while hidden in one task with one write', async () => {
		const { environment, log, storage } = setup();
		environment.hide();
		const setItem = jest.spyOn(storage!, 'setItem');

		log('flag-a');
		log('flag-b');
		log('flag-c');
		await settle();

		expect(setItem).toHaveBeenCalledTimes(1);
		expect(persistedFlagKeys(storage!)).toEqual(['flag-a', 'flag-b', 'flag-c']);
	});

	it('does not persist an exposure queued while hidden when the page is shown in the same task', async () => {
		const { environment, log, storage } = setup();
		environment.hide();

		log('flag-a');
		environment.show();
		await settle();

		expect(storage!.items.size).toBe(0);
	});

	it('persists reclaimed and queued exposures when constructed in a hidden page', async () => {
		const storage = new FakeStorage();
		const otherKey = `${STORAGE_KEY_PREFIX}earlier-page`;
		storage.items.set(
			otherKey,
			serializeExposures([{ record: exposure('flag-old'), attempts: 0 }], ENDPOINT),
		);
		const environment = new FakeExposureEnvironment(storage);
		environment.hide();
		const logger = createExposureLogger(
			{ endpoint: ENDPOINT, batchSize: 100, flushIntervalMs: 10_000 },
			environment,
		);

		expect(storage.items.has(otherKey)).toBe(false);
		expect(persistedFlagKeys(storage)).toEqual(['flag-old']);
		logger.log('flag-a', () => exposure('flag-a'));
		await settle();
		expect(persistedFlagKeys(storage)).toEqual(['flag-old', 'flag-a']);
	});

	it('does not persist exposures queued after the page is visible again', () => {
		const { environment, log, storage } = setup();

		log('flag-a');
		environment.hide();
		environment.show();
		log('flag-b');

		expect(storage!.items.has(OWN_KEY)).toBe(false);
	});

	it('removes its key on return to the page and delivers each exposure once', async () => {
		const { environment, log, storage } = setup();

		log('flag-a');
		environment.hide();
		environment.show();
		expect(storage!.items.has(OWN_KEY)).toBe(false);

		environment.advance(10_000);
		environment.requests[0]!.respond(200);
		await settle();
		environment.hide();
		environment.advance(60_000);

		expect(environment.requests).toHaveLength(1);
		expect(deliveredFlagKeys(environment.requests[0]!)).toEqual(['flag-a']);
	});

	it('removes a stale key when the page becomes hidden with nothing undelivered', async () => {
		const { environment, log, storage } = setup();

		log('flag-a');
		environment.advance(10_000);
		environment.requests[0]!.respond(200);
		await settle();
		storage!.items.set(OWN_KEY, 'stale');
		environment.hide();

		expect(storage!.items.has(OWN_KEY)).toBe(false);
	});
});

describe('reclaiming persisted exposures', () => {
	it('takes, removes, and delivers other instances’ entries to its own endpoint', () => {
		const storage = new FakeStorage();
		const otherKey = `${STORAGE_KEY_PREFIX}earlier-page`;
		storage.items.set(
			otherKey,
			serializeExposures([{ record: exposure('flag-old', '1.2.2'), attempts: 4 }], OTHER_ENDPOINT),
		);
		storage.items.set(`${STORAGE_KEY_PREFIX}corrupt`, 'not json');
		storage.items.set('unrelated', 'kept');

		const { environment } = setup(storage);
		environment.advance(10_000);

		expect([...storage.items.keys()]).toEqual(['unrelated']);
		expect(environment.requests).toHaveLength(1);
		expect(environment.requests[0]!.url).toBe(ENDPOINT);
		const body = JSON.parse(environment.requests[0]!.init.body) as {
			resourceLogs: { resource: { attributes: unknown[] } }[];
		};
		expect(body.resourceLogs[0]?.resource.attributes).toContainEqual({
			key: 'service.version',
			value: { stringValue: '1.2.2' },
		});
	});

	it('delivers a log record saved by a newer client unchanged', () => {
		const storage = new FakeStorage();
		const logRecord = {
			...exposure('flag-new').logRecord,
			eventName: 'flag_consistency_check',
			traceId: '5b8efff798038103d269b633813fc60c',
			future: { nested: true },
			attributes: [
				{ key: 'feature_flag.key', value: { stringValue: 'flag-new' } },
				{
					key: 'k',
					value: { kvlistValue: { values: [{ key: 'a', value: { stringValue: 'b' } }] } },
				},
			],
		};
		const valid = JSON.parse(
			serializeExposures([{ record: exposure('flag-new'), attempts: 0 }], ENDPOINT),
		) as { entries: object[] };
		storage.items.set(
			`${STORAGE_KEY_PREFIX}newer-client`,
			JSON.stringify({ version: 1, entries: [{ ...valid.entries[0]!, logRecord }] }),
		);

		const { environment } = setup(storage);
		environment.advance(10_000);

		expect(environment.requests).toHaveLength(1);
		const body = JSON.parse(environment.requests[0]!.init.body) as {
			resourceLogs: { scopeLogs: { logRecords: unknown[] }[] }[];
		};
		expect(body.resourceLogs[0]?.scopeLogs[0]?.logRecords).toEqual([logRecord]);
	});

	it('delivers only the readable one of two records when one has a malformed trace ID', () => {
		const storage = new FakeStorage();
		const valid = JSON.parse(
			serializeExposures(
				[
					{ record: exposure('flag-a'), attempts: 0 },
					{ record: exposure('flag-b'), attempts: 0 },
				],
				ENDPOINT,
			),
		) as { entries: { logRecord: object }[] };
		const [first, second] = valid.entries;
		storage.items.set(
			`${STORAGE_KEY_PREFIX}earlier-page`,
			JSON.stringify({
				version: 1,
				entries: [first, { ...second!, logRecord: { ...second!.logRecord, traceId: 'zz' } }],
			}),
		);

		const { environment } = setup(storage);
		environment.advance(10_000);

		expect(environment.requests.map(deliveredFlagKeys)).toEqual([['flag-a']]);
	});

	it('leaves another instance’s entry for its owner when removing it fails', () => {
		const storage = new FakeStorage();
		const otherKey = `${STORAGE_KEY_PREFIX}earlier-page`;
		storage.items.set(
			otherKey,
			serializeExposures([{ record: exposure('flag-old'), attempts: 0 }], ENDPOINT),
		);
		storage.failRemoves = true;

		const { environment } = setup(storage);
		environment.advance(10_000);

		expect(storage.items.has(otherKey)).toBe(true);
		expect(environment.requests).toHaveLength(0);
	});

	it('leaves another instance’s entry in storage when page-lifecycle registration throws', () => {
		const storage = new FakeStorage();
		const otherKey = `${STORAGE_KEY_PREFIX}earlier-page`;
		const text = serializeExposures([{ record: exposure('flag-old'), attempts: 0 }], ENDPOINT);
		storage.items.set(otherKey, text);
		const environment = new FakeExposureEnvironment(storage);
		environment.onPageLifecycle = () => {
			throw new TypeError('addEventListener is not a function');
		};

		expect(() =>
			createExposureLogger(
				{ endpoint: ENDPOINT, batchSize: 100, flushIntervalMs: 10_000 },
				environment,
			),
		).toThrow(TypeError);
		expect(storage.items.get(otherKey)).toBe(text);
	});

	it('sends exposures taken for another endpoint to its own endpoint at once, and new ones after', async () => {
		const storage = new FakeStorage();
		storage.items.set(
			`${STORAGE_KEY_PREFIX}earlier-page`,
			serializeExposures([{ record: exposure('flag-old'), attempts: 0 }], OTHER_ENDPOINT),
		);
		const { environment, log } = setup(storage);

		log('flag-new');
		environment.requests[0]!.respond(200);
		await settle();
		environment.advance(10_000);

		expect(environment.requests.map((request) => request.url)).toEqual([ENDPOINT, ENDPOINT]);
		expect(deliveredFlagKeys(environment.requests[0]!)).toEqual(['flag-old']);
		expect(deliveredFlagKeys(environment.requests[1]!)).toEqual(['flag-new']);
	});

	it('drops queued exposures whose entries the host page removed while this page was hidden', () => {
		const storage = new FakeStorage();
		const first = setup(storage);
		first.log('flag-a');
		first.environment.hide();

		storage.items.clear();
		first.environment.show();
		first.environment.advance(10_000);

		expect(first.environment.requests).toHaveLength(0);
	});

	it('drops entries another instance took while this page was hidden', async () => {
		const storage = new FakeStorage();
		const first = setup(storage);
		first.log('flag-a');
		first.environment.hide();

		const second = new FakeExposureEnvironment(storage, 'other-tab');
		createExposureLogger({ endpoint: ENDPOINT, batchSize: 100, flushIntervalMs: 10_000 }, second);
		first.environment.show();
		first.environment.advance(10_000);
		second.advance(10_000);

		expect(first.environment.requests).toHaveLength(0);
		expect(second.requests).toHaveLength(1);
		expect(deliveredFlagKeys(second.requests[0]!)).toEqual(['flag-a']);
	});

	it('does not deliver entries another instance took while this page stays hidden', async () => {
		const storage = new FakeStorage();
		const first = setup(storage);
		first.log('flag-a');
		first.environment.hide();

		const second = new FakeExposureEnvironment(storage, 'other-tab');
		createExposureLogger({ endpoint: ENDPOINT, batchSize: 100, flushIntervalMs: 10_000 }, second);
		first.environment.advance(10_000);
		second.advance(10_000);

		expect(first.environment.requests).toHaveLength(0);
		expect(second.requests).toHaveLength(1);
		expect(deliveredFlagKeys(second.requests[0]!)).toEqual(['flag-a']);
	});

	it('neither persists nor retries in-flight entries another instance took', async () => {
		const storage = new FakeStorage();
		const first = setup(storage);
		first.log('flag-a');
		first.environment.advance(10_000);
		first.environment.hide();

		const second = new FakeExposureEnvironment(storage, 'other-tab');
		createExposureLogger({ endpoint: ENDPOINT, batchSize: 100, flushIntervalMs: 10_000 }, second);
		first.log('flag-b');
		first.environment.hide();
		expect(persistedFlagKeys(storage)).toEqual(['flag-b']);

		first.environment.requests[0]!.respond(503);
		await settle();
		first.environment.advance(60_000);
		second.advance(10_000);

		expect(first.environment.requests.map(deliveredFlagKeys)).toEqual([['flag-a'], ['flag-b']]);
		expect(second.requests.map(deliveredFlagKeys)).toEqual([['flag-a']]);
	});

	it('does not hold later exposures behind a retry of in-flight entries another instance took', async () => {
		const storage = new FakeStorage();
		const first = setup(storage);
		first.log('flag-a');
		first.environment.advance(10_000);
		first.environment.hide();
		const second = new FakeExposureEnvironment(storage, 'other-tab');
		createExposureLogger({ endpoint: ENDPOINT, batchSize: 100, flushIntervalMs: 10_000 }, second);

		first.environment.requests[0]!.respond(503);
		await settle();
		first.log('flag-b');
		first.environment.advance(9_999);
		expect(first.environment.requests).toHaveLength(1);
		first.environment.advance(1);

		expect(first.environment.requests.map(deliveredFlagKeys)).toEqual([['flag-a'], ['flag-b']]);
	});

	it('flushes an exposure queued while its in-flight batch was taken without the retry backoff', async () => {
		const storage = new FakeStorage();
		const environment = new FakeExposureEnvironment(storage);
		const logger = createExposureLogger(
			{ endpoint: ENDPOINT, batchSize: 100, flushIntervalMs: 100 },
			environment,
		);
		logger.log('flag-a', () => exposure('flag-a'));
		environment.advance(100);
		environment.hide();
		const second = new FakeExposureEnvironment(storage, 'other-tab');
		createExposureLogger({ endpoint: ENDPOINT, batchSize: 100, flushIntervalMs: 10_000 }, second);
		logger.log('flag-b', () => exposure('flag-b'));

		environment.requests[0]!.respond(503);
		await settle();
		environment.advance(100);

		expect(environment.requests.map(deliveredFlagKeys)).toEqual([['flag-a'], ['flag-b']]);
	});

	it('does not hold later exposures behind a retry whose entries another instance took', async () => {
		const storage = new FakeStorage();
		const first = setup(storage);
		first.log('flag-a');
		first.environment.advance(10_000);
		first.environment.requests[0]!.respond(503);
		await settle();
		first.environment.hide();
		const second = new FakeExposureEnvironment(storage, 'other-tab');
		createExposureLogger({ endpoint: ENDPOINT, batchSize: 100, flushIntervalMs: 10_000 }, second);

		first.log('flag-b');
		await settle();
		first.environment.advance(9_999);
		expect(first.environment.requests).toHaveLength(1);
		first.environment.advance(1);

		expect(first.environment.requests.map(deliveredFlagKeys)).toEqual([['flag-a'], ['flag-b']]);
	});

	it('flushes an exposure held behind a retry that a hidden signal finds taken', async () => {
		const storage = new FakeStorage();
		const first = setup(storage);
		first.log('flag-a');
		first.environment.hide();
		first.environment.storageImpl = null;
		first.environment.show();
		first.environment.storageImpl = storage;
		first.environment.advance(10_000);
		first.environment.requests[0]!.respond(503);
		await settle();
		first.log('flag-b');
		createExposureLogger(
			{ endpoint: ENDPOINT, batchSize: 100, flushIntervalMs: 10_000 },
			new FakeExposureEnvironment(storage, 'other-tab'),
		);

		first.environment.hide();
		first.environment.advance(10_000);

		expect(first.environment.requests.map(deliveredFlagKeys)).toEqual([['flag-a'], ['flag-b']]);
	});

	it('flushes an exposure held behind a retry that a visible signal finds taken', async () => {
		const storage = new FakeStorage();
		const first = setup(storage);
		first.log('flag-a');
		first.environment.advance(10_000);
		first.environment.hide();
		first.environment.requests[0]!.respond(503);
		await settle();
		first.environment.storageImpl = null;
		first.log('flag-b');
		await settle();
		first.environment.storageImpl = storage;
		createExposureLogger(
			{ endpoint: ENDPOINT, batchSize: 100, flushIntervalMs: 10_000 },
			new FakeExposureEnvironment(storage, 'other-tab'),
		);

		first.environment.show();
		first.environment.advance(10_000);

		expect(first.environment.requests.map(deliveredFlagKeys)).toEqual([['flag-a'], ['flag-b']]);
	});

	it('does not recreate a taken key on a second hidden signal', () => {
		const storage = new FakeStorage();
		const first = setup(storage);
		first.log('flag-a');
		first.environment.hide();
		createExposureLogger(
			{ endpoint: ENDPOINT, batchSize: 100, flushIntervalMs: 10_000 },
			new FakeExposureEnvironment(storage, 'other-tab'),
		);

		first.environment.hide();

		expect(storage.items.has(OWN_KEY)).toBe(false);
	});
});

describe('storage failures', () => {
	it('keeps delivering from memory when a write fails', async () => {
		const storage = new FakeStorage();
		storage.failWrites = true;
		const { environment, log } = setup(storage);

		log('flag-a');
		expect(() => environment.hide()).not.toThrow();
		expect(storage.items.size).toBe(0);
		environment.advance(10_000);
		environment.requests[0]!.respond(200);
		await settle();

		expect(environment.requests).toHaveLength(1);
	});

	it('removes its key when a later rewrite fails', async () => {
		const storage = new FakeStorage();
		const { environment, log } = setup(storage);

		log('flag-a');
		log('flag-b');
		environment.hide();
		storage.failWrites = true;
		environment.advance(10_000);
		environment.requests[0]!.respond(503);
		await settle();

		expect(storage.items.has(OWN_KEY)).toBe(false);
	});

	it('writes only the exposures queued most recently that fit and still delivers the others', () => {
		const storage = new FakeStorage();
		const { environment, log } = setup(storage, 2_000);
		// More than fit within the storage budget.
		const flagKeys = Array.from({ length: 600 }, (_, index) => `flag-${index}`);
		for (const flagKey of flagKeys) log(flagKey);

		environment.hide();
		const persisted = persistedFlagKeys(storage) ?? [];
		expect(persisted.length).toBeGreaterThan(0);
		expect(persisted).toEqual(flagKeys.slice(-persisted.length));
		expect(persisted.length).toBeLessThan(flagKeys.length);
		environment.advance(10_000);

		expect(deliveredFlagKeys(environment.requests[0]!)).toEqual(flagKeys);
	});

	it('drops the exposures taken earliest once a retry bounds the queue, whatever endpoint they recorded', async () => {
		const storage = new FakeStorage();
		storage.items.set(
			`${STORAGE_KEY_PREFIX}earlier-page`,
			serializeExposures([{ record: exposure('flag-taken-first'), attempts: 0 }], ENDPOINT),
		);
		storage.items.set(
			`${STORAGE_KEY_PREFIX}other-endpoint-page`,
			serializeExposures([{ record: exposure('flag-taken-second'), attempts: 0 }], OTHER_ENDPOINT),
		);
		const { environment, log } = setup(storage, 2_000);
		// Taken exposures are sent as the client is constructed, before the flush interval.
		expect(environment.requests.map((request) => request.url)).toEqual([ENDPOINT]);
		expect(deliveredFlagKeys(environment.requests[0]!)).toEqual([
			'flag-taken-first',
			'flag-taken-second',
		]);
		const logged = Array.from({ length: MAX_QUEUED_WHILE_FAILING }, (_, index) => `flag-${index}`);
		for (const flagKey of logged) log(flagKey);
		environment.requests[0]!.respond(503);
		await settle();
		environment.hide();
		const persisted = persistedFlagKeys(storage) ?? [];
		expect(persisted).toEqual(logged.slice(-persisted.length));
		environment.show();
		environment.advance(1_000);

		expect(MAX_QUEUED_WHILE_FAILING).toBe(1_000);
		expect(deliveredFlagKeys(environment.requests[1]!)).toEqual(logged);
	});

	it('keeps delivering an exposure it did not write after another instance takes its key', () => {
		const storage = new FakeStorage();
		const { environment, log } = setup(storage, 2_000);
		const flagKeys = Array.from({ length: 600 }, (_, index) => `flag-${index}`);
		for (const flagKey of flagKeys) log(flagKey);
		environment.hide();
		const written = persistedFlagKeys(storage)?.length ?? 0;
		expect(written).toBeGreaterThan(0);

		storage.items.delete(OWN_KEY);
		environment.show();
		environment.advance(10_000);

		expect(environment.requests).toHaveLength(1);
		expect(deliveredFlagKeys(environment.requests[0]!)).toEqual(flagKeys.slice(0, -written));
	});

	it('works without storage', () => {
		const { environment, log } = setup(null);

		log('flag-a');
		expect(() => environment.hide()).not.toThrow();
		environment.advance(10_000);

		expect(environment.requests).toHaveLength(1);
	});

	it('still removes its key on return to the page when reading it fails', () => {
		const { environment, log, storage } = setup();

		log('flag-a');
		environment.hide();
		storage!.failReads = true;
		environment.show();

		expect(storage!.items.has(OWN_KEY)).toBe(false);
	});

	it('retries removing its key on return to the page after removing it fails', async () => {
		const { environment, log, storage } = setup();

		log('flag-a');
		environment.hide();
		storage!.failRemoves = true;
		environment.advance(10_000);
		environment.requests[0]!.respond(200);
		await settle();
		expect(storage!.items.has(OWN_KEY)).toBe(true);
		storage!.failRemoves = false;
		environment.show();

		expect(storage!.items.has(OWN_KEY)).toBe(false);
	});

	it('survives storage that throws on read during reclaim and visibility changes', () => {
		const storage = new FakeStorage();
		storage.items.set(`${STORAGE_KEY_PREFIX}earlier-page`, 'x');
		storage.failReads = true;
		const { environment, log } = setup(storage);

		log('flag-a');
		expect(() => {
			environment.hide();
			environment.show();
		}).not.toThrow();
		environment.advance(10_000);

		expect(environment.requests).toHaveLength(1);
	});
});

describe('circuit breaker', () => {
	/** Fail the latest delivery with a network error 3 times, so the breaker opens. */
	async function openBreaker(environment: FakeExposureEnvironment): Promise<void> {
		for (let failure = 1; failure <= 3; failure += 1) {
			environment.requests.at(-1)!.fail();
			await settle();
			if (failure < 3) environment.advance(30_000);
		}
	}

	it('persists exposures queued while the breaker is open', async () => {
		const storage = new FakeStorage();
		const { environment, log } = setup(storage, 1);

		log('flag-a');
		environment.advance(0);
		log('flag-b');
		environment.hide();
		await openBreaker(environment);
		expect(persistedFlagKeys(storage)).toEqual(['flag-a', 'flag-b']);
		log('flag-c');
		await settle();
		expect(persistedFlagKeys(storage)).toEqual(['flag-a', 'flag-b', 'flag-c']);
		environment.show();
		expect(persistedFlagKeys(storage)).toBeNull();
		environment.hide();

		expect(persistedFlagKeys(storage)).toEqual(['flag-a', 'flag-b', 'flag-c']);
		expect(environment.requests).toHaveLength(3);
	});

	it('lets a later client deliver exposures held by an open breaker, with their attempts', async () => {
		const storage = new FakeStorage();
		const first = setup(storage, 1);
		first.log('flag-a');
		first.environment.advance(0);
		await openBreaker(first.environment);
		first.log('flag-b');
		first.environment.hide();

		const later = new FakeExposureEnvironment(storage, 'later-page');
		createExposureLogger({ endpoint: ENDPOINT, batchSize: 2, flushIntervalMs: 10_000 }, later);

		expect(storage.items.size).toBe(0);
		expect(later.requests).toHaveLength(1);
		expect(later.requests[0]!.url).toBe(ENDPOINT);
		expect(deliveredFlagKeys(later.requests[0]!)).toEqual(['flag-a', 'flag-b']);
		later.requests[0]!.fail();
		await settle();
		later.hide();
		expect(
			parseExposures(storage.items.get(`${STORAGE_KEY_PREFIX}later-page-1`)!).map(
				(entry) => entry.attempts,
			),
		).toEqual([4, 1]);
	});

	it('does not persist exposures held by an open breaker again once another tab takes them', async () => {
		const storage = new FakeStorage();
		const { environment, log } = setup(storage, 1);
		log('flag-a');
		environment.advance(0);
		await openBreaker(environment);
		environment.hide();

		const otherTab = new FakeExposureEnvironment(storage, 'other-tab');
		createExposureLogger({ endpoint: ENDPOINT, batchSize: 1, flushIntervalMs: 10_000 }, otherTab);
		environment.show();
		environment.hide();

		expect(persistedFlagKeys(storage)).toBeNull();
		expect(otherTab.requests).toHaveLength(1);
	});

	it('persists the newest of the exposures it holds while the breaker is open', async () => {
		const storage = new FakeStorage();
		const { environment, log } = setup(storage, 1);

		log('flag-a');
		environment.advance(0);
		await openBreaker(environment);
		const logged = Array.from(
			{ length: MAX_QUEUED_WHILE_FAILING + 1 },
			(_, index) => `flag-${index}`,
		);
		for (const flagKey of logged) log(flagKey);
		environment.hide();

		const persisted = persistedFlagKeys(storage) ?? [];
		expect(persisted.length).toBeGreaterThan(0);
		expect(persisted).toEqual(logged.slice(-persisted.length));
	});

	it('holds exposures taken for another endpoint behind the open breaker, then sends them to its own', async () => {
		const storage = new FakeStorage();
		storage.items.set(
			`${STORAGE_KEY_PREFIX}earlier-page`,
			serializeExposures([{ record: exposure('flag-a'), attempts: 0 }], ENDPOINT),
		);
		storage.items.set(
			`${STORAGE_KEY_PREFIX}other-endpoint-page`,
			serializeExposures([{ record: exposure('flag-b'), attempts: 0 }], OTHER_ENDPOINT),
		);
		const { environment } = setup(storage, 1);

		for (let error = 1; error <= 3; error += 1) {
			if (error > 1) environment.advance(30_000);
			expect(deliveredFlagKeys(environment.requests.at(-1)!)).toEqual(['flag-a']);
			environment.requests.at(-1)!.fail();
			await settle();
		}
		environment.advance(BREAKER_PROBE_INTERVAL_MS - 1);
		expect(environment.requests).toHaveLength(3);
		environment.advance(1);
		expect(environment.requests).toHaveLength(4);
		expect(deliveredFlagKeys(environment.requests[3]!)).toEqual(['flag-a']);
		environment.requests[3]!.respond(200);
		await settle();

		expect(environment.requests).toHaveLength(5);
		expect(deliveredFlagKeys(environment.requests[4]!)).toEqual(['flag-b']);
		expect(new Set(environment.requests.map((request) => request.url))).toEqual(
			new Set([ENDPOINT]),
		);
	});
});
