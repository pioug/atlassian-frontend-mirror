import {
  AnalyticsHandler,
  Flags,
  ExposureEvent,
  FlagShape,
  CustomAttributes,
  ReservedAttributes,
  AutomaticAnalyticsHandler,
  ExposureEventAttributes,
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
  automaticAnalyticsHandler?: AutomaticAnalyticsHandler;
  isAutomaticExposuresEnabled: boolean = false;
  automaticExposuresCache: { [flagKey: string]: boolean } = {};

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

  setAutomaticAnalyticsHandler(
    automaticAnalyticsHandler: AutomaticAnalyticsHandler,
  ) {
    this.automaticAnalyticsHandler = automaticAnalyticsHandler;
  }

  setIsAutomaticExposuresEnabled(isEnabled: boolean) {
    this.isAutomaticExposuresEnabled = isEnabled;
  }

  setAutomaticExposuresMode(
    enableAutomaticExposures: boolean,
    automaticAnalyticsHandler: AutomaticAnalyticsHandler,
  ) {
    this.setIsAutomaticExposuresEnabled(enableAutomaticExposures);
    this.setAutomaticAnalyticsHandler(automaticAnalyticsHandler);
  }

  getFlag(flagKey: string): TrackedFlag | UntrackedFlag | null {
    const flag = this.flags[flagKey];

    if (isFlagWithEvaluationDetails(flag)) {
      return new TrackedFlag(
        flagKey,
        flag,
        this.trackExposure,
        this.sendAutomaticExposure,
      );
    }

    if (isSimpleFlag(flag)) {
      return new UntrackedFlag(flagKey, flag, this.sendAutomaticExposure);
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
      tags: ['measurement'],
      highPriority: false,
      source: '@atlaskit/feature-flag-client',
    };

    this.analyticsHandler(exposureEvent);

    this.trackedFlags[flagKey] = true;
  };

  private sendAutomaticExposure = (
    flagKey: string,
    value: string | boolean | object,
    flagExplanation?: FlagShape['explanation'],
  ) => {
    if (
      this.trackedFlags[flagKey] ||
      this.automaticExposuresCache[flagKey] ||
      !this.automaticAnalyticsHandler ||
      !this.isAutomaticExposuresEnabled
    ) {
      return;
    }

    const flagAttributes: ReservedAttributes = {
      flagKey,
      value,
      reason: 'SIMPLE_EVAL',
    };

    if (flagExplanation) {
      flagAttributes.reason = flagExplanation.kind;
      flagAttributes.ruleId = flagExplanation.ruleId;
      flagAttributes.errorKind = flagExplanation.errorKind;
    }

    const exposureEvent: ExposureEvent = {
      action: 'exposed',
      actionSubject: 'feature',
      attributes: flagAttributes as ExposureEventAttributes,
      tags: ['autoExposure', 'measurement'],
      highPriority: false,
      source: '@atlaskit/feature-flag-client',
    };

    this.automaticAnalyticsHandler.sendOperationalEvent(exposureEvent);

    this.automaticExposuresCache[flagKey] = true;
  };
}
