import Fetcher, {
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

import { type ProviderOptions } from './types';

export type { ProviderOptions } from './types';

export default class SingleFetchProvider implements Provider {
	private readonly providerOptions: ProviderOptions;
	private clientVersion: string | undefined;
	private clientOptions: BaseClientOptions | undefined;
	private identifiers: Identifiers | undefined;
	private customAttributes: CustomAttributes | undefined;

	constructor(providerOptions: ProviderOptions) {
		this.providerOptions = providerOptions;
	}

	setClientVersion(clientVersion: string): void {
		this.clientVersion = clientVersion;
	}

	async setProfile(
		clientOptions: BaseClientOptions,
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
	): Promise<void> {
		this.clientOptions = clientOptions;
		this.identifiers = identifiers;
		this.customAttributes = customAttributes;
	}

	async getExperimentValues(): Promise<FrontendExperimentsResult> {
		if (!this.clientVersion) {
			throw new Error('Client version has not been set');
		}

		if (!this.clientOptions || !this.identifiers) {
			throw new Error('Profile has not been set');
		}

		const fetcherOptions: FetcherOptions = {
			...this.clientOptions,
			...this.providerOptions,
		};

		return await Fetcher.fetchExperimentValues(
			this.clientVersion,
			fetcherOptions,
			this.identifiers,
			this.customAttributes,
		).then((result: FrontendExperimentsResponse) => ({
			experimentValues: result.experimentValues,
			customAttributesFromFetch: result.customAttributes,
			clientSdkKey: result.clientSdkKey,
		}));
	}

	async getClientSdkKey(): Promise<string> {
		if (!this.clientVersion) {
			throw new Error('Client version has not been set');
		}

		if (!this.clientOptions) {
			throw new Error('Profile has not been set');
		}

		const fetcherOptions: FetcherOptions = {
			...this.clientOptions,
			...this.providerOptions,
		};

		const result: FrontendClientSdkKeyResponse = await Fetcher.fetchClientSdkKey(
			this.clientVersion,
			fetcherOptions,
		);
		return result.clientSdkKey;
	}

	getApiKey(): string {
		return this.providerOptions.apiKey;
	}
}
