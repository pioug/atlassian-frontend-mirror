import { ResponseError } from './errors';
import {
	type CustomAttributes,
	FeatureGateEnvironment,
	type Identifiers,
	PerimeterType,
} from './temp-types';
import {
	type FetcherOptions,
	type FrontendClientSdkKeyResponse,
	type FrontendExperimentsRequest,
	type FrontendExperimentsResponse,
} from './types';

export type {
	FetcherOptions,
	FrontendExperimentsResponse,
	FrontendClientSdkKeyResponse,
} from './types';

export { ResponseError } from './errors';

const DEFAULT_REQUEST_TIMEOUT_MS = 5000;

const PROD_BASE_URL = 'https://api.atlassian.com/flags';
const STAGING_BASE_URL = 'https://api.stg.atlassian.com/flags';
export const DEV_BASE_URL = 'https://api.dev.atlassian.com/flags';
export const FEDM_STAGING_BASE_URL = 'https://api.stg.atlassian-us-gov-mod.com/flags';
export const FEDM_PROD_BASE_URL = 'https://api.atlassian-us-gov-mod.com/flags';

export const GATEWAY_BASE_URL = '/gateway/api/flags';
export const EXPERIMENT_VALUES_API_VERSION = 'v2';

type Method = 'GET' | 'POST';

export default class Fetcher {
	static async fetchClientSdk(
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
