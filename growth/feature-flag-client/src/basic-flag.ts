import { getFlagType } from './lib';
import {
  FlagWrapper,
  FlagShape,
  FlagType,
  AutomaticExposureHandler,
  FlagValue,
  CustomAttributes,
  TriggeredExposureHandler,
  FlagExplanation,
} from './types';

/**
 * This class contains the base logic for evaluating feature flags.
 */
export default class BasicFlag implements FlagWrapper {
  flagKey: string;
  flag: FlagShape;
  type: FlagType;
  /**
   * @todo The value is only required for backwards compatibility, since
   * the object returned from client.getFlag has always contained this field.
   * This field can be deleted once client.getFlag has been removed from
   * the public API
   */
  value: FlagValue;
  evaluationCount: number;
  trackExposure: TriggeredExposureHandler;
  sendAutomaticExposure: AutomaticExposureHandler;

  constructor(
    flagKey: string,
    flag: FlagShape,
    trackExposure: TriggeredExposureHandler,
    sendAutomaticExposure: AutomaticExposureHandler,
  ) {
    this.flagKey = flagKey;
    this.flag = flag;
    this.value = flag.value;
    this.type = getFlagType(flag.value);
    this.evaluationCount = 0;
    this.trackExposure = trackExposure;
    this.sendAutomaticExposure = sendAutomaticExposure;
  }

  private evaluate<T extends FlagValue>(
    expectedType: FlagType,
    defaultValue: T,
    shouldTrackExposureEvent: boolean,
    exposureData?: CustomAttributes,
    oneOf?: T[],
  ): T {
    let value: T = this.flag.value as T;
    let explanation: FlagExplanation | undefined = this.flag.explanation;
    if (this.type !== expectedType) {
      shouldTrackExposureEvent = false;
      value = defaultValue;
      explanation = {
        ...(explanation || {}),
        kind: 'ERROR',
        errorKind: 'WRONG_TYPE',
      };
    } else if (oneOf !== undefined && !oneOf.includes(value)) {
      shouldTrackExposureEvent = false;
      value = defaultValue;
      explanation = {
        ...(explanation || {}),
        kind: 'ERROR',
        errorKind: 'VALIDATION_ERROR',
      };
    }

    // For backwards compability, we only fire the opt-in exposure event in valid evaluations.
    // The automatic exposures can fire in all scenarios including errors.
    if (shouldTrackExposureEvent) {
      this.trackExposure(this.flagKey, this.flag, exposureData);
    }

    this.sendAutomaticExposure(this.flagKey, value, explanation);

    this.evaluationCount++;
    return value;
  }

  getBooleanValue(options: {
    default: boolean;
    shouldTrackExposureEvent?: boolean;
    exposureData?: CustomAttributes;
  }): boolean {
    const shouldTrackExposureEvent =
      options.shouldTrackExposureEvent !== undefined
        ? options.shouldTrackExposureEvent
        : true;
    return this.evaluate<boolean>(
      FlagType.BOOLEAN,
      options.default,
      shouldTrackExposureEvent,
      options.exposureData,
    );
  }

  getVariantValue(options: {
    default: string;
    oneOf: string[];
    shouldTrackExposureEvent?: boolean;
    exposureData?: CustomAttributes;
  }): string {
    const shouldTrackExposureEvent =
      options.shouldTrackExposureEvent !== undefined
        ? options.shouldTrackExposureEvent
        : true;
    return this.evaluate<string>(
      FlagType.STRING,
      options.default,
      shouldTrackExposureEvent,
      options.exposureData,
      options.oneOf,
    );
  }

  getJSONValue(): object {
    return this.evaluate<object>(FlagType.JSON, {}, false);
  }

  getRawValue(options: {
    default: FlagValue;
    shouldTrackExposureEvent?: boolean;
    exposureData?: CustomAttributes;
  }): FlagValue {
    const shouldTrackExposureEvent =
      options.shouldTrackExposureEvent !== undefined
        ? options.shouldTrackExposureEvent
        : true;
    return this.evaluate<FlagValue>(
      this.type,
      options.default,
      shouldTrackExposureEvent,
      options.exposureData,
    );
  }
}
