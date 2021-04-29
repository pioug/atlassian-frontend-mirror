import {
  FlagWrapper,
  Reason,
  ErrorKind,
  AutomaticExposureHandler,
  FlagValue,
  CustomAttributes,
} from './types';

/**
 * This class handles the evaluations for flags that do not exist in the collection given to the client.
 */
export default class MissingFlag implements FlagWrapper {
  static readonly explanation = {
    kind: 'ERROR' as Reason,
    errorKind: 'FLAG_NOT_FOUND' as ErrorKind,
  };

  flagKey: string;
  sendAutomaticExposure: AutomaticExposureHandler;
  evaluationCount: number;

  constructor(
    flagKey: string,
    sendAutomaticExposure: AutomaticExposureHandler,
  ) {
    this.flagKey = flagKey;
    this.sendAutomaticExposure = sendAutomaticExposure;
    this.evaluationCount = 0;
  }

  private evaluate<T extends FlagValue>(defaultValue: T) {
    this.sendAutomaticExposure(
      this.flagKey,
      defaultValue,
      MissingFlag.explanation,
    );
    this.evaluationCount++;
    return defaultValue;
  }

  getBooleanValue(options: {
    default: boolean;
    shouldTrackExposureEvent?: boolean;
    exposureData?: CustomAttributes;
  }): boolean {
    return this.evaluate(options.default);
  }

  getVariantValue(options: {
    default: string;
    oneOf: string[];
    shouldTrackExposureEvent?: boolean;
    exposureData?: CustomAttributes;
  }): string {
    return this.evaluate(options.default);
  }

  getJSONValue(): object {
    return this.evaluate({});
  }

  getRawValue(options: {
    default: FlagValue;
    shouldTrackExposureEvent?: boolean;
    exposureData?: CustomAttributes;
  }): FlagValue {
    return this.evaluate(options.default);
  }
}
