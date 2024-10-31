import {
	type BaseClientOptions,
	type CustomAttributes,
	type Identifiers,
	type OptionsWithDefaults,
} from '@atlaskit/feature-gate-js-client';

export interface FrontendExperimentsRequest {
	identifiers: Identifiers;
	customAttributes?: CustomAttributes;
	targetApp: string;
}

export interface FrontendExperimentsResponse {
	clientSdkKey?: string;
	experimentValues: Record<string, unknown>;
	customAttributes: CustomAttributes;
}

export interface FrontendClientSdkKeyResponse {
	clientSdkKey: string;
}

export type FetcherOptions = Pick<
	OptionsWithDefaults<BaseClientOptions>,
	'environment' | 'targetApp' | 'perimeter'
> & {
	apiKey: string;
	fetchTimeoutMs?: number;
	useGatewayURL?: boolean;
};
