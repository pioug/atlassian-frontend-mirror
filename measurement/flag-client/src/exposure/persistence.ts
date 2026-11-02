/**
 * The `localStorage` format for undelivered exposures, following the design's CDDL model. Not part
 * of the public API.
 */
import { isEnvironmentType, isNonBlankString, type ResourceIdentity } from './attribution';
import type { ExposureStorage } from './environment';
import type { QueuedRecord, StoredLogRecord } from './otlp';

/** Every client instance persists under this prefix followed by its instance identifier. */
export const STORAGE_KEY_PREFIX = '@atlaskit/flag-client:exposures:';

/**
 * The most UTF-16 code units that the exposure keys and values of every instance on an origin may
 * occupy together: 256 KiB at two bytes per code unit, a twentieth of the 5 MiB `localStorage` quota
 * the host shares, so deliveries that always fail cannot fill it from any number of tabs.
 */
export const MAX_PERSISTED_CODE_UNITS: number = 128 * 1024;

/**
 * The budget, in the same units, while deliveries are failing on an origin with no recent successful
 * delivery, such as one whose requests a content blocker rejects. Such an origin may never deliver
 * what it persists, so its storage converges to this rather than the full budget.
 */
export const UNDELIVERED_ORIGIN_CODE_UNITS: number = 4 * 1024;

/** Holds the time, in epoch milliseconds, of the origin's last successful exposure delivery. */
export const DELIVERY_MARKER_KEY = '@atlaskit/flag-client:last-delivery';

/** A successful delivery this recent shows the origin can deliver, so it keeps the full budget. */
export const DELIVERY_MARKER_FRESH_MS: number = 7 * 24 * 60 * 60 * 1000;

/** A successful delivery rewrites a marker only when it is at least this old, to limit writes. */
export const DELIVERY_MARKER_REFRESH_MS: number = 60 * 60 * 1000;

/**
 * How long ago the marker records a successful delivery, or `null` when it is absent, unreadable, or
 * records a later time than `now`. Throws when storage cannot be read.
 */
export function deliveryMarkerAge(storage: ExposureStorage, now: number): number | null {
	const text = storage.getItem(DELIVERY_MARKER_KEY);
	if (text === null || !/^\d{1,16}$/.test(text)) return null;
	const age = now - Number(text);
	return age >= 0 ? age : null;
}

const FORMAT_VERSION = 1;

// A receiver rejects the whole request when an integer is out of range for its member, so a value
// beyond these bounds is unreadable.
// Written as shifts of `BigInt(1)`: bigint literals need an ES2020 target (AFM builds for ES2019),
// and consumers that transpile `**` to `Math.pow` would throw on a bigint as this module loads.
const UINT64_END = BigInt(1) << BigInt(64);
const INT64_END = BigInt(1) << BigInt(63);
const UINT32_END = BigInt(1) << BigInt(32);
const INT32_END = BigInt(1) << BigInt(31);

/** An undelivered exposure with its failed delivery attempts so far. */
export interface QueuedExposure {
	readonly record: QueuedRecord;
	attempts: number;
}

/**
 * Serialize entries for storage, each recording `endpoint`, the writing client's. This client
 * delivers what it takes to its own endpoint and ignores the member, but earlier versions discard an
 * entry without a deliverable one.
 */
export function serializeExposures(entries: readonly QueuedExposure[], endpoint: string): string {
	return serializeEntries(entries.map((entry) => serializeEntry(entry, endpoint)));
}

function serializeEntry({ record, attempts }: QueuedExposure, endpoint: string): string {
	return JSON.stringify({
		endpoint,
		attempts,
		resource: record.resource,
		scopeVersion: record.scopeVersion,
		logRecord: record.logRecord,
	});
}

/** The stored value for serialized entries, as `JSON.stringify` writes the whole format. */
function serializeEntries(entries: readonly string[]): string {
	return `{"version":${FORMAT_VERSION},"entries":[${entries.join(',')}]}`;
}

/** The value written for a key and the entries it holds. */
export interface BudgetedExposures {
	readonly text: string;
	readonly entries: readonly QueuedExposure[];
}

/**
 * Serialize the entries to write under `ownKey` so that the key and value, counted in UTF-16 code
 * units, fit within `budget` less the other instances' exposure keys and values measured now. Entries are left out in the order `queuedOrder` gives, earliest first, until
 * the rest fit, so the result is the longest run of the newest entries that fits, never an older
 * entry in place of a newer one; the others keep their order. Throws when another instance's value
 * cannot be read, since the budget then cannot be checked, and the caller removes its own key.
 */
export function serializeExposuresWithinBudget(
	storage: ExposureStorage,
	ownKey: string,
	entries: readonly QueuedExposure[],
	queuedOrder: (entry: QueuedExposure) => number,
	endpoint: string,
	budget: number = MAX_PERSISTED_CODE_UNITS,
): BudgetedExposures {
	let room = budget - ownKey.length;
	const keys: string[] = [];
	for (let index = 0; index < storage.length; index += 1) {
		const key = storage.key(index);
		if (key !== null && key.startsWith(STORAGE_KEY_PREFIX) && key !== ownKey) keys.push(key);
	}
	for (const key of keys) room -= key.length + (storage.getItem(key)?.length ?? 0);

	const texts = entries.map((entry) => serializeEntry(entry, endpoint));
	const kept = new Set(entries.keys());
	// The empty format, plus each entry and the comma before every entry but the first.
	let length = serializeEntries([]).length + Math.max(texts.length - 1, 0);
	for (const text of texts) length += text.length;
	const orders = entries.map(queuedOrder);
	const byAge = [...kept].sort((a, b) => (orders[a] ?? 0) - (orders[b] ?? 0));
	for (const index of byAge) {
		if (length <= room) break;
		kept.delete(index);
		length -= (texts[index]?.length ?? 0) + (kept.size > 0 ? 1 : 0);
	}
	if (length > room) return { text: '', entries: [] };
	return {
		text: serializeEntries(texts.filter((_, index) => kept.has(index))),
		entries: entries.filter((_, index) => kept.has(index)),
	};
}

/**
 * Read persisted exposures. A value that is not the expected format yields no entries, and an entry
 * that cannot be read is ignored while its readable siblings are kept. The endpoint an entry records
 * is not read, so entries from any client on the origin are accepted whatever endpoint they name.
 */
export function parseExposures(text: string): QueuedExposure[] {
	let parsed: unknown;
	try {
		parsed = JSON.parse(text);
	} catch {
		return [];
	}
	if (!isObject(parsed) || parsed['version'] !== FORMAT_VERSION) return [];
	const entries = parsed['entries'];
	if (!Array.isArray(entries)) return [];

	const exposures: QueuedExposure[] = [];
	for (const entry of entries) {
		const exposure = parseEntry(entry);
		if (exposure !== null) exposures.push(exposure);
	}
	return exposures;
}

function parseEntry(entry: unknown): QueuedExposure | null {
	if (!isObject(entry)) return null;
	const { attempts, resource, scopeVersion, logRecord } = entry;
	if (!isNonBlankString(scopeVersion)) return null;
	if (!Number.isSafeInteger(attempts) || (attempts as number) < 0) return null;
	const identity = parseResource(resource);
	if (identity === null || !isLogRecord(logRecord)) return null;
	return {
		record: { resource: identity, scopeVersion, logRecord },
		attempts: attempts as number,
	};
}

function parseResource(value: unknown): ResourceIdentity | null {
	if (!isObject(value)) return null;
	const { serviceName, environmentType, serviceVersion } = value;
	// This client never writes a blank service name or version, nor a blank scope version above.
	if (!isNonBlankString(serviceName)) return null;
	if (environmentType !== undefined && !isEnvironmentType(environmentType)) return null;
	if (serviceVersion !== undefined && !isNonBlankString(serviceVersion)) return null;
	return {
		serviceName,
		...(environmentType === undefined ? {} : { environmentType }),
		...(serviceVersion === undefined ? {} : { serviceVersion }),
	};
}

/**
 * Whether a value is an OTLP/JSON `LogRecord` whose defined members are validly encoded. Another
 * client version may have written it, so it needs no particular member or value, and members OTLP
 * does not define are kept because OTLP/JSON receivers ignore them. A receiver rejects the whole
 * request when a defined member is malformed, so such a record is unreadable rather than batched
 * with readable exposures.
 */
function isLogRecord(value: unknown): value is StoredLogRecord {
	try {
		return isMessage(value, LOG_RECORD);
	} catch {
		// A value nested deeper than the stack allows cannot be checked, so it is unreadable.
		return false;
	}
}

type Check = (value: unknown) => boolean;

/**
 * Checks for the members OTLP/JSON defines on one message type, keyed by their JSON names. Protobuf
 * JSON parsers also accept a member's original snake_case name, so both are checked.
 */
function members(checks: Readonly<Record<string, Check>>): ReadonlyMap<string, Check> {
	const byName = new Map<string, Check>();
	for (const [name, check] of Object.entries(checks)) {
		byName.set(name, check);
		byName.set(
			name.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`),
			check,
		);
	}
	return byName;
}

/** Whether a value is a JSON object whose defined members are each valid. */
function isMessage(value: unknown, defined: ReadonlyMap<string, Check>): boolean {
	if (!isObject(value)) return false;
	for (const [name, member] of Object.entries(value)) {
		const check = defined.get(name);
		if (check !== undefined && !check(member)) return false;
	}
	return true;
}

/**
 * Accept null as well, as the member's default value. The Flag Telemetry collector reads null only
 * for string, message, and repeated members, so only those use this.
 */
function orNull(check: Check): Check {
	return (value) => value === null || check(value);
}

function repeated(check: Check): Check {
	return orNull((value) => Array.isArray(value) && value.every(check));
}

function message(defined: () => ReadonlyMap<string, Check>): Check {
	return orNull((value) => isMessage(value, defined()));
}

const isAnyValue: Check = (value) =>
	isMessage(value, ANY_VALUE) &&
	// `AnyValue` holds one value kind, so a second one this client recognizes is malformed.
	Object.entries(value as Record<string, unknown>).filter(
		([name, member]) => ANY_VALUE.has(name) && member !== null,
	).length <= 1;

const isKeyValue: Check = (value) => isMessage(value, KEY_VALUE);

const isString: Check = orNull((value) => typeof value === 'string');

// Protobuf JSON writes 64-bit integers as decimal strings and reads them as strings or numbers.
const isUint64: Check = (value) => isIntegerIn(value, BigInt(0), UINT64_END, /^\d{1,20}$/);
const isInt64: Check = (value) => isIntegerIn(value, -INT64_END, INT64_END, /^-?\d{1,19}$/);
// It writes 32-bit integers as numbers and also reads them as decimal strings.
const isUint32: Check = (value) => isIntegerIn(value, BigInt(0), UINT32_END, /^\d{1,10}$/);
// OTLP/JSON writes an enum as its integer value, never its name.
const isEnum: Check = (value) =>
	typeof value === 'number' &&
	Number.isInteger(value) &&
	value >= -Number(INT32_END) &&
	value < Number(INT32_END);

function isIntegerIn(value: unknown, min: bigint, end: bigint, digits: RegExp): boolean {
	let parsed: bigint;
	if (typeof value === 'number') {
		if (!Number.isInteger(value)) return false;
		parsed = BigInt(value);
	} else if (typeof value === 'string') {
		// Bounded first so a long digit string is rejected without a big-number parse.
		if (!digits.test(value)) return false;
		parsed = BigInt(value);
	} else {
		return false;
	}
	return parsed >= min && parsed < end;
}

const NON_FINITE_DOUBLES: ReadonlySet<string> = new Set(['NaN', 'Infinity', '-Infinity']);
const DECIMAL = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;

/** A double is a finite JSON number, a decimal string, or a protobuf JSON non-finite name. */
const isDouble: Check = (value) => {
	// `JSON.parse` reads `1e400` as `Infinity`, which `JSON.stringify` then writes as null.
	if (typeof value === 'number') return Number.isFinite(value);
	if (typeof value !== 'string') return false;
	return NON_FINITE_DOUBLES.has(value) || (DECIMAL.test(value) && Number.isFinite(Number(value)));
};

/** Standard padded base64, the only form the Flag Telemetry collector decodes. */
const isBytes: Check = (value) =>
	typeof value === 'string' && value.length % 4 === 0 && /^[A-Za-z0-9+/]*={0,2}$/.test(value);

/** OTLP/JSON writes a trace or span ID as case-insensitive hexadecimal, or empty when unset. */
function isHexId(bytes: number): Check {
	const pattern = new RegExp(`^(?:[0-9a-fA-F]{${bytes * 2}})?$`);
	return (value) => typeof value === 'string' && pattern.test(value);
}

const KEY_VALUE = members({ key: isString, value: orNull((value) => isAnyValue(value)) });
const ARRAY_VALUE = members({ values: repeated((value) => isAnyValue(value)) });
const KEY_VALUE_LIST = members({ values: repeated((value) => isKeyValue(value)) });
const ANY_VALUE = members({
	stringValue: isString,
	boolValue: (value) => typeof value === 'boolean',
	intValue: isInt64,
	doubleValue: isDouble,
	arrayValue: message(() => ARRAY_VALUE),
	kvlistValue: message(() => KEY_VALUE_LIST),
	bytesValue: isBytes,
});
const LOG_RECORD = members({
	timeUnixNano: isUint64,
	observedTimeUnixNano: isUint64,
	severityNumber: isEnum,
	severityText: isString,
	body: orNull((value) => isAnyValue(value)),
	attributes: repeated((value) => isKeyValue(value)),
	droppedAttributesCount: isUint32,
	flags: isUint32,
	traceId: isHexId(16),
	spanId: isHexId(8),
	eventName: isString,
});

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}
