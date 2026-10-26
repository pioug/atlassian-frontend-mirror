/**
 * The `localStorage` format for undelivered exposures, following the design's CDDL model. Not part
 * of the public API.
 */
import { isEnvironmentType, isNonBlankString, type ResourceIdentity } from './attribution';
import type { QueuedRecord, StoredLogRecord } from './otlp';

/** Every client instance persists under this prefix followed by its instance identifier. */
export const STORAGE_KEY_PREFIX = '@atlaskit/flag-client:exposures:';

const FORMAT_VERSION = 1;

// A receiver rejects the whole request when an integer is out of range for its member, so a value
// beyond these bounds is unreadable.
// Written as shifts of `BigInt(1)`: bigint literals need an ES2020 target (AFM builds for ES2019),
// and consumers that transpile `**` to `Math.pow` would throw on a bigint as this module loads.
const UINT64_END = BigInt(1) << BigInt(64);
const INT64_END = BigInt(1) << BigInt(63);
const UINT32_END = BigInt(1) << BigInt(32);
const INT32_END = BigInt(1) << BigInt(31);

/** An undelivered exposure with its destination and failed delivery attempts so far. */
export interface QueuedExposure {
	readonly record: QueuedRecord;
	readonly endpoint: string;
	attempts: number;
}

export function serializeExposures(entries: readonly QueuedExposure[]): string {
	return JSON.stringify({
		version: FORMAT_VERSION,
		entries: entries.map(({ record, endpoint, attempts }) => ({
			endpoint,
			attempts,
			resource: record.resource,
			scopeVersion: record.scopeVersion,
			logRecord: record.logRecord,
		})),
	});
}

/**
 * Read persisted exposures. A value that is not the expected format yields no entries, and an entry
 * that cannot be read is ignored while its readable siblings are kept.
 */
export function parseExposures(text: string, maxAttempts: number): QueuedExposure[] {
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
		const exposure = parseEntry(entry, maxAttempts);
		if (exposure !== null) exposures.push(exposure);
	}
	return exposures;
}

function parseEntry(entry: unknown, maxAttempts: number): QueuedExposure | null {
	if (!isObject(entry)) return null;
	const { endpoint, attempts, resource, scopeVersion, logRecord } = entry;
	if (!isDeliverableEndpoint(endpoint) || !isNonBlankString(scopeVersion)) return null;
	// An entry that already exhausted its attempts should have been discarded, so it is not readable.
	if (!Number.isSafeInteger(attempts) || (attempts as number) < 0) return null;
	if ((attempts as number) >= maxAttempts) return null;
	const identity = parseResource(resource);
	if (identity === null || !isLogRecord(logRecord)) return null;
	return {
		record: { resource: identity, scopeVersion, logRecord },
		endpoint,
		attempts: attempts as number,
	};
}

/**
 * Whether a value is an endpoint this client writes: an absolute `http:` or `https:` URL without
 * credentials. Any other value would make `fetch` fail, which is retried and holds up delivery.
 */
function isDeliverableEndpoint(value: unknown): value is string {
	if (typeof value !== 'string') return false;
	try {
		const url = new URL(value);
		return (
			(url.protocol === 'http:' || url.protocol === 'https:') &&
			url.username === '' &&
			url.password === ''
		);
	} catch {
		return false;
	}
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
