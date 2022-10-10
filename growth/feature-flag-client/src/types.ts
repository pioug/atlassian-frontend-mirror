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
  kind: Reason;
  ruleId?: RuleId;
  ruleIndex?: number;
  errorKind?: ErrorKind;
};

export type FlagShape<T = FlagValue> = {
  value: T;
  explanation?: FlagExplanation;
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
  flagKey: string;
  reason: Reason;
  ruleId?: string;
  value: unknown;
  errorKind?: ErrorKind;
};

export type CustomAttributes = {
  [attributeName: string]: string | number | boolean | object;
};

export type ExposureEventAttributes = ReservedAttributes & CustomAttributes;

export type ExposureEvent = {
  action: string;
  actionSubject: string;
  attributes: ExposureEventAttributes;
  source: string;
  tags?: string[];
  highPriority?: boolean;
};

export interface FlagWrapper {
  evaluationCount: number;
  getBooleanValue(options: {
    default: boolean;
    shouldTrackExposureEvent?: boolean;
    exposureData?: CustomAttributes;
  }): boolean;

  getVariantValue(options: {
    default: string;
    oneOf: string[];
    shouldTrackExposureEvent?: boolean;
    exposureData?: CustomAttributes;
  }): string;

  getJSONValue(): object;

  getRawValue(options: {
    default: FlagValue;
    shouldTrackExposureEvent?: boolean;
    exposureData?: CustomAttributes;
  }): FlagValue;

  getFlagEvaluation<T = FlagValue>(options: {
    default: T;
    shouldTrackExposureEvent?: boolean;
    exposureData?: CustomAttributes;
  }): FlagShape<T>;
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
  value: T;
  explanation?: FlagExplanation;
  didFallbackToDefaultValue: boolean;
};

export type TrackFeatureFlagOptions = {
  triggerReason?: ExposureTriggerReason;
  value?: string | boolean | object;
  explanation?: FlagExplanation | undefined;
};

export type ClientOptions = {
  flags?: Flags;
  analyticsHandler?: AnalyticsHandler;
  isAutomaticExposuresEnabled?: boolean;
  ignoreTypes?: boolean;
};
