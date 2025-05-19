import {
	type EvaluationDetails as NewEvaluationDetails,
	SecondaryExposure,
	type StatsigUser,
} from '@statsig/js-client';

import { isFedRamp } from '@atlaskit/atlassian-context';

import { type EvaluationDetails, EvaluationReason } from './compat/types';
import {
	type BaseClientOptions,
	type CustomAttributes,
	type FeatureGateOptions,
	type Identifiers,
	type NewFeatureGateOptions,
	type OptionsWithDefaults,
	PerimeterType,
} from './types';

export const getOptionsWithDefaults = <T extends BaseClientOptions>(
	options: T,
): OptionsWithDefaults<T> => ({
	/**
	 * If more federal PerimeterTypes are added in the future, this should be updated so
	 * that isFedRamp() === true always returns the strictest perimeter.
	 */
	perimeter: isFedRamp() ? PerimeterType.FEDRAMP_MODERATE : PerimeterType.COMMERCIAL,
	...options,
});

export const shallowEquals = (objectA?: object, objectB?: object): boolean => {
	if (!objectA && !objectB) {
		return true;
	}

	if (!objectA || !objectB) {
		return false;
	}

	const aEntries: [string, unknown][] = Object.entries(objectA);
	const bEntries: [string, unknown][] = Object.entries(objectB);
	if (aEntries.length !== bEntries.length) {
		return false;
	}

	const ascendingKeyOrder = ([key1]: [string, unknown], [key2]: [string, unknown]) =>
		key1.localeCompare(key2);
	aEntries.sort(ascendingKeyOrder);
	bEntries.sort(ascendingKeyOrder);

	for (let i = 0; i < aEntries.length; i++) {
		const [, aValue] = aEntries[i];
		const [, bValue] = bEntries[i];
		if (aValue !== bValue) {
			return false;
		}
	}

	return true;
};

/**
 * This method creates an instance of StatsigUser from the given set of identifiers and
 * attributes.
 */
export const toStatsigUser = (
	identifiers: Identifiers,
	customAttributes?: CustomAttributes,
): StatsigUser => {
	const user: StatsigUser = {
		customIDs: identifiers,
		custom: customAttributes,
	};

	if (identifiers.atlassianAccountId) {
		user.userID = identifiers.atlassianAccountId;
	}

	return user;
};

export const migrateInitializationOptions = <T extends FeatureGateOptions>(
	options: T,
): Omit<T, keyof FeatureGateOptions> & NewFeatureGateOptions => {
	const {
		api,
		disableCurrentPageLogging,
		loggingIntervalMillis,
		loggingBufferMaxSize,
		localMode,
		eventLoggingApi,
		eventLoggingApiForRetries,
		disableLocalStorage,
		ignoreWindowUndefined,
		disableAllLogging,

		// No equivalent but is pointless anyway since our Statsig init is synchronous
		initTimeoutMs: _initTimeoutMs,

		// No equivalent in new client but probably not important?
		disableNetworkKeepalive: _disableNetworkKeepalive,

		// Needs to be implemented manually but unused according to zoekt
		overrideStableID: _overrideStableID,

		// No equivalent for these but can't see them actually used anywhere in old client?
		disableErrorLogging: _disableErrorLogging,
		disableAutoMetricsLogging: _disableAutoMetricsLogging,

		...rest
	} = options;

	return {
		...rest,
		networkConfig: {
			api,
			logEventUrl: eventLoggingApi ? eventLoggingApi + 'rgstr' : undefined,
			logEventFallbackUrls: eventLoggingApiForRetries ? [eventLoggingApiForRetries] : undefined,
			preventAllNetworkTraffic:
				localMode || (!ignoreWindowUndefined && typeof window === 'undefined'),
		},
		includeCurrentPageUrlWithEvents: !disableCurrentPageLogging,
		loggingIntervalMs: loggingIntervalMillis,
		loggingBufferMaxSize,
		disableStorage: disableLocalStorage === undefined ? localMode : disableLocalStorage,
		disableLogging: disableAllLogging === undefined ? localMode : disableAllLogging,
	};
};

const evaluationReasonMappings = Object.entries(EvaluationReason).map<[string, EvaluationReason]>(
	([key, value]) => [key.toLowerCase(), value],
);

export const migrateEvaluationDetails = (details: NewEvaluationDetails): EvaluationDetails => {
	const reasonLower = details.reason.toLowerCase();
	return {
		reason:
			evaluationReasonMappings.find(([key]) => reasonLower.includes(key))?.[1] ??
			EvaluationReason.Unknown,
		time: details.receivedAt ?? Date.now(),
	};
};

export const migrateSecondaryExposures = (
	secondaryExposures: SecondaryExposure[] | string[],
): Record<string, string>[] => {
	return secondaryExposures.map((exposure) => {
		if (typeof exposure === 'string') {
			// This should ideally have gateValue and ruleID fields too, but it's not possible for us
			// to determine the correct values for these.
			return {
				gate: exposure,
			};
		}

		return exposure;
	});
};
