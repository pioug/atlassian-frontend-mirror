import { type FetcherOptions } from '@atlaskit/feature-gate-fetcher';

export type ProviderOptions = Pick<FetcherOptions, 'apiKey' | 'useGatewayURL'> & {
	readyTimeoutInMilliseconds: number;
	pollingInterval: number;
};
