import Fetcher, {
	fromExperimentValuesResponse,
	toFrontendExperimentsResult,
} from '@atlaskit/feature-gate-fetcher/Fetcher';
import type {
	EvalFlagsResponse,
	FetcherOptions,
	FrontendClientSdkKeyResponse,
} from '@atlaskit/feature-gate-fetcher/types';
import type {
	BaseClientOptions,
	CustomAttributes,
	FrontendExperimentsResult,
	Identifiers,
	OptionsWithDefaults,
	Provider,
} from '@atlaskit/feature-gate-js-client/types';

import { type ProviderOptions } from './types';

export type { ProviderOptions } from './types';

export default class SingleFetchProvider implements Provider {
	private readonly providerOptions: ProviderOptions;
	private clientVersion: string | undefined;
	private clientOptions: OptionsWithDefaults<BaseClientOptions> | undefined;
	private identifiers: Identifiers | undefined;
	private customAttributes: CustomAttributes | undefined;

	constructor(providerOptions: ProviderOptions) {
		this.providerOptions = providerOptions;
	}

	setClientVersion(clientVersion: string): void {
		this.clientVersion = clientVersion;
	}

	async setProfile(
		clientOptions: OptionsWithDefaults<BaseClientOptions>,
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

		const customAttributes = this.customAttributes;
		// Without FFP flags, only Statsig values are fetched and FFP is treated as disabled
		const response: Promise<EvalFlagsResponse> = this.providerOptions.includeFfpFlags
			? Fetcher.fetchEvalFlags(
					this.clientVersion,
					fetcherOptions,
					this.identifiers,
					customAttributes,
				)
			: Fetcher.fetchExperimentValues(
					this.clientVersion,
					fetcherOptions,
					this.identifiers,
					customAttributes,
				).then(fromExperimentValuesResponse);
		return await response.then((result: EvalFlagsResponse) =>
			toFrontendExperimentsResult(result, customAttributes),
		);
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
