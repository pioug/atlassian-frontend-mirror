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

	constructor(providerOptions: ProviderOptions) {
		this.providerOptions = providerOptions;
	}

	async getExperimentValues(
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

	async getClientSdkKey(clientVersion: string, clientOptions: ClientOptions): Promise<string> {
		const fetcherOptions: FetcherOptions = {
			...clientOptions,
			...this.providerOptions,
		};

		const result: FrontendClientSdkKeyResponse = await Fetcher.fetchClientSdk(
			clientVersion,
			fetcherOptions,
		);
		return result.clientSdkKey;
	}

	getApiKey(): string {
		return this.providerOptions.apiKey;
	}
}
