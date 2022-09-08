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
  TrackFeatureFlagOptions,
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
  flags: Map<String, FlagShape>;
  flagWrapperCache: Map<string, FlagWrapper>;
  trackedFlags: Set<string>;
  analyticsHandler?: AnalyticsHandler;
  automaticAnalyticsHandler?: AutomaticAnalyticsHandler;
  isAutomaticExposuresEnabled: boolean;
  automaticExposuresCache: Set<string>;

  constructor(options: {
    flags?: Flags;
    analyticsHandler: (event: ExposureEvent) => void;
  }) {
    const { flags, analyticsHandler } = options;

    enforceAttributes(options, ['analyticsHandler'], 'Feature Flag Client');

    this.flags = new Map();
    this.flagWrapperCache = new Map();
    this.automaticExposuresCache = new Set();
    this.trackedFlags = new Set();
    this.isAutomaticExposuresEnabled = false;

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
        this._trackExposure.bind(this),
        this.sendAutomaticExposure.bind(this),
      );
    } else {
      wrapper = new MissingFlag(flagKey, this.sendAutomaticExposure.bind(this));
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

  /**
   * This method combines both the trackExposure and sendAutomaticExposure flows into
   * one endpoint. Depending on the passed in trigger reason a manual or automatic exposure
   * is sent.
   **/
  trackFeatureFlag(flagKey: string, options: TrackFeatureFlagOptions = {}) {
    const triggerReason = options?.triggerReason
      ? options.triggerReason
      : ExposureTriggerReason.Manual;

    const isValueSet = this.flags.has(flagKey) || 'value' in options;

    if (!isValueSet) {
      // eslint-disable-next-line no-console
      console.warn(
        `No value associated with the flagKey: ${flagKey} with an exposure trigger reason of: ${triggerReason}`,
      );
      return;
    }

    // if no values for flagValue and explanation supplied then retrieve them from the flags map
    const flagValue =
      'value' in options ? options.value : this.flags.get(flagKey)?.value;

    const flagExplanation = options?.explanation
      ? options.explanation
      : this.flags.get(flagKey)?.explanation;

    if (triggerReason === ExposureTriggerReason.AutoExposure) {
      this.sendAutomaticExposure(flagKey, flagValue, flagExplanation);
    } else {
      // default to fire a manual track exposure
      this._trackExposure(
        flagKey,
        { value: flagValue, explanation: flagExplanation },
        triggerReason,
      );
    }
  }

  trackExposure(
    flagKey: string,
    flag: FlagShape,
    exposureData: CustomAttributes = {},
  ) {
    return this._trackExposure(
      flagKey,
      flag,
      ExposureTriggerReason.Manual,
      exposureData,
    );
  }

  private _trackExposure(
    flagKey: string,
    flag: Omit<FlagShape, 'value'> & { value: unknown },
    exposureTriggerReason: ExposureTriggerReason,
    exposureData: CustomAttributes = {},
  ) {
    if (
      this.trackedFlags.has(flagKey) ||
      !flag ||
      !flag.explanation ||
      !this.analyticsHandler
    ) {
      return;
    }

    const hasCustomAttributes = Object.keys(exposureData).length > 0;
    checkForReservedAttributes(exposureData);

    const flagAttributes: ReservedAttributes = {
      flagKey,
      reason: flag.explanation.kind,
      ruleId: flag.explanation.ruleId,
      value: flag.value,
    };

    const action = 'exposed';
    const actionSubject = 'feature';
    const highPriority = true;
    const source = '@atlaskit/feature-flag-client';

    this.analyticsHandler({
      action,
      actionSubject,
      attributes: flagAttributes as ExposureEventAttributes,
      tags: [exposureTriggerReason, 'measurement'],
      highPriority,
      source,
    });

    // Due to the way we've simplified our pipeline, custom attributes are dropped from exposure
    // events. In order not to break existing users of this feature immediately, we're sending an
    // extra event that won't be consumed by our pipeline, but will end up in the `cloud.*` tables.
    // See: https://hello.atlassian.net/wiki/spaces/MEASURE/pages/1838596497/AtlasKit+TAC
    if (hasCustomAttributes) {
      this.analyticsHandler({
        action,
        actionSubject,
        attributes: Object.assign({}, flagAttributes, exposureData),
        tags: [
          'measurement',
          exposureTriggerReason === ExposureTriggerReason.AutoExposure
            ? ExposureTriggerReason.Manual
            : exposureTriggerReason,
          ExposureTriggerReason.hasCustomAttributes,
        ],
        highPriority,
        source,
      });
    }

    this.trackedFlags.add(flagKey);
  }

  private sendAutomaticExposure(
    flagKey: string,
    value: unknown,
    flagExplanation?: FlagShape['explanation'],
  ) {
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
  }

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
