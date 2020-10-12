export type Reason =
  | 'OFF'
  | 'FALLTHROUGH'
  | 'RULE_MATCH'
  | 'TARGET_MATCH'
  | 'INELIGIBLE';

export type RuleId = string;

export type FlagShape = {
  value: boolean | string | object;
  explanation?: {
    kind: Reason;
    ruleId?: RuleId;
    ruleIndex?: number;
  };
};

export type Flags = {
  [flagName: string]: FlagShape;
};

export type ReservedAttributes = {
  flagKey: string;
  reason: Reason;
  ruleId?: string;
  value: boolean | string | object;
};

export type CustomAttributes = {
  [attributeName: string]: string | number | boolean;
};

export type ExposureEventAttributes = ReservedAttributes & CustomAttributes;

export type ExposureEvent = {
  action: string;
  actionSubject: string;
  attributes: ExposureEventAttributes;
  source: string;
};

export interface FlagConstructor {
  new (
    flagKey: string,
    flag: FlagShape,
    trackExposure: (flagKey: string, flag: FlagShape) => void,
  ): Flag;
}
export interface Flag {
  getBooleanValue(options: {
    default: boolean;
    shouldTrackExposureEvent?: boolean;
    data: CustomAttributes;
  }): boolean;

  getVariantValue(options: {
    default: string;
    oneOf: string[];
    shouldTrackExposureEvent?: boolean;
    data: CustomAttributes;
  }): string;

  getJSONValue(): object;
}

export type AnalyticsHandler = (event: ExposureEvent) => void;
