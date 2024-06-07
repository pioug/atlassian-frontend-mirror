import { type CustomAttributes, type Identifiers } from '../index';

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
