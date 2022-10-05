import {
  AnalyticsHandler,
  ClientOptions,
  CustomAttributes,
  ExposureEvent,
  ExposureEventAttributes,
  ExposureTriggerReason,
  Flags,
  FlagShape,
  FlagStats,
  FlagValue,
  FlagWrapper,
  ReservedAttributes,
  TrackFeatureFlagOptions,
} from './types';

import {
  checkForReservedAttributes,
  enforceAttributes,
  isObject,
  isObjectEmptyOrUndefined,
  validateFlags,
} from './lib';

import MissingFlag from './missing-flag';
import BasicFlag from './basic-flag';

export default class FeatureFlagClient {
  private readonly flags: Map<String, FlagShape>;
  private readonly flagWrapperCache: Map<string, FlagWrapper>;

  private analyticsHandler?: AnalyticsHandler;

  private isAutomaticExposuresEnabled: boolean;

  private readonly trackedFlags: Set<string>;
  private readonly customAttributesExposuresCache: Set<string>;
  private readonly ignoreTypes: boolean;

  constructor(options: ClientOptions) {
    enforceAttributes(options, ['analyticsHandler'], 'Feature Flag Client');
    const {
      flags,
      analyticsHandler,
      isAutomaticExposuresEnabled,
      ignoreTypes,
    } = options;

    this.flags = new Map();
    this.flagWrapperCache = new Map();
    this.customAttributesExposuresCache = new Set();
    this.trackedFlags = new Set();
    this.isAutomaticExposuresEnabled = isAutomaticExposuresEnabled || false;
    this.ignoreTypes = ignoreTypes || false;

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

  setAnalyticsHandler(analyticsHandler?: AnalyticsHandler) {
    this.analyticsHandler = analyticsHandler;
  }

  setIsAutomaticExposuresEnabled(isEnabled: boolean) {
    this.isAutomaticExposuresEnabled = isEnabled;
  }

  /**
   * This method returns the wrapper object for the given flag key.
   * If the flag does not exist, this will return a stubbed flag following the null-object pattern,
   * so it is always guaranteed to return an object.
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
        this.ignoreTypes,
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
    exposureData?: CustomAttributes,
  ) {
    if (
      !(flag && flag.explanation && this.shouldSendEvent(flagKey, exposureData))
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

    this.sendExposureEvent(flagAttributes, exposureTriggerReason, exposureData);
  }

  private shouldSendEvent(
    flagKey: string,
    customAttributes?: CustomAttributes,
  ): boolean {
    return (
      this.analyticsHandler !== undefined &&
      (!this.trackedFlags.has(flagKey) ||
        (!isObjectEmptyOrUndefined(customAttributes) &&
          !this.customAttributesExposuresCache.has(flagKey)))
    );
  }

  private sendAutomaticExposure(
    flagKey: string,
    value: unknown,
    flagExplanation?: FlagShape['explanation'],
  ) {
    if (
      !(
        flagExplanation &&
        this.isAutomaticExposuresEnabled &&
        this.shouldSendEvent(flagKey)
      )
    ) {
      return;
    }

    const flagAttributes: ReservedAttributes = {
      flagKey,
      value,
      reason: flagExplanation.kind || 'SIMPLE_EVAL', // In theory this shouldnt be necessary
      ruleId: flagExplanation.ruleId,
      errorKind: flagExplanation.errorKind,
    };

    this.sendExposureEvent(flagAttributes, ExposureTriggerReason.AutoExposure);
  }

  private sendExposureEvent(
    attributes: ReservedAttributes,
    exposureTriggerReason: ExposureTriggerReason,
    customAttributes?: CustomAttributes,
  ) {
    if (!this.trackedFlags.has(attributes.flagKey)) {
      const exposureEvent: ExposureEvent = {
        action: 'exposed',
        actionSubject: 'feature',
        attributes: attributes as ExposureEventAttributes,
        tags: ['measurement', exposureTriggerReason],
        highPriority: false,
        source: '@atlaskit/feature-flag-client',
      };
      this.analyticsHandler?.sendOperationalEvent(exposureEvent);
      this.trackedFlags.add(attributes.flagKey);
    }

    // Due to the way we've simplified our pipeline, custom attributes are dropped from exposure
    // events. In order not to break existing users of this feature immediately, we're sending an
    // extra event that won't be consumed by our pipeline, but will end up in the `cloud.*` tables.
    // See: https://hello.atlassian.net/wiki/spaces/MEASURE/pages/1838596497/AtlasKit+TAC
    if (!isObjectEmptyOrUndefined(customAttributes)) {
      const customeAttributesExposureEvent: ExposureEvent = {
        action: 'exposed',
        actionSubject: 'feature',
        attributes: Object.assign({}, attributes, customAttributes),
        tags: [
          'measurement',
          ExposureTriggerReason.hasCustomAttributes,
          exposureTriggerReason,
        ],
        highPriority: true,
        source: '@atlaskit/feature-flag-client',
      };
      this.analyticsHandler?.sendOperationalEvent(
        customeAttributesExposureEvent,
      );
      this.customAttributesExposuresCache.add(attributes.flagKey);
    }
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
