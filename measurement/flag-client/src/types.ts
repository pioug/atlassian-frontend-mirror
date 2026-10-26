export type FlagContextValue = string | number | boolean;

export type FlagReturnType = 'BOOLEAN' | 'STRING' | 'NUMBER' | 'JSON';

export type MatchReason = string;

/**
 * The holdout allocation reported for a flag result.
 *
 * Members are `unknown` because the client passes the allocation through without validating its
 * members; producers may omit any member.
 */
export interface HoldoutAllocationMetadata {
	readonly holdoutKey?: unknown;
	readonly holdoutRuleId?: unknown;
	readonly identifierType?: unknown;
	readonly allocationReason?: unknown;
}

/**
 * One segment evaluation reported for a flag result.
 *
 * Members are `unknown` because the client passes entries through without validating them;
 * producers may omit any member.
 */
export interface SegmentEvaluationMetadata {
	readonly segmentKey?: unknown;
	readonly result?: unknown;
	readonly ruleId?: unknown;
	readonly reason?: unknown;
}

export interface EvaluationMetadata {
	readonly flagKey: string;
	readonly identifierType: string | null;
	/** Resolved from the client's current user, never from the payload request context. */
	readonly identifierValue: string | null;
	readonly matchReason: MatchReason;
	readonly variationId: string | null;
	readonly ruleId: string | null;
	/**
	 * The payload's holdout allocation, or `null` when the payload omits it or sets it to `null`, and
	 * in client-generated fallback metadata.
	 */
	readonly holdoutAllocation: HoldoutAllocationMetadata | null;
	/** Segment evaluations in payload order; empty when omitted and for client-generated fallbacks. */
	readonly segments: readonly SegmentEvaluationMetadata[];
}

export interface EvaluationDetails<T> {
	readonly value: T;
	readonly metadata: EvaluationMetadata;
}

/**
 * The identifiers and attributes a payload was evaluated for. An absent `attributes` is treated as an
 * empty object; an explicit `null` is invalid.
 */
export interface RequestContext {
	readonly identifiers: Readonly<Record<string, string>>;
	readonly attributes?: Readonly<Record<string, FlagContextValue>>;
}

export interface BulkEvaluationMetadata {
	readonly identifierType?: string | null;
	readonly matchReason: MatchReason;
	readonly variationId?: string | null;
	readonly ruleId?: string | null;
	readonly holdoutAllocation?: HoldoutAllocationMetadata | null;
	readonly segments?: readonly SegmentEvaluationMetadata[];
	/** Retained with the captured payload for exposure telemetry; not returned in details. */
	readonly targetApps?: readonly string[];
	/** Retained with the captured payload for exposure telemetry; not returned in details. */
	readonly flagVersion?: string;
	/** Retained with the captured payload for exposure telemetry; not returned in details. */
	readonly errorMessage?: string;
}

/** One server-produced per-flag result. */
export interface FlagResult {
	readonly returnType: FlagReturnType;
	readonly value?: unknown;
	readonly useCodeDefault: boolean;
	readonly metadata: BulkEvaluationMetadata;
}

/** Per-flag results keyed by flag key, matching the Feature Flag Service `ffp.flags` member. */
export type BulkEvaluationResult = Readonly<Record<string, FlagResult>>;

/**
 * The version of the flag data a payload was built from, matching the Feature Flag Service
 * `FfpBootstrapPayload.ClientVersion`.
 */
export interface ClientVersion {
	/** Non-empty version token. */
	readonly token: string;
	readonly updatedAt?: string;
}

/**
 * The schema version 1 payload wire format.
 *
 * `vs` is optional: an absent `vs` is treated as `'1'`. Only this version may omit `vs`; every later
 * wire format requires its own `vs` literal.
 *
 * `requestContext` is required and `clientVersion` is optional. Both are validated and retained with
 * the payload but do not affect reads or details metadata.
 */
export interface BulkEvaluationPayloadV1 {
	/**
	 * `vs` means `versionSchema` and identifies the bulk evaluation payload schema for this client SDK
	 * to use.
	 */
	readonly vs?: '1';
	readonly flags: BulkEvaluationResult;
	readonly requestContext: RequestContext;
	readonly clientVersion?: ClientVersion;
}

/**
 * The payload a provider yields: one of the wire formats this client supports, discriminated by `vs`.
 *
 * Supported versions:
 * - `'1'` (or an absent `vs`): {@link BulkEvaluationPayloadV1}
 *
 * A payload whose `vs` names any other version fails initialization or replacement with
 * `invalid_schema_version`.
 */
export type BulkEvaluationPayload = BulkEvaluationPayloadV1;

export type PayloadProvider = () => BulkEvaluationPayload;

/**
 * The user a client serves.
 *
 * The client normalizes the user on each attempt: it keeps string identifier values and string,
 * boolean, or finite-number attribute values, and drops every other entry with one warning.
 */
export interface FlagUser {
	readonly identifiers: Readonly<Record<string, string>>;
	readonly attributes?: Readonly<Record<string, FlagContextValue>>;
}

/**
 * The deployment environment type a client runs in.
 *
 * These are the `MICROS_ENVTYPE` values that server SDK exposure endpoint resolution supports.
 */
export type EnvironmentType = 'dev' | 'local' | 'staging' | 'prod';

/**
 * Options fixed for the lifetime of a `FlagClient` instance.
 *
 * The client copies these values at construction and does not validate them at runtime. They do not
 * affect initialization, replacement, reads, or details metadata.
 */
export interface FlagClientOptions {
	/** The target app this client serves. */
	readonly targetApp: string;
	/** The deployment environment type this client runs in. */
	readonly environmentType: EnvironmentType;
	/** The application version, when known. */
	readonly serviceVersion?: string;
	/** Exposure telemetry options. Logging is enabled by default only where a global `window` exists. */
	readonly exposureLogging?: ExposureLoggingOptions;
}

/**
 * Exposure telemetry options. An option that fails its type is ignored with a console warning, so
 * its default applies. A disabled client does not check `endpoint`, `batchSize`, or
 * `flushIntervalMs`.
 */
export interface ExposureLoggingOptions {
	/** Whether exposures are recorded and delivered. Defaults to whether a global `window` exists. */
	readonly enabled?: boolean;
	/**
	 * OTLP/HTTP logs endpoint: an absolute HTTP or HTTPS URL, or a path starting with a single `/`,
	 * resolved once against `window.location.origin` and unsupported without a `window`. Defaults to
	 * `https://xp.atlassian.com/ft/v1/logs`.
	 */
	readonly endpoint?: string;
	/** Exposures that trigger an immediate delivery. A positive integer; defaults to `100`. */
	readonly batchSize?: number;
	/** Milliseconds a queued exposure waits before delivery. Positive and finite; defaults to `10000`. */
	readonly flushIntervalMs?: number;
}

/** Per-read options for typed value and details reads. */
export interface EvaluationOptions {
	/** When `true`, the read records no automatic exposure. Log one later with `logExposure`. */
	readonly disableExposureLogging?: boolean;
}

/** Failure reasons shared by initialization and replacement payload acquisition. */
export type PayloadAcquisitionFailureReason =
	| 'provider_threw'
	| 'provider_returned_no_payload'
	| 'invalid_schema_version'
	| 'invalid_payload_shape'
	| 'payload_capture_failed';

export type InitializeResult =
	| { readonly initialized: true }
	| {
			readonly initialized: false;
			readonly reason: 'already_initialized' | PayloadAcquisitionFailureReason;
			readonly error?: unknown;
	  };

export type ReplaceResult =
	| { readonly replaced: true }
	| {
			readonly replaced: false;
			readonly reason: 'not_initialized' | PayloadAcquisitionFailureReason;
			readonly error?: unknown;
	  };
