import { hasOwn, isString } from './type-guards';
import type {
	BulkEvaluationMetadata,
	BulkEvaluationPayload,
	BulkEvaluationPayloadV1,
	ClientVersion,
	FlagContextValue,
	FlagResult,
	FlagReturnType,
	RequestContext,
} from './types';

const FLAG_RETURN_TYPES = new Set<string>(['BOOLEAN', 'STRING', 'NUMBER', 'JSON']);

/** The payload schema versions this client supports, one per member of `BulkEvaluationPayload`. */
export type SupportedSchemaVersion = NonNullable<BulkEvaluationPayload['vs']>;

const SUPPORTED_SCHEMA_VERSIONS: ReadonlySet<unknown> = new Set<SupportedSchemaVersion>(['1']);

/**
 * The supported schema version a payload declares, or `null` when its `vs` names an unsupported
 * version. An absent `vs` is version `'1'`; an explicit `null` is present and unsupported.
 */
export function payloadSchemaVersion(
	payload: Readonly<Record<string, unknown>>,
): SupportedSchemaVersion | null {
	if (payload.vs === undefined) {
		return '1';
	}
	return SUPPORTED_SCHEMA_VERSIONS.has(payload.vs) ? (payload.vs as SupportedSchemaVersion) : null;
}

/**
 * Validate the schema version 1 wire format accepted at the initialization and replacement boundary.
 *
 * `vs` must be absent or `'1'`. `flags` is required and may be empty. `requestContext` is required.
 * `clientVersion` is validated only when present; an explicit `null` is present and invalid. Other
 * payload members, including `status` and `targetApp`, are ignored.
 */
export function isValidBulkEvaluationPayloadV1(value: unknown): value is BulkEvaluationPayloadV1 {
	if (!isRecord(value) || (value.vs !== undefined && value.vs !== '1') || !isRecord(value.flags)) {
		return false;
	}
	if (!isValidRequestContext(value.requestContext)) {
		return false;
	}
	if (value.clientVersion !== undefined && !isValidClientVersion(value.clientVersion)) {
		return false;
	}

	return Object.values(value.flags).every(isValidFlagResult);
}

/**
 * Validate a client version: a non-empty string `token` and an optional string `updatedAt`, which is
 * not parsed as a timestamp. Other members are tolerated.
 */
function isValidClientVersion(value: unknown): value is ClientVersion {
	return (
		isRecord(value) &&
		typeof value.token === 'string' &&
		value.token.length > 0 &&
		isOptionalString(value.updatedAt)
	);
}

/**
 * Validate request-context identifiers and, when present, attributes without enforcing higher-level
 * semantics. An absent `attributes` is valid; an explicit `null` is not.
 */
function isValidRequestContext(value: unknown): value is RequestContext {
	if (!isRecord(value) || !isStringRecord(value.identifiers)) {
		return false;
	}

	return value.attributes === undefined || isFlagContextValueRecord(value.attributes);
}

/** Validate one per-flag result, including value presence rules for useCodeDefault. */
function isValidFlagResult(value: unknown): value is FlagResult {
	if (!isRecord(value)) {
		return false;
	}
	if (!isFlagReturnType(value.returnType)) {
		return false;
	}
	if (typeof value.useCodeDefault !== 'boolean') {
		return false;
	}
	if (!isValidBulkEvaluationMetadata(value.metadata)) {
		return false;
	}

	return value.useCodeDefault || (hasOwn(value, 'value') && isTransportFlagValue(value.value));
}

function isValidBulkEvaluationMetadata(value: unknown): value is BulkEvaluationMetadata {
	if (!isRecord(value) || typeof value.matchReason !== 'string') {
		return false;
	}

	return (
		isOptionalStringOrNull(value.identifierType) &&
		isOptionalStringOrNull(value.variationId) &&
		isOptionalStringOrNull(value.ruleId) &&
		isOptionalRecordOrNull(value.holdoutAllocation) &&
		isOptionalArrayOf(value.segments, isRecord) &&
		isOptionalArrayOf(value.targetApps, isString) &&
		isOptionalString(value.flagVersion) &&
		isOptionalString(value.errorMessage)
	);
}

/**
 * Accept an omitted, `null`, or object member.
 *
 * A holdout allocation is checked only for being an object; its members pass through.
 */
function isOptionalRecordOrNull(value: unknown): boolean {
	return value === undefined || value === null || isRecord(value);
}

/**
 * Accept an omitted member or an array whose every entry satisfies `isEntry`.
 *
 * Segment entries are checked only for being objects; their members pass through.
 */
function isOptionalArrayOf(value: unknown, isEntry: (entry: unknown) => boolean): boolean {
	return value === undefined || (Array.isArray(value) && value.every(isEntry));
}

function isOptionalString(value: unknown): boolean {
	return value === undefined || isString(value);
}

function isFlagReturnType(value: unknown): value is FlagReturnType {
	return typeof value === 'string' && FLAG_RETURN_TYPES.has(value);
}

function isFlagContextValueRecord(
	value: unknown,
): value is Readonly<Record<string, FlagContextValue>> {
	return (
		isRecord(value) &&
		Object.values(value).every(
			(entry) =>
				typeof entry === 'string' || typeof entry === 'number' || typeof entry === 'boolean',
		)
	);
}

function isStringRecord(value: unknown): value is Readonly<Record<string, string>> {
	return isRecord(value) && Object.values(value).every((entry) => typeof entry === 'string');
}

function isOptionalStringOrNull(value: unknown): boolean {
	return value === undefined || value === null || typeof value === 'string';
}

/** Accept transport-safe primitive values plus JSON composite values for JSON flags. */
function isTransportFlagValue(value: unknown): boolean {
	if (typeof value === 'string' || typeof value === 'boolean') {
		return true;
	}
	if (typeof value === 'number') {
		return Number.isFinite(value);
	}
	return isJsonContainer(value);
}

/** Accept JSON object or array containers when all nested entries are JSON-compatible. */
function isJsonContainer(value: unknown): boolean {
	if (!isObjectLike(value)) {
		return false;
	}
	return Object.values(value).every(isJsonCompatibleValue);
}

/** Recursively validate JSON-compatible nested values used inside transport JSON containers. */
function isJsonCompatibleValue(value: unknown): boolean {
	if (value === null || typeof value === 'string' || typeof value === 'boolean') {
		return true;
	}
	if (typeof value === 'number') {
		return Number.isFinite(value);
	}
	return isObjectLike(value) && Object.values(value).every(isJsonCompatibleValue);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
	return isObjectLike(value) && !Array.isArray(value);
}

function isObjectLike(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}
