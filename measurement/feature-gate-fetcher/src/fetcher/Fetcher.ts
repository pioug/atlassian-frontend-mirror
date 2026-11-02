import { EvalFlagsUnavailableError } from '@atlaskit/feature-gate-js-client/eval-flags/eval-flags-unavailable-error';
import { fromExperimentValuesResponse } from '@atlaskit/feature-gate-js-client/eval-flags/from-experiment-values-response';
import { getEvalFlagsStatus } from '@atlaskit/feature-gate-js-client/eval-flags/get-eval-flags-status';
import { hasNoUsableProvider } from '@atlaskit/feature-gate-js-client/eval-flags/has-no-usable-provider';
import { toInitializeValues } from '@atlaskit/feature-gate-js-client/eval-flags/to-initialize-values';
import {
	type CustomAttributes,
	FeatureGateEnvironment,
	type FrontendExperimentsResult,
	type Identifiers,
	PerimeterType,
} from '@atlaskit/feature-gate-js-client/types';

import { ResponseError } from './errors';
import {
	type EvalFlagsResponse,
	type FetcherOptions,
	type FrontendClientSdkKeyResponse,
	type FrontendExperimentsRequest,
	type FrontendExperimentsResponse,
} from './types';

export type {
	EvalFlagsResponse,
	FetcherOptions,
	FrontendExperimentsResponse,
	FrontendClientSdkKeyResponse,
} from './types';

export { ResponseError } from './errors';

// The evalFlags helpers are owned by @atlaskit/feature-gate-js-client, which this package depends
// on, so the client and the providers share one implementation.
export { fromExperimentValuesResponse, getEvalFlagsStatus };

/**
 * Converts an `/api/v1/evalFlags` response into the result shape that providers return to
 * `@atlaskit/feature-gate-js-client`. A section is used only when its provider is `OK`. Without a
 * Statsig section, Statsig is bootstrapped with no values and the custom attributes sent with the
 * request are used for the user. A `DISABLED` provider is listed in `disabledProviders`, so the client
 * neither initializes nor calls it.
 */
export const toFrontendExperimentsResult: (
	response: EvalFlagsResponse,
	requestCustomAttributes?: CustomAttributes,
) => FrontendExperimentsResult = toInitializeValues;

const DEFAULT_REQUEST_TIMEOUT_MS = 5000;

const PROD_BASE_URL = 'https://api.atlassian.com/flags';
const STAGING_BASE_URL = 'https://api.stg.atlassian.com/flags';
export const DEV_BASE_URL = 'https://api.dev.atlassian.com/flags';
export const FEDM_STAGING_BASE_URL = 'https://api.stg.atlassian-us-gov-mod.com/flags';
export const FEDM_PROD_BASE_URL = 'https://api.atlassian-us-gov-mod.com/flags';

export const GATEWAY_BASE_URL = '/gateway/api/flags';
export const EXPERIMENT_VALUES_API_VERSION = 'v2';
export const EVAL_FLAGS_API_VERSION = 'v1';

type Method = 'GET' | 'POST';

/**
 * The Statsig section of an `/api/v1/evalFlags` response. Throws when the service does not report
 * Statsig as `OK`, as `/api/v2/frontend/experimentValues` returned a 5xx when it had no values.
 */
const getStatsigSection = (response: EvalFlagsResponse | null): FrontendExperimentsResponse => {
	const status = response?.status?.statsig;
	const statsig = response?.statsig;
	if (
		status !== 'OK' ||
		!statsig ||
		typeof statsig.experimentValues !== 'object' ||
		statsig.experimentValues === null
	) {
		throw new Error(`Statsig values are unavailable, status: ${JSON.stringify(status)}`);
	}
	return statsig;
};

export default class Fetcher {
	static async fetchClientSdkKey(
		clientVersion: string,
		fetcherOptions: FetcherOptions,
	): Promise<FrontendClientSdkKeyResponse> {
		const { targetApp } = fetcherOptions;
		const url = `/api/v2/frontend/clientSdkKey/${targetApp}`;
		try {
			return await this.fetchRequest(clientVersion, url, 'GET', fetcherOptions);
		} catch (error: unknown) {
			if (error instanceof Error) {
				throw error;
			}
			throw Error('Failed to retrieve client sdk key');
		}
	}

	/**
	 * Fetches the values of every flag for the user from both Statsig and the Feature Flag Platform
	 * (FFP). The service decides which platform serves each flag. Use
	 * {@link toFrontendExperimentsResult} to convert the response into a provider result.
	 *
	 * Rejects with an `EvalFlagsUnavailableError` (not a {@link ResponseError}) when no provider is
	 * `OK` and one is `UNAVAILABLE`, so that a response with no values fails like a 5xx.
	 */
	static async fetchEvalFlags(
		clientVersion: string,
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
			response = await this.fetchRequest(
				clientVersion,
				`/api/${EVAL_FLAGS_API_VERSION}/evalFlags`,
				'POST',
				fetcherOptions,
				requestBody,
			);
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
	 * Fetches Statsig values only, so flags served by the Feature Flag Platform are not included;
	 * prefer {@link Fetcher.fetchEvalFlags}. With `includeFfpFlags`, they are the Statsig section of
	 * the `/api/v1/evalFlags` response, and the rest of the response is ignored; otherwise they come
	 * from `/api/v2/frontend/experimentValues`.
	 */
	static async fetchExperimentValues(
		clientVersion: string,
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
			if (fetcherOptions.includeFfpFlags) {
				const response: EvalFlagsResponse | null = await this.fetchRequest(
					clientVersion,
					`/api/${EVAL_FLAGS_API_VERSION}/evalFlags`,
					'POST',
					fetcherOptions,
					requestBody,
				);
				return getStatsigSection(response);
			}
			return await this.fetchRequest(
				clientVersion,
				`/api/${EXPERIMENT_VALUES_API_VERSION}/frontend/experimentValues`,
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

	static async handleResponseError(response: Response): Promise<void> {
		if (!response.ok) {
			// Use text() instead of json() as the error body might not be json data
			const body = await response.text();
			throw new ResponseError(
				'Non 2xx response status received',
				response.status,
				JSON.stringify(body),
			);
		}

		if (response.status === 204) {
			throw new ResponseError('Unexpected 204 response', response.status, '');
		}
	}

	static async extractResponseBody<T>(response: Response): Promise<T> {
		const value: string = await response.text();
		return JSON.parse(value) as T;
	}

	private static getBaseUrl(
		serviceEnv: FeatureGateEnvironment,
		useGatewayUrl: boolean = false,
		perimeter: PerimeterType = PerimeterType.COMMERCIAL,
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
					return STAGING_BASE_URL;
				default:
					return PROD_BASE_URL;
			}
		} else {
			throw new Error(`Invalid perimeter "${perimeter}"`);
		}
	}

	private static async fetchRequest<T>(
		clientVersion: string,
		path: string,
		method: Method,
		fetcherOptions: FetcherOptions,
		body?: object,
	): Promise<T> {
		const baseUrl = Fetcher.getBaseUrl(
			fetcherOptions.environment,
			fetcherOptions.useGatewayURL,
			fetcherOptions.perimeter,
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
				'X-Client-Version': clientVersion,
				'X-API-KEY': fetcherOptions.apiKey,
			},
			signal: abortSignal,
			...(body && { body: JSON.stringify(body) }),
		});

		await this.handleResponseError(response);
		return await this.extractResponseBody(response);
	}
}
