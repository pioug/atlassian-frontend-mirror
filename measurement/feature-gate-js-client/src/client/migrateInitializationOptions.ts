import { type FeatureGateOptions, type NewFeatureGateOptions } from './types';

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
