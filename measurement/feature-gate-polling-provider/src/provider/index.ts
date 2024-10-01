import { createHash } from 'crypto';

import Fetcher, {
	type ClientOptions,
	type CustomAttributes,
	type FetcherOptions,
	type FrontendClientSdkKeyResponse,
	type FrontendExperimentsResponse,
	type FrontendExperimentsResult,
	type Identifiers,
	type Provider,
} from '@atlaskit/feature-gate-fetcher';

import FeatureGatesDB from '../database/FeatureGatesDB';
import { type RulesetProfile } from '../database/types';

import { type ProviderOptions } from './types';

export type { ProviderOptions } from './types';

export const DATABASE_PURGE_TIMEOUT = 10000;
// 5 min
export const EXPERIMENT_VALUES_STALE_TIMEOUT_MS = 1000 * 60 * 5;

export default class PollingProvider implements Provider {
	private readonly providerOptions: ProviderOptions;
	private currentProfileHash: string | undefined;
	private currentTargetApp: string | undefined;
	private featureGatesDB: FeatureGatesDB | undefined;
	private applyUpdate: ((experimentsResult: FrontendExperimentsResult) => void) | undefined;

	constructor(providerOptions: ProviderOptions) {
		this.providerOptions = providerOptions;

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

	async getExperimentValues(
		clientVersion: string,
		clientOptions: ClientOptions,
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
	): Promise<FrontendExperimentsResult> {
		this.currentProfileHash = this.getProfileHash(clientOptions, identifiers, customAttributes);
		this.currentTargetApp = clientOptions.targetApp;

		// Attempt to get from local storage
		const valuesFromDB = await this.featureGatesDB?.getExperimentValues(this.currentProfileHash);

		if (valuesFromDB) {
			if (Date.now() - valuesFromDB.timestamp > EXPERIMENT_VALUES_STALE_TIMEOUT_MS) {
				this.triggerValuesRefetch(clientVersion, clientOptions, identifiers, customAttributes);
			}

			return valuesFromDB.experimentValues;
		}

		const experimentResult = await this.fetchExperimentValues(
			clientVersion,
			clientOptions,
			identifiers,
			customAttributes,
		);

		this.featureGatesDB?.setExperimentValues({
			profileHash: this.currentProfileHash,
			context: this.getRulesetProfile(clientOptions, identifiers, customAttributes),
			experimentValues: experimentResult,
			timestamp: Date.now(),
		});

		return experimentResult;
	}

	async getClientSdkKey(clientVersion: string, clientOptions: ClientOptions): Promise<string> {
		this.currentTargetApp = clientOptions.targetApp;

		const fetcherOptions: FetcherOptions = {
			...clientOptions,
			...this.providerOptions,
		};

		const clientKeyFromDB = await this.featureGatesDB?.getClientSdkKey(this.currentTargetApp);

		if (clientKeyFromDB) {
			return clientKeyFromDB.clientSdkKey;
		}

		const { clientSdkKey }: FrontendClientSdkKeyResponse = await Fetcher.fetchClientSdk(
			clientVersion,
			fetcherOptions,
		);

		this.featureGatesDB?.setClientSdkKey({
			clientSdkKey,
			targetApp: clientOptions.targetApp,
			timestamp: Date.now(),
		});

		return clientSdkKey;
	}

	getApiKey(): string {
		return this.providerOptions.apiKey;
	}

	private getProfileHash(
		clientOptions: ClientOptions,
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
	): string {
		const rulesetProfile: RulesetProfile = this.getRulesetProfile(
			clientOptions,
			identifiers,
			customAttributes,
		);

		return createHash('sha256').update(JSON.stringify(rulesetProfile)).digest('hex');
	}

	private getRulesetProfile(
		clientOptions: ClientOptions,
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

	private async triggerValuesRefetch(
		clientVersion: string,
		clientOptions: ClientOptions,
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
	): Promise<void> {
		if (!this.applyUpdate) {
			// eslint-disable-next-line no-console
			console.warn('No apply update callback has been set. Cannot update experiment values.');
			return;
		}

		const experimentResult = await this.fetchExperimentValues(
			clientVersion,
			clientOptions,
			identifiers,
			customAttributes,
		);

		const recalculatedHash = this.getProfileHash(clientOptions, identifiers, customAttributes);

		this.featureGatesDB?.setExperimentValues({
			profileHash: recalculatedHash,
			context: this.getRulesetProfile(clientOptions, identifiers, customAttributes),
			experimentValues: experimentResult,
			timestamp: Date.now(),
		});

		if (recalculatedHash === this.currentProfileHash) {
			this.applyUpdate(experimentResult);
		}
	}

	private async fetchExperimentValues(
		clientVersion: string,
		clientOptions: ClientOptions,
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
	): Promise<FrontendExperimentsResult> {
		const fetcherOptions: FetcherOptions = {
			...clientOptions,
			...this.providerOptions,
		};

		return await Fetcher.fetchExperimentValues(
			clientVersion,
			fetcherOptions,
			identifiers,
			customAttributes,
		).then((result: FrontendExperimentsResponse) => ({
			experimentValues: result.experimentValues,
			customAttributesFromFetch: result.customAttributes,
			clientSdkKey: result.clientSdkKey,
		}));
	}
}
