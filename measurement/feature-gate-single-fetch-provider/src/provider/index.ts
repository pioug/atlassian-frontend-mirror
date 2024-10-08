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

import { type ProviderOptions } from './types';

export type { ProviderOptions } from './types';

export default class SingleFetchProvider implements Provider {
	private readonly providerOptions: ProviderOptions;
	private clientVersion: string | undefined;

	constructor(providerOptions: ProviderOptions) {
		this.providerOptions = providerOptions;
	}

	setClientVersion(clientVersion: string): void {
		this.clientVersion = clientVersion;
	}

	async getExperimentValues(
		clientOptions: ClientOptions,
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
	): Promise<FrontendExperimentsResult> {
		if (!this.clientVersion) {
			throw new Error('Client version has not been set');
		}

		const fetcherOptions: FetcherOptions = {
			...clientOptions,
			...this.providerOptions,
		};

		return await Fetcher.fetchExperimentValues(
			this.clientVersion,
			fetcherOptions,
			identifiers,
			customAttributes,
		).then((result: FrontendExperimentsResponse) => ({
			experimentValues: result.experimentValues,
			customAttributesFromFetch: result.customAttributes,
			clientSdkKey: result.clientSdkKey,
		}));
	}

	async getClientSdkKey(clientOptions: ClientOptions): Promise<string> {
		if (!this.clientVersion) {
			throw new Error('Client version has not been set');
		}

		const fetcherOptions: FetcherOptions = {
			...clientOptions,
			...this.providerOptions,
		};

		const result: FrontendClientSdkKeyResponse = await Fetcher.fetchClientSdk(
			this.clientVersion,
			fetcherOptions,
		);
		return result.clientSdkKey;
	}

	getApiKey(): string {
		return this.providerOptions.apiKey;
	}
}
