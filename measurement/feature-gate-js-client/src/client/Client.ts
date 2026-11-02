import {
	_makeLayer,
	LogEventCompressionMode,
	StableID,
	StatsigClient,
	type StatsigOptions,
	type StatsigUser,
} from '@statsig/js-client';

import type { FfpEvaluationClient } from '../ffp/types';
import { default as Subscriptions } from '../subscriptions/Subscriptions';
import { DynamicConfig } from './compat/DynamicConfig';
import { Layer } from './compat/Layer';
import { EvaluationReason } from './compat/types';
import { deepAssign } from './deepAssign';
import { isEvalFlagsDegraded } from './fetcher/evalFlags/isEvalFlagsDegraded';
import { toInitializeValues } from './fetcher/evalFlags/toInitializeValues';
import { type FetcherOptions, default as Fetcher } from './fetcher/Fetcher';
import { FfpClientAdapter } from './FfpClientAdapter';
import { getOptionsWithDefaults } from './getOptionsWithDefaults';
import { migrateInitializationOptions } from './migrateInitializationOptions';
import { NoFetchDataAdapter } from './NoFetchDataAdapter';
import {
	LOCAL_STORAGE_KEY,
	type LocalOverrides,
	PersistentOverrideAdapter,
} from './PersistentOverrideAdapter';
import { shallowEquals } from './shallowEquals';
import { toStatsigUser } from './toStatsigUser';
import {
	type BaseClientOptions,
	type CheckGateOptions,
	type ClientOptions,
	type CustomAttributes,
	FeatureGateEnvironment,
	type EvalFlagsProvider,
	type EvalFlagsStatus,
	type FfpInitializeValues,
	type FromValuesClientOptions,
	type FrontendExperimentsResult,
	type GetExperimentOptions,
	type GetExperimentValueOptions,
	type GetLayerOptions,
	type GetLayerValueOptions,
	type Identifiers,
	type OptionsWithDefaults,
	PerimeterType,
	type Provider,
} from './types';
import { CLIENT_VERSION } from './version';

const DEFAULT_CLIENT_KEY = 'client-default-key';
// default event logging api is Atlassian proxy rather than Statsig's domain, to avoid ad blockers
const DEFAULT_EVENT_LOGGING_API = 'https://xp.atlassian.com/v1/rgstr';

/** The one source that answers for a gate or config. See {@link Client.route}. */
type Route<T> =
	| { source: 'statsig'; statsigClient: StatsigClient }
	| { source: 'override'; value: T }
	| { source: 'ffp' | 'default' };

function logFetchError(error: unknown): void {
	if (error instanceof Error) {
		// eslint-disable-next-line no-console
		console.error(
			`Error occurred when trying to fetch the Feature Gates client values, error: ${error.message}`,
		);
	}
	// eslint-disable-next-line no-console
	console.warn(`Initialising Statsig client without values`);
}

export class Client {
	private statsigClient?: StatsigClient;
	private user?: StatsigUser;
	private initOptions?: OptionsWithDefaults<
		BaseClientOptions | ClientOptions | FromValuesClientOptions
	>;
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
	/** Serves the flags the Feature Flag Service assigns to FFP; all other keys use Statsig. */
	private ffp = new FfpClientAdapter();
	private overrideAdapter: PersistentOverrideAdapter;
	/** True once an initialize method has applied values, even if Statsig is not running. */
	private valuesApplied = false;
	/** The options Statsig was (or will be) started with, kept to start it again when re-enabled. */
	private statsigInitOptions?: FromValuesClientOptions;
	/** A start of Statsig after initialization that is still in progress. */
	private statsigStart?: Promise<void>;
	/** Incremented when Statsig stops, so a start that it overtook does nothing. */
	private statsigGeneration = 0;

	constructor({
		localStorageKey = LOCAL_STORAGE_KEY,
		overrideAdapter,
	}: { localStorageKey?: string; overrideAdapter?: PersistentOverrideAdapter } = {}) {
		this.overrideAdapter = overrideAdapter || new PersistentOverrideAdapter(localStorageKey);
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
			if ((this.initCompleted || this.initWithDefaults) && this.currentIdentifiers) {
				this.assertReady();
				const identifiers = this.currentIdentifiers;
				const customAttributes =
					experimentsResult.customAttributesFromFetch ?? this.currentAttributes;
				const disabled = experimentsResult.disabledProviders ?? [];
				this.ffp.apply(
					this.initOptions!,
					disabled.includes('ffp') ? undefined : experimentsResult.ffp,
					identifiers,
					customAttributes,
				);
				if (disabled.includes('statsig')) {
					this.stopStatsig();
				} else if (this.statsigClient) {
					this.dataAdapter.setBootstrapData(experimentsResult.experimentValues);
					this.dataAdapter.setData(JSON.stringify(experimentsResult.experimentValues));
				} else if (!this.statsigStart) {
					// Statsig is enabled again after being disabled. A start already in progress is left to
					// finish; the next update brings it up to date.
					this.restartStatsig(experimentsResult, identifiers, customAttributes)
						.then(() => this.subscriptions.anyUpdated())
						.catch((error: unknown) => {
							// eslint-disable-next-line no-console
							console.warn('Failed to start the Statsig client', error);
						});
				}
				this.statsigValuesUpdated();
				this.reportEvalFlagsStatus('providerUpdate', experimentsResult.status);
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
		this.sendOperationalEvent(action, 'featureGatesClient', {
			success,
			startTime,
			totalTime,
			...(apiKey && { apiKey }),
		})?.catch((err) => {
			if (this.initOptions!.environment !== FeatureGateEnvironment.Production) {
				// eslint-disable-next-line no-console
				console.error('Analytics web client promise did not resolve', err);
			}
		});
	}

	/** Sends an operational event about this client, once the analytics client is available. */
	private sendOperationalEvent(
		action: string,
		actionSubject: string,
		attributes: Record<string, unknown>,
	): Promise<void> | undefined {
		const initOptions = this.initOptions!;
		return initOptions.analyticsWebClient?.then((analyticsWebClient) => {
			analyticsWebClient.sendOperationalEvent({
				action,
				actionSubject,
				attributes: {
					targetApp: initOptions.targetApp,
					clientVersion: CLIENT_VERSION,
					...attributes,
				},
				tags: ['measurement'],
				source: '@atlaskit/feature-gate-js-client',
			});
		});
	}

	/**
	 * Reports values that are worse than the Feature Flag Service intends because a provider is
	 * unavailable. The client still resolves with what it received; affected flags return the
	 * code default (or, with the polling provider, the last values the provider served).
	 */
	private reportEvalFlagsStatus(trigger: string, status: EvalFlagsStatus | undefined): void {
		if (!status || !isEvalFlagsDegraded(status) || !this.initOptions) {
			return;
		}
		const initOptions = this.initOptions;
		if (initOptions.environment !== FeatureGateEnvironment.Production) {
			// eslint-disable-next-line no-console
			console.warn(
				`Feature flag values are degraded (Statsig: ${status.statsig}, FFP: ${status.ffp}). Affected flags will return their default values.`,
			);
		}
		this.sendOperationalEvent('degraded', 'featureGatesClientValues', {
			trigger,
			statsigStatus: status.statsig,
			ffpStatus: status.ffp,
		})?.catch(() => {
			// The initialization event already reports a missing analytics client.
		});
	}

	async initializeFromValues(
		clientOptions: FromValuesClientOptions,
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
		initializeValues: Record<string, unknown> = {},
		ffpValues?: FfpInitializeValues,
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
			ffpValues,
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

	/**
	 * Throws if the Statsig client does not exist. The client's own methods use
	 * {@link assertReady} instead, because Statsig is absent while the Feature Flag Service
	 * disables it.
	 */
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
		this.assertReady();
		const fetchOptionsWithDefaults = getOptionsWithDefaults(fetchOptions);
		const initializeValuesProducer = () =>
			Fetcher.fetchFlagValues(fetchOptionsWithDefaults, identifiers, customAttributes).then(
				(response) => toInitializeValues(response, customAttributes),
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
		this.assertReady();
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
		ffpValues?: FfpInitializeValues,
	): Promise<void> {
		this.assertReady();
		const initializeValuesProducer = () =>
			Promise.resolve({
				experimentValues: initializeValues,
				customAttributesFromFetch: customAttributes,
				ffp: ffpValues,
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

	async waitUntilInitializeCompleted(): Promise<void> {
		if (!this.initPromise) {
			throw new Error('The client must be initialized before you can wait until initialized.');
		}

		if (this.initCompleted) {
			return;
		}

		await this.initPromise;
	}

	/**
	 * The Feature Flag Platform (FFP) client, for reading flags that only exist in FFP. New flags are
	 * created only in FFP, so read them here.
	 *
	 * @example
	 * ```ts
	 * const enabled = client.ffpClient?.getBooleanValue('my-new-flag', false) ?? false;
	 * ```
	 *
	 * - It is `undefined` until an initialize method is called, then it is the same instance for the
	 *   lifetime of this client, including across user updates.
	 * - Until FFP values arrive, and when the Feature Flag Service does not use FFP for the user, its
	 *   reads return the default they are given.
	 * - Local overrides (see {@link Client.overrideGate}) do not apply to it.
	 * - It serves only FFP values, so a flag being migrated from Statsig to FFP gets the default
	 *   whenever Statsig serves it. Read migrating flags with {@link Client.checkGate},
	 *   {@link Client.getExperimentValue} and the other methods of this client, which serve each flag
	 *   from whichever of FFP or Statsig the service assigns it to.
	 *
	 * Its methods match those of `FlagClient` from `@atlaskit/flag-client`, so code that reads it
	 * keeps working once it uses a `FlagClient` directly.
	 */
	get ffpClient(): FfpEvaluationClient | undefined {
		return this.initOptions ? this.ffp.getClient(this.initOptions) : undefined;
	}

	/**
	 * Returns the value for a feature gate. Returns false if there are errors.
	 *
	 * Not for flags that only exist in the Feature Flag Platform (FFP): use {@link Client.ffpClient}
	 * for those. Use this method for Statsig flags, including flags being migrated from Statsig to FFP.
	 *
	 * @param {string} gateName - The name of the feature gate.
	 * @param {Object} options
	 * @param {boolean} options.fireGateExposure
	 *        Whether or not to fire the exposure event for the gate. Defaults to true.
	 *        To log an exposure event manually at a later time, use {@link Client.manuallyLogGateExposure}
	 *        (see [Statsig docs about manually logging exposures](https://docs.statsig.com/client/jsClientSDK#manual-exposures-)).
	 */
	checkGate(gateName: string, options: CheckGateOptions = {}): boolean {
		try {
			this.assertReady();
			const { fireGateExposure = true } = options;
			const route = this.route(gateName, 'gates');
			switch (route.source) {
				case 'statsig':
					return route.statsigClient.checkGate(gateName, {
						disableExposureLog: !fireGateExposure,
					});
				case 'ffp':
					return this.ffp.checkGate(gateName, fireGateExposure);
				case 'override':
					return route.value;
				default:
					return false;
			}
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

	/**
	 * Returns whether the given feature gate exists for the current user.
	 *
	 * Not for flags that only exist in the Feature Flag Platform (FFP): use {@link Client.ffpClient}
	 * for those. Use this method for Statsig flags, including flags being migrated from Statsig to FFP.
	 */
	isGateExist(gateName: string): boolean {
		try {
			this.assertReady();
			const route = this.route(gateName, 'gates');
			if (route.source !== 'statsig') {
				return route.source !== 'default';
			}
			const gate = route.statsigClient.getFeatureGate(gateName, { disableExposureLog: true });

			return !gate.details.reason.includes('Unrecognized');
		} catch (error: unknown) {
			// eslint-disable-next-line no-console
			console.error(`Error occurred when trying to check FeatureGate: ${error}`);
			// in case of error report true to avoid false positives.
			return true;
		}
	}

	/**
	 * Returns whether the given experiment exists for the current user.
	 *
	 * Not for flags that only exist in the Feature Flag Platform (FFP): use {@link Client.ffpClient}
	 * for those. Use this method for Statsig flags, including flags being migrated from Statsig to FFP.
	 */
	isExperimentExist(experimentName: string): boolean {
		try {
			this.assertReady();
			const route = this.route(experimentName, 'configs');
			if (route.source !== 'statsig') {
				return route.source !== 'default';
			}
			const config = route.statsigClient.getExperiment(experimentName, {
				disableExposureLog: true,
			});

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
	 *
	 * Not for flags that only exist in the Feature Flag Platform (FFP): use {@link Client.ffpClient}
	 * for those. Use this method for Statsig flags, including flags being migrated from Statsig to FFP.
	 *
	 * @param gateName
	 */
	manuallyLogGateExposure(gateName: string): void {
		this.assertReady();
		const route = this.route(gateName, 'gates');
		if (route.source === 'ffp') {
			this.ffp.logGateExposure(gateName);
		} else if (route.source === 'statsig') {
			// This is the approach recommended in the docs
			// https://docs.statsig.com/client/javascript-sdk/#manual-exposures-
			route.statsigClient.checkGate(gateName);
		}
		// An overridden or default value has no exposure.
	}

	/**
	 * Returns the entire config for a given experiment.
	 *
	 * Not for flags that only exist in the Feature Flag Platform (FFP): use {@link Client.ffpClient}
	 * for those. Use this method for Statsig flags, including flags being migrated from Statsig to FFP.
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
			this.assertReady();
			const { fireExperimentExposure = true } = options;
			const route = this.route(experimentName, 'configs');
			switch (route.source) {
				case 'statsig':
					return DynamicConfig.fromExperiment(
						route.statsigClient.getExperiment(experimentName, {
							disableExposureLog: !fireExperimentExposure,
						}),
					);
				case 'ffp': {
					const ffpConfig = this.ffp.getConfig(experimentName, fireExperimentExposure);
					return new DynamicConfig(experimentName, ffpConfig.value, ffpConfig.ruleId, {
						time: Date.now(),
						reason: EvaluationReason.Bootstrap,
					});
				}
				case 'override':
					return new DynamicConfig(experimentName, route.value, '', {
						time: Date.now(),
						reason: EvaluationReason.LocalOverride,
					});
				default:
					return new DynamicConfig(experimentName, {}, '', {
						time: Date.now(),
						reason: EvaluationReason.Unrecognized,
					});
			}
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
	 * Not for flags that only exist in the Feature Flag Platform (FFP): use {@link Client.ffpClient}
	 * for those. Use this method for Statsig flags, including flags being migrated from Statsig to FFP.
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
	 *
	 * Not for flags that only exist in the Feature Flag Platform (FFP): use {@link Client.ffpClient}
	 * for those. Use this method for Statsig flags, including flags being migrated from Statsig to FFP.
	 *
	 * @param experimentName
	 */
	manuallyLogExperimentExposure(experimentName: string): void {
		this.assertReady();
		const route = this.route(experimentName, 'configs');
		if (route.source === 'ffp') {
			this.ffp.logConfigExposure(experimentName);
		} else if (route.source === 'statsig') {
			// This is the approach recommended in the docs
			// https://docs.statsig.com/client/javascript-sdk/#manual-exposures-
			route.statsigClient.getExperiment(experimentName);
		}
		// An overridden or default value has no exposure.
	}

	/**
	 * Manually log a layer exposure (see [Statsig docs about manually logging exposures](https://docs.statsig.com/client/jsClientSDK#manual-exposures-)).
	 * This is useful if you have evaluated a layer earlier via {@link Client.getLayerValue} where <code>options.fireExperimentExposure</code> is false.
	 *
	 * Layers exist only in Statsig. Flags that only exist in the Feature Flag Platform (FFP) are read
	 * with {@link Client.ffpClient}.
	 *
	 * @param layerName
	 * @param parameterName
	 */
	manuallyLogLayerExposure(layerName: string, parameterName: string): void {
		this.assertReady();
		// This is the approach recommended in the docs
		// https://docs.statsig.com/client/javascript-sdk/#manual-exposures-
		this.statsigClient?.getLayer(layerName)?.get(parameterName);
	}

	shutdownStatsig(): void {
		this.assertReady();
		this.statsigClient?.shutdown();
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
	 *
	 * Not for flags that only exist in the Feature Flag Platform (FFP): use {@link Client.ffpClient}
	 * for those. Use this method for Statsig flags, including flags being migrated from Statsig to FFP.
	 *
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
	 *
	 * Not for flags that only exist in the Feature Flag Platform (FFP): use {@link Client.ffpClient}
	 * for those. Use this method for Statsig flags, including flags being migrated from Statsig to FFP.
	 *
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

		if (clientOptions.localMode) {
			await this.initFromValues(fromValuesClientOptions, identifiers, customAttributes);
			return;
		}

		await this.initFromFetchedValues(
			fromValuesClientOptions,
			identifiers,
			customAttributes,
			Fetcher.fetchClientSdk(clientOptions).then((value) => value.clientSdkKey),
			Fetcher.fetchFlagValues(clientOptions, identifiers, customAttributes).then((response) =>
				toInitializeValues(response, customAttributes),
			),
			'initialize',
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

		// A failure to set the profile, even a synchronous one, fails both fetches.
		const profilePromise = Promise.resolve().then(() =>
			provider.setProfile(baseClientOptions, identifiers, customAttributes),
		);
		await this.initFromFetchedValues(
			fromValuesClientOptions,
			identifiers,
			customAttributes,
			profilePromise.then(() => provider.getClientSdkKey()),
			profilePromise.then(() => provider.getExperimentValues()),
			'initializeWithProvider',
		);
	}

	/**
	 * Initializes from values that are still being fetched, alongside Statsig's SDK key.
	 *
	 * Only Statsig needs the key, so a failed key fetch leaves FFP initialized with its values and
	 * Statsig without values, and the key is not waited for at all when the Feature Flag Service
	 * disables Statsig. A failed values fetch initializes Statsig without values (but with the key,
	 * if it arrives) and FFP not at all. Either failure rejects after initializing.
	 */
	private async initFromFetchedValues(
		fromValuesClientOptions: FromValuesClientOptions,
		identifiers: Identifiers,
		customAttributes: CustomAttributes | undefined,
		clientSdkKeyPromise: Promise<string>,
		valuesPromise: Promise<FrontendExperimentsResult>,
		trigger: string,
	): Promise<void> {
		// Record the key on the options whenever it arrives, so Statsig can still use it if it is
		// enabled after being disabled. Never leave a failure unhandled, as it may never be awaited.
		const clientSdkKeyResult = clientSdkKeyPromise.then(
			(sdkKey): { error?: unknown } => {
				fromValuesClientOptions.sdkKey = sdkKey;
				return {};
			},
			(error: unknown) => ({ error }),
		);

		let values: FrontendExperimentsResult;
		try {
			values = await valuesPromise;
		} catch (error: unknown) {
			logFetchError(error);
			// Statsig starts without values, but still with its SDK key if that arrives.
			await clientSdkKeyResult;
			await this.initFromValues(fromValuesClientOptions, identifiers, customAttributes);
			throw error;
		}

		const disabledProviders = values.disabledProviders ?? [];
		const keyFailure = disabledProviders.includes('statsig') ? {} : await clientSdkKeyResult;
		if ('error' in keyFailure) {
			logFetchError(keyFailure.error);
			await this.initFromValues(
				fromValuesClientOptions,
				identifiers,
				customAttributes,
				undefined,
				values.ffp,
				disabledProviders,
			);
			throw keyFailure.error;
		}

		await this.initFromValues(
			fromValuesClientOptions,
			identifiers,
			values.customAttributesFromFetch,
			values.experimentValues,
			values.ffp,
			disabledProviders,
		);
		this.reportEvalFlagsStatus(trigger, values.status);
	}

	/**
	 * This method initializes the client using a set of boostrap values obtained from one of the
	 * server-side SDKs.
	 *
	 * Each provider is initialized independently, and a provider in `disabledProviders` is not
	 * initialized at all.
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
		ffpValues?: FfpInitializeValues,
		disabledProviders: ReadonlyArray<EvalFlagsProvider> = [],
	): Promise<void> {
		this.overrideAdapter.initFromStoredOverrides();
		this.currentIdentifiers = identifiers;
		this.currentAttributes = customAttributes;
		this.statsigInitOptions = clientOptions;
		// FFP is independent of Statsig, so apply it before the Statsig client can fail.
		this.ffp.apply(
			clientOptions,
			disabledProviders.includes('ffp') ? undefined : ffpValues,
			identifiers,
			customAttributes,
		);
		this.valuesApplied = true;

		if (!disabledProviders.includes('statsig')) {
			await this.startStatsig(clientOptions, identifiers, customAttributes, initializeValues);
		}
	}

	/**
	 * Creates and initializes the Statsig client. If that fails, Statsig is initialized with the
	 * default SDK key and without values, and the error is rethrown.
	 */
	private async startStatsig(
		clientOptions: FromValuesClientOptions,
		identifiers: Identifiers,
		customAttributes: CustomAttributes | undefined,
		initializeValues: Record<string, unknown>,
	): Promise<void> {
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

		const frontendUser = toStatsigUser(identifiers, customAttributes);
		this.user = deepAssign({}, initializeValues.user, frontendUser);

		const statsigOptions: StatsigOptions = {
			...restClientOptions,
			environment: {
				tier: environment,
			},
			includeCurrentPageUrlWithEvents: false,
			dataAdapter: this.dataAdapter,
			overrideAdapter: this.overrideAdapter,
			logEventCompressionMode: LogEventCompressionMode.Forced,
		};

		// Statsig validates the provided stableId against their own cookie, so we either need
		// to update the cookie to match, or disable the validation completely.
		if (identifiers.stableId) {
			StableID.setOverride(identifiers.stableId, sdkKey);
		} else {
			statsigOptions.disableStableID = true;
		}

		const generation = this.statsigGeneration;
		try {
			this.statsigClient = new StatsigClient(sdkKey, this.user, statsigOptions);
			this.dataAdapter.setBootstrapData(initializeValues);
			await this.statsigClient.initializeAsync();
		} catch (error: unknown) {
			if (generation !== this.statsigGeneration) {
				// Statsig was stopped while starting, so it must not be started again with defaults.
				throw error;
			}
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
	 * Starts Statsig after initialization, when the Feature Flag Service enables it again after
	 * disabling it. Concurrent calls share one start, and a start overtaken by {@link stopStatsig}
	 * does nothing.
	 */
	private restartStatsig(
		values: FrontendExperimentsResult,
		identifiers: Identifiers,
		customAttributes: CustomAttributes | undefined,
	): Promise<void> {
		if (!this.statsigStart) {
			const generation = this.statsigGeneration;
			this.statsigStart = this.getStatsigRestartOptions(values)
				.then((options) => {
					if (generation !== this.statsigGeneration) {
						return;
					}
					this.statsigInitOptions = options;
					return this.startStatsig(options, identifiers, customAttributes, values.experimentValues);
				})
				.finally(() => {
					this.statsigStart = undefined;
				});
		}
		return this.statsigStart;
	}

	/**
	 * The options to start Statsig with after initialization. Statsig's SDK key is normally already
	 * known from initialization; otherwise it comes from the values or is fetched again.
	 */
	private async getStatsigRestartOptions(
		values: FrontendExperimentsResult,
	): Promise<FromValuesClientOptions> {
		const options: FromValuesClientOptions = { ...(this.statsigInitOptions ?? this.initOptions!) };
		if (!options.sdkKey) {
			options.sdkKey = values.clientSdkKey ?? (await this.fetchStatsigSdkKey());
		}
		return options;
	}

	private async fetchStatsigSdkKey(): Promise<string | undefined> {
		if (this.provider) {
			return this.provider.getClientSdkKey();
		}
		const initOptions = this.initOptions;
		if (initOptions && 'apiKey' in initOptions) {
			return (await Fetcher.fetchClientSdk(initOptions)).clientSdkKey;
		}
		// Initialized from values: the caller supplied the key, if any.
		return undefined;
	}

	/**
	 * Stops Statsig while the Feature Flag Service disables it: the client is shut down and no longer
	 * called, so its keys get the wrapper's defaults. It is started again when re-enabled.
	 */
	private stopStatsig(): void {
		this.statsigGeneration += 1;
		const statsigClient = this.statsigClient;
		this.statsigClient = undefined;
		this.user = undefined;
		if (statsigClient) {
			Promise.resolve(statsigClient.shutdown()).catch((error: unknown) => {
				// eslint-disable-next-line no-console
				console.warn('Failed to shut down the Statsig client', error);
			});
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
		getInitializeValues: () => Promise<FrontendExperimentsResult>,
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
	): Promise<void> {
		this.assertReady();
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
		const updateUserPromise = this.updateClientsUser(
			initializeValuesPromise,
			identifiers,
			customAttributes,
		);

		// We replace the init promise here since we are essentially re-initializing the client at this
		// point. Any subsequent calls to await client.initialize() or client.updateUser()
		// will now also await this user update.
		this.initPromise = updateUserPromise.catch(async () => {
			// A failed update leaves the initialization result as it was.
			this.initPromise = originalInitPromise;

			// Once the values arrive the client switches to the new user, even if Statsig then fails to
			// update, so the provider keeps the new profile. Only a failed fetch reverts it.
			if (this.isCurrentUser(identifiers, customAttributes)) {
				return;
			}

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
	 * This method updates the user on each provider's client, independently: FFP serves the new
	 * user's values even if Statsig fails to update, and a provider disabled by the Feature Flag
	 * Service is stopped (or, if it is enabled again, started).
	 *
	 * @param identifiers
	 * @param customAttributes
	 * @param initializeValuesPromise
	 * @private
	 */
	private async updateClientsUser(
		initializeValuesPromise: Promise<FrontendExperimentsResult>,
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
	): Promise<void> {
		let initializeValues: FrontendExperimentsResult;
		try {
			initializeValues = await initializeValuesPromise;
		} catch (err) {
			// Make sure the updateUserCompletionCallback is called for any errors in our custom code.
			// This is not necessary for the updateUserWithValues call, because the Statsig client will
			// already invoke the callback itself.
			const errMsg = err instanceof Error ? err.message : JSON.stringify(err);
			this.initOptions!.updateUserCompletionCallback?.(false, errMsg);
			throw err;
		}

		const disabledProviders = initializeValues.disabledProviders ?? [];
		this.currentIdentifiers = identifiers;
		this.currentAttributes = customAttributes;
		this.ffp.apply(
			this.initOptions!,
			disabledProviders.includes('ffp') ? undefined : initializeValues.ffp,
			identifiers,
			initializeValues.customAttributesFromFetch,
		);

		let success = true;
		let errorMessage: string | null = null;
		try {
			await this.updateStatsigUser(
				initializeValues,
				identifiers,
				disabledProviders.includes('statsig'),
			);
		} catch (err) {
			success = false;
			errorMessage = String(err);
		}

		this.initOptions?.updateUserCompletionCallback?.(success, errorMessage);
		this.subscriptions.anyUpdated();
		this.reportEvalFlagsStatus('updateUser', initializeValues.status);
		if (!success) {
			throw new Error('Failed to update user. An unexpected error occured.');
		}
	}

	/** Updates, starts or stops Statsig for a new user, as the Feature Flag Service directs. */
	private async updateStatsigUser(
		initializeValues: FrontendExperimentsResult,
		identifiers: Identifiers,
		disabled: boolean,
	): Promise<void> {
		if (disabled) {
			this.stopStatsig();
			return;
		}
		// Let a start that is already in progress finish, then update the client it created.
		await this.statsigStart?.catch(() => undefined);
		if (!this.statsigClient) {
			await this.restartStatsig(
				initializeValues,
				identifiers,
				initializeValues.customAttributesFromFetch,
			);
			return;
		}
		const frontendUser = toStatsigUser(identifiers, initializeValues.customAttributesFromFetch);
		this.dataAdapter.setBootstrapData(initializeValues.experimentValues);
		this.user = deepAssign({}, initializeValues.experimentValues.user, frontendUser);
		await this.statsigClient.updateUserAsync(this.user);
	}

	/**
	 * Picks the one source that answers for a gate or config, so a key never reaches a client that
	 * does not own it:
	 * - FFP, for a key in its latest payload. A local override for such a key is applied here
	 *   instead, because Statsig must not be called for it.
	 * - Statsig, for every other key while it is enabled. It applies local overrides itself.
	 * - Otherwise a local override, or the wrapper's default.
	 */
	private route<K extends 'gates' | 'configs'>(
		name: string,
		kind: K,
	): Route<LocalOverrides[K][string]> {
		const servedByFfp = this.ffp.has(name);
		if (!servedByFfp && this.statsigClient) {
			return { source: 'statsig', statsigClient: this.statsigClient };
		}
		const override = this.overrideAdapter.getOverride(kind, name);
		if (override !== undefined) {
			return { source: 'override', value: override };
		}
		return { source: servedByFfp ? 'ffp' : 'default' };
	}

	/**
	 * Throws until values have been applied by an initialize method. Statsig may legitimately be
	 * absent afterwards, when the Feature Flag Service disables it.
	 */
	private assertReady(): void {
		if (!this.valuesApplied) {
			throw new Error('Client must be initialized before using this method');
		}
	}

	/**
	 * Call this if modifying the values being served by the Statsig library since it has its own
	 * memoization cache which will not be updated if the values are changed outside of the library.
	 */
	protected statsigValuesUpdated = (): void => {
		if (this.user) {
			// Trigger a reset of the memoize cache
			this.statsigClient?.updateUserSync(this.user, { disableBackgroundCacheRefresh: true });
		}
		this.subscriptions.anyUpdated();
	};

	/**
	 * @returns string version of the current package in semver style.
	 */
	getPackageVersion(): string {
		return CLIENT_VERSION;
	}

	/**
	 * Returns the `targetApp` value that was provided during client initialization.
	 * This identifies the product/app context (e.g., `'confluence_web'`, `'jira_web'`).
	 *
	 * Returns `undefined` if `initialize` has never been called.
	 *
	 * @returns The targetApp string, or undefined if initialize has never been called.
	 */
	getTargetApp(): string | undefined {
		return this.initOptions?.targetApp;
	}

	/**
	 * Returns a specified layer otherwise returns an empty layer as a default value if the layer doesn't exist.
	 *
	 * Layers exist only in Statsig. Flags that only exist in the Feature Flag Platform (FFP) are read
	 * with {@link Client.ffpClient}.
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
			this.assertReady();
			const { fireLayerExposure = true } = options;
			if (!this.statsigClient) {
				// Layers are Statsig-only, so without Statsig only an override can serve one.
				const layer = _makeLayer(layerName, { reason: 'Unrecognized' }, null);
				return Layer.fromLayer(this.overrideAdapter.getLayerOverride(layer, {}) ?? layer);
			}
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
	 * Layers exist only in Statsig. Flags that only exist in the Feature Flag Platform (FFP) are read
	 * with {@link Client.ffpClient}.
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
