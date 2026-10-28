import {
	evaluateBooleanFlag,
	evaluateNumberFlag,
	evaluateObjectFlag,
	evaluateStringFlag,
	ownFlagResult,
	type EvaluationOutcome,
	type EvaluationState,
} from './evaluation';
import {
	INITIALIZED,
	resolveExposureIdentity,
	type ExposureIdentity,
	type InitializationStatus,
} from './exposure/attribution';
import { createExposureClock, type ExposureClock } from './exposure/clock';
import { exposureIdentifiersKey, exposureIdentityKey } from './exposure/deduplication';
import { loadExposureDelivery, type ExposureDelivery } from './exposure/delivery-loader';
import { attributionIdentifiers } from './exposure/identifiers';
import type { ExposureDeliveryOptions } from './exposure/logger';
import type { ExposureMappingInput } from './exposure/mapper';
import { resolveExposureLogging } from './exposure/options';
import {
	BufferingExposureSink,
	deliveringSink,
	NOOP_EXPOSURE_SINK,
	type ExposureSink,
} from './exposure/sink';
import { capturePayload } from './payload-capture';
import {
	isRecord,
	isValidBulkEvaluationPayloadV1,
	payloadSchemaVersion,
} from './payload-validation';
import { isString } from './type-guards';
import type {
	BulkEvaluationPayloadV1,
	EvaluationDetails,
	EvaluationOptions,
	ExposureLoggingOptions,
	FlagClientOptions,
	FlagResult,
	FlagUser,
	InitializeResult,
	PayloadAcquisitionFailureReason,
	PayloadProvider,
	ReplaceResult,
	RequestContext,
} from './types';
import {
	EMPTY_USER,
	hasNormalizationFindings,
	normalizeUser,
	type FFPUser,
} from './user-normalization';

type InitializeFailure = Exclude<InitializeResult, { initialized: true }>;
type ReplaceFailure = Exclude<ReplaceResult, { replaced: true }>;

/** A captured payload whose retained `requestContext` always carries `attributes`. */
type CapturedPayload = Omit<BulkEvaluationPayloadV1, 'requestContext'> & {
	readonly requestContext: Required<RequestContext>;
};

/** Outcome of the shared provider-to-captured-payload pipeline. */
type PayloadAcquisition =
	| { readonly acquired: true; readonly payload: CapturedPayload }
	| {
			readonly acquired: false;
			readonly reason: PayloadAcquisitionFailureReason;
			readonly error?: unknown;
			/** The rejected `vs` when the reason is `invalid_schema_version` and `vs` is a string. */
			readonly rejectedSchemaVersion?: string;
	  };

/** State that exists only after a successful initialization. */
interface InitializedState {
	readonly payload: CapturedPayload;
}

/** State retained for exposure telemetry. It never affects initialization, replacement, or reads. */
interface RetainedState {
	/** The option values supplied at construction, fixed for the lifetime of the instance. */
	readonly options: Readonly<FlagClientOptions>;
	/**
	 * The failure reason of the most recent initialization attempt that did not fail with
	 * `already_initialized`, or `null` before such an attempt and after a successful one.
	 */
	lastInitializeFailure: PayloadAcquisitionFailureReason | null;
	/**
	 * The string `vs` rejected by that same attempt when it failed with `invalid_schema_version`, or
	 * `null` otherwise. Replacement attempts never change it.
	 */
	rejectedSchemaVersion: string | null;
}

const ACQUISITION_FAILURE_TIPS: Readonly<Record<PayloadAcquisitionFailureReason, string>> = {
	provider_threw:
		'Check the payload provider for thrown errors and confirm it synchronously returns a BulkEvaluationPayload.',
	provider_returned_no_payload:
		'Confirm the payload provider returns a BulkEvaluationPayload value instead of null or undefined.',
	invalid_schema_version: 'Supply a payload whose vs schema version is "1", or omit vs.',
	invalid_payload_shape:
		'Validate the provider result against the BulkEvaluationPayload shape before passing the provider to the client.',
	payload_capture_failed:
		'Ensure the payload only contains cloneable data so the SDK can capture an immutable snapshot.',
};

const INITIALIZATION_FAILURE_TIPS: Readonly<Record<InitializeFailure['reason'], string>> = {
	...ACQUISITION_FAILURE_TIPS,
	already_initialized:
		'Call replace() to serve a different payload or user from an initialized FlagClient.',
};

const REPLACEMENT_FAILURE_TIPS: Readonly<Record<ReplaceFailure['reason'], string>> = {
	...ACQUISITION_FAILURE_TIPS,
	not_initialized: 'Call initialize() successfully before calling replace().',
};

const EXPOSURE_OPTION_TIP =
	'See ExposureLoggingOptions: enabled is a boolean, endpoint an absolute HTTP(S) URL, batchSize a positive integer, and flushIntervalMs a positive finite number.';

const USER_NORMALIZATION_TIP =
	'Pass identifier values as strings and attribute values as strings, booleans, or finite numbers.';

/** The read-time inputs of an exposure, beyond the details and the fixed resource identity. */
type ExposureContext = Pick<
	ExposureMappingInput,
	'flagResult' | 'requestContext' | 'user' | 'initialization' | 'clientVersion'
>;

export class FlagClient {
	private initialized: InitializedState | null = null;

	/**
	 * The normalized user from the most recent initialization attempt that did not fail with
	 * `already_initialized`, or from the most recent successful replacement after it. Set even when
	 * that initialization attempt fails, so exposure telemetry can attribute uninitialized reads.
	 * `EMPTY_USER` before any such attempt, so reads need only check `initialized`.
	 */
	private currentUser: FFPUser = EMPTY_USER;
	/**
	 * Each details read's exposure inputs, keyed by the returned metadata object, so a manual exposure
	 * reproduces its read's attribution. Shallow copies of details share the metadata object.
	 */
	private readonly exposureContexts = new WeakMap<object, ExposureContext>();

	/**
	 * The identifier part of the last deduplication identity and the request context or user it was
	 * built from. Both are replaced, never mutated, on `initialize` and `replace`.
	 */
	private cachedIdentifiersKey: { readonly source: object; readonly key: string } | null = null;

	private readonly retained: RetainedState;

	/**
	 * Where reads send their exposures: the delivery subsystem once it has loaded, a buffer that
	 * replays into it until then, or the no-op sink when exposure logging is disabled.
	 */
	private exposureSink: ExposureSink;

	/**
	 * The clock an enabled client stamps its exposures with, and the flag that it logs at all; `null`
	 * when exposure logging is disabled. The rest of the host environment belongs to the delivery
	 * subsystem and is constructed with it.
	 */
	private readonly exposureClock: ExposureClock | null;

	/** Exposure resource identity, resolved once from the construction options. */
	private readonly exposureIdentity: ExposureIdentity;

	/**
	 * Create an uninitialized client for one target app and environment.
	 *
	 * Copies the option values without validating them and never throws. Unsupported exposure
	 * logging options are ignored with one warning each, naming the option but never its value.
	 */
	constructor(options: FlagClientOptions) {
		const captured = captureOptions(options);
		this.retained = { options: captured, lastInitializeFailure: null, rejectedSchemaVersion: null };
		this.exposureIdentity = resolveExposureIdentity(captured);

		const exposureLogging = resolveExposureLogging(captured.exposureLogging, {
			hasWindow: typeof window !== 'undefined',
			origin: windowOrigin(),
		});
		for (const option of exposureLogging.unsupported) {
			// eslint-disable-next-line no-console -- diagnostics are part of the client's documented contract
			console.warn('Flag client ignored an unsupported exposure logging option', {
				option,
				tip: EXPOSURE_OPTION_TIP,
			});
		}

		let clock: ExposureClock | null = null;
		let sink: ExposureSink = NOOP_EXPOSURE_SINK;
		if (exposureLogging.enabled) {
			try {
				clock = createExposureClock();
				sink = this.openSink(exposureLogging.delivery);
			} catch {
				// Construction never throws, so a host that cannot run exposure delivery logs nothing.
				clock = null;
				sink = NOOP_EXPOSURE_SINK;
			}
		}
		this.exposureClock = clock;
		this.exposureSink = sink;
	}

	/**
	 * The sink for an enabled client.
	 *
	 * The delivery subsystem is loaded on demand, so it is normally still arriving while the first
	 * flags are read. Until it arrives those exposures are buffered and then replayed into it, so a
	 * read on the critical path logs the same exposure an eagerly loaded subsystem would have logged.
	 * A subsystem that fails to load leaves the client logging nothing, as a host that cannot run
	 * delivery does.
	 */
	private openSink(options: ExposureDeliveryOptions): ExposureSink {
		const delivery = loadExposureDelivery();
		if (!isPending(delivery)) {
			return deliveringSink(
				delivery.createExposureLogger(options, delivery.createExposureEnvironment()),
				delivery,
			);
		}

		const buffer = new BufferingExposureSink();
		// These callbacks run in a later microtask than the constructor, so the assignment below never
		// races the one the constructor makes from this method's return value.
		void delivery.then(
			(loaded) => {
				let sink: ExposureSink;
				try {
					sink = deliveringSink(
						loaded.createExposureLogger(options, loaded.createExposureEnvironment()),
						loaded,
					);
				} catch {
					this.exposureSink = NOOP_EXPOSURE_SINK;
					return;
				}
				buffer.replayInto(sink);
				this.exposureSink = sink;
			},
			() => {
				this.exposureSink = NOOP_EXPOSURE_SINK;
			},
		);
		return buffer;
	}

	/**
	 * Initialize the client once from a synchronous payload provider.
	 *
	 * Checks run in order: `already_initialized`, user normalization, then payload acquisition. Never
	 * throws.
	 */
	initialize(provider: PayloadProvider, user: FlagUser): InitializeResult {
		if (this.initialized !== null) {
			return this.warnInitializationFailure({ initialized: false, reason: 'already_initialized' });
		}

		this.currentUser = this.normalizeAndWarn(user, 'initialize');

		const acquisition = acquirePayload(provider);
		if (!acquisition.acquired) {
			this.retained.lastInitializeFailure = acquisition.reason;
			this.retained.rejectedSchemaVersion = acquisition.rejectedSchemaVersion ?? null;
			return this.warnInitializationFailure({
				initialized: false,
				reason: acquisition.reason,
				...(acquisition.error !== undefined ? { error: acquisition.error } : {}),
			});
		}

		this.initialized = { payload: acquisition.payload };
		this.retained.lastInitializeFailure = null;
		this.retained.rejectedSchemaVersion = null;
		return { initialized: true };
	}

	/**
	 * Replace the payload and user of an initialized client together.
	 *
	 * Fails with `not_initialized`, without invoking the provider or normalizing the user, before a
	 * successful initialization. Any other failure keeps the previous payload and user. Never throws.
	 */
	replace(provider: PayloadProvider, user: FlagUser): ReplaceResult {
		if (this.initialized === null) {
			return this.warnReplacementFailure({ replaced: false, reason: 'not_initialized' });
		}

		const replacementUser = this.normalizeAndWarn(user, 'replace');
		const acquisition = acquirePayload(provider);
		if (!acquisition.acquired) {
			return this.warnReplacementFailure({
				replaced: false,
				reason: acquisition.reason,
				...(acquisition.error !== undefined ? { error: acquisition.error } : {}),
			});
		}

		this.initialized = { payload: acquisition.payload };
		this.currentUser = replacementUser;
		this.exposureSink.endDeduplicationWindows();
		return { replaced: true };
	}

	getBooleanValue(
		flagKey: string,
		safeDefaultValue: boolean,
		options?: EvaluationOptions,
	): boolean {
		return this.read(evaluateBooleanFlag, flagKey, safeDefaultValue, options, false).value;
	}

	getStringValue(flagKey: string, safeDefaultValue: string, options?: EvaluationOptions): string {
		return this.read(evaluateStringFlag, flagKey, safeDefaultValue, options, false).value;
	}

	getNumberValue(flagKey: string, safeDefaultValue: number, options?: EvaluationOptions): number {
		return this.read(evaluateNumberFlag, flagKey, safeDefaultValue, options, false).value;
	}

	getObjectValue<T>(flagKey: string, safeDefaultValue: T, options?: EvaluationOptions): T {
		return this.read(evaluateObjectFlag<T>, flagKey, safeDefaultValue, options, false).value;
	}

	getBooleanDetails(
		flagKey: string,
		safeDefaultValue: boolean,
		options?: EvaluationOptions,
	): EvaluationDetails<boolean> {
		return this.read(evaluateBooleanFlag, flagKey, safeDefaultValue, options, true);
	}

	getStringDetails(
		flagKey: string,
		safeDefaultValue: string,
		options?: EvaluationOptions,
	): EvaluationDetails<string> {
		return this.read(evaluateStringFlag, flagKey, safeDefaultValue, options, true);
	}

	getNumberDetails(
		flagKey: string,
		safeDefaultValue: number,
		options?: EvaluationOptions,
	): EvaluationDetails<number> {
		return this.read(evaluateNumberFlag, flagKey, safeDefaultValue, options, true);
	}

	getObjectDetails<T>(
		flagKey: string,
		safeDefaultValue: T,
		options?: EvaluationOptions,
	): EvaluationDetails<T> {
		return this.read(evaluateObjectFlag<T>, flagKey, safeDefaultValue, options, true);
	}

	/**
	 * Log one manual exposure for details obtained from this client, typically after a read with
	 * `disableExposureLogging`. Details this client returned reproduce the exposure their read would
	 * have produced; for any other details, attribution comes from the client's current state. Does
	 * nothing when exposure logging is disabled and never throws.
	 */
	logExposure<T>(details: EvaluationDetails<T>): void {
		if (this.exposureClock === null) return;
		try {
			const metadata: unknown = (details as Partial<EvaluationDetails<T>> | null | undefined)
				?.metadata;
			// Caller-built metadata without these would queue a record with no flag key or reason.
			if (typeof metadata !== 'object' || metadata === null) return;
			const { flagKey, matchReason } = metadata as { flagKey?: unknown; matchReason?: unknown };
			if (!isString(flagKey) || !isString(matchReason)) return;
			const context =
				this.exposureContexts.get(metadata) ??
				this.exposureContext(
					this.initialized === null
						? null
						: (ownFlagResult(this.initialized.payload.flags, flagKey) ?? null),
				);
			this.recordExposure(details, context, true);
		} catch {
			// Exposure telemetry must never affect the caller.
		}
	}

	/** The one read path: evaluate, record at most one automatic exposure, return the details. */
	private read<T>(
		evaluate: (
			state: EvaluationState | null,
			flagKey: string,
			safeDefault: T,
		) => EvaluationOutcome<T>,
		flagKey: string,
		safeDefaultValue: T,
		options: EvaluationOptions | undefined,
		// Only returned details can reach `logExposure`, so value reads keep no context.
		retainContext: boolean,
	): EvaluationDetails<T> {
		const outcome = evaluate(this.evaluationState(), flagKey, safeDefaultValue);
		if (this.exposureClock !== null) {
			try {
				const record = options?.disableExposureLogging !== true;
				// A suppressed value read neither records nor retains, so it builds no context.
				if (record || retainContext) {
					const context = this.exposureContext(outcome.flagResult);
					if (retainContext) this.exposureContexts.set(outcome.details.metadata, context);
					if (record) this.recordExposure(outcome.details, context, false);
				}
			} catch {
				// Exposure telemetry must never change or fail a read.
			}
		}
		return outcome.details;
	}

	/** Queue one exposure unless deduplicated. The record is built only when it is queued. */
	private recordExposure(
		details: EvaluationDetails<unknown>,
		context: ExposureContext,
		manual: boolean,
	): void {
		const clock = this.exposureClock;
		if (clock === null) return;
		const { flagKey, variationId, ruleId, matchReason } = details.metadata;
		const identityKey = exposureIdentityKey({
			flagKey,
			variationId,
			ruleId,
			matchReason,
			identifiersKey: this.identifiersKey(context),
		});
		this.exposureSink.log(identityKey, {
			...context,
			details,
			identity: this.exposureIdentity,
			manual,
			epochMillis: clock.now(),
		});
	}

	/** The identifier part of the deduplication identity, recomputed only when its source changes. */
	private identifiersKey(context: ExposureContext): string {
		const source = context.requestContext ?? context.user;
		let cached = this.cachedIdentifiersKey;
		if (cached?.source !== source) {
			cached = { source, key: exposureIdentifiersKey(attributionIdentifiers(context)) };
			this.cachedIdentifiersKey = cached;
		}
		return cached.key;
	}

	/** The exposure inputs current state supplies for a read of a flag with this payload result. */
	private exposureContext(flagResult: FlagResult | null): ExposureContext {
		const payload = this.initialized?.payload;
		return {
			flagResult,
			user: this.currentUser,
			initialization: this.initializationStatus(),
			...(payload !== undefined ? { requestContext: payload.requestContext } : {}),
			...(payload?.clientVersion !== undefined ? { clientVersion: payload.clientVersion } : {}),
		};
	}

	/**
	 * Initialization as exposures see it, from FFP-141's retained most recent failure reason and
	 * rejected schema version.
	 */
	private initializationStatus(): InitializationStatus {
		if (this.initialized !== null) return INITIALIZED;
		const { lastInitializeFailure, rejectedSchemaVersion } = this.retained;
		return {
			state: 'uninitialized',
			lastFailureReason: lastInitializeFailure,
			...(rejectedSchemaVersion === null ? {} : { rejectedSchemaVersion }),
		};
	}

	/** Read state, or `null` while uninitialized. */
	private evaluationState(): EvaluationState | null {
		if (this.initialized === null) {
			return null;
		}
		return { payload: this.initialized.payload, user: this.currentUser };
	}

	/** Normalize a user and emit at most one warning naming discarded keys, never values. */
	private normalizeAndWarn(user: unknown, operation: 'initialize' | 'replace'): FFPUser {
		const normalization = normalizeUser(user);
		if (hasNormalizationFindings(normalization)) {
			// eslint-disable-next-line no-console -- diagnostics are part of the client's documented contract
			console.warn('Flag client user normalization dropped invalid entries', {
				operation,
				droppedEntries: normalization.droppedEntries,
				emptyMembers: normalization.emptyMembers,
				tip: USER_NORMALIZATION_TIP,
			});
		}
		return normalization.user;
	}

	private warnInitializationFailure(result: InitializeFailure): InitializeFailure {
		// eslint-disable-next-line no-console -- diagnostics are part of the client's documented contract
		console.warn('Flag client initialization failed', {
			reason: result.reason,
			tip: INITIALIZATION_FAILURE_TIPS[result.reason],
			...(result.error !== undefined ? { error: result.error } : {}),
		});
		return result;
	}

	private warnReplacementFailure(result: ReplaceFailure): ReplaceFailure {
		// eslint-disable-next-line no-console -- diagnostics are part of the client's documented contract
		console.warn('Flag client replacement failed', {
			reason: result.reason,
			tip: REPLACEMENT_FAILURE_TIPS[result.reason],
			...(result.error !== undefined ? { error: result.error } : {}),
		});
		return result;
	}
}

/**
 * Invoke, check, validate, and capture a provider payload. Shared by initialize and replace.
 *
 * The schema version is resolved before the rest of the shape, so a payload of another schema
 * version is reported as `invalid_schema_version` rather than `invalid_payload_shape`. Each version
 * is then validated against its own wire format.
 */
function acquirePayload(provider: PayloadProvider): PayloadAcquisition {
	let candidate: unknown;
	try {
		candidate = provider();
	} catch (error) {
		return { acquired: false, reason: 'provider_threw', error };
	}

	if (candidate == null) {
		return { acquired: false, reason: 'provider_returned_no_payload' };
	}
	try {
		return inspectPayload(candidate);
	} catch (error) {
		// A payload that throws while it is read, such as a revoked proxy or a throwing getter, cannot
		// be validated; reporting it keeps initialize and replace from throwing.
		return { acquired: false, reason: 'invalid_payload_shape', error };
	}
}

/** Resolve the schema version, then validate and capture the payload against that version. */
function inspectPayload(candidate: unknown): PayloadAcquisition {
	if (!isRecord(candidate)) {
		return { acquired: false, reason: 'invalid_payload_shape' };
	}
	const schemaVersion = payloadSchemaVersion(candidate);
	if (schemaVersion === null) {
		return {
			acquired: false,
			reason: 'invalid_schema_version',
			...(isString(candidate.vs) ? { rejectedSchemaVersion: candidate.vs } : {}),
		};
	}

	// A later schema version adds a case that validates its wire format and converts it into the
	// internal model that reads and exposure telemetry use; version 1 is currently that model.
	switch (schemaVersion) {
		case '1':
			return acquireVersion1Payload(candidate);
	}
}

function acquireVersion1Payload(candidate: unknown): PayloadAcquisition {
	if (!isValidBulkEvaluationPayloadV1(candidate)) {
		return { acquired: false, reason: 'invalid_payload_shape' };
	}

	const payload = capturePayload(candidate, withRequestContextAttributes);
	if (payload === null) {
		return { acquired: false, reason: 'payload_capture_failed' };
	}
	// Capture reads the provider's object again, so a getter or proxy can yield a different value than
	// the one validated above. Validate the frozen snapshot that reads will use as well. The empty
	// `attributes` is supplied on the private copy before this check, so a valid snapshot always
	// carries both request context maps. The original is still validated first because the JSON
	// capture fallback drops members such as functions, and the failure reasons must reflect what the
	// provider returned.
	if (!isValidBulkEvaluationPayloadV1(payload)) {
		return { acquired: false, reason: 'invalid_payload_shape' };
	}
	return { acquired: true, payload };
}

/**
 * Supply an empty `attributes` to a `requestContext` that omits it, so the captured payload always
 * retains both maps.
 *
 * This runs on the private copy made during capture, which has not been validated yet; a copy that no
 * longer has an object `requestContext` is returned unchanged and fails the snapshot validation.
 */
function withRequestContextAttributes(copy: BulkEvaluationPayloadV1): CapturedPayload {
	const requestContext: unknown = copy.requestContext;
	if (!isRecord(requestContext) || requestContext.attributes !== undefined) {
		// TypeScript does not narrow the nested optional member; the snapshot validation establishes it.
		return copy as CapturedPayload;
	}
	return { ...copy, requestContext: { ...requestContext, attributes: {} } } as CapturedPayload;
}

/**
 * Copy the construction option values so later mutation of the caller's object has no effect.
 *
 * The values are deliberately not validated at runtime. Reads go through optional chaining, so an
 * untyped caller that omits the options does not throw.
 */
function captureOptions(options: FlagClientOptions): Readonly<FlagClientOptions> {
	const source = options as Partial<FlagClientOptions> | null | undefined;
	const serviceVersion = source?.serviceVersion;
	const exposureLogging = source?.exposureLogging;
	return Object.freeze({
		targetApp: source?.targetApp as string,
		environmentType: source?.environmentType as FlagClientOptions['environmentType'],
		...(serviceVersion !== undefined ? { serviceVersion } : {}),
		...(exposureLogging !== undefined
			? { exposureLogging: copyExposureLogging(exposureLogging) }
			: {}),
	});
}

/** Shallow-copy exposure logging options when they are an object; other values are kept for warnings. */
function copyExposureLogging(value: ExposureLoggingOptions): ExposureLoggingOptions {
	try {
		return typeof value === 'object' && value !== null && !Array.isArray(value)
			? Object.freeze({ ...value })
			: value;
	} catch {
		// A throwing getter or a revoked proxy is reported as an unsupported `exposureLogging`.
		return null as unknown as ExposureLoggingOptions;
	}
}

/** Whether the exposure delivery subsystem is still loading. */
function isPending(
	delivery: ExposureDelivery | Promise<ExposureDelivery>,
): delivery is Promise<ExposureDelivery> {
	return typeof (delivery as Partial<Promise<ExposureDelivery>>).then === 'function';
}

/** The global `window` location origin, or `null` when it is absent, unreadable, or opaque. */
function windowOrigin(): string | null {
	if (typeof window === 'undefined') return null;
	try {
		const origin = (window as { readonly location?: { readonly origin?: unknown } }).location
			?.origin;
		return typeof origin === 'string' && origin !== 'null' ? origin : null;
	} catch {
		return null;
	}
}
