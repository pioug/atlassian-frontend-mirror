import { type FetcherOptions } from '@atlaskit/feature-gate-fetcher';

import { type ExperimentValuesEntry } from '../database/types';

export type PollingConfig = {
	interval: number;
	tabHiddenPollingFactor: number;
	maxWaitInterval: number;
	minWaitInterval: number;
	backOffFactor: number;
	backOffJitter: number;
	maxInstantRetryTimes: number;
};

export type ProviderOptions = Pick<FetcherOptions, 'apiKey' | 'useGatewayURL'> & {
	initialFetchTimeout?: number;
	pollingInterval?: number;
};

export type FeatureGateState = Pick<
	ExperimentValuesEntry,
	'experimentValuesResponse' | 'profileHash' | 'timestamp'
>;
