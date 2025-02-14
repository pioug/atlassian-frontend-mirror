// Reference: https://github.com/statsig-io/js-lite/blob/main/src/StatsigStore.ts
export type EvaluationDetails = {
	time: number;
	reason: EvaluationReason;
};

export enum EvaluationReason {
	// Order is important since the logic for migrating from a new client reason to an old one
	// returns the first which is a substring of the new client reason
	Error = 'Error',
	LocalOverride = 'LocalOverride',
	Unrecognized = 'Unrecognized',
	Uninitialized = 'Uninitialized',
	NetworkNotModified = 'NetworkNotModified',
	Network = 'Network',
	InvalidBootstrap = 'InvalidBootstrap',
	Bootstrap = 'Bootstrap',
	Cache = 'Cache',

	// For when we could not migrate the reason from the new client
	Unknown = 'Unknown',
}

// Reference: https://github.com/statsig-io/js-lite/blob/main/src/StatsigSDKOptions.ts
export type StatsigOptions = {
	api?: string;
	disableCurrentPageLogging?: boolean;
	environment?: StatsigEnvironment;
	loggingIntervalMillis?: number;
	loggingBufferMaxSize?: number;
	disableNetworkKeepalive?: boolean;
	overrideStableID?: string;
	localMode?: boolean;
	initTimeoutMs?: number;
	disableErrorLogging?: boolean;
	disableAutoMetricsLogging?: boolean;
	initializeValues?: Record<string, any> | null;
	eventLoggingApi?: string;
	eventLoggingApiForRetries?: string;
	disableLocalStorage?: boolean;
	ignoreWindowUndefined?: boolean;
	updateUserCompletionCallback?: UpdateUserCompletionCallback;
	disableAllLogging?: boolean;
};

export type StatsigEnvironment = {
	tier?: 'production' | 'staging' | 'development' | string;
	[key: string]: string | undefined;
};

export type UpdateUserCompletionCallback = (
	durationMs: number,
	success: boolean,
	message: string | null,
) => void;
