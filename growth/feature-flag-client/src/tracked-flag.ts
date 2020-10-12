import { FlagShape, Flag, CustomAttributes } from './types';
import { isBoolean, isObject, isOneOf, isString } from './lib';

export default class TrackedFlag implements Flag {
  flagKey: string;
  flag: FlagShape;
  value: string | boolean | object;
  trackExposure: (
    flagKey: string,
    flag: FlagShape,
    exposureData?: CustomAttributes,
  ) => void;

  constructor(
    flagKey: string,
    flag: FlagShape,
    trackExposure: (
      flagKey: string,
      flag: FlagShape,
      exposureData?: CustomAttributes,
    ) => void,
  ) {
    this.flagKey = flagKey;
    this.value = flag.value;
    this.trackExposure = trackExposure;
    this.flag = flag;
  }

  getBooleanValue(options: {
    default: boolean;
    shouldTrackExposureEvent?: boolean;
    exposureData?: CustomAttributes;
  }): boolean {
    if (!isBoolean(this.value)) {
      return options.default;
    }

    if (options.shouldTrackExposureEvent) {
      this.trackExposure(this.flagKey, this.flag, options.exposureData);
    }

    return this.value as boolean;
  }

  getVariantValue(options: {
    default: string;
    oneOf: string[];
    shouldTrackExposureEvent?: boolean;
    exposureData?: CustomAttributes;
  }): string {
    if (
      !isString(this.value) ||
      !isOneOf(this.value as string, options.oneOf)
    ) {
      return options.default;
    }
    if (options.shouldTrackExposureEvent) {
      this.trackExposure(this.flagKey, this.flag, options.exposureData);
    }

    return this.value as string;
  }

  getJSONValue(): object {
    if (!isObject(this.value)) {
      return {};
    }

    return this.value as object;
  }
}
