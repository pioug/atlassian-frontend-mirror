import { Client } from './Client';
import { type FeatureFlagValue, type WithDocComments } from './types';
import { CLIENT_VERSION } from './version';

export type { EvaluationDetails, LocalOverrides } from 'statsig-js-lite';
export { DynamicConfig, EvaluationReason } from 'statsig-js-lite';

export type {
	AnalyticsWebClient,
	BaseClientOptions,
	CheckGateOptions,
	ClientOptions,
	CustomAttributes,
	FromValuesClientOptions,
	FrontendExperimentsResult,
	GetExperimentOptions,
	GetExperimentValueOptions,
	Identifiers,
	InitializeValues,
	OptionsWithDefaults,
	UpdateUserCompletionCallback,
	Provider,
} from './types';
export { FeatureGateEnvironment, PerimeterType } from './types';

export { CLIENT_VERSION } from './version';

declare global {
	interface Window {
		__FEATUREGATES_JS__: StaticFeatureGatesClient;
		__CRITERION__?: {
			addFeatureFlagAccessed?: (flagName: string, flagValue: FeatureFlagValue) => void;
			addUFOHold?: (id: string, name: string, labelStack: string, startTime: number) => void;
			removeUFOHold?: (id: string) => void;
			getFeatureFlagOverride?: (flagName: string) => boolean | undefined;
			getExperimentValueOverride?: <T>(experimentName: string, parameterName: string) => T;
		};
	}
}

/**
 * Access the FeatureGates object via the default export.
 * ```ts
 * import FeatureGates from '@atlaskit/feature-gate-js-client';
 * ```
 */
class FeatureGates {
	private static client = new Client();
	private static hasCheckGateErrorOccurred = false;
	private static hasGetExperimentValueErrorOccurred = false;

	static checkGate: Client['checkGate'] = (gateName, options) => {
		try {
			// Check if the CRITERION override mechanism is available
			if (
				window &&
				window.__CRITERION__ &&
				typeof window.__CRITERION__.getFeatureFlagOverride === 'function'
			) {
				// Attempt to retrieve an override value for the feature gate
				const overrideValue = window.__CRITERION__.getFeatureFlagOverride(gateName);
				// If an override value is found, return it immediately
				if (overrideValue !== undefined) {
					return overrideValue;
				}
			}
		} catch (error) {
			// Log the first occurrence of the error
			if (!FeatureGates.hasCheckGateErrorOccurred) {
				// eslint-disable-next-line no-console
				console.warn({
					msg: 'An error has occurred checking the feature gate from criterion override. Only the first occurrence of this error is logged.',
					gateName,
					error,
				});
				FeatureGates.hasCheckGateErrorOccurred = true;
			}
		}

		// Proceed with the main logic if no override is found
		return this.client.checkGate(gateName, options);
	};

	static isGateExists(gateName: string): boolean {
		return this.client.isGateExist(gateName);
	}
	static isExperimentExists(experimentName: string): boolean {
		return this.client.isExperimentExist(experimentName);
	}
	static getExperimentValue: Client['getExperimentValue'] = (
		experimentName,
		parameterName,
		defaultValue,
		options,
	) => {
		try {
			// Check if the CRITERION override mechanism is available
			if (
				typeof window !== 'undefined' &&
				window.__CRITERION__ &&
				typeof window.__CRITERION__.getExperimentValueOverride === 'function'
			) {
				const overrideValue = window.__CRITERION__.getExperimentValueOverride(
					experimentName,
					parameterName,
				);
				if (overrideValue !== undefined && overrideValue !== null) {
					return overrideValue as any;
				}
			}
		} catch (error) {
			// Log the first occurrence of the error
			if (!FeatureGates.hasCheckGateErrorOccurred) {
				// Log the first occurrence of the error
				if (!this.hasGetExperimentValueErrorOccurred) {
					// eslint-disable-next-line no-console
					console.warn({
						msg: 'An error has occurred getting the experiment value from criterion override. Only the first occurrence of this error is logged.',
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

		// Proceed with the main logic if no override is found
		return this.client.getExperimentValue(experimentName, parameterName, defaultValue, options);
	};

	static initializeCalled = this.client.initializeCalled.bind(this.client);
	static initializeCompleted = this.client.initializeCompleted.bind(this.client);
	static initialize = this.client.initialize.bind(this.client);
	static initializeWithProvider = this.client.initializeWithProvider.bind(this.client);
	static initializeFromValues = this.client.initializeFromValues.bind(this.client);
	static manuallyLogGateExposure = this.client.manuallyLogGateExposure.bind(this.client);
	static getExperiment = this.client.getExperiment.bind(this.client);
	static manuallyLogExperimentExposure = this.client.manuallyLogExperimentExposure.bind(
		this.client,
	);
	static manuallyLogLayerExposure = this.client.manuallyLogLayerExposure.bind(this.client);
	static shutdownStatsig = this.client.shutdownStatsig.bind(this.client);
	static overrideGate = this.client.overrideGate.bind(this.client);
	static clearGateOverride = this.client.clearGateOverride.bind(this.client);
	static overrideConfig = this.client.overrideConfig.bind(this.client);
	static clearConfigOverride = this.client.clearConfigOverride.bind(this.client);
	static setOverrides = this.client.setOverrides.bind(this.client);
	static getOverrides = this.client.getOverrides.bind(this.client);
	static clearAllOverrides = this.client.clearAllOverrides.bind(this.client);
	static isCurrentUser = this.client.isCurrentUser.bind(this.client);
	static onGateUpdated = this.client.onGateUpdated.bind(this.client);
	static onExperimentValueUpdated = this.client.onExperimentValueUpdated.bind(this.client);
	static onAnyUpdated = this.client.onAnyUpdated.bind(this.client);
	static updateUser = this.client.updateUser.bind(this.client);
	static updateUserWithProvider = this.client.updateUserWithProvider.bind(this.client);
	static updateUserWithValues = this.client.updateUserWithValues.bind(this.client);
	static getPackageVersion = this.client.getPackageVersion.bind(this.client);
	static getLayer = this.client.getLayer.bind(this.client);
	static getLayerValue = this.client.getLayerValue.bind(this.client);
}

type StaticFeatureGatesClient = WithDocComments<typeof FeatureGates, Client>;
let boundFGJS = FeatureGates as StaticFeatureGatesClient;

// This makes it possible to get a reference to the FeatureGates client at runtime.
// This is important for overriding values in Cypress tests, as there needs to be a
// way to get the exact instance for a window in order to mock some of its methods.
if (typeof window !== 'undefined') {
	if (window.__FEATUREGATES_JS__ === undefined) {
		window.__FEATUREGATES_JS__ = FeatureGates;
	} else {
		boundFGJS = window.__FEATUREGATES_JS__ as StaticFeatureGatesClient;
		const boundVersion = boundFGJS?.getPackageVersion?.() || '4.10.0 or earlier';
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
