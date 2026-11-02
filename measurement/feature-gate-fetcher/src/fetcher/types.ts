import type {
	BaseClientOptions,
	CustomAttributes,
	EvalFlagsStatus,
	FfpInitializeValues,
	Identifiers,
	OptionsWithDefaults,
} from '@atlaskit/feature-gate-js-client/types';

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
 * Response of the Feature Flag Service `/api/v1/evalFlags` endpoint. When both Statsig and the
 * Feature Flag Platform (FFP) are `OK`, the service partitions flags so each key is in exactly one
 * section. A section is only meaningful when its provider's `status` is `OK`; otherwise it is empty
 * (omitted, `null` or `{}`). `status` is always reported, as a 5xx is returned without a body.
 */
export interface EvalFlagsResponse {
	statsig?: FrontendExperimentsResponse | null;
	ffp?: FfpInitializeValues | null;
	status: EvalFlagsStatus;
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
	/**
	 * Whether to include flags served by the Feature Flag Platform (FFP). Defaults to `false`. When
	 * `true`, {@link Fetcher.fetchExperimentValues} fetches from `/api/v1/evalFlags` and returns only
	 * its Statsig section; {@link Fetcher.fetchEvalFlags} always includes FFP flags.
	 */
	includeFfpFlags?: boolean;
};
