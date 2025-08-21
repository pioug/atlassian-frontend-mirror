export type Reason =
	| 'OFF'
	| 'FALLTHROUGH'
	| 'RULE_MATCH'
	| 'TARGET_MATCH'
	| 'INELIGIBLE'
	| 'SIMPLE_EVAL'
	| 'ERROR';

export type ErrorKind = 'WRONG_TYPE' | 'FLAG_NOT_FOUND' | 'VALIDATION_ERROR';

export enum ExposureTriggerReason {
	OptIn = 'optInExposure', // Consumer sets shouldTrackExposure to true
	Manual = 'manualExposure', // Consumer manually fires the event using client.trackExposure
	Default = 'defaultExposure', // Consumer does not specify shouldTrackExposure (default behaviour)
	AutoExposure = 'autoExposure', // Consumer sets shouldTrackExposure to false (fired as part of TAC)
	hasCustomAttributes = 'hasCustomAttributes', // Set if consumer sends extra exposure data along (in addition to above tags)
}

export type RuleId = string;

export type FlagValue = boolean | string | object;

export type FlagExplanation = {
	errorKind?: ErrorKind;
	kind: Reason;
	ruleId?: RuleId;
	ruleIndex?: number;
};

export type FlagShape<T = FlagValue> = {
	explanation?: FlagExplanation;
	value: T;
};

export type TriggeredExposureHandler = (
	flagKey: string,
	flag: FlagShape,
	exposureData?: CustomAttributes,
) => void;

export type InternalTriggeredExposureHandler = (
	flagKey: string,
	flag: FlagShape,
	exposureTriggerReason: ExposureTriggerReason,
	exposureData?: CustomAttributes,
) => void;

export type AutomaticExposureHandler = (
	flagKey: string,
	value: string | boolean | object,
	flagExplanation?: FlagShape['explanation'],
) => void;

export type Flags = {
	[flagName: string]: FlagShape;
};

export type ReservedAttributes = {
	errorKind?: ErrorKind;
	flagKey: string;
	reason: Reason;
	ruleId?: string;
	value: unknown;
};

export type CustomAttributes = {
	[attributeName: string]: string | number | boolean | object;
};

export type ExposureEventAttributes = ReservedAttributes & CustomAttributes;

export type ExposureEvent = {
	action: string;
	actionSubject: string;
	attributes: ExposureEventAttributes;
	highPriority?: boolean;
	source: string;
	tags?: string[];
};

export interface FlagWrapper {
	evaluationCount: number;
	getBooleanValue(options: {
		default: boolean;
		exposureData?: CustomAttributes;
		shouldTrackExposureEvent?: boolean;
	}): boolean;

	getFlagEvaluation<T = FlagValue>(options: {
		default: T;
		exposureData?: CustomAttributes;
		shouldTrackExposureEvent?: boolean;
	}): FlagShape<T>;

	getJSONValue(): object;

	getRawValue(options: {
		default: FlagValue;
		exposureData?: CustomAttributes;
		shouldTrackExposureEvent?: boolean;
	}): FlagValue;

	getVariantValue(options: {
		default: string;
		exposureData?: CustomAttributes;
		oneOf: string[];
		shouldTrackExposureEvent?: boolean;
	}): string;
}

export interface AnalyticsHandler {
	sendOperationalEvent(event: ExposureEvent): Promise<void>;
}

export type FlagStats = {
	[flagKey: string]: {
		evaluationCount: number;
	};
};

export type EvaluationResult<T = FlagValue> = {
	didFallbackToDefaultValue: boolean;
	explanation?: FlagExplanation;
	value: T;
};

export type TrackFeatureFlagOptions = {
	explanation?: FlagExplanation | undefined;
	triggerReason?: ExposureTriggerReason;
	value?: string | boolean | object;
};

export type ClientOptions = {
	analyticsHandler?: AnalyticsHandler;
	flags?: Flags;
	ignoreTypes?: boolean;
	isAutomaticExposuresEnabled?: boolean;

	// Deprecated. Will always be true
	isMissingFlagEventsDisabled?: boolean;
};
