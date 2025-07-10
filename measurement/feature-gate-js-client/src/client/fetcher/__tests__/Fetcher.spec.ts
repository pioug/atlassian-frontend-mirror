import fetchMock from 'jest-fetch-mock';

import { FeatureGateEnvironment, PerimeterType } from '../../FeatureGates';
import { ResponseError } from '../errors';
import { type FetcherOptions } from '../Fetcher';
import Fetcher from '../index';
import { type FrontendClientSdkKeyResponse, type FrontendExperimentsResponse } from '../types';

fetchMock.enableMocks();

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
	perimeter: PerimeterType.COMMERCIAL,
	targetApp: TARGET_APP,
};

describe('Fetcher', () => {
	afterEach(() => {
		fetchMock.resetMocks();
		jest.restoreAllMocks();
	});

	describe('fetchClientSdkKey', () => {
		test('returns clientSdkKey if successful', async () => {
			fetchMock.mockResponseOnce(JSON.stringify(defaultClientSdkKeyResponseBody), {
				status: 200,
			});
			const response: FrontendClientSdkKeyResponse =
				await Fetcher.fetchClientSdk(defaultFetcherOptions);
			expect(response.clientSdkKey).toEqual(defaultClientSdkKeyResponseBody.clientSdkKey);
		});

		test('returns empty response on 204', async () => {
			fetchMock.mockResponseOnce('', { status: 204 });
			const promise = Fetcher.fetchClientSdk(defaultFetcherOptions);
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

			const promise = Fetcher.fetchClientSdk(defaultFetcherOptions);
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

			const promise = Fetcher.fetchClientSdk(defaultFetcherOptions);
			await expect(promise).rejects.toBeInstanceOf(SyntaxError);
			await expect(promise).rejects.toThrow(
				'Unexpected token \'i\', "invalid object" is not valid JSON',
			);
		});

		test('handles empty 200 response', async () => {
			fetchMock.mockResponseOnce('', { status: 200 });
			const promise = Fetcher.fetchClientSdk(defaultFetcherOptions);
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
			await Fetcher.fetchClientSdk(fetcherOptions);
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
			await Fetcher.fetchClientSdk(fetcherOptions);
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
			await Fetcher.fetchClientSdk(fetcherOptions);
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
			await Fetcher.fetchClientSdk(fetcherOptions);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(fetchMock.mock.calls[0][0]).toEqual(EXPECTED_KEY_GATEWAY_URL);
		});

		test('constructs correct staging URL in browser - single subdomain fragment', async () => {
			jest.spyOn(Fetcher, 'getWindowLocation').mockReturnValue({
				hostname: 'pear.oasis-stg.com',
				protocol: 'https:',
			} as unknown as Location);

			const expectedUrl = 'https://api.pear.oasis-stg.com/flags/api/v2/frontend/clientSdkKey/test';

			await testIcUrlConstruction(expectedUrl, FeatureGateEnvironment.Staging);
		});

		test('constructs correct staging URL in browser - multiple subdomain fragments', async () => {
			jest.spyOn(Fetcher, 'getWindowLocation').mockReturnValue({
				hostname: 'foo.bar.pear.oasis-stg.com',
				protocol: 'https:',
			} as unknown as Location);

			const expectedUrl = 'https://api.pear.oasis-stg.com/flags/api/v2/frontend/clientSdkKey/test';

			await testIcUrlConstruction(expectedUrl, FeatureGateEnvironment.Staging);
		});

		test('constructs correct prod URL in browser - single subdomain fragment', async () => {
			jest.spyOn(Fetcher, 'getWindowLocation').mockReturnValue({
				hostname: 'ic-name.atlassian-isolated.net',
				protocol: 'https:',
			} as unknown as Location);

			const expectedUrl =
				'https://api.ic-name.atlassian-isolated.net/flags/api/v2/frontend/clientSdkKey/test';

			await testIcUrlConstruction(expectedUrl, FeatureGateEnvironment.Production);
		});

		test('constructs correct prod URL in browser - multiple subdomain fragments', async () => {
			jest.spyOn(Fetcher, 'getWindowLocation').mockReturnValue({
				hostname: 'admin.foo-bar.ic-name.atlassian-isolated.net',
				protocol: 'https:',
			} as unknown as Location);

			const expectedUrl =
				'https://api.ic-name.atlassian-isolated.net/flags/api/v2/frontend/clientSdkKey/test';

			await testIcUrlConstruction(expectedUrl, FeatureGateEnvironment.Production);
		});

		test('constructs URL with isolationContextId in non-browser environment', async () => {
			jest.spyOn(Fetcher, 'getWindowLocation').mockReturnValue(undefined);
			fetchMock.mockResponseOnce(JSON.stringify(defaultClientSdkKeyResponseBody));
			const fetcherOptions = {
				...defaultFetcherOptions,
				environment: FeatureGateEnvironment.Production,
				useGatewayURL: false,
				perimeter: PerimeterType.COMMERCIAL,
				isolationContextId: 'ic-7bf',
				apiKey: 'test-api-key',
			};
			await Fetcher.fetchClientSdk(fetcherOptions);
			const expectedUrl =
				'https://atlassian-statsig-proxy-archetype.atl-paas.ic-7bf.atl-ic.net/api/v2/frontend/clientSdkKey/test';
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(fetchMock.mock.calls[0][0]).toEqual(expectedUrl);
		});

		test('returns null in non-browser environment without isolationContextId', async () => {
			jest.spyOn(Fetcher, 'getWindowLocation').mockReturnValue(undefined);
			fetchMock.mockResponseOnce(JSON.stringify(defaultClientSdkKeyResponseBody));
			const fetcherOptions = {
				...defaultFetcherOptions,
				environment: FeatureGateEnvironment.Production,
				useGatewayURL: false,
				perimeter: PerimeterType.COMMERCIAL,
				apiKey: 'test-api-key',
			};
			await Fetcher.fetchClientSdk(fetcherOptions);
			const expectedUrl = 'https://api.atlassian.com/flags/api/v2/frontend/clientSdkKey/test';
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(fetchMock.mock.calls[0][0]).toEqual(expectedUrl);
		});

		test('falls back to STAGING_BASE_URL for staging environment when getApiUrl returns null', async () => {
			jest.spyOn(Fetcher, 'getWindowLocation').mockReturnValue(undefined);
			const expectedUrl = 'https://api.stg.atlassian.com/flags/api/v2/frontend/clientSdkKey/test';

			testIcUrlConstruction(expectedUrl, FeatureGateEnvironment.Staging);
		});

		test('falls back to PROD_BASE_URL for production environment when getApiUrl returns null', async () => {
			jest.spyOn(Fetcher, 'getWindowLocation').mockReturnValue(undefined);
			const expectedUrl = 'https://api.atlassian.com/flags/api/v2/frontend/clientSdkKey/test';

			testIcUrlConstruction(expectedUrl, FeatureGateEnvironment.Production);
		});

		async function testIcUrlConstruction(expectedUrl: string, environment: FeatureGateEnvironment) {
			fetchMock.mockResponseOnce(JSON.stringify(defaultClientSdkKeyResponseBody));
			const fetcherOptions = {
				...defaultFetcherOptions,
				environment: environment,
				useGatewayURL: false,
				perimeter: PerimeterType.COMMERCIAL,
				isolationContextId: undefined,
				apiKey: 'test-api-key',
			};
			await Fetcher.fetchClientSdk(fetcherOptions);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(fetchMock.mock.calls[0][0]).toEqual(expectedUrl);
		}
	});

	describe('fetchExperimentValues', () => {
		test('returns feature flags if successful', async () => {
			fetchMock.mockResponseOnce(JSON.stringify(defaultExperimentsResponseBody), {
				status: 200,
			});
			const response: FrontendExperimentsResponse = await Fetcher.fetchExperimentValues(
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
			const promise = Fetcher.fetchExperimentValues(defaultFetcherOptions, {
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

			const promise = Fetcher.fetchExperimentValues(defaultFetcherOptions, {
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

			const promise = Fetcher.fetchExperimentValues(defaultFetcherOptions, {
				atlassianAccountId: 'account-abc',
			});
			await expect(promise).rejects.toBeInstanceOf(SyntaxError);
			await expect(promise).rejects.toThrow(
				'Unexpected token \'i\', "invalid object" is not valid JSON',
			);
		});

		test('handles empty 200 response', async () => {
			fetchMock.mockResponseOnce('', { status: 200 });
			const promise = Fetcher.fetchExperimentValues(defaultFetcherOptions, {
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
			await Fetcher.fetchExperimentValues(fetcherOptions, {
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
			await Fetcher.fetchExperimentValues(fetcherOptions, {
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
			await Fetcher.fetchExperimentValues(fetcherOptions, {
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
				fetcherOptions,
				{ atlassianAccountId: 'account-abc' },
				{},
			);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(fetchMock.mock.calls[0][0]).toEqual(EXPECTED_VALUES_GATEWAY_URL);
		});
	});
});
