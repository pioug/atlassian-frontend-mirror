/** Resource identity and not-initialized messages for exposures. Not part of the public API. */
import type { EnvironmentType, PayloadAcquisitionFailureReason } from '../types';
import { PACKAGE_NAME } from '../version';

/** The `deployment.environment_type` values exposures may report. */
const ENVIRONMENT_TYPES: ReadonlySet<string> = new Set(
	Object.keys({ dev: true, local: true, staging: true, prod: true } satisfies Record<
		EnvironmentType,
		true
	>),
);

/**
 * The Resource an exposure belongs to. Records with equal identities share one OTLP Resource, and
 * the identity is persisted with each record so reclaimed records keep their original Resource.
 */
export interface ResourceIdentity {
	readonly serviceName: string;
	readonly environmentType?: EnvironmentType;
	readonly serviceVersion?: string;
}

/** Everything an instance's exposures are attributed to, fixed at construction. */
export interface ExposureIdentity {
	readonly resource: ResourceIdentity;
	/** The `feature_flag.set.id` value, or `null` when the target app cannot be represented. */
	readonly flagSetId: string | null;
}

/**
 * The client options an identity is resolved from. Values are `unknown` because the client does
 * not check them at runtime, so plain JavaScript callers can supply any value.
 */
export interface ExposureIdentityOptions {
	readonly targetApp: unknown;
	readonly environmentType: unknown;
	readonly serviceVersion?: unknown;
}

/**
 * Resolve the identity once from the constructor options.
 *
 * A nonblank `targetApp` is used unchanged, including `"$all"`; otherwise the package name stands in
 * for `service.name` and `feature_flag.set.id` is omitted, because a blank or non-string value
 * cannot be represented without synthesizing or coercing one. Unsupported environment types and
 * blank or non-string service versions are omitted.
 */
export function resolveExposureIdentity(options: ExposureIdentityOptions): ExposureIdentity {
	const targetApp = isNonBlankString(options.targetApp) ? options.targetApp : null;
	const environmentType = isEnvironmentType(options.environmentType)
		? options.environmentType
		: undefined;
	const serviceVersion = isNonBlankString(options.serviceVersion)
		? options.serviceVersion
		: undefined;
	return Object.freeze({
		resource: Object.freeze({
			serviceName: targetApp ?? PACKAGE_NAME,
			...(environmentType === undefined ? {} : { environmentType }),
			...(serviceVersion === undefined ? {} : { serviceVersion }),
		}),
		flagSetId: targetApp,
	});
}

/**
 * The client's initialization state as exposures see it. `lastFailureReason` is the most recent
 * failure the client retains, or `null` when no attempt has completed. `rejectedSchemaVersion` is the
 * payload `vs` string the client retains after an `invalid_schema_version` failure.
 */
export type InitializationStatus =
	| { readonly state: 'initialized' }
	| {
			readonly state: 'uninitialized';
			readonly lastFailureReason: PayloadAcquisitionFailureReason | null;
			readonly rejectedSchemaVersion?: string;
	  };

/** Shared because every read while initialized reports it. */
export const INITIALIZED: InitializationStatus = Object.freeze({ state: 'initialized' });

export const NO_COMPLETED_ATTEMPT: InitializationStatus = Object.freeze({
	state: 'uninitialized',
	lastFailureReason: null,
});

/** Characters of a rejected schema version kept in a message before it is cut short with `...`. */
const MESSAGE_SCHEMA_VERSION_LENGTH = 16;

/**
 * The fixed error message for client-generated `not_initialized` details, or `undefined` while
 * initialized. Messages contain only client-owned text, apart from a rejected schema version, which
 * is shortened to fit the message.
 *
 * Initialization is synchronous, so no retained failure reason while uninitialized means no attempt
 * has completed; the wording stays accurate for a read from inside the first provider callback.
 */
export function notInitializedMessage(status: InitializationStatus): string | undefined {
	if (status.state === 'initialized') return undefined;
	const reason = status.lastFailureReason;
	const cause =
		reason === null
			? 'no initialize attempt completed'
			: reason === 'invalid_schema_version' && status.rejectedSchemaVersion !== undefined
				? `${reason} ${quoteForMessage(status.rejectedSchemaVersion)}`
				: reason;
	return `FFP evaluation failed: not_initialized (${cause})`;
}

/**
 * The value as a JSON string, cut to the message length on a code point boundary and followed by
 * `...` outside the quotes when cut, so a cut value cannot be mistaken for one ending in `...`.
 */
function quoteForMessage(value: string): string {
	const codePoints = Array.from(value);
	return codePoints.length <= MESSAGE_SCHEMA_VERSION_LENGTH
		? JSON.stringify(value)
		: `${JSON.stringify(codePoints.slice(0, MESSAGE_SCHEMA_VERSION_LENGTH).join(''))}...`;
}

/** Whether a value is a string with at least one non-whitespace character. */
export function isNonBlankString(value: unknown): value is string {
	return typeof value === 'string' && value.trim() !== '';
}

/** Whether a value is an environment type an exposure Resource may report. */
export function isEnvironmentType(value: unknown): value is EnvironmentType {
	return typeof value === 'string' && ENVIRONMENT_TYPES.has(value);
}
