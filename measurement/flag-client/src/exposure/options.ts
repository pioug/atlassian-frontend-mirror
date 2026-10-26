/** Exposure logging option resolution. Not part of the public API. */
import type { ExposureDeliveryOptions } from './logger';

export const DEFAULT_EXPOSURE_ENDPOINT = 'https://xp.atlassian.com/ft/v1/logs';
export const DEFAULT_BATCH_SIZE = 100;
export const DEFAULT_FLUSH_INTERVAL_MS = 10_000;

/** The exposure logging options a client runs with, plus the names of any it ignored. */
export interface ResolvedExposureLogging {
	readonly enabled: boolean;
	readonly delivery: ExposureDeliveryOptions;
	/** Supplied options that failed their type, in a stable order. Names only, never values. */
	readonly unsupported: readonly string[];
}

/** What the host offers at construction for resolving defaults and path endpoints. */
export interface ExposureLoggingHost {
	/** Whether a global `window` exists; the `enabled` default. */
	readonly hasWindow: boolean;
	/** The `window` location origin, or `null` when it is unavailable or opaque. */
	readonly origin: string | null;
}

/**
 * Resolve the `exposureLogging` client option without throwing.
 *
 * Construction never validates option types, so untyped callers can supply anything. A member that
 * fails its type, or a non-object `exposureLogging`, is reported as unsupported and replaced by its
 * default. A disabled client never checks its delivery options, so it never warns about them.
 *
 * @param raw - The caller's `exposureLogging` value, unchecked.
 * @param host - The `enabled` default and the origin a path `endpoint` resolves against.
 */
export function resolveExposureLogging(
	raw: unknown,
	host: ExposureLoggingHost,
): ResolvedExposureLogging {
	const unsupported: string[] = [];
	let source: Readonly<Record<string, unknown>> = {};
	if (raw !== undefined) {
		if (typeof raw === 'object' && raw !== null && !Array.isArray(raw)) {
			source = raw as Readonly<Record<string, unknown>>;
		} else {
			unsupported.push('exposureLogging');
		}
	}

	const pick = <T>(name: string, resolve: (value: unknown) => T | undefined, fallback: T): T => {
		const value = source[name];
		if (value === undefined) return fallback;
		const resolved = resolve(value);
		if (resolved !== undefined) return resolved;
		unsupported.push(name);
		return fallback;
	};

	const enabled = pick('enabled', asBoolean, host.hasWindow);
	const delivery: ExposureDeliveryOptions = enabled
		? {
				endpoint: pick(
					'endpoint',
					(value) => asEndpoint(value, host.origin),
					DEFAULT_EXPOSURE_ENDPOINT,
				),
				batchSize: pick('batchSize', asPositiveInteger, DEFAULT_BATCH_SIZE),
				flushIntervalMs: pick('flushIntervalMs', asPositiveFiniteNumber, DEFAULT_FLUSH_INTERVAL_MS),
			}
		: {
				endpoint: DEFAULT_EXPOSURE_ENDPOINT,
				batchSize: DEFAULT_BATCH_SIZE,
				flushIntervalMs: DEFAULT_FLUSH_INTERVAL_MS,
			};
	return { enabled, delivery, unsupported };
}

function asBoolean(value: unknown): boolean | undefined {
	return typeof value === 'boolean' ? value : undefined;
}

function asPositiveInteger(value: unknown): number | undefined {
	return Number.isSafeInteger(value) && (value as number) > 0 ? (value as number) : undefined;
}

function asPositiveFiniteNumber(value: unknown): number | undefined {
	return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : undefined;
}

/**
 * An absolute `http:` or `https:` URL, normalized by the URL parser, or a single-slash path resolved
 * against `origin`.
 *
 * Parsing without a base rejects relative references. A second `/` or `\` would make the path
 * protocol-relative and leave the page origin, so such paths are rejected. The parser also drops
 * tab and newline characters, so a path is rejected whenever it resolves to another origin.
 */
function asEndpoint(value: unknown, origin: string | null): string | undefined {
	if (typeof value !== 'string') return undefined;
	if (value.startsWith('/')) {
		if (origin === null || value.startsWith('//') || value.startsWith('/\\')) return undefined;
		const url = asHttpUrl(value, origin);
		return url !== undefined && new URL(url).origin === origin ? url : undefined;
	}
	return asHttpUrl(value);
}

function asHttpUrl(value: string, base?: string): string | undefined {
	try {
		const url = base === undefined ? new URL(value) : new URL(value, base);
		// Browsers reject a request to a URL with credentials, so such an endpoint could never deliver.
		const supported =
			(url.protocol === 'http:' || url.protocol === 'https:') &&
			url.username === '' &&
			url.password === '';
		return supported ? url.href : undefined;
	} catch {
		return undefined;
	}
}
