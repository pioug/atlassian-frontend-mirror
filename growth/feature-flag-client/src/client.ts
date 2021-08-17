import {
  AnalyticsHandler,
  Flags,
  ExposureEvent,
  FlagShape,
  CustomAttributes,
  ReservedAttributes,
  AutomaticAnalyticsHandler,
  ExposureEventAttributes,
  FlagWrapper,
  FlagStats,
  FlagValue,
  ExposureTriggerReason,
} from './types';

import {
  isObject,
  enforceAttributes,
  validateFlags,
  checkForReservedAttributes,
} from './lib';

import MissingFlag from './missing-flag';
import BasicFlag from './basic-flag';

export default class FeatureFlagClient {
  flags: Map<String, FlagShape> = new Map();
  flagWrapperCache: Map<string, FlagWrapper> = new Map();
  trackedFlags: Set<string> = new Set();
  analyticsHandler?: AnalyticsHandler;
  automaticAnalyticsHandler?: AutomaticAnalyticsHandler;
  isAutomaticExposuresEnabled: boolean = false;
  automaticExposuresCache: Set<string> = new Set();

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

    Object.entries(flags).forEach(([flagKey, flag]) => {
      this.flags.set(flagKey, flag);
    });

    // Clear any cached data for flags that have been passed in again,
    // in case they have different values or explanations
    for (const flagKey of this.flagWrapperCache.keys()) {
      if (flags.hasOwnProperty(flagKey)) {
        this.flagWrapperCache.delete(flagKey);
      }
    }
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

  /**
   * @todo Remove this method in a future major release.
   * This method should not have been exposed publically, but unfortunately is still used in some products.
   * We have created the getRawValue method already, which should solve the previous use-cases, but
   * have kept the method in order to get the changes rolled out.
   *
   * @deprecated Since 4.2.0. Will be deleted in version 5.0. Please use getRawValue instead.
   */
  getFlag(flagKey: string): BasicFlag | null {
    const wrapper = this.getFlagWrapper(flagKey);

    if (wrapper instanceof BasicFlag) {
      return wrapper;
    }

    // This is added for backwards compatibility
    return null;
  }

  /**
   * This method returns the wrapper object for the given flag key.
   * If the flag does not exist, this will return a stubbed flag following the null-object pattern,
   * so it is always guaranteed to return an object.
   *
   * @todo In a future major release, we should look at removing getFlag from the public API, and merging
   * these two methods together. getFlag has been left returning null values for backwards compatibility.
   */
  private getFlagWrapper(flagKey: string): FlagWrapper {
    let wrapper: FlagWrapper | undefined = this.flagWrapperCache.get(flagKey);
    if (wrapper !== undefined) {
      return wrapper;
    }

    const flag = this.flags.get(flagKey);
    if (flag) {
      wrapper = new BasicFlag(
        flagKey,
        flag,
        this._trackExposure,
        this.sendAutomaticExposure,
      );
    } else {
      wrapper = new MissingFlag(flagKey, this.sendAutomaticExposure);
    }

    this.flagWrapperCache.set(flagKey, wrapper);
    return wrapper;
  }

  clear() {
    this.flags.clear();
    this.flagWrapperCache.clear();
    this.trackedFlags.clear();
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
    const wrapper = this.getFlagWrapper(flagKey);
    return wrapper.getBooleanValue(options);
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
    const wrapper = this.getFlagWrapper(flagKey);
    return wrapper.getVariantValue(options);
  }

  getJSONValue(flagKey: string): object {
    const wrapper = this.getFlagWrapper(flagKey);
    return wrapper.getJSONValue();
  }

  getRawValue(
    flagKey: string,
    options: {
      default: FlagValue;
      shouldTrackExposureEvent?: boolean;
      exposureData?: CustomAttributes;
    },
  ): FlagValue {
    enforceAttributes(options, ['default'], 'getRawValue');
    const wrapper = this.getFlagWrapper(flagKey);
    return wrapper.getRawValue(options);
  }

  trackExposure = (
    flagKey: string,
    flag: FlagShape,
    exposureData: CustomAttributes = {},
  ) =>
    this._trackExposure(
      flagKey,
      flag,
      ExposureTriggerReason.Manual,
      exposureData,
    );

  private _trackExposure = (
    flagKey: string,
    flag: FlagShape,
    exposureTriggerReason: ExposureTriggerReason,
    exposureData: CustomAttributes = {},
  ) => {
    if (
      this.trackedFlags.has(flagKey) ||
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
      tags: [exposureTriggerReason, 'measurement'],
      highPriority: true,
      source: '@atlaskit/feature-flag-client',
    };

    this.analyticsHandler(exposureEvent);

    this.trackedFlags.add(flagKey);
  };

  private sendAutomaticExposure = (
    flagKey: string,
    value: string | boolean | object,
    flagExplanation?: FlagShape['explanation'],
  ) => {
    if (
      this.automaticExposuresCache.has(flagKey) ||
      !flagExplanation ||
      !this.isAutomaticExposuresEnabled ||
      this.trackedFlags.has(flagKey) ||
      !this.automaticAnalyticsHandler
    ) {
      return;
    }

    const flagAttributes: ReservedAttributes = {
      flagKey,
      value,
      reason: 'SIMPLE_EVAL',
    };

    flagAttributes.reason = flagExplanation.kind;
    flagAttributes.ruleId = flagExplanation.ruleId;
    flagAttributes.errorKind = flagExplanation.errorKind;

    const exposureEvent: ExposureEvent = {
      action: 'exposed',
      actionSubject: 'feature',
      attributes: flagAttributes as ExposureEventAttributes,
      tags: [ExposureTriggerReason.AutoExposure, 'measurement'],
      highPriority: false,
      source: '@atlaskit/feature-flag-client',
    };

    this.automaticAnalyticsHandler.sendOperationalEvent(exposureEvent);

    this.automaticExposuresCache.add(flagKey);
  };

  getFlagStats(): FlagStats {
    const flagStats: FlagStats = {};
    for (const [flagKey, wrapper] of this.flagWrapperCache) {
      const { evaluationCount } = wrapper;
      flagStats[flagKey] = {
        evaluationCount,
      };
    }
    return flagStats;
  }
}
