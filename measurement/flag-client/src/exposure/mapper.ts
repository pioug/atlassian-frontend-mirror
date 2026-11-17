/** Pure mapping from one read to one exposure record. Not part of the public API. */
import type { ClientFallbackReason } from '../evaluation';
import type {
	ClientVersion,
	EvaluationDetails,
	FlagResult,
	HoldoutAllocationMetadata,
	RequestContext,
} from '../types';
import type { FFPUser } from '../user-normalization';
import { PACKAGE_VERSION } from '../version';
import {
	notInitializedMessage,
	type ExposureIdentity,
	type InitializationStatus,
} from './attribution';
import { attributionIdentifiers, isNonEmptyString } from './identifiers';
import {
	boolValue,
	doubleValue,
	intValue,
	numberValue,
	stringArrayValue,
	stringValue,
	unixNanoFromMillis,
	type ExposureRecord,
	type OtlpAnyValue,
	type OtlpKeyValue,
} from './otlp';
import { ERROR_REASONS } from './reasons';

export interface ExposureMappingInput {
	readonly details: EvaluationDetails<unknown>;
	/**
	 * The initialized payload's flag result for the details' flag key, including one whose return type
	 * did not match the read, or `null` when uninitialized or the flag is absent.
	 */
	readonly flagResult: FlagResult | null;
	/**
	 * The held payload's request context, which supersedes `user` for attribution, or absent while the
	 * client holds no payload. The client retains an absent `attributes` as an empty object.
	 */
	readonly requestContext?: Required<RequestContext>;
	readonly user: FFPUser;
	/** The identity resolved once from the client's constructor options. */
	readonly identity: ExposureIdentity;
	readonly initialization: InitializationStatus;
	readonly clientVersion?: ClientVersion;
	readonly manual: boolean;
	readonly epochMillis: number;
}

/** Typed so a respelling in `CLIENT_FALLBACK_REASONS` fails to compile here. */
const NOT_INITIALIZED: ClientFallbackReason = 'not_initialized';

/** Error reasons whose payload `errorMessage` is preferred over the fixed client-owned text. */
const PAYLOAD_MESSAGE_ERROR_REASONS: ReadonlySet<string> = new Set([
	'general_error',
	'invalid_context',
]);

/**
 * Map one read to its exposure record.
 *
 * The source names the payload origin: `bootstrap` whenever the client holds an initialized payload,
 * and `fallback` otherwise. Error reasons omit actual variant and rule attribution; captured assignment diagnostics remain available. Unavailable values are
 * omitted rather than synthesized, except the schema-reserved `default` rule ID for a variation
 * without a rule. The flag value is never included.
 */
export function mapExposureRecord(input: ExposureMappingInput): ExposureRecord {
	const { metadata } = input.details;
	const flagResult = input.flagResult;
	const flagSetId = input.identity.flagSetId;
	const attributes: OtlpKeyValue[] = [];
	const add = (key: string, value: OtlpAnyValue): void => {
		attributes.push({ key, value });
	};

	add('feature_flag.key', stringValue(metadata.flagKey));
	if (flagSetId !== null) add('feature_flag.set.id', stringValue(flagSetId));
	const isError = ERROR_REASONS.has(metadata.matchReason);
	// Caller-built details may omit the member, so a variation ID that is not a string is absent.
	const variationId: unknown = metadata.variationId;
	const hasVariation = typeof variationId === 'string';
	if (!isError && hasVariation) add('feature_flag.result.variant', stringValue(variationId));
	add('feature_flag.result.reason', stringValue(metadata.matchReason));

	const errorMessage = isError
		? errorReasonMessage(metadata.matchReason, flagResult, input.initialization)
		: flagResult?.metadata.errorMessage;
	if (isNonEmptyString(errorMessage)) add('feature_flag.error.message', stringValue(errorMessage));

	const flagVersion = flagResult?.metadata.flagVersion;
	if (isNonEmptyString(flagVersion)) add('feature_flag.version', stringValue(flagVersion));

	// Only the default variation has a variation without a rule; matched rules always carry an ID.
	// An empty rule ID counts as absent.
	const ruleId = isError
		? null
		: isNonEmptyString(metadata.ruleId)
			? metadata.ruleId
			: hasVariation && metadata.matchReason === 'no_rules_matched'
				? 'default'
				: null;
	if (ruleId !== null) add('atl.feature_flag.rule_id', stringValue(ruleId));

	const clientVersion = input.clientVersion;
	if (clientVersion !== undefined && isNonEmptyString(clientVersion.token)) {
		add('atl.feature_flag.client.version.token', stringValue(clientVersion.token));
		if (isNonEmptyString(clientVersion.updatedAt)) {
			add('atl.feature_flag.client.version.updated_at', stringValue(clientVersion.updatedAt));
		}
	}

	// Resolve the selected unit from the captured evaluation, never a newer/current user's identity.
	const identifierName = flagResult?.metadata.identifierType;
	const identifiers = input.requestContext?.identifiers;
	const identifierValue =
		typeof identifierName === 'string' &&
		identifiers !== undefined &&
		Object.prototype.hasOwnProperty.call(identifiers, identifierName)
			? identifiers[identifierName]
			: undefined;
	for (const [name, value] of [
		['randomization_identifier_value', identifierValue],
		['randomization_identifier_name', identifierName],
	] as const) {
		if (typeof value === 'string') add(`atl.feature_flag.${name}`, stringValue(value));
	}
	addHoldoutAllocation(metadata.holdoutAllocation, 'atl.feature_flag.holdout_allocation.', add);
	const outcome = metadata.stableSplitOutcome;
	if (typeof outcome?.matchReason === 'string') {
		const prefix = 'atl.feature_flag.stable_split_outcome.';
		add(`${prefix}match_reason`, stringValue(outcome.matchReason));
		if (typeof outcome.variationId === 'string') {
			add(`${prefix}variation_id`, stringValue(outcome.variationId));
		}
		addHoldoutAllocation(outcome.holdoutAllocation, `${prefix}holdout_allocation.`, add);
	}

	const targetApps = (flagResult?.metadata.targetApps ?? []).filter(isNonEmptyString);
	if (targetApps.length > 0) add('atl.feature_flag.target_apps', stringArrayValue(targetApps));

	add(
		'atl.feature_flag.result.source',
		stringValue(input.initialization.state === 'initialized' ? 'bootstrap' : 'fallback'),
	);
	add('atl.feature_flag.exposure.manual', boolValue(input.manual));
	add('atl.feature_flag.sampling.rate', doubleValue(1));
	add('atl.feature_flag.sampling.item.count', intValue(1));

	for (const [key, value] of attributionIdentifiers(input)) {
		add(`atl.identifiers.${key}`, stringValue(value));
	}
	const context = input.requestContext ?? input.user;
	for (const [key, value] of Object.entries(context.attributes)) {
		if (key === '') continue;
		if (typeof value === 'string') {
			if (value !== '') add(`atl.attributes.${key}`, stringValue(value));
		} else if (typeof value === 'boolean') {
			add(`atl.attributes.${key}`, boolValue(value));
		} else if (Number.isFinite(value)) {
			add(`atl.attributes.${key}`, numberValue(value));
		}
	}

	return {
		resource: input.identity.resource,
		scopeVersion: PACKAGE_VERSION,
		logRecord: {
			timeUnixNano: unixNanoFromMillis(input.epochMillis),
			severityNumber: 1,
			severityText: 'TRACE',
			eventName: 'flag-evaluated',
			attributes,
		},
	};
}

/** Map complete actual or hypothetical holdouts; incomplete groups cannot be exported to StreamHub. */
function addHoldoutAllocation(
	holdout: HoldoutAllocationMetadata | null | undefined,
	prefix: string,
	add: (key: string, value: OtlpAnyValue) => void,
): void {
	if (
		typeof holdout?.holdoutKey !== 'string' ||
		typeof holdout.identifierType !== 'string' ||
		typeof holdout.allocationReason !== 'string'
	) {
		return;
	}
	add(`${prefix}holdout_key`, stringValue(holdout.holdoutKey));
	if (typeof holdout.holdoutRuleId === 'string') {
		add(`${prefix}holdout_rule_id`, stringValue(holdout.holdoutRuleId));
	}
	add(`${prefix}identifier_type`, stringValue(holdout.identifierType));
	add(`${prefix}allocation_reason`, stringValue(holdout.allocationReason));
}

/**
 * The message for an error reason. Fixed text contains only client-owned values; a payload message
 * is used only for the reasons whose payload reports the failure itself.
 */
function errorReasonMessage(
	reason: string,
	flagResult: FlagResult | null,
	initialization: InitializationStatus,
): string {
	const payloadMessage = flagResult?.metadata.errorMessage;
	if (PAYLOAD_MESSAGE_ERROR_REASONS.has(reason) && isNonEmptyString(payloadMessage)) {
		return payloadMessage;
	}
	if (reason === NOT_INITIALIZED) {
		const message = notInitializedMessage(initialization);
		if (message !== undefined) return message;
	}
	return `FFP evaluation failed: ${reason}`;
}
