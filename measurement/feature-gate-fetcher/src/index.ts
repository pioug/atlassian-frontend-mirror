export type {
	FetcherOptions,
	FrontendExperimentsResponse,
	FrontendClientSdkKeyResponse,
} from './fetcher';

export {
	default,
	DEV_BASE_URL,
	FEDM_PROD_BASE_URL,
	GATEWAY_BASE_URL,
	ResponseError,
	EXPERIMENT_VALUES_API_VERSION,
} from './fetcher';

/**
 * This will be removed before merging to main with the feature-gate-js-client major version with these types
 */
export type {
	ClientOptions,
	CustomAttributes,
	FrontendExperimentsResult,
	Identifiers,
	Provider,
} from './fetcher/temp-types';

export { FeatureGateEnvironment } from './fetcher/temp-types';
