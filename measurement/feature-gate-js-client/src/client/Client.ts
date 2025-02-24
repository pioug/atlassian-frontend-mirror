import {
	_makeExperiment,
	_makeLayer,
	StatsigClient,
	type StatsigOptions,
	type StatsigUser,
} from '@statsig/js-client';

import Subscriptions from '../subscriptions';

import { DynamicConfig } from './compat/DynamicConfig';
import { Layer } from './compat/Layer';
import { EvaluationReason } from './compat/types';
import Fetcher, { type FetcherOptions } from './fetcher';
import { NoFetchDataAdapter } from './NoFetchDataAdapter';
import {
	LOCAL_STORAGE_KEY,
	type LocalOverrides,
	PersistentOverrideAdapter,
} from './PersistentOverrideAdapter';
import {
	type BaseClientOptions,
	type CheckGateOptions,
	type ClientOptions,
	type CustomAttributes,
	FeatureGateEnvironment,
	type FromValuesClientOptions,
	type FrontendExperimentsResult,
	type GetExperimentOptions,
	type GetExperimentValueOptions,
	type GetLayerOptions,
	type GetLayerValueOptions,
	type Identifiers,
	type InitializeValues,
	type OptionsWithDefaults,
	PerimeterType,
	type Provider,
} from './types';
import {
	getOptionsWithDefaults,
	migrateInitializationOptions,
	shallowEquals,
	toStatsigUser,
} from './utils';
import { CLIENT_VERSION } from './version';

const DEFAULT_CLIENT_KEY = 'client-default-key';
// default event logging api is Atlassian proxy rather than Statsig's domain, to avoid ad blockers
const DEFAULT_EVENT_LOGGING_API = 'https://xp.atlassian.com/v1/rgstr';

export class Client {
	private statsigClient?: StatsigClient;
	private user?: StatsigUser;
	private initOptions?: OptionsWithDefaults<
		BaseClientOptions | ClientOptions | FromValuesClientOptions
	>;
	private sdkKey?: string;
	private initPromise: Promise<void> | null = null;
	/** True if an initialize method was called and completed successfully. */
	private initCompleted = false;
	/**
	 * True if an initialize method was called and completed, meaning the client is now usable.
	 * However if there was an error during initialization it may have initialized with default
	 * values. Use {@link initCompleted} to check for this.
	 */
	private initWithDefaults = false;
	private currentIdentifiers?: Identifiers;
	private currentAttributes?: CustomAttributes;
	private hasCheckGateErrorOccurred = false;
	private hasGetExperimentErrorOccurred = false;
	private hasGetExperimentValueErrorOccurred = false;
	private hasGetLayerErrorOccurred = false;
	private hasGetLayerValueErrorOccurred = false;

	private provider?: Provider;
	private subscriptions = new Subscriptions();
	private dataAdapter = new NoFetchDataAdapter();
	private overrideAdapter: PersistentOverrideAdapter;

	constructor({ localStorageKey = LOCAL_STORAGE_KEY }: { localStorageKey?: string } = {}) {
		this.overrideAdapter = new PersistentOverrideAdapter(localStorageKey);
	}

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
	async initialize(
		clientOptions: ClientOptions,
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
	): Promise<void> {
		const clientOptionsWithDefaults = getOptionsWithDefaults(clientOptions);
		if (this.initPromise) {
			if (!shallowEquals(clientOptionsWithDefaults, this.initOptions)) {
				// eslint-disable-next-line no-console
				console.warn(
					'Feature Gates client already initialized with different options. New options were not applied.',
				);
			}
			return this.initPromise;
		}
		const startTime = performance.now();
		this.initOptions = clientOptionsWithDefaults;
		this.initPromise = this.init(clientOptionsWithDefaults, identifiers, customAttributes)
			.then(() => {
				this.initCompleted = true;
				this.initWithDefaults = true;
			})
			.finally(() => {
				const endTime = performance.now();
				const totalTime = endTime - startTime;
				this.fireClientEvent(
					startTime,
					totalTime,
					'initialize',
					this.initCompleted,
					clientOptionsWithDefaults.apiKey,
				);
			});
		return this.initPromise;
	}

	/**
	 * @description
	 * This method initializes the client using the provider given to call to fetch the bootstrap values.
	 * If the client is initialized with an `analyticsWebClient`, it will send an operational event
	 * to GASv3 with the following attributes:
	 * - targetApp: the target app of the client
	 * - clientVersion: the version of the client
	 * - success: whether the initialization was successful
	 * - startTime: the time when the initialization started
	 * - totalTime: the total time it took to initialize the client
	 * - apiKey: the api key used to initialize the client
	 * @param clientOptions {ClientOptions}
	 * @param provider {Provider}
	 * @param identifiers {Identifiers}
	 * @param customAttributes {CustomAttributes}
	 * @returns {Promise<void>}
	 */
	async initializeWithProvider(
		clientOptions: BaseClientOptions,
		provider: Provider,
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
	): Promise<void> {
		const clientOptionsWithDefaults = getOptionsWithDefaults(clientOptions);
		if (this.initPromise) {
			if (!shallowEquals(clientOptionsWithDefaults, this.initOptions)) {
				// eslint-disable-next-line no-console
				console.warn(
					'Feature Gates client already initialized with different options. New options were not applied.',
				);
			}
			return this.initPromise;
		}
		const startTime = performance.now();
		this.initOptions = clientOptionsWithDefaults;
		this.provider = provider;
		this.provider.setClientVersion(CLIENT_VERSION);
		if (this.provider.setApplyUpdateCallback) {
			this.provider.setApplyUpdateCallback(this.applyUpdateCallback.bind(this));
		}

		this.initPromise = this.initWithProvider(
			clientOptionsWithDefaults,
			provider,
			identifiers,
			customAttributes,
		)
			.then(() => {
				this.initCompleted = true;
				this.initWithDefaults = true;
			})
			.finally(() => {
				const endTime = performance.now();
				const totalTime = endTime - startTime;
				this.fireClientEvent(
					startTime,
					totalTime,
					'initializeWithProvider',
					this.initCompleted,
					provider.getApiKey ? provider.getApiKey() : undefined,
				);
			});
		return this.initPromise;
	}

	private applyUpdateCallback(experimentsResult: FrontendExperimentsResult): void {
		try {
			if (this.initCompleted || this.initWithDefaults) {
				this.assertInitialized(this.statsigClient);
				this.dataAdapter.setBootstrapData(experimentsResult.experimentValues);
				this.dataAdapter.setData(JSON.stringify(experimentsResult.experimentValues));
				this.statsigValuesUpdated();
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.warn('Error when attempting to apply update', error);
		}
	}

	private fireClientEvent(
		startTime: number,
		totalTime: number,
		action: string,
		success: boolean,
		apiKey: string | undefined = undefined,
	) {
		this.initOptions!.analyticsWebClient?.then((analyticsWebClient) => {
			const attributes = {
				targetApp: this.initOptions!.targetApp,
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
		}).catch((err) => {
			if (this.initOptions!.environment !== FeatureGateEnvironment.Production) {
				// eslint-disable-next-line no-console
				console.error('Analytics web client promise did not resolve', err);
			}
		});
	}

	async initializeFromValues(
		clientOptions: FromValuesClientOptions,
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
		initializeValues: Record<string, unknown> = {},
	): Promise<void> {
		const clientOptionsWithDefaults = getOptionsWithDefaults(clientOptions);
		if (this.initPromise) {
			if (!shallowEquals(clientOptionsWithDefaults, this.initOptions)) {
				// eslint-disable-next-line no-console
				console.warn(
					'Feature Gates client already initialized with different options. New options were not applied.',
				);
			}
			return this.initPromise;
		}

		// This makes sure the new Statsig client behaves like the old when bootstrap data is
		// passed, and `has_updates` isn't specified (which happens a lot in product integration tests).
		if (!Object.prototype.hasOwnProperty.call(initializeValues, 'has_updates')) {
			initializeValues['has_updates'] = true;
		}

		const startTime = performance.now();
		this.initOptions = clientOptionsWithDefaults;
		this.initPromise = this.initFromValues(
			clientOptionsWithDefaults,
			identifiers,
			customAttributes,
			initializeValues,
		)
			.then(() => {
				this.initCompleted = true;
				this.initWithDefaults = true;
			})
			.finally(() => {
				const endTime = performance.now();
				const totalTime = endTime - startTime;
				this.fireClientEvent(startTime, totalTime, 'initializeFromValues', this.initCompleted);
			});
		return this.initPromise;
	}

	protected assertInitialized(statsigClient: StatsigClient | undefined): asserts statsigClient {
		if (!statsigClient) {
			throw new Error('Client must be initialized before using this method');
		}
	}

	/**
	 * This method updates the user using a network call to fetch the new set of values.
	 * @param fetchOptions {FetcherOptions}
	 * @param identifiers {Identifiers}
	 * @param customAttributes {CustomAttributes}
	 */
	async updateUser(
		fetchOptions: FetcherOptions,
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
	): Promise<void> {
		this.assertInitialized(this.statsigClient);
		const fetchOptionsWithDefaults = getOptionsWithDefaults(fetchOptions);
		const initializeValuesProducer = () =>
			Fetcher.fetchExperimentValues(fetchOptionsWithDefaults, identifiers, customAttributes).then(
				({ experimentValues, customAttributes }) => ({
					experimentValues,
					customAttributesFromFetch: customAttributes,
				}),
			);
		await this.updateUserUsingInitializeValuesProducer(
			initializeValuesProducer,
			identifiers,
			customAttributes,
		);
	}

	/**
	 * This method updates the user using the provider given on initialisation to get the new set of
	 * values.
	 * @param identifiers {Identifiers}
	 * @param customAttributes {CustomAttributes}
	 */
	async updateUserWithProvider(
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
	): Promise<void> {
		this.assertInitialized(this.statsigClient);
		if (!this.provider) {
			throw new Error(
				'Cannot update user using provider as the client was not initialised with a provider',
			);
		}

		await this.provider.setProfile(this.initOptions!, identifiers, customAttributes);

		await this.updateUserUsingInitializeValuesProducer(
			() => this.provider!.getExperimentValues(),
			identifiers,
			customAttributes,
		);
	}

	/**
	 * This method updates the user given a new set of bootstrap values obtained from one of the
	 * server-side SDKs.
	 *
	 * @param identifiers {Identifiers}
	 * @param customAttributes {CustomAttributes}
	 * @param initializeValues {Record<string,unknown>}
	 */
	async updateUserWithValues(
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
		initializeValues: Record<string, unknown> = {},
	): Promise<void> {
		this.assertInitialized(this.statsigClient);
		const initializeValuesProducer = () =>
			Promise.resolve({
				experimentValues: initializeValues,
				customAttributesFromFetch: customAttributes,
			});
		await this.updateUserUsingInitializeValuesProducer(
			initializeValuesProducer,
			identifiers,
			customAttributes,
		);
	}

	initializeCalled(): boolean {
		return this.initPromise != null;
	}

	initializeCompleted(): boolean {
		return this.initCompleted;
	}

	/**
	 * Returns the value for a feature gate. Returns false if there are errors.
	 * @param {string} gateName - The name of the feature gate.
	 * @param {Object} options
	 * @param {boolean} options.fireGateExposure
	 *        Whether or not to fire the exposure event for the gate. Defaults to true.
	 *        To log an exposure event manually at a later time, use {@link Client.manuallyLogGateExposure}
	 *        (see [Statsig docs about manually logging exposures](https://docs.statsig.com/client/jsClientSDK#manual-exposures-)).
	 */
	checkGate(gateName: string, options: CheckGateOptions = {}): boolean {
		try {
			this.assertInitialized(this.statsigClient);
			const { fireGateExposure = true } = options;
			return this.statsigClient.checkGate(gateName, { disableExposureLog: !fireGateExposure });
		} catch (error: unknown) {
			// Log the first occurrence of the error
			if (!this.hasCheckGateErrorOccurred) {
				// eslint-disable-next-line no-console
				console.warn({
					msg: 'An error has occurred checking the feature gate. Only the first occurrence of this error is logged.',
					gateName,
					error,
				});
				this.hasCheckGateErrorOccurred = true;
			}

			return false;
		}
	}

	isGateExist(gateName: string): boolean {
		try {
			this.assertInitialized(this.statsigClient);
			const gate = this.statsigClient.getFeatureGate(gateName, { disableExposureLog: true });

			return !gate.details.reason.includes('Unrecognized');
		} catch (error: unknown) {
			// eslint-disable-next-line no-console
			console.error(`Error occurred when trying to check FeatureGate: ${error}`);
			// in case of error report true to avoid false positives.
			return true;
		}
	}

	isExperimentExist(experimentName: string): boolean {
		try {
			this.assertInitialized(this.statsigClient);
			const config = this.statsigClient.getExperiment(experimentName, { disableExposureLog: true });

			return !config.details.reason.includes('Unrecognized');
		} catch (error: unknown) {
			// eslint-disable-next-line no-console
			console.error(`Error occurred when trying to check Experiment: ${error}`);
			// in case of error report true to avoid false positives.
			return true;
		}
	}

	/**
	 * Manually log a gate exposure (see [Statsig docs about manually logging exposures](https://docs.statsig.com/client/jsClientSDK#manual-exposures-)).
	 * This is useful if you have evaluated a gate earlier via {@link Client.checkGate} where
	 * <code>options.fireGateExposure</code> is false.
	 * @param gateName
	 */
	manuallyLogGateExposure(gateName: string): void {
		this.assertInitialized(this.statsigClient);
		// This is the approach recommended in the docs
		// https://docs.statsig.com/client/javascript-sdk/#manual-exposures-
		this.statsigClient.checkGate(gateName);
	}

	/**
	 * Returns the entire config for a given experiment.
	 *
	 * @param {string} experimentName - The name of the experiment
	 * @param {Object} options
	 * @param {boolean} options.fireExperimentExposure - Whether or not to fire the exposure event
	 * for the experiment. Defaults to true. To log an exposure event manually at a later time, use
	 * {@link Client.manuallyLogExperimentExposure} (see [Statsig docs about manually logging exposures](https://docs.statsig.com/client/jsClientSDK#manual-exposures-)).
	 * @returns The config for an experiment
	 * @example
	 * ```ts
	 * const experimentConfig = client.getExperiment('example-experiment-name');
	 * const backgroundColor: string = experimentConfig.get('backgroundColor', 'yellow');
	 * ```
	 */
	getExperiment(experimentName: string, options: GetExperimentOptions = {}): DynamicConfig {
		try {
			this.assertInitialized(this.statsigClient);
			const { fireExperimentExposure = true } = options;
			return DynamicConfig.fromExperiment(
				this.statsigClient.getExperiment(experimentName, {
					disableExposureLog: !fireExperimentExposure,
				}),
			);
		} catch (error: unknown) {
			// Log the first occurrence of the error
			if (!this.hasGetExperimentErrorOccurred) {
				// eslint-disable-next-line no-console
				console.warn({
					msg: 'An error has occurred getting the experiment. Only the first occurrence of this error is logged.',
					experimentName,
					error,
				});
				this.hasGetExperimentErrorOccurred = true;
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
	 * @param {T} defaultValue - The value to serve if the experiment or parameter do not exist, or
	 * if the returned value does not match the expected type.
	 * @param {Object} options
	 * @param {boolean} options.fireExperimentExposure - Whether or not to fire the exposure event
	 * for the experiment. Defaults to true. To log an exposure event manually at a later time, use
	 * {@link Client.manuallyLogExperimentExposure} (see [Statsig docs about manually logging exposures](https://docs.statsig.com/client/jsClientSDK#manual-exposures-))
	 * @param {function} options.typeGuard - A function that asserts that the return value has the
	 * expected type. If this function returns false, then the default value will be returned
	 * instead. This can be set to protect your code from unexpected values being set remotely. By
	 * default, this will be done by asserting that the default value and value are the same primitive
	 * type.
	 * @returns The value of the parameter if the experiment and parameter both exist, otherwise the
	 * default value.
	 * @example
	 ``` ts
	 type ValidColor = 'blue' | 'red' | 'yellow';
	 type ValidColorTypeCheck = (value: unknown) => value is ValidColor;

	 const isValidColor: ValidColorTypeCheck =
			(value: unknown) => typeof value === 'string' && ['blue', 'red', 'yellow'].includes(value);

	 const buttonColor: ValidColor = client.getExperimentValue(
			'example-experiment-name',
			'backgroundColor',
			'yellow',
			{
					typeGuard: isValidColor
			}
	 );
	 ```
	*/
	getExperimentValue<T>(
		experimentName: string,
		parameterName: string,
		defaultValue: T,
		options: GetExperimentValueOptions<T> = {},
	): T {
		const experiment = this.getExperiment(experimentName, options);

		try {
			const { typeGuard } = options;
			return experiment.get(parameterName, defaultValue, typeGuard);
		} catch (error: unknown) {
			// Log the first occurrence of the error
			if (!this.hasGetExperimentValueErrorOccurred) {
				// eslint-disable-next-line no-console
				console.warn({
					msg: 'An error has occurred getting the experiment value. Only the first occurrence of this error is logged.',
					experimentName,
					defaultValue,
					options,
					error,
				});
				this.hasGetExperimentValueErrorOccurred = true;
			}

			return defaultValue;
		}
	}

	/**
	 * Manually log an experiment exposure (see [Statsig docs about manually logging exposures](https://docs.statsig.com/client/jsClientSDK#manual-exposures-)).
	 * This is useful if you have evaluated an experiment earlier via {@link Client.getExperimentValue} or
	 * {@link Client.getExperiment} where <code>options.fireExperimentExposure</code> is false.
	 * @param experimentName
	 */
	manuallyLogExperimentExposure(experimentName: string): void {
		this.assertInitialized(this.statsigClient);
		// This is the approach recommended in the docs
		// https://docs.statsig.com/client/javascript-sdk/#manual-exposures-
		this.statsigClient.getExperiment(experimentName);
	}

	/**
	 * Manually log a layer exposure (see [Statsig docs about manually logging exposures](https://docs.statsig.com/client/jsClientSDK#manual-exposures-)).
	 * This is useful if you have evaluated a layer earlier via {@link Client.getLayerValue} where <code>options.fireExperimentExposure</code> is false.
	 * @param layerName
	 * @param parameterName
	 */
	manuallyLogLayerExposure(layerName: string, parameterName: string): void {
		this.assertInitialized(this.statsigClient);
		// This is the approach recommended in the docs
		// https://docs.statsig.com/client/javascript-sdk/#manual-exposures-
		this.statsigClient.getLayer(layerName)?.get(parameterName);
	}

	shutdownStatsig(): void {
		this.assertInitialized(this.statsigClient);
		this.statsigClient.shutdown();
	}

	/**
	 * Adds a new override for the given gate.
	 *
	 * This method is additive, meaning you can call it multiple times with different gate names to
	 * build your full set of overrides.
	 *
	 * Overrides are persisted to the `STATSIG_OVERRIDES` key in localStorage, so they
	 * will continue to affect every client that is initialized on the same domain after this method
	 * is called. If you are using this API for testing purposes, you should call
	 * {@link Client.clearGateOverride} after your tests are completed to remove this
	 * localStorage entry.
	 *
	 * @param {string} gateName
	 * @param {boolean} value
	 */
	overrideGate(gateName: string, value: boolean): void {
		this.overrideAdapter.overrideGate(gateName, value);
		// Trigger a reset of the memoized gate value
		if (this.user) {
			this.statsigClient?.updateUserSync(this.user, { disableBackgroundCacheRefresh: true });
		}
		this.statsigValuesUpdated();
	}

	/**
	 * Removes any overrides that have been set for the given gate.
	 */
	clearGateOverride(gateName: string): void {
		this.overrideAdapter.removeGateOverride(gateName);
		this.statsigValuesUpdated();
	}

	/**
	 * Adds a new override for the given config (or experiment).
	 *
	 * This method is additive, meaning you can call it multiple times with different experiment
	 * names to build your full set of overrides.
	 *
	 * Overrides are persisted to the `STATSIG_OVERRIDES` key in localStorage, so they
	 * will continue to affect every client that is initialized on the same domain after this method
	 * is called. If you are using this API for testing purposes, you should call
	 * {@link Client.clearConfigOverride} after your tests are completed to remove this
	 * localStorage entry.
	 *
	 * @param {string} experimentName
	 * @param {object} values
	 */
	overrideConfig(experimentName: string, values: Record<string, unknown>): void {
		this.overrideAdapter.overrideDynamicConfig(experimentName, values);
		this.statsigValuesUpdated();
	}

	/**
	 * Removes any overrides that have been set for the given experiment.
	 * @param {string} experimentName
	 */
	clearConfigOverride(experimentName: string): void {
		this.overrideAdapter.removeDynamicConfigOverride(experimentName);
		this.statsigValuesUpdated();
	}

	/**
	 * Set overrides for gates, experiments and layers in batch.
	 *
	 * Note that these overrides are **not** additive and will completely replace any that have been
	 * added via prior calls to {@link Client.overrideConfig} or
	 * {@link Client.overrideGate}.
	 *
	 * Overrides are persisted to the `STATSIG_OVERRIDES` key in localStorage, so they
	 * will continue to affect every client that is initialized on the same domain after this method
	 * is called. If you are using this API for testing purposes, you should call
	 * {@link Client.clearAllOverrides} after your tests are completed to remove this
	 * localStorage entry.
	 */
	setOverrides(overrides: Partial<LocalOverrides>): void {
		this.overrideAdapter.setOverrides(overrides);
		this.statsigValuesUpdated();
	}

	/**
	 * @returns The current overrides for gates, configs (including experiments) and layers.
	 */
	getOverrides(): LocalOverrides {
		return this.overrideAdapter.getOverrides();
	}

	/**
	 * Clears overrides for all gates, configs (including experiments) and layers.
	 */
	clearAllOverrides(): void {
		this.overrideAdapter.removeAllOverrides();
		this.statsigValuesUpdated();
	}

	/**
	 * Returns whether the given identifiers and customAttributes align with the current
	 * set that is being used by the client.
	 *
	 * If this method returns false, then the {@link Client.updateUser},
	 * {@link Client.updateUserWithValues} or {@link Client.updateUserWithProvider}
	 * methods can be used to re-align these values.
	 *
	 * @param identifiers
	 * @param customAttributes
	 * @returns a flag indicating whether the clients current configuration aligns with the given values
	 */
	isCurrentUser(identifiers: Identifiers, customAttributes?: CustomAttributes): boolean {
		return (
			shallowEquals(this.currentIdentifiers, identifiers) &&
			shallowEquals(this.currentAttributes, customAttributes)
		);
	}

	/**
	 * Subscribe to updates where the given callback will be called with the current checkGate value
	 * @param gateName
	 * @param callback
	 * @param options
	 * @returns off function to unsubscribe from updates
	 */
	onGateUpdated(
		gateName: string,
		callback: (value: boolean) => void,
		options: CheckGateOptions = {},
	): () => void {
		const wrapCallback = (value: boolean): void => {
			const { fireGateExposure = true } = options;
			if (fireGateExposure) {
				this.manuallyLogGateExposure(gateName);
			}
			try {
				callback(value);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.warn(`Error calling callback for gate ${gateName} with value ${value}`, error);
			}
		};

		return this.subscriptions.onGateUpdated(
			gateName,
			wrapCallback,
			this.checkGate.bind(this),
			options,
		);
	}

	/**
	 * Subscribe to updates where the given callback will be called with the current experiment value
	 * @param experimentName
	 * @param parameterName
	 * @param defaultValue
	 * @param callback
	 * @param options
	 * @returns off function to unsubscribe from updates
	 */
	onExperimentValueUpdated<T>(
		experimentName: string,
		parameterName: string,
		defaultValue: T,
		callback: (value: T) => void,
		options: GetExperimentValueOptions<T> = {},
	): () => void {
		const wrapCallback = (value: T): void => {
			const { fireExperimentExposure = true } = options;
			if (fireExperimentExposure) {
				this.manuallyLogExperimentExposure(experimentName);
			}
			try {
				callback(value);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.warn(
					`Error calling callback for experiment ${experimentName} with value ${value}`,
					error,
				);
			}
		};

		return this.subscriptions.onExperimentValueUpdated(
			experimentName,
			parameterName,
			defaultValue,
			wrapCallback,
			this.getExperimentValue.bind(this),
			options,
		);
	}

	/**
	 * Subscribe so on any update the callback will be called.
	 * NOTE: The callback will be called whenever the values are updated even if the values have not
	 * changed.
	 * @param callback
	 * @returns off function to unsubscribe from updates
	 */
	onAnyUpdated(callback: () => void): () => void {
		return this.subscriptions.onAnyUpdated(callback);
	}

	/**
	 * This method initializes the client using a network call to fetch the bootstrap values for the
	 * given user.
	 *
	 * @param clientOptions
	 * @param identifiers
	 * @param customAttributes
	 * @private
	 */
	private async init(
		clientOptions: OptionsWithDefaults<ClientOptions>,
		identifiers: Identifiers,
		customAttributes: CustomAttributes | undefined,
	): Promise<void> {
		const fromValuesClientOptions: FromValuesClientOptions = {
			...clientOptions,
		};

		let experimentValues: Record<string, unknown> | undefined;
		let customAttributesFromResult: CustomAttributes | undefined;

		try {
			// If client sdk key fetch fails, an error would be thrown and handled instead of waiting for
			// the experiment values request to be settled, and it will fall back to use default values.
			const clientSdkKeyPromise = Fetcher.fetchClientSdk(clientOptions).then(
				(value) => (fromValuesClientOptions.sdkKey = value.clientSdkKey),
			);

			const experimentValuesPromise = Fetcher.fetchExperimentValues(
				clientOptions,
				identifiers,
				customAttributes,
			);

			// Only wait for the experiment values request to finish and try to initialise the client
			// with experiment values if both requests are successful. Else an error would be thrown and
			// handled by the catch
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
			await this.initFromValues(fromValuesClientOptions, identifiers, customAttributes);
			throw error;
		}

		return this.initFromValues(
			fromValuesClientOptions,
			identifiers,
			customAttributesFromResult,
			experimentValues,
		);
	}

	private async initWithProvider(
		baseClientOptions: OptionsWithDefaults<BaseClientOptions>,
		provider: Provider,
		identifiers: Identifiers,
		customAttributes: CustomAttributes | undefined,
	): Promise<void> {
		const fromValuesClientOptions: FromValuesClientOptions = {
			...baseClientOptions,
			disableCurrentPageLogging: true,
		};

		let experimentValues: Record<string, unknown> | undefined;
		let customAttributesFromResult: CustomAttributes | undefined;

		try {
			await provider.setProfile(baseClientOptions, identifiers, customAttributes);

			// If client sdk key fetch fails, an error would be thrown and handled instead of waiting for
			// the experiment values request to be settled, and it will fall back to use default values.
			const clientSdkKeyPromise = provider
				.getClientSdkKey()
				.then((value) => (fromValuesClientOptions.sdkKey = value));

			const experimentValuesPromise = provider.getExperimentValues();

			// Only wait for the experiment values request to finish and try to initialise the client
			// with experiment values if both requests are successful. Else an error would be thrown and
			// handled by the catch
			const [, experimentValuesResult] = await Promise.all([
				clientSdkKeyPromise,
				experimentValuesPromise,
			]);

			experimentValues = experimentValuesResult.experimentValues;
			customAttributesFromResult = experimentValuesResult.customAttributesFromFetch;
		} catch (error: unknown) {
			if (error instanceof Error) {
				// eslint-disable-next-line no-console
				console.error(
					`Error occurred when trying to fetch the Feature Gates client values, error: ${error?.message}`,
				);
			}
			// eslint-disable-next-line no-console
			console.warn(`Initialising Statsig client without values`);
			await this.initFromValues(fromValuesClientOptions, identifiers, customAttributes);
			throw error;
		}

		return this.initFromValues(
			fromValuesClientOptions,
			identifiers,
			customAttributesFromResult,
			experimentValues,
		);
	}

	/**
	 * This method initializes the client using a set of boostrap values obtained from one of the
	 * server-side SDKs.
	 *
	 * @param clientOptions
	 * @param identifiers
	 * @param customAttributes
	 * @param initializeValues
	 * @private
	 */
	private async initFromValues(
		clientOptions: FromValuesClientOptions,
		identifiers: Identifiers,
		customAttributes?: CustomAttributes | undefined,
		initializeValues: Record<string, unknown> = {},
	): Promise<void> {
		this.overrideAdapter.initFromStoredOverrides();
		this.currentIdentifiers = identifiers;
		this.currentAttributes = customAttributes;

		const newClientOptions = migrateInitializationOptions(clientOptions);
		if (!newClientOptions.sdkKey) {
			newClientOptions.sdkKey = DEFAULT_CLIENT_KEY;
		}

		if (!newClientOptions.networkConfig?.logEventUrl) {
			newClientOptions.networkConfig = {
				...newClientOptions.networkConfig,
				logEventUrl: DEFAULT_EVENT_LOGGING_API,
			};
		}

		if (newClientOptions.perimeter === PerimeterType.FEDRAMP_MODERATE) {
			// disable all logging in FedRAMP to prevent egress of sensitive data
			newClientOptions.disableLogging = true;
		}

		const {
			sdkKey,
			environment,
			updateUserCompletionCallback: _updateUserCompletionCallback,
			perimeter: _perimeter,
			...restClientOptions
		} = newClientOptions;

		this.sdkKey = sdkKey;
		this.user = toStatsigUser(identifiers, customAttributes, this.sdkKey);

		const statsigOptions: StatsigOptions = {
			...restClientOptions,
			environment: {
				tier: environment,
			},
			includeCurrentPageUrlWithEvents: false,
			dataAdapter: this.dataAdapter,
			overrideAdapter: this.overrideAdapter,
		};

		try {
			this.statsigClient = new StatsigClient(sdkKey, this.user, statsigOptions);
			this.dataAdapter.setBootstrapData(initializeValues);
			await this.statsigClient.initializeAsync();
		} catch (error: unknown) {
			if (error instanceof Error) {
				// eslint-disable-next-line no-console
				console.error(
					`Error occurred when trying to initialise the Statsig client, error: ${error?.message}`,
				);
			}
			// eslint-disable-next-line no-console
			console.warn(`Initialising Statsig client with default sdk key and without values`);
			this.statsigClient = new StatsigClient(DEFAULT_CLIENT_KEY, this.user, statsigOptions);
			this.dataAdapter.setBootstrapData();
			await this.statsigClient.initializeAsync();
			this.initWithDefaults = true;
			throw error;
		}
	}

	/**
	 * This method updates the user for this client with the bootstrap values returned from a given
	 * Promise.
	 * It uses the customAttributes from fetching experiment values to update the Statsig user but
	 * uses the customAttributes from given input to check if the user has changed.
	 *
	 * @param {Identifiers} identifiers
	 * @param {CustomAttributes} customAttributes
	 * @param {Promise<InitializeValues>} getInitializeValues
	 * @private
	 */
	private async updateUserUsingInitializeValuesProducer(
		getInitializeValues: () => Promise<InitializeValues>,
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
	): Promise<void> {
		this.assertInitialized(this.statsigClient);
		if (!this.initPromise) {
			throw new Error('The client must be initialized before you can update the user.');
		}

		// If the user isn't changing at all, then exit immediately
		if (this.isCurrentUser(identifiers, customAttributes)) {
			return this.initPromise;
		}

		// Wait for the current initialize/update to finish
		const originalInitPromise = this.initPromise;
		try {
			await this.initPromise;
		} catch (err) {
			// Proceed with the user update even if the init failed, since this update
			// may put the client back into a valid state.
		}

		const initializeValuesPromise = getInitializeValues();
		const updateUserPromise = this.updateStatsigClientUser(
			initializeValuesPromise,
			identifiers,
			customAttributes,
		);

		// We replace the init promise here since we are essentially re-initializing the client at this
		// point. Any subsequent calls to await client.initialize() or client.updateUser()
		// will now also await this user update.
		this.initPromise = updateUserPromise.catch(async () => {
			// If the update failed then it changed nothing, so revert back to the original promise.
			this.initPromise = originalInitPromise;

			// Set the user profile again to revert back to the current user
			if (this.provider) {
				await this.provider.setProfile(
					this.initOptions!,
					this.currentIdentifiers!,
					this.currentAttributes,
				);
			}
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
	private async updateStatsigClientUser(
		initializeValuesPromise: Promise<InitializeValues>,
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
	): Promise<void> {
		this.assertInitialized(this.statsigClient);

		let initializeValues, user;
		try {
			initializeValues = await initializeValuesPromise;
			user = toStatsigUser(identifiers, initializeValues.customAttributesFromFetch, this.sdkKey);
		} catch (err) {
			// Make sure the updateUserCompletionCallback is called for any errors in our custom code.
			// This is not necessary for the updateUserWithValues call, because the Statsig client will
			// already invoke the callback itself.
			const errMsg = err instanceof Error ? err.message : JSON.stringify(err);
			this.initOptions!.updateUserCompletionCallback?.(false, errMsg);
			throw err;
		}

		let success = true;
		let errorMessage: string | null = null;
		try {
			this.dataAdapter.setBootstrapData(initializeValues.experimentValues);
			this.user = user;
			await this.statsigClient.updateUserAsync(this.user);
		} catch (err) {
			success = false;
			errorMessage = String(err);
		}

		this.initOptions?.updateUserCompletionCallback?.(success, errorMessage);
		if (success) {
			this.currentIdentifiers = identifiers;
			this.currentAttributes = customAttributes;
			this.subscriptions.anyUpdated();
		} else {
			throw new Error('Failed to update user. An unexpected error occured.');
		}
	}

	/**
	 * Call this if modifying the values being served by the Statsig library since it has its own
	 * memoization cache which will not be updated if the values are changed outside of the library.
	 */
	protected statsigValuesUpdated = () => {
		if (this.user) {
			// Trigger a reset of the memoize cache
			this.statsigClient!.updateUserSync(this.user, { disableBackgroundCacheRefresh: true });
		}
		this.subscriptions.anyUpdated();
	};

	/**
	 * @returns string version of the current package in semver style.
	 */
	getPackageVersion() {
		return CLIENT_VERSION;
	}

	/**
	 * Returns a specified layer otherwise returns an empty layer as a default value if the layer doesn't exist.
	 *
	 * @param {string} layerName - The name of the layer
	 * @param {Object} options
	 * @param {boolean} options.fireLayerExposure - Whether or not to fire the exposure event for the
	 * layer. Defaults to true. To log an exposure event manually at a later time, use
	 * {@link Client.manuallyLogLayerExposure} (see [Statsig docs about manually logging exposures](https://docs.statsig.com/client/jsClientSDK#manual-exposures-)).
	 * @returns A layer
	 * @example
	 * ```ts
	 * const layer = client.getLayer('example-layer-name');
	 * const exampletitle: string = layer.get("title", "Welcome to Statsig!");
	 * ```
	 */
	getLayer(
		/** The name of the layer */
		layerName: string,
		options: GetLayerOptions = {},
	): Layer {
		try {
			this.assertInitialized(this.statsigClient);
			const { fireLayerExposure = true } = options;
			return Layer.fromLayer(
				this.statsigClient.getLayer(layerName, { disableExposureLog: !fireLayerExposure }),
			);
		} catch (error: unknown) {
			// Log the first occurrence of the error
			if (!this.hasGetLayerErrorOccurred) {
				// eslint-disable-next-line no-console
				console.warn({
					msg: 'An error has occurred getting the layer. Only the first occurrence of this error is logged.',
					layerName,
					error,
				});
				this.hasGetLayerErrorOccurred = true;
			}

			// Return a default value
			return Layer.fromLayer(_makeLayer(layerName, { reason: 'Error' }, null));
		}
	}

	/**
	 * Returns the value of a given parameter in a layer config.
	 *
	 * @template T
	 * @param {string} layerName - The name of the layer
	 * @param {string} parameterName - The name of the parameter to fetch from the layer config
	 * @param {T} defaultValue - The value to serve if the layer or parameter do not exist, or if the
	 * returned value does not match the expected type.
	 * @param {Object} options
	 * @param {boolean} options.fireLayerExposure - Whether or not to fire the exposure event for the
	 * layer. Defaults to true. To log an exposure event manually at a later time, use
	 * {@link Client.manuallyLogLayerExposure} (see [Statsig docs about manually logging exposures](https://docs.statsig.com/client/jsClientSDK#manual-exposures-))
	 * @param {function} options.typeGuard - A function that asserts that the return value has the expected type. If this function returns false, then the default value will be returned instead. This can be set to protect your code from unexpected values being set remotely. By default, this will be done by asserting that the default value and value are the same primitive type.
	 * @returns The value of the parameter if the layer and parameter both exist, otherwise the default value.
	 * @example
	 * ``` ts
	 * type ValidColor = 'blue' | 'red' | 'yellow';
	 * type ValidColorTypeCheck = (value: unknown) => value is ValidColor;
	 *
	 * const isValidColor: ValidColorTypeCheck =
	 *    (value: unknown) => typeof value === 'string' && ['blue', 'red', 'yellow'].includes(value);
	 *
	 * const buttonColor: ValidColor = client.getLayerValue(
	 *    'example-layer-name',
	 *    'backgroundColor',
	 *    'yellow',
	 *    {
	 *        typeGuard: isValidColor
	 *    }
	 * );
	 * ```
	 */
	getLayerValue<T>(
		layerName: string,
		parameterName: string,
		defaultValue: T,
		options: GetLayerValueOptions<T> = {},
	): T {
		const layer = this.getLayer(layerName, options);

		try {
			const { typeGuard } = options;
			return layer.get(parameterName, defaultValue, typeGuard);
		} catch (error: unknown) {
			// Log the first occurrence of the error
			if (!this.hasGetLayerValueErrorOccurred) {
				// eslint-disable-next-line no-console
				console.warn({
					msg: 'An error has occurred getting the layer value. Only the first occurrence of this error is logged.',
					layerName,
					defaultValue,
					options,
					error,
				});
				this.hasGetLayerValueErrorOccurred = true;
			}

			return defaultValue;
		}
	}
}
