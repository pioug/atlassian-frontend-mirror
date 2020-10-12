import {
  AnalyticsHandler,
  Flags,
  ExposureEvent,
  FlagShape,
  CustomAttributes,
  ReservedAttributes,
} from './types';
import {
  isObject,
  enforceAttributes,
  isFlagWithEvaluationDetails,
  isSimpleFlag,
  validateFlags,
  checkForReservedAttributes,
} from './lib';

import TrackedFlag from './tracked-flag';
import UntrackedFlag from './untracked-flag';

export default class FeatureFlagClient {
  flags: Readonly<Flags> = {};
  trackedFlags: { [flagKey: string]: boolean } = {};
  analyticsHandler?: AnalyticsHandler;

  constructor(options: {
    flags?: Flags;
    analyticsHandler: (event: ExposureEvent) => void;
  }) {
    const { flags, analyticsHandler } = options;

    enforceAttributes(options, ['analyticsHandler'], 'Feature Flag Client');

    this.setFlags(flags || {});
    this.setAnalyticsHandler(analyticsHandler);
  }

  setFlags(flags: Flags) {
    if (!isObject(flags)) {
      return;
    }

    // @ts-ignore
    if (process.env.NODE_ENV !== 'production') {
      validateFlags(flags);
    }

    this.flags = {
      ...this.flags,
      ...flags,
    };
  }

  setAnalyticsHandler(analyticsHandler: AnalyticsHandler) {
    this.analyticsHandler = analyticsHandler;
  }

  getFlag(flagKey: string): TrackedFlag | UntrackedFlag | null {
    const flag = this.flags[flagKey];

    if (isFlagWithEvaluationDetails(flag)) {
      return new TrackedFlag(flagKey, flag, this.trackExposure);
    }

    if (isSimpleFlag(flag)) {
      return new UntrackedFlag(flagKey, flag);
    }

    return null;
  }

  clear() {
    this.flags = {};
    this.trackedFlags = {};
  }

  getBooleanValue(
    flagKey: string,
    options: {
      default: boolean;
      shouldTrackExposureEvent?: boolean;
      exposureData?: CustomAttributes;
    },
  ): boolean {
    enforceAttributes(options, ['default'], 'getBooleanValue');

    const getterOptions = {
      shouldTrackExposureEvent: true,
      ...options,
    };

    const flag = this.getFlag(flagKey);

    if (!flag) {
      return options.default;
    }

    return flag.getBooleanValue(getterOptions);
  }

  getVariantValue(
    flagKey: string,
    options: {
      default: string;
      oneOf: string[];
      shouldTrackExposureEvent?: boolean;
      exposureData?: CustomAttributes;
    },
  ): string {
    enforceAttributes(options, ['default', 'oneOf'], 'getVariantValue');

    const getterOptions = {
      shouldTrackExposureEvent: true,
      ...options,
    };

    const flag = this.getFlag(flagKey);

    if (!flag) {
      return options.default;
    }

    return flag.getVariantValue(getterOptions) as string;
  }

  getJSONValue(flagKey: string): object {
    const flag = this.getFlag(flagKey);

    if (!flag) {
      return {};
    }

    return flag.getJSONValue();
  }

  trackExposure = (
    flagKey: string,
    flag: FlagShape,
    exposureData: CustomAttributes = {},
  ) => {
    if (
      this.trackedFlags[flagKey] ||
      !flag ||
      !flag.explanation ||
      !this.analyticsHandler
    ) {
      return;
    }

    checkForReservedAttributes(exposureData);

    const flagAttributes: ReservedAttributes = {
      flagKey,
      reason: flag.explanation.kind,
      ruleId: flag.explanation.ruleId,
      value: flag.value,
    };

    const exposureEvent: ExposureEvent = {
      action: 'exposed',
      actionSubject: 'feature',
      attributes: Object.assign(exposureData, flagAttributes),
      source: '@atlaskit/feature-flag-client',
    };

    this.analyticsHandler(exposureEvent);

    this.trackedFlags[flagKey] = true;
  };
}
