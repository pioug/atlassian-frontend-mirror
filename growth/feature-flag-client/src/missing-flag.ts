import {
  type FlagWrapper,
  type Reason,
  type ErrorKind,
  type AutomaticExposureHandler,
  type FlagValue,
  type CustomAttributes,
  type FlagShape,
} from './types';

export const MISSING_FLAG_EXPLANATION = {
  kind: 'ERROR' as Reason,
  errorKind: 'FLAG_NOT_FOUND' as ErrorKind,
};

/**
 * This class handles the evaluations for flags that do not exist in the collection given to the client.
 */
export default class MissingFlag implements FlagWrapper {
  public evaluationCount: number;

  private readonly flagKey: string;
  private readonly sendAutomaticExposure: AutomaticExposureHandler | null;

  constructor(
    flagKey: string,
    sendAutomaticExposure: AutomaticExposureHandler | null,
  ) {
    this.flagKey = flagKey;
    this.sendAutomaticExposure = sendAutomaticExposure;
    this.evaluationCount = 0;
  }

  private evaluate<T = FlagValue>(defaultValue: T) {
    this.sendAutomaticExposure != null &&
      this.sendAutomaticExposure(
        this.flagKey,
        defaultValue as unknown as FlagValue,
        MISSING_FLAG_EXPLANATION,
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

  getFlagEvaluation<T = FlagValue>(options: {
    default: T;
    shouldTrackExposureEvent?: boolean | undefined;
    exposureData?: CustomAttributes | undefined;
  }): FlagShape<T> {
    const value: T = this.evaluate<T>(options.default);
    return {
      value,
      explanation: MISSING_FLAG_EXPLANATION,
    } as FlagShape<T>;
  }
}
