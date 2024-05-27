import Statsig, {
  DynamicConfig,
  EvaluationReason,
  type LocalOverrides,
  type StatsigOptions,
  type StatsigUser,
} from 'statsig-js-lite';

import Fetcher, { type FetcherOptions } from './fetcher';
import {
  type CheckGateOptions,
  type ClientOptions,
  type CustomAttributes,
  FeatureGateEnvironment,
  type FromValuesClientOptions,
  type GetExperimentOptions,
  type GetExperimentValueOptions,
  type Identifiers,
  type InitializeValues,
  PerimeterType,
  type UpdateUserCompletionCallback,
} from './types';
import { CLIENT_VERSION } from './version';

export type { EvaluationDetails, LocalOverrides } from 'statsig-js-lite';
export { DynamicConfig, EvaluationReason } from 'statsig-js-lite';

export type {
  AnalyticsWebClient,
  ClientOptions,
  CustomAttributes,
  FromValuesClientOptions,
  GetExperimentOptions,
  GetExperimentValueOptions,
  Identifiers,
  InitializeValues,
  UpdateUserCompletionCallback,
} from './types';
export { FeatureGateEnvironment, PerimeterType } from './types';

declare global {
  interface Window {
    __FEATUREGATES_JS__: FeatureGates;
  }
}

type StatsigUpdateUserCompletionCallback = NonNullable<
  StatsigOptions['updateUserCompletionCallback']
>;

const DEFAULT_CLIENT_KEY = 'client-default-key';
// the default event logging api is the Atlassian proxy rather than Statsig's domain, to avoid ad blockers
const DEFAULT_EVENT_LOGGING_API = 'https://xp.atlassian.com/v1/';

/**
 * Access the FeatureGates object via the default export.
 * ```ts
 * import FeatureGates from '@atlaskit/feature-gate-js-client';
 * ```
 */
class FeatureGates {
  private static initOptions: ClientOptions | FromValuesClientOptions;
  private static initPromise: Promise<void> | null = null;
  private static initCompleted: boolean = false;
  private static currentIdentifiers: Identifiers;
  private static currentAttributes?: CustomAttributes;
  private static hasGetExperimentErrorOccurred = false;
  private static hasGetExperimentValueErrorOccurred = false;
  private static hasCheckGateErrorOccurred = false;

  /**
   * @description
   * This method initializes the client using a network call to fetch the bootstrap values.
   * If the client is inialized with an `analyticsWebClient`, it will send an operational event
   * to GASv3 with the following attributes:
   * - targetApp: the target app of the client
   * - clientVersion: the version of the client
   * - success: whether the initialization was successful
   * - startTime: the time when the initialization started
   * - totalTime: the total time it took to initialize the client
   * - apiKey: the api key used to initialize the client
   * @param clientOptions {ClientOptions}
   * @param identifiers {Identifiers}
   * @param customAttributes {CustomAttributes}
   * @returns {Promise<void>}
   */
  static async initialize(
    clientOptions: ClientOptions,
    identifiers: Identifiers,
    customAttributes?: CustomAttributes,
  ): Promise<void> {
    if (FeatureGates.initPromise) {
      if (
        !FeatureGates.shallowEquals(clientOptions, FeatureGates.initOptions)
      ) {
        // eslint-disable-next-line no-console
        console.warn(
          'Feature Gates client already initialized with different options. New options were not applied.',
        );
      }
      return FeatureGates.initPromise;
    }
    const startTime = performance.now();
    FeatureGates.initOptions = clientOptions;
    FeatureGates.initPromise = FeatureGates.init(
      clientOptions,
      identifiers,
      customAttributes,
    )
      .then(() => {
        FeatureGates.initCompleted = true;
      })
      .finally(() => {
        const endTime = performance.now();
        const totalTime = endTime - startTime;
        FeatureGates.fireClientEvent(
          startTime,
          totalTime,
          'initialize',
          FeatureGates.initCompleted,
          clientOptions.apiKey,
        );
      });
    return FeatureGates.initPromise;
  }

  private static fireClientEvent(
    startTime: number,
    totalTime: number,
    action: string,
    success: boolean,
    apiKey: string | undefined = undefined,
  ) {
    FeatureGates.initOptions.analyticsWebClient
      ?.then(analyticsWebClient => {
        const attributes = {
          targetApp: FeatureGates.initOptions.targetApp,
          clientVersion: CLIENT_VERSION,
          success,
          startTime,
          totalTime,
          ...(apiKey && { apiKey }),
        };
        analyticsWebClient.sendOperationalEvent({
          action,
          actionSubject: 'featureGatesClient',
          attributes,
          tags: ['measurement'],
          source: '@atlaskit/feature-gate-js-client',
        });
      })
      .catch(err => {
        if (
          FeatureGates.initOptions.environment !==
          FeatureGateEnvironment.Production
        ) {
          // eslint-disable-next-line no-console
          console.error('Analytics web client promise did not resolve', err);
        }
      });
  }

  static async initializeFromValues(
    clientOptions: FromValuesClientOptions,
    identifiers: Identifiers,
    customAttributes?: CustomAttributes,
    initializeValues: Record<string, unknown> = {},
  ): Promise<void> {
    if (FeatureGates.initPromise) {
      if (
        !FeatureGates.shallowEquals(clientOptions, FeatureGates.initOptions)
      ) {
        // eslint-disable-next-line no-console
        console.warn(
          'Feature Gates client already initialized with different options. New options were not applied.',
        );
      }
      return FeatureGates.initPromise;
    }
    const startTime = performance.now();
    FeatureGates.initOptions = clientOptions;
    FeatureGates.initPromise = FeatureGates.initFromValues(
      clientOptions,
      identifiers,
      customAttributes,
      initializeValues,
    )
      .then(() => {
        FeatureGates.initCompleted = true;
      })
      .finally(() => {
        const endTime = performance.now();
        const totalTime = endTime - startTime;
        FeatureGates.fireClientEvent(
          startTime,
          totalTime,
          'initializeFromValues',
          FeatureGates.initCompleted,
        );
      });
    return FeatureGates.initPromise;
  }

  /**
   * This method updates the user using a network call to fetch the new set of values.
   * @param fetchOptions {FetcherOptions}
   * @param identifiers {Identifiers}
   * @param customAttributes {CustomAttributes}
   */
  static async updateUser(
    fetchOptions: FetcherOptions,
    identifiers: Identifiers,
    customAttributes?: CustomAttributes,
  ): Promise<void> {
    const initializeValuesProducer = () =>
      Fetcher.fetchExperimentValues(
        fetchOptions,
        identifiers,
        customAttributes,
      ).then(({ experimentValues, customAttributes }) => ({
        experimentValues,
        customAttributesFromFetch: customAttributes,
      }));
    await FeatureGates.updateUserUsingInitializeValuesProducer(
      initializeValuesProducer,
      identifiers,
      customAttributes,
    );
  }

  /**
   * This method updates the user given a new set of bootstrap values obtained from one of the server-side SDKs.
   *
   * @param identifiers {Identifiers}
   * @param customAttributes {CustomAttributes}
   * @param initializeValues {Record<string,unknown>}
   */
  static async updateUserWithValues(
    identifiers: Identifiers,
    customAttributes?: CustomAttributes,
    initializeValues: Record<string, unknown> = {},
  ): Promise<void> {
    const initializeValuesProducer = () =>
      Promise.resolve({
        experimentValues: initializeValues,
        customAttributesFromFetch: customAttributes,
      });
    await FeatureGates.updateUserUsingInitializeValuesProducer(
      initializeValuesProducer,
      identifiers,
      customAttributes,
    );
  }

  static initializeCalled(): boolean {
    return FeatureGates.initPromise != null;
  }

  static initializeCompleted(): boolean {
    return FeatureGates.initCompleted;
  }

  /**
   * Returns the value for a feature gate. Returns false if there are errors.
   * @param {string} gateName - The name of the feature gate.
   * @param {Object} options
   * @param {boolean} options.fireGateExposure
   *        Whether or not to fire the exposure event for the gate. Defaults to true.
   *        To log an exposure event manually at a later time, use {@link FeatureGates.manuallyLogGateExposure}
   *        (see [Statsig docs about manually logging exposures](https://docs.statsig.com/client/jsClientSDK#manual-exposures-)).
   */
  static checkGate(gateName: string, options: CheckGateOptions = {}): boolean {
    try {
      const { fireGateExposure = true } = options;
      const evalMethod = fireGateExposure
        ? Statsig.checkGate.bind(Statsig)
        : Statsig.checkGateWithExposureLoggingDisabled.bind(Statsig);
      return evalMethod(gateName);
    } catch (error: unknown) {
      // Log the first occurrence of the error
      if (!FeatureGates.hasCheckGateErrorOccurred) {
        // eslint-disable-next-line no-console
        console.warn({
          msg: 'An error has occurred checking the feature gate. Only the first occurrence of this error is logged.',
          gateName,
          error,
        });
        FeatureGates.hasCheckGateErrorOccurred = true;
      }

      return false;
    }
  }

  /**
   * Manually log a gate exposure (see [Statsig docs about manually logging exposures](https://docs.statsig.com/client/jsClientSDK#manual-exposures-)).
   * This is useful if you have evaluated a gate earlier via {@link FeatureGates.checkGate} where <code>options.fireGateExposure</code> is false.
   * @param gateName
   */
  static manuallyLogGateExposure(gateName: string): void {
    Statsig.manuallyLogGateExposure(gateName);
  }

  /**
   * Returns the entire config for a given experiment.
   *
   * @param {string} experimentName - The name of the experiment
   * @param {Object} options
   * @param {boolean} options.fireExperimentExposure - Whether or not to fire the exposure event for the experiment. Defaults to true. To log an exposure event manually at a later time, use {@link FeatureGates.manuallyLogExperimentExposure} (see [Statsig docs about manually logging exposures](https://docs.statsig.com/client/jsClientSDK#manual-exposures-)).
   * @returns The config for an experiment
   * @example
   * ```ts
   * const experimentConfig = FeatureGates.getExperiment('example-experiment-name');
   * const backgroundColor: string = experimentConfig.get('backgroundColor', 'yellow');
   * ```
   */
  static getExperiment(
    experimentName: string,
    options: GetExperimentOptions = {},
  ): DynamicConfig {
    try {
      const { fireExperimentExposure = true } = options;
      const evalMethod = fireExperimentExposure
        ? Statsig.getExperiment.bind(Statsig)
        : Statsig.getExperimentWithExposureLoggingDisabled.bind(Statsig);
      return evalMethod(experimentName);
    } catch (error: unknown) {
      // Log the first occurrence of the error
      if (!FeatureGates.hasGetExperimentErrorOccurred) {
        // eslint-disable-next-line no-console
        console.warn({
          msg: 'An error has occurred getting the experiment. Only the first occurrence of this error is logged.',
          experimentName,
          error,
        });
        FeatureGates.hasGetExperimentErrorOccurred = true;
      }

      // Return a default value
      return new DynamicConfig(experimentName, {}, '', {
        time: Date.now(),
        reason: EvaluationReason.Error,
      });
    }
  }

  /**
   * Returns the value of a given parameter in an experiment config.
   *
   * @template T
   * @param {string} experimentName - The name of the experiment
   * @param {string} parameterName - The name of the parameter to fetch from the experiment config
   * @param {T} defaultValue - The value to serve if the experiment or parameter do not exist, or if the returned value does not match the expected type.
   * @param {Object} options
   * @param {boolean} options.fireExperimentExposure - Whether or not to fire the exposure event for the experiment. Defaults to true. To log an exposure event manually at a later time, use {@link FeatureGates.manuallyLogExperimentExposure} (see [Statsig docs about manually logging exposures](https://docs.statsig.com/client/jsClientSDK#manual-exposures-))
   * @param {function} options.typeGuard - A function that asserts that the return value has the expected type. If this function returns false, then the default value will be returned instead. This can be set to protect your code from unexpected values being set remotely. By default, this will be done by asserting that the default value and value are the same primitive type.
   * @returns The value of the parameter if the experiment and parameter both exist, otherwise the default value.
   * @example
   ``` ts
   type ValidColor = 'blue' | 'red' | 'yellow';
   type ValidColorTypeCheck = (value: unknown) => value is ValidColor;

   const isValidColor: ValidColorTypeCheck =
      (value: unknown) => typeof value === 'string' && ['blue', 'red', 'yellow'].includes(value);

   const buttonColor: ValidColor = FeatureGates.getExperimentValue(
      'example-experiment-name',
      'backgroundColor',
      'yellow',
      {
          typeGuard: isValidColor
      }
   );
   ```
  */
  static getExperimentValue<T>(
    experimentName: string,
    parameterName: string,
    defaultValue: T,
    options: GetExperimentValueOptions<T> = {},
  ): T {
    const experiment = FeatureGates.getExperiment(experimentName, options);

    try {
      const { typeGuard } = options;
      return experiment.get(parameterName, defaultValue, typeGuard);
    } catch (error: unknown) {
      // Log the first occurrence of the error
      if (!FeatureGates.hasGetExperimentValueErrorOccurred) {
        // eslint-disable-next-line no-console
        console.warn({
          msg: 'An error has occurred getting the experiment value. Only the first occurrence of this error is logged.',
          experimentName,
          defaultValue,
          options,
          error,
        });
        FeatureGates.hasGetExperimentValueErrorOccurred = true;
      }

      return defaultValue;
    }
  }

  /**
   * Manually log an experiment exposure (see [Statsig docs about manually logging exposures](https://docs.statsig.com/client/jsClientSDK#manual-exposures-)).
   * This is useful if you have evaluated an experiment earlier via {@link FeatureGates.getExperimentValue} or
   * {@link FeatureGates.getExperiment} where <code>options.fireExperimentExposure</code> is false.
   * @param experimentName
   */
  static manuallyLogExperimentExposure(experimentName: string): void {
    Statsig.manuallyLogExperimentExposure(experimentName);
  }

  static shutdownStatsig(): void {
    Statsig.shutdown();
  }

  /**
   * Adds a new override for the given gate.
   *
   * This method is additive, meaning you can call it multiple times with different gate names to build
   * your full set of overrides.
   *
   * Overrides are persisted to the `STATSIG_JS_LITE_LOCAL_OVERRIDES` key in localStorage, so they will
   * continue to affect every client that is initialized on the same domain after this method is called.
   * If you are using this API for testing purposes, you should call ${@link FeatureGates.clearGateOverride} after
   * your tests are completed to remove this localStorage entry.
   *
   * @param {string} gateName
   * @param {boolean} value
   */
  static overrideGate(gateName: string, value: boolean): void {
    Statsig.overrideGate(gateName, value);
  }

  /**
   * Removes any overrides that have been set for the given gate.
   * @param {string} gateName
   */
  static clearGateOverride(gateName: string): void {
    Statsig.overrideGate(gateName, null);
  }

  /**
   * Adds a new override for the given config (or experiment).
   *
   * This method is additive, meaning you can call it multiple times with different experiment names to build
   * your full set of overrides.
   *
   * Overrides are persisted to the `STATSIG_JS_LITE_LOCAL_OVERRIDES` key in localStorage, so they will
   * continue to affect every client that is initialized on the same domain after this method is called.
   * If you are using this API for testing purposes, you should call ${@link FeatureGates.clearConfigOverride} after
   * your tests are completed to remove this localStorage entry.
   *
   * @param {string} experimentName
   * @param {object} values
   */
  static overrideConfig(
    experimentName: string,
    values: Record<string, unknown>,
  ): void {
    Statsig.overrideConfig(experimentName, values);
  }

  /**
   * Removes any overrides that have been set for the given experiment.
   * @param {string} experimentName
   */
  static clearConfigOverride(experimentName: string): void {
    Statsig.overrideConfig(experimentName, null);
  }

  /**
   * Set overrides for gates, experiments and layers in batch.
   *
   * Note that these overrides are **not** additive and will completely replace any that have been added
   * via prior calls to {@link FeatureGates.overrideConfig} or {@link FeatureGates.overrideGate}.
   *
   * Overrides are persisted to the `STATSIG_JS_LITE_LOCAL_OVERRIDES` key in localStorage, so they will
   * continue to affect every client that is initialized on the same domain after this method is called.
   * If you are using this API for testing purposes, you should call ${@link FeatureGates.clearAllOverrides} after
   * your tests are completed to remove this localStorage entry.
   *
   * @param {object} overrides
   */
  static setOverrides(overrides: Partial<LocalOverrides>): void {
    Statsig.setOverrides({
      gates: {},
      configs: {},
      layers: {},
      ...overrides,
    });
  }

  /**
   * @returns The current overrides for gates, configs (including experiments) and layers.
   */
  static getOverrides(): LocalOverrides {
    return Statsig.getOverrides();
  }

  /**
   * Clears overrides for all gates, configs (including experiments) and layers.
   */
  static clearAllOverrides(): void {
    Statsig.setOverrides(null);
  }

  /**
   * Returns whether the given identifiers and customAttributes align with the current
   * set that is being used by the client.
   *
   * If this method returns false, then the {@link FeatureGates.updateUser} or {@link FeatureGates.updateUserWithValues}
   * methods can be used to re-align these values.
   *
   * @param identifiers
   * @param customAttributes
   * @returns a flag indicating whether the clients current configuration aligns with the given values
   */
  static isCurrentUser(
    identifiers: Identifiers,
    customAttributes?: CustomAttributes,
  ): boolean {
    return (
      FeatureGates.shallowEquals(
        FeatureGates.currentIdentifiers,
        identifiers,
      ) &&
      FeatureGates.shallowEquals(
        FeatureGates.currentAttributes,
        customAttributes,
      )
    );
  }

  /**
   * This method initializes the client using a network call to fetch the bootstrap values for the given user.
   *
   * @param clientOptions
   * @param identifiers
   * @param customAttributes
   * @private
   */
  private static async init(
    clientOptions: ClientOptions,
    identifiers: Identifiers,
    customAttributes: CustomAttributes | undefined,
  ) {
    const fromValuesClientOptions: FromValuesClientOptions = {
      ...clientOptions,
      disableCurrentPageLogging: true,
    };

    let experimentValues: Record<string, unknown> | undefined;
    let customAttributesFromResult: CustomAttributes | undefined;

    try {
      // If client sdk key fetch fails, an error would be thrown and handled instead of waiting for the experiment
      // values request to be settled, and it will fall back to use default values.
      const clientSdkKeyPromise = Fetcher.fetchClientSdk(clientOptions).then(
        value => (fromValuesClientOptions.sdkKey = value.clientSdkKey),
      );

      const experimentValuesPromise = Fetcher.fetchExperimentValues(
        clientOptions,
        identifiers,
        customAttributes,
      );

      // Only wait for the experiment values request to finish and try to initialise the client with experiment
      // values if both requests are successful. Else an error would be thrown and handled by the catch
      const [, experimentValuesResult] = await Promise.all([
        clientSdkKeyPromise,
        experimentValuesPromise,
      ]);

      experimentValues = experimentValuesResult.experimentValues;
      customAttributesFromResult = experimentValuesResult.customAttributes;
    } catch (error: unknown) {
      if (error instanceof Error) {
        // eslint-disable-next-line no-console
        console.error(
          `Error occurred when trying to fetch the Feature Gates client values, error: ${error?.message}`,
        );
      }
      // eslint-disable-next-line no-console
      console.warn(`Initialising Statsig client without values`);
      await FeatureGates.initFromValues(
        fromValuesClientOptions,
        identifiers,
        customAttributes,
      );
      throw error;
    }

    await this.initFromValues(
      fromValuesClientOptions,
      identifiers,
      customAttributesFromResult,
      experimentValues,
    );
  }

  /**
   * This method initializes the client using a set of boostrap values obtained from one of the server-side SDKs.
   *
   * @param clientOptions
   * @param identifiers
   * @param customAttributes
   * @param initializeValues
   * @private
   */
  private static async initFromValues(
    clientOptions: FromValuesClientOptions,
    identifiers: Identifiers,
    customAttributes?: CustomAttributes | undefined,
    initializeValues: Record<string, unknown> = {},
  ) {
    const user = this.toStatsigUser(identifiers, customAttributes);
    FeatureGates.currentIdentifiers = identifiers;
    FeatureGates.currentAttributes = customAttributes;

    if (!clientOptions.sdkKey) {
      clientOptions.sdkKey = DEFAULT_CLIENT_KEY;
    }

    if (!clientOptions.eventLoggingApi) {
      clientOptions.eventLoggingApi = DEFAULT_EVENT_LOGGING_API;
    }

    if (clientOptions.perimeter === PerimeterType.FEDRAMP_MODERATE) {
      // disable all logging in FedRAMP to prevent egress of sensitive data
      clientOptions.disableAllLogging = true;
    }

    const { sdkKey } = clientOptions;
    const statsigOptions: StatsigOptions = this.toStatsigOptions(
      clientOptions,
      initializeValues,
    );

    try {
      await Statsig.initialize(sdkKey, user, statsigOptions);
    } catch (error: unknown) {
      if (error instanceof Error) {
        // eslint-disable-next-line no-console
        console.error(
          `Error occurred when trying to initialise the Statsig client, error: ${error?.message}`,
        );
      }
      // eslint-disable-next-line no-console
      console.warn(
        `Initialising Statsig client with default sdk key and without values`,
      );
      await Statsig.initialize(DEFAULT_CLIENT_KEY, user, {
        ...statsigOptions,
        initializeValues: {},
      });
      throw error;
    }
  }

  /**
   * This method creates an instance of StatsigUser from the given set of identifiers and attributes.
   *
   * @param identifiers
   * @param customAttributes
   * @private
   */
  private static toStatsigUser(
    identifiers: Identifiers,
    customAttributes?: CustomAttributes,
  ): StatsigUser {
    const user: StatsigUser = {
      customIDs: identifiers,
      custom: customAttributes,
    };

    if (identifiers.atlassianAccountId) {
      user.userID = identifiers.atlassianAccountId;
    }

    return user;
  }

  /**
   * This method updates the user for this client with the bootstrap values returned from a given Promise.
   * It uses the customAttributes from fetching experiment values to update the Statsig user but
   * uses the customAttributes from given input to check if the user has changed.
   *
   * @param {Identifiers} identifiers
   * @param {CustomAttributes} customAttributes
   * @param {Promise<InitializeValues>} getInitializeValues
   * @private
   */
  private static async updateUserUsingInitializeValuesProducer(
    getInitializeValues: () => Promise<InitializeValues>,
    identifiers: Identifiers,
    customAttributes?: CustomAttributes,
  ): Promise<void> {
    if (!FeatureGates.initPromise) {
      throw new Error(
        'The FeatureGates client must be initialized before you can update the user.',
      );
    }

    // If the user isn't changing at all, then exit immediately
    if (FeatureGates.isCurrentUser(identifiers, customAttributes)) {
      return FeatureGates.initPromise;
    }

    // Wait for the current initialize/update to finish
    const originalInitPromise = FeatureGates.initPromise;
    try {
      await FeatureGates.initPromise;
    } catch (err) {
      // Proceed with the user update even if the init failed, since this update
      // may put the client back into a valid state.
    }

    const initializeValuesPromise = getInitializeValues();
    const updateUserPromise: Promise<void> =
      FeatureGates.updateStatsigClientUser(
        initializeValuesPromise,
        identifiers,
        customAttributes,
      );

    // We replace the init promise here since we are essentially re-initializing the client at this point.
    // Any subsequent calls to await FeatureGates.initialize() or FeatureGates.updateUser() will now also await this user update.
    FeatureGates.initPromise = updateUserPromise.catch(() => {
      // If the update failed then it changed nothing, so revert back to the original promise.
      FeatureGates.initPromise = originalInitPromise;
    });

    return updateUserPromise;
  }

  /**
   * This method updates the user on the nested Statsig client
   *
   * @param identifiers
   * @param customAttributes
   * @param initializeValuesPromise
   * @private
   */
  private static async updateStatsigClientUser(
    initializeValuesPromise: Promise<InitializeValues>,
    identifiers: Identifiers,
    customAttributes?: CustomAttributes,
  ): Promise<void> {
    let initializeValues, user;
    try {
      initializeValues = await initializeValuesPromise;
      user = FeatureGates.toStatsigUser(
        identifiers,
        initializeValues.customAttributesFromFetch,
      );
    } catch (err) {
      // Make sure the updateUserCompletionCallback is called for any errors in our custom code.
      // This is not necessary for the updateUserWithValues call, because the Statsig client will already invoke the callback itself.
      const errMsg = err instanceof Error ? err.message : JSON.stringify(err);
      FeatureGates.initOptions.updateUserCompletionCallback?.(false, errMsg);
      throw err;
    }

    const success = Statsig.updateUserWithValues(
      user,
      initializeValues.experimentValues,
    );
    if (success) {
      FeatureGates.currentIdentifiers = identifiers;
      FeatureGates.currentAttributes = customAttributes;
    } else {
      throw new Error('Failed to update user. An unexpected error occured.');
    }
  }

  /**
   * This method transforms the options given by the user into the format accepted by the Statsig client.
   *
   * @param options
   * @param {Record<string, unknown>} initializeValues
   * @private
   */
  private static toStatsigOptions(
    options: FromValuesClientOptions,
    initializeValues: Record<string, unknown>,
  ): StatsigOptions {
    const {
      // De-structured to remove from restClientOptions
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sdkKey,
      // De-structured to remove from restClientOptions
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      updateUserCompletionCallback,
      // De-structured to remove from restClientOptions
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      perimeter,
      ...restClientOptions
    } = options;

    return {
      ...restClientOptions,
      initializeValues,
      environment: {
        tier: options.environment,
      },
      disableCurrentPageLogging: true,
      ...(options.updateUserCompletionCallback && {
        updateUserCompletionCallback:
          FeatureGates.toStatsigUpdateUserCompletionCallback(
            options.updateUserCompletionCallback,
          ),
      }),
    };
  }

  /**
   * This method transforms an UpdateUserCompletionCallback in our own format into the format accepted by the Statsig client.
   *
   * @param callback
   * @private
   */
  private static toStatsigUpdateUserCompletionCallback(
    callback: UpdateUserCompletionCallback,
  ): StatsigUpdateUserCompletionCallback {
    /**
     * The duration passed to the callback indicates how long the update took, but it is deceptive since it only times the
     * Statsig code and doesn't account for all of the extra custom work we do to obtain the bootstrap values.
     * As a result, we just suppress this parameter in our own callback rather than trying to keep it accurate.
     */
    return (_duration: number, success: boolean, message: string | null) => {
      callback(success, message);
    };
  }
  private static shallowEquals(objectA?: object, objectB?: object): boolean {
    if (!objectA && !objectB) {
      return true;
    }

    if (!objectA || !objectB) {
      return false;
    }

    const aEntries: [string, unknown][] = Object.entries(objectA);
    const bEntries: [string, unknown][] = Object.entries(objectB);
    if (aEntries.length !== bEntries.length) {
      return false;
    }

    const ascendingKeyOrder = (
      [key1]: [string, unknown],
      [key2]: [string, unknown],
    ) => key1.localeCompare(key2);
    aEntries.sort(ascendingKeyOrder);
    bEntries.sort(ascendingKeyOrder);

    for (let i = 0; i < aEntries.length; i++) {
      const [, aValue] = aEntries[i];
      const [, bValue] = bEntries[i];
      if (aValue !== bValue) {
        return false;
      }
    }

    return true;
  }

  /**
   * @returns string version of the current package in semver style.
   */
  static getPackageVersion() {
    return CLIENT_VERSION;
  }
}

let boundFGJS = FeatureGates;

// This makes it possible to get a reference to the FeatureGates client at runtime.
// This is important for overriding values in Cyprus tests, as there needs to be a
// way to get the exact instance for a window in order to mock some of its methods.
if (typeof window !== 'undefined') {
  if (window.__FEATUREGATES_JS__ === undefined) {
    window.__FEATUREGATES_JS__ = FeatureGates;
  } else {
    boundFGJS = window.__FEATUREGATES_JS__ as typeof FeatureGates;
    const boundVersion =
      boundFGJS?.getPackageVersion?.() || '4.10.0 or earlier';
    if (boundVersion !== CLIENT_VERSION) {
      const message = `Multiple versions of FeatureGateClients found on the current page.
      The currently bound version is ${boundVersion} when module version ${CLIENT_VERSION} was loading.`;
      // eslint-disable-next-line no-console
      console.warn(message);
    }
  }
}

/**
 * @property {FeatureGates} FeatureGate default export
 */
export default boundFGJS;
