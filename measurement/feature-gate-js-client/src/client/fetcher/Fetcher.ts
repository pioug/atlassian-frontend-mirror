/* eslint-disable @atlaskit/volt-strict-mode/no-multiple-exports */

import {
	type ClientOptions,
	type CustomAttributes,
	FeatureGateEnvironment,
	type Identifiers,
	type OptionsWithDefaults,
	PerimeterType,
} from '../types';
import { CLIENT_VERSION } from '../version';
import { ResponseError } from './errors';
import { fromExperimentValuesResponse } from './evalFlags/fromExperimentValuesResponse';
import { getEvalFlagsStatus } from './evalFlags/getEvalFlagsStatus';
import { hasNoUsableProvider } from './evalFlags/hasNoUsableProvider';
import { EvalFlagsUnavailableError } from './EvalFlagsUnavailableError';
import {
	type EvalFlagsResponse,
	type FrontendClientSdkKeyResponse,
	type FrontendExperimentsRequest,
	type FrontendExperimentsResponse,
} from './types';

const DEFAULT_REQUEST_TIMEOUT_MS = 5000;

export const PROD_BASE_URL = 'https://api.atlassian.com/flags';
export const STAGING_BASE_URL = 'https://api.stg.atlassian.com/flags';
export const DEV_BASE_URL = 'https://api.dev.atlassian.com/flags';
export const FEDM_STAGING_BASE_URL = 'https://api.stg.atlassian-us-gov-mod.com/flags';
export const FEDM_PROD_BASE_URL = 'https://api.atlassian-us-gov-mod.com/flags';
export const IC_FFS_BASE_URL = 'https://atlassian-statsig-proxy-archetype.atl-paas.%s.atl-ic.net';

export const IC_STAGING_BASE_DOMAIN_URL = 'oasis-stg.com/flags';
export const IC_PROD_BASE_DOMAIN_URL = 'atlassian-isolated.net/flags';

export const GATEWAY_BASE_URL = '/gateway/api/flags';

export type FetcherOptions = Pick<
	OptionsWithDefaults<ClientOptions>,
	| 'apiKey'
	| 'fetchTimeoutMs'
	| 'environment'
	| 'useGatewayURL'
	| 'targetApp'
	| 'perimeter'
	| 'isolationContextId'
	| 'includeFfpFlags'
>;

type Method = 'GET' | 'POST';

export default class Fetcher {
	static async fetchClientSdk(
		fetcherOptions: FetcherOptions,
	): Promise<FrontendClientSdkKeyResponse> {
		const { targetApp } = fetcherOptions;
		const url = `/api/v2/frontend/clientSdkKey/${targetApp}`;
		try {
			return await this.fetchRequest(url, 'GET', fetcherOptions);
		} catch (error: unknown) {
			if (error instanceof Error) {
				throw error;
			}
			throw Error('Failed to retrieve client sdk key');
		}
	}

	/**
	 * Fetches the Statsig values for a user from `/api/v2/frontend/experimentValues`. Use
	 * {@link Fetcher.fetchFlagValues}, which calls this only without `includeFfpFlags`.
	 */
	static async fetchExperimentValues(
		fetcherOptions: FetcherOptions,
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
	): Promise<FrontendExperimentsResponse> {
		const requestBody: FrontendExperimentsRequest = {
			identifiers,
			customAttributes,
			targetApp: fetcherOptions.targetApp,
		};

		try {
			return await this.fetchRequest(
				'/api/v2/frontend/experimentValues',
				'POST',
				fetcherOptions,
				requestBody,
			);
		} catch (error: unknown) {
			if (error instanceof Error) {
				throw error;
			}
			throw Error('Failed to retrieve experiment values');
		}
	}

	/**
	 * Fetches the combined Statsig and Feature Flag Platform bootstrap values for a user.
	 *
	 * Rejects with {@link EvalFlagsUnavailableError} when no provider is `OK` and one is `UNAVAILABLE`,
	 * so that a response with no values fails like any other failed fetch.
	 */
	static async fetchEvalFlags(
		fetcherOptions: FetcherOptions,
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
	): Promise<EvalFlagsResponse> {
		const requestBody: FrontendExperimentsRequest = {
			identifiers,
			customAttributes,
			targetApp: fetcherOptions.targetApp,
		};

		let response: EvalFlagsResponse;
		try {
			response = await this.fetchRequest('/api/v1/evalFlags', 'POST', fetcherOptions, requestBody);
		} catch (error: unknown) {
			if (error instanceof Error) {
				throw error;
			}
			throw Error('Failed to retrieve flag values');
		}

		const status = getEvalFlagsStatus(response);
		if (hasNoUsableProvider(status)) {
			throw new EvalFlagsUnavailableError(status);
		}
		return response;
	}

	/**
	 * Fetches the bootstrap values for a user. With `includeFfpFlags`, they come from
	 * {@link Fetcher.fetchEvalFlags}; otherwise only Statsig values are fetched, with
	 * {@link Fetcher.fetchExperimentValues}, and are returned as a response in which FFP is `DISABLED`.
	 */
	static async fetchFlagValues(
		fetcherOptions: FetcherOptions,
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
	): Promise<EvalFlagsResponse> {
		if (fetcherOptions.includeFfpFlags) {
			return this.fetchEvalFlags(fetcherOptions, identifiers, customAttributes);
		}
		return this.fetchExperimentValues(fetcherOptions, identifiers, customAttributes).then(
			fromExperimentValuesResponse,
		);
	}

	static async handleResponseError(response: Response): Promise<void> {
		if (!response.ok) {
			// Use text() instead of json() as the error body might not be json data
			const body = await response.text();
			throw new ResponseError(
				`Non 2xx response status received, status: ${
					response.status
				}, body: ${JSON.stringify(body)}`,
			);
		}

		if (response.status === 204) {
			throw new ResponseError('Unexpected 204 response');
		}
	}

	static async extractResponseBody<T>(response: Response): Promise<T> {
		const value: string = await response.text();
		return JSON.parse(value) as T;
	}

	private static getBaseUrl(
		serviceEnv: FeatureGateEnvironment,
		useGatewayUrl: boolean = false,
		perimeter: PerimeterType,
		isolationContextId: string | null = null,
	): string {
		if (useGatewayUrl) {
			return GATEWAY_BASE_URL;
		}

		if (perimeter === PerimeterType.FEDRAMP_MODERATE) {
			switch (serviceEnv) {
				case FeatureGateEnvironment.Production:
					return FEDM_PROD_BASE_URL;
				case FeatureGateEnvironment.Staging:
					return FEDM_STAGING_BASE_URL;
				default:
					throw new Error(`Invalid environment "${serviceEnv}" for "${perimeter}" perimeter`);
			}
		} else if (perimeter === PerimeterType.COMMERCIAL) {
			switch (serviceEnv) {
				case FeatureGateEnvironment.Development:
					return DEV_BASE_URL;
				case FeatureGateEnvironment.Staging:
					const apiUrl = this.getApiUrl(isolationContextId);
					if (apiUrl !== null) {
						return apiUrl;
					}
					return STAGING_BASE_URL;
				default:
					const prodApiUrl = this.getApiUrl(isolationContextId);
					if (prodApiUrl !== null) {
						return prodApiUrl;
					}
					return PROD_BASE_URL;
			}
		} else {
			throw new Error(`Invalid perimeter "${perimeter}"`);
		}
	}

	private static async fetchRequest<T>(
		path: string,
		method: Method,
		fetcherOptions: FetcherOptions,
		body?: object,
	): Promise<T> {
		const baseUrl = Fetcher.getBaseUrl(
			fetcherOptions.environment,
			fetcherOptions.useGatewayURL,
			fetcherOptions.perimeter,
			fetcherOptions.isolationContextId,
		);

		const fetchTimeout = fetcherOptions.fetchTimeoutMs || DEFAULT_REQUEST_TIMEOUT_MS;

		let abortSignal: AbortSignal | undefined;
		if (AbortSignal.timeout) {
			abortSignal = AbortSignal.timeout(fetchTimeout);
		} else if (AbortController) {
			const abortController = new AbortController();
			abortSignal = abortController.signal;
			setTimeout(() => abortController.abort(), fetchTimeout);
		}

		const response = await fetch(`${baseUrl}${path}`, {
			method,
			headers: {
				'Content-Type': 'application/json',
				'X-Client-Name': 'feature-gate-js-client',
				'X-Client-Version': CLIENT_VERSION,
				'X-API-KEY': fetcherOptions.apiKey,
			},
			signal: abortSignal,
			...(body && { body: JSON.stringify(body) }),
		});

		await this.handleResponseError(response);
		return await this.extractResponseBody(response);
	}

	private static getApiUrl(isolationContextId: string | null): string | null {
		const window = this.getWindowLocation();
		if (window === undefined) {
			//this is needed when this SDK is used for SSR or plugin use cases where secret keys not available to use backend SDKs
			if (!isolationContextId) {
				return null;
			}
			return IC_FFS_BASE_URL.replace('%s', isolationContextId);
		}
		const { protocol, hostname } = window;

		// Match last subdomain fragment before oasis-stg.com
		const oasisMatch = hostname.match(/([^.]+)\.oasis-stg\.com$/);

		if (oasisMatch) {
			return `${protocol}//api.${oasisMatch[1]}.${IC_STAGING_BASE_DOMAIN_URL}`;
		}

		// Match last subdomain fragment before atlassian-isolated.net
		const isolatedMatch = hostname.match(/([^.]+)\.atlassian-isolated\.net$/);

		if (isolatedMatch) {
			return `${protocol}//api.${isolatedMatch[1]}.${IC_PROD_BASE_DOMAIN_URL}`;
		}

		return null;
	}

	static getWindowLocation(): Location | undefined {
		if (typeof window !== 'undefined' && window.location) {
			return window.location;
		}
		return undefined;
	}
}
