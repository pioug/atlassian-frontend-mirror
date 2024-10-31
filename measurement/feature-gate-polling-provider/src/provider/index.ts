import Fetcher, {
	EXPERIMENT_VALUES_API_VERSION,
	type FetcherOptions,
	type FrontendClientSdkKeyResponse,
	type FrontendExperimentsResponse,
} from '@atlaskit/feature-gate-fetcher';
import {
	type BaseClientOptions,
	type CustomAttributes,
	type FrontendExperimentsResult,
	type Identifiers,
	type OptionsWithDefaults,
	type Provider,
} from '@atlaskit/feature-gate-js-client';

import Broadcast from '../Broadcast';
import FeatureGatesDB from '../database/FeatureGatesDB';
import { type ExperimentValuesEntry, type RulesetProfile } from '../database/types';

import Refresh from './Refresh';
import { type FeatureGateState, type ProviderOptions } from './types';
import { cloneObject, createHash, getFrontendExperimentsResult } from './utils';

export type { ProviderOptions } from './types';

export const DATABASE_PURGE_TIMEOUT = 10000;

export default class PollingProvider implements Provider {
	private readonly providerOptions: ProviderOptions;

	// Profile hash of the current user and context.
	// This will be undefined if client has not been initialised or when a user is being updated
	private currentProfileHash: string | undefined;
	private currentRulesetProfile: RulesetProfile | undefined;

	private lastUpdatedTimestamp: number = 0;

	private featureGatesDB: FeatureGatesDB | undefined;
	private clientVersion: string | undefined;
	private refresh: Refresh;
	private broadcast: Broadcast;
	private applyUpdate: ((experimentsResult: FrontendExperimentsResult) => void) | undefined;

	constructor(providerOptions: ProviderOptions) {
		this.providerOptions = providerOptions;

		this.featureGateUpdateHttpHandler = this.featureGateUpdateHttpHandler.bind(this);
		this.featureGateUpdateBroadcastHandler = this.featureGateUpdateBroadcastHandler.bind(this);

		this.refresh = new Refresh(providerOptions, this.featureGateUpdateHttpHandler);
		this.broadcast = new Broadcast(providerOptions.apiKey, this.featureGateUpdateBroadcastHandler);

		try {
			this.featureGatesDB = new FeatureGatesDB();

			// Dont run on startup to prevent slowdown
			setTimeout(() => this.featureGatesDB?.purgeStaleEntries(), DATABASE_PURGE_TIMEOUT);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.warn(`Error when trying to start DB, ${JSON.stringify(error)}`);
		}
	}

	setApplyUpdateCallback(
		applyUpdate: (experimentsResult: FrontendExperimentsResult) => void,
	): void {
		this.applyUpdate = applyUpdate;
	}

	setClientVersion(clientVersion: string): void {
		this.clientVersion = clientVersion;
		this.refresh.setClientVersion(clientVersion);
	}

	async setProfile(
		clientOptions: OptionsWithDefaults<BaseClientOptions>,
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
	): Promise<void> {
		const { profileHash, rulesetProfile } = await this.getProfileHashAndProfile(
			clientOptions,
			identifiers,
			customAttributes,
		);

		if (this.currentProfileHash !== profileHash) {
			this.lastUpdatedTimestamp = 0;
		}

		this.currentProfileHash = profileHash;
		this.currentRulesetProfile = rulesetProfile;
		this.broadcast.updateUserContext(profileHash);
		this.refresh.updateProfile(
			profileHash,
			rulesetProfile,
			// We expect setProfile to be set 1. before calls to get* methods and 2. used to revert the user if updateUser* fails
			// For 1, we will set the timestamp to the current time as the get methods will cause a request if it is needed
			// For 2, it is an error case and with this code it would reset the next polling interval, delaying the next poll for new values
			Date.now(),
		);
		this.refresh.start();
	}

	async getExperimentValues(): Promise<FrontendExperimentsResult> {
		if (!this.clientVersion) {
			throw new Error('Client version has not been set');
		}

		if (!this.currentRulesetProfile || !this.currentProfileHash) {
			throw new Error('Profile has not been set');
		}

		const profileHash = cloneObject(this.currentProfileHash);
		const rulesetProfile = cloneObject(this.currentRulesetProfile);

		// Attempt to get from the DB
		const dbValues = await this.featureGatesDB?.getExperimentValues(profileHash);

		const lastKnownUpdatedTimestamp = dbValues?.timestamp ?? 0;

		this.lastUpdatedTimestamp = lastKnownUpdatedTimestamp;

		if (dbValues) {
			this.refresh.setTimestamp(lastKnownUpdatedTimestamp);
			this.refresh.start();
			return getFrontendExperimentsResult(dbValues.experimentValuesResponse);
		}

		let newLastUpdatedTimestamp = lastKnownUpdatedTimestamp;

		const experimentResult = await this.fetchExperimentValues(this.clientVersion, rulesetProfile)
			.then((result) => {
				newLastUpdatedTimestamp = Date.now();
				return result;
			})
			.finally(() => {
				if (profileHash === this.currentProfileHash) {
					this.lastUpdatedTimestamp = newLastUpdatedTimestamp;
					this.refresh.setTimestamp(newLastUpdatedTimestamp);
					this.refresh.start();
				}
			});

		const featureGateState = {
			profileHash,
			rulesetProfile,
			experimentValuesResponse: experimentResult,
			timestamp: newLastUpdatedTimestamp,
		};

		// Should not process this update as getExperimentValues will only be called on initialize and update user,
		// and in those cases processing is handled elsewhere
		this.featureGateUpdateHttpHandler(featureGateState, false);

		return getFrontendExperimentsResult(experimentResult);
	}

	async getClientSdkKey(): Promise<string> {
		if (!this.clientVersion) {
			throw new Error('Client version has not been set');
		}

		if (!this.currentRulesetProfile) {
			throw new Error('Profile has not been set');
		}

		const { environment, targetApp, perimeter } = this.currentRulesetProfile;
		const { apiKey, initialFetchTimeout, useGatewayURL } = this.providerOptions;

		const fetcherOptions: FetcherOptions = {
			environment,
			targetApp,
			perimeter,
			apiKey,
			fetchTimeoutMs: initialFetchTimeout,
			useGatewayURL,
		};

		const clientKeyFromDB = await this.featureGatesDB?.getClientSdkKey({
			targetApp,
			environment,
			perimeter,
		});

		if (clientKeyFromDB) {
			return clientKeyFromDB.clientSdkKey;
		}

		const { clientSdkKey }: FrontendClientSdkKeyResponse = await Fetcher.fetchClientSdkKey(
			this.clientVersion,
			fetcherOptions,
		);

		this.featureGatesDB?.setClientSdkKey({
			clientSdkKey,
			targetApp,
			environment,
			perimeter,
			timestamp: Date.now(),
		});

		return clientSdkKey;
	}

	getApiKey(): string {
		return this.providerOptions.apiKey;
	}

	private async getProfileHashAndProfile(
		clientOptions: OptionsWithDefaults<BaseClientOptions>,
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
	): Promise<{ profileHash: string; rulesetProfile: RulesetProfile }> {
		const rulesetProfile: RulesetProfile = this.getRulesetProfile(
			clientOptions,
			identifiers,
			customAttributes,
		);

		const hashedProfile = await createHash(JSON.stringify(rulesetProfile));

		return {
			profileHash: EXPERIMENT_VALUES_API_VERSION + '.' + hashedProfile,
			rulesetProfile,
		};
	}

	private getRulesetProfile(
		clientOptions: OptionsWithDefaults<BaseClientOptions>,
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
	): RulesetProfile {
		return {
			identifiers,
			customAttributes,
			environment: clientOptions.environment,
			targetApp: clientOptions.targetApp,
			perimeter: clientOptions.perimeter,
		};
	}

	private async fetchExperimentValues(
		clientVersion: string,
		rulesetProfile: RulesetProfile,
	): Promise<FrontendExperimentsResponse> {
		const { identifiers, customAttributes, environment, targetApp, perimeter } = rulesetProfile;
		const { apiKey, initialFetchTimeout, useGatewayURL } = this.providerOptions;

		const fetcherOptions: FetcherOptions = {
			environment,
			targetApp,
			perimeter,
			apiKey,
			fetchTimeoutMs: initialFetchTimeout,
			useGatewayURL,
		};

		return await Fetcher.fetchExperimentValues(
			clientVersion,
			fetcherOptions,
			identifiers,
			customAttributes,
		);
	}

	private featureGateUpdateHttpHandler(
		experimentValuesEntry: ExperimentValuesEntry,
		shouldProcessUpdate: boolean = true,
	): void {
		if (shouldProcessUpdate) {
			this.processFeatureGateUpdate(experimentValuesEntry);
		}

		this.featureGatesDB?.setExperimentValues(experimentValuesEntry);

		// broadcast the flag state to other tabs if the profile matches that of the current broadcast channel
		if (experimentValuesEntry.profileHash === this.currentProfileHash) {
			this.broadcast.sendFeatureGateState(experimentValuesEntry);
		}
	}

	private featureGateUpdateBroadcastHandler(featureGateState: FeatureGateState): void {
		// return if broadcasted feature gate state is stale
		if (featureGateState.timestamp < this.lastUpdatedTimestamp) {
			return;
		}

		this.processFeatureGateUpdate(featureGateState);
	}

	private processFeatureGateUpdate(featureGateState: FeatureGateState): void {
		if (this.currentProfileHash === featureGateState.profileHash) {
			this.lastUpdatedTimestamp = featureGateState.timestamp;
			this.refresh.setTimestamp(featureGateState.timestamp);

			if (!this.applyUpdate) {
				// eslint-disable-next-line no-console
				console.warn('No apply update callback has been set. Cannot update experiment values.');
			} else {
				this.applyUpdate(getFrontendExperimentsResult(featureGateState.experimentValuesResponse));
			}
		}
	}
}
