import { hasOwn, isString } from './type-guards';
import type {
	BulkEvaluationPayloadV1,
	BulkEvaluationResult,
	EvaluationDetails,
	EvaluationMetadata,
	FlagResult,
	FlagReturnType,
	SegmentEvaluationMetadata,
} from './types';
import type { FFPUser } from './user-normalization';

/** Match reasons the client sets when it serves the caller's default value instead of a result. */
export const CLIENT_FALLBACK_REASONS = [
	'not_initialized',
	'flag_not_found',
	'type_mismatch',
] as const;

/** A match reason the client sets when it serves the caller's default value. */
export type ClientFallbackReason = (typeof CLIENT_FALLBACK_REASONS)[number];

/** The state a read uses: the captured payload and the current user. */
export interface EvaluationState {
	readonly payload: BulkEvaluationPayloadV1;
	readonly user: FFPUser;
}

/**
 * The details a read returns, with the payload flag result for the flag key, including one whose
 * return type did not match the read, or `null` when uninitialized or the flag is absent.
 */
export interface EvaluationOutcome<T> {
	readonly details: EvaluationDetails<T>;
	readonly flagResult: FlagResult | null;
}

const NO_SEGMENTS: readonly SegmentEvaluationMetadata[] = Object.freeze([]);

export function evaluateBooleanFlag(
	state: EvaluationState | null,
	flagKey: string,
	safeDefaultValue: boolean,
): EvaluationOutcome<boolean> {
	return evaluateFlag(state, flagKey, 'BOOLEAN', safeDefaultValue, isBoolean);
}

export function evaluateStringFlag(
	state: EvaluationState | null,
	flagKey: string,
	safeDefaultValue: string,
): EvaluationOutcome<string> {
	return evaluateFlag(state, flagKey, 'STRING', safeDefaultValue, isString);
}

export function evaluateNumberFlag(
	state: EvaluationState | null,
	flagKey: string,
	safeDefaultValue: number,
): EvaluationOutcome<number> {
	return evaluateFlag(state, flagKey, 'NUMBER', safeDefaultValue, isNumber);
}

export function evaluateObjectFlag<T>(
	state: EvaluationState | null,
	flagKey: string,
	safeDefaultValue: T,
): EvaluationOutcome<T> {
	return evaluateFlag(state, flagKey, 'JSON', safeDefaultValue, (value): value is T =>
		isJsonContainer(value),
	);
}

/** The payload's result for a flag, ignoring inherited members such as `constructor`. */
export function ownFlagResult(
	flags: BulkEvaluationResult,
	flagKey: string,
): FlagResult | undefined {
	return hasOwn(flags, flagKey) ? flags[flagKey] : undefined;
}

function evaluateFlag<T>(
	state: EvaluationState | null,
	flagKey: string,
	expectedReturnType: FlagReturnType,
	safeDefaultValue: T,
	isExpectedValue: (value: unknown) => value is T,
): EvaluationOutcome<T> {
	if (state === null) {
		return fallbackDetails(flagKey, safeDefaultValue, 'not_initialized');
	}

	const flagResult = ownFlagResult(state.payload.flags, flagKey);
	if (flagResult === undefined) {
		return fallbackDetails(flagKey, safeDefaultValue, 'flag_not_found');
	}
	if (flagResult.returnType !== expectedReturnType) {
		return fallbackDetails(flagKey, safeDefaultValue, 'type_mismatch', flagResult);
	}

	if (flagResult.useCodeDefault) {
		return {
			details: {
				value: safeDefaultValue,
				metadata: metadataFromResult(flagKey, state.user, flagResult),
			},
			flagResult,
		};
	}
	if (!isExpectedValue(flagResult.value)) {
		return fallbackDetails(flagKey, safeDefaultValue, 'type_mismatch', flagResult);
	}

	return {
		details: {
			value: flagResult.value,
			metadata: metadataFromResult(flagKey, state.user, flagResult),
		},
		flagResult,
	};
}

function fallbackDetails<T>(
	flagKey: string,
	value: T,
	matchReason: ClientFallbackReason,
	flagResult: FlagResult | null = null,
): EvaluationOutcome<T> {
	const metadata: EvaluationMetadata = {
		flagKey,
		identifierType: null,
		identifierValue: null,
		matchReason,
		variationId: null,
		ruleId: null,
		holdoutAllocation: null,
		segments: NO_SEGMENTS,
	};
	return { details: { value, metadata }, flagResult };
}

/**
 * Build details metadata for a payload-backed result.
 *
 * `identifierValue` comes from the current user, never from the payload request context. The holdout
 * allocation and segment list are the captured, already-frozen values, so no per-read copy is
 * needed.
 */
function metadataFromResult(
	flagKey: string,
	user: FFPUser,
	result: FlagResult,
): EvaluationMetadata {
	const identifierType = result.metadata.identifierType ?? null;

	return {
		flagKey,
		identifierType,
		identifierValue: identifierType === null ? null : (user.identifiers[identifierType] ?? null),
		matchReason: result.metadata.matchReason,
		variationId: result.metadata.variationId ?? null,
		ruleId: result.metadata.ruleId ?? null,
		holdoutAllocation: result.metadata.holdoutAllocation ?? null,
		segments: result.metadata.segments ?? NO_SEGMENTS,
	};
}

function isBoolean(value: unknown): value is boolean {
	return typeof value === 'boolean';
}

function isNumber(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value);
}

function isJsonContainer(value: unknown): boolean {
	return typeof value === 'object' && value !== null;
}
