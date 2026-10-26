import {
	resolveExposureIdentity,
	type ExposureIdentity,
	type InitializationStatus,
} from '../../exposure/attribution';
import type { ExposureMappingInput } from '../../exposure/mapper';
import type { OtlpAnyValue, OtlpKeyValue } from '../../exposure/otlp';
import type { EvaluationDetails, FlagResult } from '../../types';
import { normalizeUser, type FFPUser } from '../../user-normalization';

export const INITIALIZED: InitializationStatus = { state: 'initialized' };

/** The identity of a client constructed for `jira-frontend` in production. */
export const IDENTITY: ExposureIdentity = resolveExposureIdentity({
	targetApp: 'jira-frontend',
	environmentType: 'prod',
});

export type PlainValue = string | number | boolean | readonly PlainValue[];

/** Decode an OTLP/JSON value to the plain JSON value fixture expectations use. */
export function plainValue(value: OtlpAnyValue): PlainValue {
	if ('stringValue' in value) return value.stringValue;
	if ('boolValue' in value) return value.boolValue;
	if ('intValue' in value) return Number(value.intValue);
	if ('doubleValue' in value) return value.doubleValue;
	return value.arrayValue.values.map(plainValue);
}

/** Attributes as a key-to-plain-value map. */
export function plainAttributes(attributes: readonly OtlpKeyValue[]): Record<string, PlainValue> {
	return Object.fromEntries(attributes.map(({ key, value }) => [key, plainValue(value)]));
}

/** Attributes as a key-to-OTLP-value map, for asserting exact wire encodings. */
export function wireAttributes(attributes: readonly OtlpKeyValue[]): Record<string, OtlpAnyValue> {
	return Object.fromEntries(attributes.map(({ key, value }) => [key, value]));
}

export function user(
	identifiers: Record<string, unknown> = {},
	attributes: Record<string, unknown> = {},
): FFPUser {
	return normalizeUser({ identifiers, attributes }).user;
}

export function flagResult(metadata: Partial<FlagResult['metadata']> = {}): FlagResult {
	return {
		returnType: 'BOOLEAN',
		value: true,
		useCodeDefault: false,
		metadata: { matchReason: 'rule_match', variationId: 'on', ruleId: 'rule-1', ...metadata },
	};
}

/** Details as the client builds them from a retained result. */
export function detailsFor(flagKey: string, result: FlagResult): EvaluationDetails<unknown> {
	return {
		value: result.value,
		metadata: {
			flagKey,
			identifierType: result.metadata.identifierType ?? null,
			identifierValue: null,
			matchReason: result.metadata.matchReason,
			variationId: result.metadata.variationId ?? null,
			ruleId: result.metadata.ruleId ?? null,
			holdoutAllocation: result.metadata.holdoutAllocation ?? null,
			segments: [],
		},
	};
}

/** Details as the client builds them for a client-generated safe default. */
export function fallbackDetails(flagKey: string, matchReason: string): EvaluationDetails<unknown> {
	return {
		value: false,
		metadata: {
			flagKey,
			identifierType: null,
			identifierValue: null,
			matchReason,
			variationId: null,
			ruleId: null,
			holdoutAllocation: null,
			segments: [],
		},
	};
}

/** A mapping input for a retained result read by an initialized client. */
export function resultInput(
	result: FlagResult,
	overrides: Partial<ExposureMappingInput> = {},
): ExposureMappingInput {
	return {
		details: detailsFor('flag-a', result),
		flagResult: result,
		user: user(),
		identity: IDENTITY,
		initialization: INITIALIZED,
		manual: false,
		epochMillis: 1_786_964_600_000,
		...overrides,
	};
}

/** A mapping input for a client-generated safe default. */
export function fallbackInput(
	matchReason: string,
	overrides: Partial<ExposureMappingInput> = {},
): ExposureMappingInput {
	return {
		details: fallbackDetails('flag-a', matchReason),
		flagResult: null,
		user: user(),
		identity: IDENTITY,
		initialization: INITIALIZED,
		manual: false,
		epochMillis: 1_786_964_600_000,
		...overrides,
	};
}
