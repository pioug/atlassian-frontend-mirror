import type { FetcherOptions } from '@atlaskit/feature-gate-fetcher/types';

export type ProviderOptions = Pick<
	FetcherOptions,
	'apiKey' | 'fetchTimeoutMs' | 'useGatewayURL' | 'includeFfpFlags'
>;
