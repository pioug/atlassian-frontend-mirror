import { FlagShape, Flag, CustomAttributes } from './types';
import {
  isBoolean,
  isObject,
  isOneOf,
  isString,
  validateFlagExplanation,
} from './lib';

export default class TrackedFlag implements Flag {
  flagKey: string;
  flag: FlagShape;
  value: string | boolean | object;
  trackExposure: (
    flagKey: string,
    flag: FlagShape,
    exposureData?: CustomAttributes,
  ) => void;
  sendAutomaticExposure: (
    flagKey: string,
    value: string | boolean | object,
    flagExplanation?: FlagShape['explanation'],
  ) => void;

  constructor(
    flagKey: string,
    flag: FlagShape,
    trackExposure: (
      flagKey: string,
      flag: FlagShape,
      exposureData?: CustomAttributes,
    ) => void,
    sendAutomaticExposure: (
      flagKey: string,
      value: string | boolean | object,
      flagExplanation?: FlagShape['explanation'],
    ) => void,
  ) {
    this.flagKey = flagKey;
    this.value = flag.value;
    this.trackExposure = trackExposure;
    this.flag = flag;
    this.sendAutomaticExposure = sendAutomaticExposure;
  }

  getBooleanValue(options: {
    default: boolean;
    shouldTrackExposureEvent?: boolean;
    exposureData?: CustomAttributes;
  }): boolean {
    let value = options.default;

    if (isBoolean(this.value)) {
      value = this.value as boolean;
    }

    const flagExplanation = validateFlagExplanation(this.flag, options.default);

    if (options.shouldTrackExposureEvent) {
      this.trackExposure(this.flagKey, this.flag, options.exposureData);
    }

    this.sendAutomaticExposure(this.flagKey, value, flagExplanation);

    return value;
  }

  getVariantValue(options: {
    default: string;
    oneOf: string[];
    shouldTrackExposureEvent?: boolean;
    exposureData?: CustomAttributes;
  }): string {
    let value = options.default;

    if (isString(this.value) && isOneOf(this.value as string, options.oneOf)) {
      value = this.value as string;
    }

    const flagExplanation = validateFlagExplanation(this.flag, options.default);

    if (options.shouldTrackExposureEvent) {
      this.trackExposure(this.flagKey, this.flag, options.exposureData);
    }

    this.sendAutomaticExposure(this.flagKey, value, flagExplanation);

    return value;
  }

  getJSONValue(): object {
    let value = {};

    if (isObject(this.value)) {
      value = this.value as object;
    }

    this.sendAutomaticExposure(this.flagKey, value);

    return value;
  }
}
