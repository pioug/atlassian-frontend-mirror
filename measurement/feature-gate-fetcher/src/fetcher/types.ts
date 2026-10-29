import type {
	BaseClientOptions,
	CustomAttributes,
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

export type FetcherOptions = Pick<
	OptionsWithDefaults<BaseClientOptions>,
	'environment' | 'targetApp' | 'perimeter'
> & {
	apiKey: string;
	fetchTimeoutMs?: number;
	useGatewayURL?: boolean;
	/**
	 * Whether to include flags served by the Feature Flag Platform (FFP). When `true`, values are
	 * fetched from `/api/v1/evalFlags`, of which only the Statsig section is used for now. Defaults
	 * to `false`.
	 */
	includeFfpFlags?: boolean;
};
