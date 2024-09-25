import fetchMock from 'jest-fetch-mock';

import { ResponseError } from '../errors';
import Fetcher from '../index';
import { FeatureGateEnvironment } from '../temp-types';
import {
	type FetcherOptions,
	type FrontendClientSdkKeyResponse,
	type FrontendExperimentsResponse,
} from '../types';

const CLIENT_VERSION = 'clientVersion';
const TARGET_APP = 'test';
const EXPECTED_VALUES_PRD_URL = `https://api.atlassian.com/flags/api/v2/frontend/experimentValues`;
const EXPECTED_VALUES_STG_URL = `https://api.stg.atlassian.com/flags/api/v2/frontend/experimentValues`;
const EXPECTED_VALUES_DEV_URL = `https://api.dev.atlassian.com/flags/api/v2/frontend/experimentValues`;
const EXPECTED_VALUES_GATEWAY_URL = `/gateway/api/flags/api/v2/frontend/experimentValues`;

const EXPECTED_KEY_PRD_URL = `https://api.atlassian.com/flags/api/v2/frontend/clientSdkKey/${TARGET_APP}`;
const EXPECTED_KEY_STG_URL = `https://api.stg.atlassian.com/flags/api/v2/frontend/clientSdkKey/${TARGET_APP}`;
const EXPECTED_KEY_DEV_URL = `https://api.dev.atlassian.com/flags/api/v2/frontend/clientSdkKey/${TARGET_APP}`;
const EXPECTED_KEY_GATEWAY_URL = `/gateway/api/flags/api/v2/frontend/clientSdkKey/${TARGET_APP}`;

const mockApiKey = `apiKey-abc`;

const defaultExperimentsResponseBody: FrontendExperimentsResponse = {
	experimentValues: {
		someValues: '123',
	},
	clientSdkKey: 'testing-123',
	customAttributes: {
		testTapTrait: true,
	},
};

const defaultClientSdkKeyResponseBody: FrontendClientSdkKeyResponse = {
	clientSdkKey: 'testing-456',
};

const defaultFetcherOptions: FetcherOptions = {
	apiKey: mockApiKey,
	environment: FeatureGateEnvironment.Staging,
	targetApp: TARGET_APP,
};

describe('Fetcher', () => {
	beforeEach(() => {
		fetchMock.enableMocks();
	});

	afterEach(() => {
		fetchMock.resetMocks();
	});

	describe('fetchClientSdkKey', () => {
		test('returns clientSdkKey if successful', async () => {
			fetchMock.mockResponseOnce(JSON.stringify(defaultClientSdkKeyResponseBody), {
				status: 200,
			});
			const response: FrontendClientSdkKeyResponse = await Fetcher.fetchClientSdk(
				CLIENT_VERSION,
				defaultFetcherOptions,
			);
			expect(response.clientSdkKey).toEqual(defaultClientSdkKeyResponseBody.clientSdkKey);
		});

		test('returns empty response on 204', async () => {
			fetchMock.mockResponseOnce('', { status: 204 });
			const promise = Fetcher.fetchClientSdk(CLIENT_VERSION, defaultFetcherOptions);
			await expect(promise).rejects.toBeInstanceOf(ResponseError);
			await expect(promise).rejects.toMatchObject({
				message: 'Unexpected 204 response',
			});
		});

		test('returns response error on failure', async () => {
			expect.hasAssertions();

			fetchMock.mockResponseOnce('something went wrong', {
				status: 500,
			});

			const promise = Fetcher.fetchClientSdk(CLIENT_VERSION, defaultFetcherOptions);
			await expect(promise).rejects.toBeInstanceOf(ResponseError);
			await expect(promise).rejects.toMatchObject({
				message: 'Non 2xx response status received, status: 500, body: "something went wrong"',
			});
		});

		test('handles error 200 response', async () => {
			expect.hasAssertions();

			fetchMock.mockResponseOnce('invalid object', {
				status: 200,
			});

			const promise = Fetcher.fetchClientSdk(CLIENT_VERSION, defaultFetcherOptions);
			await expect(promise).rejects.toBeInstanceOf(SyntaxError);
			await expect(promise).rejects.toMatchObject({
				message: 'Unexpected token i in JSON at position 0',
			});
		});

		test('handles empty 200 response', async () => {
			fetchMock.mockResponseOnce('', { status: 200 });
			const promise = Fetcher.fetchClientSdk(CLIENT_VERSION, defaultFetcherOptions);
			await expect(promise).rejects.toBeInstanceOf(SyntaxError);
			await expect(promise).rejects.toMatchObject({
				message: 'Unexpected end of JSON input',
			});
		});

		test('uses prod URL by default', async () => {
			fetchMock.mockResponseOnce(JSON.stringify(defaultClientSdkKeyResponseBody));
			const fetcherOptions = {
				...defaultFetcherOptions,
				environment: FeatureGateEnvironment.Production,
				targetApp: TARGET_APP,
			};
			await Fetcher.fetchClientSdk(CLIENT_VERSION, fetcherOptions);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(fetchMock.mock.calls[0][0]).toEqual(EXPECTED_KEY_PRD_URL);
		});

		test('uses staging URL if selected', async () => {
			fetchMock.mockResponseOnce(JSON.stringify(defaultClientSdkKeyResponseBody));
			const fetcherOptions = {
				...defaultFetcherOptions,
				environment: FeatureGateEnvironment.Staging,
				targetApp: TARGET_APP,
			};
			await Fetcher.fetchClientSdk(CLIENT_VERSION, fetcherOptions);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(fetchMock.mock.calls[0][0]).toEqual(EXPECTED_KEY_STG_URL);
		});

		test('uses dev URL if selected', async () => {
			fetchMock.mockResponseOnce(JSON.stringify(defaultClientSdkKeyResponseBody));
			const fetcherOptions = {
				...defaultFetcherOptions,
				environment: FeatureGateEnvironment.Development,
				targetApp: TARGET_APP,
			};
			await Fetcher.fetchClientSdk(CLIENT_VERSION, fetcherOptions);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(fetchMock.mock.calls[0][0]).toEqual(EXPECTED_KEY_DEV_URL);
		});

		test('uses gateway URL if specified', async () => {
			fetchMock.mockResponseOnce(JSON.stringify(defaultClientSdkKeyResponseBody));
			const fetcherOptions = {
				...defaultFetcherOptions,
				environment: FeatureGateEnvironment.Staging,
				useGatewayURL: true,
				targetApp: TARGET_APP,
			};
			await Fetcher.fetchClientSdk(CLIENT_VERSION, fetcherOptions);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(fetchMock.mock.calls[0][0]).toEqual(EXPECTED_KEY_GATEWAY_URL);
		});
	});

	describe('fetchExperimentValues', () => {
		test('returns feature flags if successful', async () => {
			fetchMock.mockResponseOnce(JSON.stringify(defaultExperimentsResponseBody), {
				status: 200,
			});
			const response: FrontendExperimentsResponse = await Fetcher.fetchExperimentValues(
				CLIENT_VERSION,
				defaultFetcherOptions,
				{
					atlassianAccountId: 'account-abc',
				},
			);
			expect(response.clientSdkKey).toEqual(defaultExperimentsResponseBody.clientSdkKey);
			expect(response.experimentValues).toEqual(defaultExperimentsResponseBody.experimentValues);
			expect(response.customAttributes).toEqual(defaultExperimentsResponseBody.customAttributes);
		});

		test('returns empty response on 204', async () => {
			fetchMock.mockResponseOnce('', { status: 204 });
			const promise = Fetcher.fetchExperimentValues(CLIENT_VERSION, defaultFetcherOptions, {
				atlassianAccountId: 'account-abc',
			});
			await expect(promise).rejects.toBeInstanceOf(ResponseError);
			await expect(promise).rejects.toMatchObject({
				message: 'Unexpected 204 response',
			});
		});

		test('returns response error on failure', async () => {
			expect.hasAssertions();

			fetchMock.mockResponseOnce('something went wrong', {
				status: 500,
			});

			const promise = Fetcher.fetchExperimentValues(CLIENT_VERSION, defaultFetcherOptions, {
				atlassianAccountId: 'account-abc',
			});
			await expect(promise).rejects.toBeInstanceOf(ResponseError);
			await expect(promise).rejects.toMatchObject({
				message: 'Non 2xx response status received, status: 500, body: "something went wrong"',
			});
		});

		test('handles error 200 response', async () => {
			expect.hasAssertions();

			fetchMock.mockResponseOnce('invalid object', {
				status: 200,
			});

			const promise = Fetcher.fetchExperimentValues(CLIENT_VERSION, defaultFetcherOptions, {
				atlassianAccountId: 'account-abc',
			});
			await expect(promise).rejects.toBeInstanceOf(SyntaxError);
			await expect(promise).rejects.toMatchObject({
				message: 'Unexpected token i in JSON at position 0',
			});
		});

		test('handles empty 200 response', async () => {
			fetchMock.mockResponseOnce('', { status: 200 });
			const promise = Fetcher.fetchExperimentValues(CLIENT_VERSION, defaultFetcherOptions, {
				atlassianAccountId: 'account-abc',
			});
			await expect(promise).rejects.toBeInstanceOf(SyntaxError);
			await expect(promise).rejects.toMatchObject({
				message: 'Unexpected end of JSON input',
			});
		});

		test('uses prod URL by default', async () => {
			fetchMock.mockResponseOnce(JSON.stringify(defaultExperimentsResponseBody));
			const fetcherOptions = {
				...defaultFetcherOptions,
				environment: FeatureGateEnvironment.Production,
				targetApp: TARGET_APP,
			};
			await Fetcher.fetchExperimentValues(CLIENT_VERSION, fetcherOptions, {
				atlassianAccountId: 'account-abc',
			});
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(fetchMock.mock.calls[0][0]).toEqual(EXPECTED_VALUES_PRD_URL);
		});

		test('uses staging URL if selected', async () => {
			fetchMock.mockResponseOnce(JSON.stringify(defaultExperimentsResponseBody));
			const fetcherOptions = {
				...defaultFetcherOptions,
				environment: FeatureGateEnvironment.Staging,
				targetApp: TARGET_APP,
			};
			await Fetcher.fetchExperimentValues(CLIENT_VERSION, fetcherOptions, {
				atlassianAccountId: 'account-abc',
			});
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(fetchMock.mock.calls[0][0]).toEqual(EXPECTED_VALUES_STG_URL);
		});

		test('uses dev URL if selected', async () => {
			fetchMock.mockResponseOnce(JSON.stringify(defaultExperimentsResponseBody));
			const fetcherOptions = {
				...defaultFetcherOptions,
				environment: FeatureGateEnvironment.Development,
				targetApp: TARGET_APP,
			};
			await Fetcher.fetchExperimentValues(CLIENT_VERSION, fetcherOptions, {
				atlassianAccountId: 'account-abc',
			});
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(fetchMock.mock.calls[0][0]).toEqual(EXPECTED_VALUES_DEV_URL);
		});

		test('uses gateway URL if specified', async () => {
			fetchMock.mockResponseOnce(JSON.stringify(defaultExperimentsResponseBody));
			const fetcherOptions = {
				...defaultFetcherOptions,
				environment: FeatureGateEnvironment.Staging,
				useGatewayURL: true,
				targetApp: TARGET_APP,
			};
			await Fetcher.fetchExperimentValues(
				CLIENT_VERSION,
				fetcherOptions,
				{ atlassianAccountId: 'account-abc' },
				{},
			);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(fetchMock.mock.calls[0][0]).toEqual(EXPECTED_VALUES_GATEWAY_URL);
		});
	});
});
