import { type CustomAttributes, type Identifiers } from '../FeatureGates';

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

/**
 * The parts of a Feature Flag Service `/api/v1/evalFlags` response that are used. The Statsig
 * section is only meaningful when `status.statsig` is `OK`.
 */
export interface EvalFlagsResponse {
	statsig?: FrontendExperimentsResponse | null;
	status?: {
		statsig?: string;
	};
}

export interface FrontendClientSdkKeyResponse {
	clientSdkKey: string;
}
