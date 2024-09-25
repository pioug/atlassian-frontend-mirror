import { type ClientOptions, type CustomAttributes, type Identifiers } from './temp-types';

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

export type FetcherOptions = Pick<ClientOptions, 'environment' | 'targetApp' | 'perimeter'> & {
	apiKey: string;
	fetchTimeoutMs?: number;
	useGatewayURL?: boolean;
};
