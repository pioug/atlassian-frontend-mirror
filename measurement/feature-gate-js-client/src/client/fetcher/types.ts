import { type CustomAttributes, type Identifiers } from '../FeatureGates';
import { type EvalFlagsStatus, type FfpInitializeValues } from '../types';

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
 * Response of the Feature Flag Service `/api/v1/evalFlags` endpoint. When both providers are `OK`,
 * each flag is in exactly one section. A section is only meaningful when its provider's `status` is
 * `OK`; otherwise it is empty (omitted, `null` or `{}`). `status` is always reported, as a 5xx is
 * returned without a body.
 */
export interface EvalFlagsResponse {
	statsig?: FrontendExperimentsResponse | null;
	ffp?: FfpInitializeValues | null;
	status: EvalFlagsStatus;
}

export interface FrontendClientSdkKeyResponse {
	clientSdkKey: string;
}
