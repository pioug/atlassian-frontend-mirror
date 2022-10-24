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
  public evaluationCount: number;

  private readonly flagKey: string;
  private readonly flag: FlagShape;
  private readonly trackExposure: InternalTriggeredExposureHandler;
  private readonly sendAutomaticExposure: AutomaticExposureHandler;
  private readonly ignoreTypes: boolean;

  // Makes the casting easier later on. The APIs should not leak any.
  // Should only be used in private functions.
  private evaluationResult?: EvaluationResult<any>;

  constructor(
    flagKey: string,
    flag: FlagShape,
    trackExposure: InternalTriggeredExposureHandler,
    sendAutomaticExposure: AutomaticExposureHandler,
    ignoreTypes: boolean,
  ) {
    this.flagKey = flagKey;
    this.flag = flag;
    this.evaluationCount = 0;
    this.trackExposure = trackExposure;
    this.sendAutomaticExposure = sendAutomaticExposure;
    this.ignoreTypes = ignoreTypes;
  }

  private getCachedResultOrCompute<T = FlagValue>(
    defaultValue: T,
    {
      shouldTrackExposureEvent,
      exposureData,
      oneOf,
      ignoreTypes,
    }: {
      shouldTrackExposureEvent?: boolean;
      exposureData?: CustomAttributes;
      oneOf?: T[];
      ignoreTypes: boolean;
    },
  ): FlagShape<T> {
    let exposureTriggerReason = ExposureTriggerReason.OptIn;
    if (shouldTrackExposureEvent === undefined) {
      shouldTrackExposureEvent = true;
      exposureTriggerReason = ExposureTriggerReason.Default;
    }

    // It is very common for products to call this method many times for the same flag key,
    // as flag evaluations are often done inside action callbacks and/or inside components with many instances.
    // We can cache the result of the first evaluation to avoid doing the same validation checks on every call.
    if (this.evaluationResult === undefined) {
      this.evaluationResult = this.computeWithValidation<T>(defaultValue, {
        oneOf,
        ignoreTypes,
      });
    }

    let value: T = this.evaluationResult.value;
    if (this.evaluationResult.didFallbackToDefaultValue) {
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

    this.sendAutomaticExposure(
      this.flagKey,
      (value as unknown) as FlagValue,
      this.evaluationResult.explanation,
    );

    this.evaluationCount++;
    return {
      value,
      explanation: this.evaluationResult.explanation,
    };
  }

  private computeWithValidation<T = FlagValue>(
    defaultValue: T,
    {
      oneOf,
      ignoreTypes,
    }: {
      oneOf?: T[];
      ignoreTypes?: boolean;
    },
  ): EvaluationResult<T> {
    let result: EvaluationResult<T> = {
      value: (this.flag.value as unknown) as T,
      explanation: this.flag.explanation,
      didFallbackToDefaultValue: false,
    };

    if (!ignoreTypes && typeof this.flag.value !== typeof defaultValue) {
      result.value = defaultValue;
      result.didFallbackToDefaultValue = true;
      result.explanation = {
        ...(result.explanation || {}),
        kind: 'ERROR',
        errorKind: 'WRONG_TYPE',
      };
    } else if (
      oneOf !== undefined &&
      !oneOf.includes((this.flag.value as unknown) as T)
    ) {
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
    const flag = this.getCachedResultOrCompute<boolean>(options.default, {
      exposureData: options.exposureData,
      shouldTrackExposureEvent: options.shouldTrackExposureEvent,
      oneOf: undefined,
      ignoreTypes: this.ignoreTypes || false,
    });

    return flag.value;
  }

  getVariantValue(options: {
    default: string;
    oneOf: string[];
    shouldTrackExposureEvent?: boolean;
    exposureData?: CustomAttributes;
  }): string {
    const flag = this.getCachedResultOrCompute<string>(options.default, {
      exposureData: options.exposureData,
      shouldTrackExposureEvent: options.shouldTrackExposureEvent,
      oneOf: options.oneOf,
      ignoreTypes: this.ignoreTypes || false,
    });

    return flag.value;
  }

  getJSONValue<T = object>(): T | {} {
    return this.getCachedResultOrCompute<T | {}>(
      {},
      {
        shouldTrackExposureEvent: false,
        ignoreTypes: this.ignoreTypes,
      },
    ).value as T;
  }

  getRawValue<T extends FlagValue = FlagValue>(options: {
    default: T;
    shouldTrackExposureEvent?: boolean;
    exposureData?: CustomAttributes;
  }): T {
    return this.getCachedResultOrCompute<T>(options.default, {
      shouldTrackExposureEvent: options.shouldTrackExposureEvent,
      exposureData: options.exposureData,
      oneOf: undefined,
      ignoreTypes: true,
    }).value;
  }

  getFlagEvaluation<T = FlagValue>(options: {
    default: T;
    shouldTrackExposureEvent?: boolean;
    exposureData?: CustomAttributes;
  }): FlagShape<T> {
    return this.getCachedResultOrCompute<T>(options.default, {
      shouldTrackExposureEvent: options.shouldTrackExposureEvent,
      exposureData: options.exposureData,
      ignoreTypes: this.ignoreTypes || false,
    });
  }
}
