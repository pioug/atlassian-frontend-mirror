import {
  FlagWrapper,
  FlagShape,
  AutomaticExposureHandler,
  FlagValue,
  CustomAttributes,
  InternalTriggeredExposureHandler,
  EvaluationResult,
  ExposureTriggerReason,
} from './types';

/**
 * This class contains the base logic for evaluating feature flags.
 */
export default class BasicFlag implements FlagWrapper {
  flagKey: string;
  flag: FlagShape;
  /**
   * @todo The value is only required for backwards compatibility, since
   * the object returned from client.getFlag has always contained this field.
   * This field can be deleted once client.getFlag has been removed from
   * the public API
   */
  value: FlagValue;
  evaluationCount: number;
  trackExposure: InternalTriggeredExposureHandler;
  sendAutomaticExposure: AutomaticExposureHandler;

  _evaluationResult?: EvaluationResult;

  constructor(
    flagKey: string,
    flag: FlagShape,
    trackExposure: InternalTriggeredExposureHandler,
    sendAutomaticExposure: AutomaticExposureHandler,
  ) {
    this.flagKey = flagKey;
    this.flag = flag;
    this.value = flag.value;
    this.evaluationCount = 0;
    this.trackExposure = trackExposure;
    this.sendAutomaticExposure = sendAutomaticExposure;
  }

  private getCachedResultOrCompute(
    defaultValue: FlagValue,
    shouldTrackExposureEvent?: boolean,
    exposureData?: CustomAttributes,
    oneOf?: FlagValue[],
  ): FlagValue {
    let exposureTriggerReason = ExposureTriggerReason.OptIn;
    if (shouldTrackExposureEvent === undefined) {
      shouldTrackExposureEvent = true;
      exposureTriggerReason = ExposureTriggerReason.Default;
    }

    // It is very common for products to call this method many times for the same flag key,
    // as flag evaluations are often done inside action callbacks and/or inside components with many instances.
    // We can cache the result of the first evaluation to avoid doing the same validation checks on every call.
    let result = this._evaluationResult;
    if (result === undefined) {
      result = this._evaluationResult = this.computeWithValidation(
        defaultValue,
        oneOf,
      );
    }

    let value = result.value;
    if (result.didFallbackToDefaultValue) {
      // Use the default that was passed in, just in case it's different to what it was in the initial evaluation
      value = defaultValue;
    } else if (shouldTrackExposureEvent) {
      // For backwards compability, only fire the opt-in exposure event in valid evaluations.
      this.trackExposure(
        this.flagKey,
        this.flag,
        exposureTriggerReason,
        exposureData,
      );
    }

    this.sendAutomaticExposure(this.flagKey, value, result.explanation);

    this.evaluationCount++;
    return value;
  }

  private computeWithValidation(
    defaultValue: FlagValue,
    oneOf?: FlagValue[],
  ): EvaluationResult {
    let result: EvaluationResult = {
      value: this.flag.value,
      explanation: this.flag.explanation,
      didFallbackToDefaultValue: false,
    };

    if (typeof this.flag.value !== typeof defaultValue) {
      result.value = defaultValue;
      result.didFallbackToDefaultValue = true;
      result.explanation = {
        ...(result.explanation || {}),
        kind: 'ERROR',
        errorKind: 'WRONG_TYPE',
      };
    } else if (oneOf !== undefined && !oneOf.includes(this.flag.value)) {
      result.value = defaultValue;
      result.didFallbackToDefaultValue = true;
      result.explanation = {
        ...(result.explanation || {}),
        kind: 'ERROR',
        errorKind: 'VALIDATION_ERROR',
      };
    }

    return result;
  }

  getBooleanValue(options: {
    default: boolean;
    shouldTrackExposureEvent?: boolean;
    exposureData?: CustomAttributes;
  }): boolean {
    const value = this.getCachedResultOrCompute(
      options.default,
      options.shouldTrackExposureEvent,
      options.exposureData,
    );

    return value as boolean;
  }

  getVariantValue(options: {
    default: string;
    oneOf: string[];
    shouldTrackExposureEvent?: boolean;
    exposureData?: CustomAttributes;
  }): string {
    const value = this.getCachedResultOrCompute(
      options.default,
      options.shouldTrackExposureEvent,
      options.exposureData,
      options.oneOf,
    );

    return value as string;
  }

  getJSONValue(): object {
    return this.getCachedResultOrCompute({}, false) as object;
  }

  getRawValue(options: {
    default: FlagValue;
    shouldTrackExposureEvent?: boolean;
    exposureData?: CustomAttributes;
  }): FlagValue {
    return this.getCachedResultOrCompute(
      options.default,
      options.shouldTrackExposureEvent,
      options.exposureData,
    );
  }
}
