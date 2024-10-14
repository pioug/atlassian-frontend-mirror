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
	type Provider,
} from '@atlaskit/feature-gate-js-client';

import Broadcast from '../Broadcast';
import FeatureGatesDB from '../database/FeatureGatesDB';
import { type ExperimentValuesEntry, type RulesetProfile } from '../database/types';

import Refresh from './Refresh';
import { type FeatureGateState, type ProviderOptions } from './types';
import { createHash, getFrontendExperimentsResult } from './utils';

export type { ProviderOptions } from './types';

export const DATABASE_PURGE_TIMEOUT = 10000;
// 5 min
export const EXPERIMENT_VALUES_STALE_TIMEOUT_MS = 1000 * 60 * 5;

export default class PollingProvider implements Provider {
	private readonly providerOptions: ProviderOptions;
	private currentProfileHash: string | undefined;
	private featureGatesDB: FeatureGatesDB | undefined;
	private clientVersion: string | undefined;
	private refresh: Refresh;
	private broadcast: Broadcast;
	private applyUpdate: ((experimentsResult: FrontendExperimentsResult) => void) | undefined;
	private lastUpdatedTimestamp: number = 0;

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

	async getExperimentValues(
		clientOptions: BaseClientOptions,
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
	): Promise<FrontendExperimentsResult> {
		if (!this.clientVersion) {
			throw new Error('Client version has not been set');
		}

		const { profileHash, rulesetProfile } = await this.getProfileHashAndProfile(
			clientOptions,
			identifiers,
			customAttributes,
		);

		this.currentProfileHash = profileHash;
		this.refresh.stop();

		// Attempt to get from the DB
		const dbValues = await this.featureGatesDB?.getExperimentValues(profileHash);

		const lastKnownUpdatedTimestamp =
			!dbValues || Date.now() - dbValues.timestamp >= EXPERIMENT_VALUES_STALE_TIMEOUT_MS
				? 0
				: dbValues.timestamp;

		this.refresh.updateProfile(profileHash, rulesetProfile, lastKnownUpdatedTimestamp);
		this.broadcast.updateUserContext(profileHash);

		if (dbValues) {
			this.refresh.start();
			this.lastUpdatedTimestamp = dbValues.timestamp;
			return getFrontendExperimentsResult(dbValues.experimentValuesResponse);
		}

		let newLastUpdatedTimestamp = lastKnownUpdatedTimestamp;

		const experimentResult = await this.fetchExperimentValues(
			this.clientVersion,
			clientOptions,
			identifiers,
			customAttributes,
		)
			.then((result) => {
				newLastUpdatedTimestamp = Date.now();
				return result;
			})
			.finally(() => {
				this.refresh.start();
			});

		this.featureGateUpdateHttpHandler({
			profileHash,
			rulesetProfile,
			experimentValuesResponse: experimentResult,
			timestamp: newLastUpdatedTimestamp,
		});

		return getFrontendExperimentsResult(experimentResult);
	}

	async getClientSdkKey(clientOptions: BaseClientOptions): Promise<string> {
		if (!this.clientVersion) {
			throw new Error('Client version has not been set');
		}

		const { environment, targetApp, perimeter } = clientOptions;
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
		clientOptions: BaseClientOptions,
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
		clientOptions: BaseClientOptions,
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
		clientOptions: BaseClientOptions,
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
	): Promise<FrontendExperimentsResponse> {
		const { environment, targetApp, perimeter } = clientOptions;
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

	private featureGateUpdateHttpHandler(experimentValuesEntry: ExperimentValuesEntry): void {
		this.processFeatureGateUpdate(experimentValuesEntry);

		this.featureGatesDB?.setExperimentValues(experimentValuesEntry);

		// broadcast the flag state to other tabs
		this.broadcast.sendFeatureGateState(experimentValuesEntry);
	}

	private featureGateUpdateBroadcastHandler(featureGateState: FeatureGateState): void {
		// return if broadcasted ff state is stale
		if (featureGateState.timestamp < this.lastUpdatedTimestamp) {
			return;
		}

		this.processFeatureGateUpdate(featureGateState);
	}

	private processFeatureGateUpdate(featureGateState: FeatureGateState): void {
		if (this.currentProfileHash === featureGateState.profileHash) {
			this.lastUpdatedTimestamp = featureGateState.timestamp;

			if (!this.applyUpdate) {
				// eslint-disable-next-line no-console
				console.warn('No apply update callback has been set. Cannot update experiment values.');
			} else {
				this.applyUpdate(getFrontendExperimentsResult(featureGateState.experimentValuesResponse));
			}

			this.refresh.setTimestamp(this.lastUpdatedTimestamp);
		}
	}
}
