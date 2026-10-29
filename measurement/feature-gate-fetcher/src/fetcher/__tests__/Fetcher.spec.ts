import fetchMock from 'jest-fetch-mock';

import { FeatureGateEnvironment, PerimeterType } from '@atlaskit/feature-gate-js-client/types';

import { ResponseError } from '../errors';
import Fetcher from '../index';
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
const EXPECTED_EVAL_FLAGS_STG_URL = `https://api.stg.atlassian.com/flags/api/v1/evalFlags`;
const EXPECTED_EVAL_FLAGS_GATEWAY_URL = `/gateway/api/flags/api/v1/evalFlags`;

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
			const response: FrontendClientSdkKeyResponse = await Fetcher.fetchClientSdkKey(
				CLIENT_VERSION,
				defaultFetcherOptions,
			);
			expect(response.clientSdkKey).toEqual(defaultClientSdkKeyResponseBody.clientSdkKey);
		});

		test('returns empty response on 204', async () => {
			fetchMock.mockResponseOnce('', { status: 204 });
			const promise = Fetcher.fetchClientSdkKey(CLIENT_VERSION, defaultFetcherOptions);
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

			const promise = Fetcher.fetchClientSdkKey(CLIENT_VERSION, defaultFetcherOptions);
			await expect(promise).rejects.toEqual(
				new ResponseError('Non 2xx response status received', 500, 'something went wrong'),
			);
		});

		test('handles error 200 response', async () => {
			expect.hasAssertions();

			fetchMock.mockResponseOnce('invalid object', {
				status: 200,
			});

			const promise = Fetcher.fetchClientSdkKey(CLIENT_VERSION, defaultFetcherOptions);
			await expect(promise).rejects.toBeInstanceOf(SyntaxError);
			await expect(promise).rejects.toThrow(
				`Unexpected token 'i', \"invalid object\" is not valid JSON`,
			);
		});

		test('handles empty 200 response', async () => {
			fetchMock.mockResponseOnce('', { status: 200 });
			const promise = Fetcher.fetchClientSdkKey(CLIENT_VERSION, defaultFetcherOptions);
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
			await Fetcher.fetchClientSdkKey(CLIENT_VERSION, fetcherOptions);
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
			await Fetcher.fetchClientSdkKey(CLIENT_VERSION, fetcherOptions);
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
			await Fetcher.fetchClientSdkKey(CLIENT_VERSION, fetcherOptions);
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
			await Fetcher.fetchClientSdkKey(CLIENT_VERSION, fetcherOptions);
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
			await expect(promise).rejects.toEqual(new ResponseError('Unexpected 204 response', 204, ''));
		});

		test('returns response error on failure', async () => {
			expect.hasAssertions();

			fetchMock.mockResponseOnce('something went wrong', {
				status: 500,
			});

			const promise = Fetcher.fetchExperimentValues(CLIENT_VERSION, defaultFetcherOptions, {
				atlassianAccountId: 'account-abc',
			});
			await expect(promise).rejects.toEqual(
				new ResponseError('Non 2xx response status received', 500, 'something went wrong'),
			);
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
			await expect(promise).rejects.toThrow(
				`Unexpected token 'i', \"invalid object\" is not valid JSON`,
			);
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

		describe('with includeFfpFlags', () => {
			const evalFlagsFetcherOptions: FetcherOptions = {
				...defaultFetcherOptions,
				includeFfpFlags: true,
			};

			const evalFlagsResponseBody = {
				statsig: defaultExperimentsResponseBody,
				ffp: { flags: { 'ffp-flag': { value: true } } },
				status: { statsig: 'OK', ffp: 'OK' },
			};

			test('returns the Statsig section of the evalFlags response', async () => {
				fetchMock.mockResponseOnce(JSON.stringify(evalFlagsResponseBody), { status: 200 });

				const response = await Fetcher.fetchExperimentValues(
					CLIENT_VERSION,
					evalFlagsFetcherOptions,
					{ atlassianAccountId: 'account-abc' },
					{ attribute: 'value' },
				);

				expect(response).toEqual(defaultExperimentsResponseBody);
				expect(fetchMock).toHaveBeenCalledTimes(1);
				expect(fetchMock.mock.calls[0][0]).toEqual(EXPECTED_EVAL_FLAGS_STG_URL);
				expect(fetchMock.mock.calls[0][1]?.method).toEqual('POST');
				expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toEqual({
					identifiers: { atlassianAccountId: 'account-abc' },
					customAttributes: { attribute: 'value' },
					targetApp: TARGET_APP,
				});
			});

			test('uses gateway URL if specified', async () => {
				fetchMock.mockResponseOnce(JSON.stringify(evalFlagsResponseBody));

				await Fetcher.fetchExperimentValues(
					CLIENT_VERSION,
					{ ...evalFlagsFetcherOptions, useGatewayURL: true },
					{ atlassianAccountId: 'account-abc' },
				);

				expect(fetchMock.mock.calls[0][0]).toEqual(EXPECTED_EVAL_FLAGS_GATEWAY_URL);
			});

			test('calls experimentValues when false', async () => {
				fetchMock.mockResponseOnce(JSON.stringify(defaultExperimentsResponseBody));

				await Fetcher.fetchExperimentValues(
					CLIENT_VERSION,
					{ ...defaultFetcherOptions, includeFfpFlags: false },
					{ atlassianAccountId: 'account-abc' },
				);

				expect(fetchMock.mock.calls[0][0]).toEqual(EXPECTED_VALUES_STG_URL);
			});

			test.each([
				['UNAVAILABLE', { statsig: {}, status: { statsig: 'UNAVAILABLE', ffp: 'OK' } }],
				['DISABLED', { status: { statsig: 'DISABLED', ffp: 'OK' } }],
				['missing', { statsig: defaultExperimentsResponseBody }],
			])('rejects when the Statsig status is %s', async (_status, body) => {
				fetchMock.mockResponseOnce(JSON.stringify(body), { status: 200 });

				const promise = Fetcher.fetchExperimentValues(CLIENT_VERSION, evalFlagsFetcherOptions, {
					atlassianAccountId: 'account-abc',
				});

				await expect(promise).rejects.toThrow('Statsig values are unavailable');
				await expect(promise).rejects.not.toBeInstanceOf(ResponseError);
			});

			test('rejects when the Statsig section has no experiment values', async () => {
				fetchMock.mockResponseOnce(JSON.stringify({ statsig: {}, status: { statsig: 'OK' } }));

				const promise = Fetcher.fetchExperimentValues(CLIENT_VERSION, evalFlagsFetcherOptions, {
					atlassianAccountId: 'account-abc',
				});

				await expect(promise).rejects.toThrow('Statsig values are unavailable');
			});

			test('returns response error on failure', async () => {
				fetchMock.mockResponseOnce('something went wrong', { status: 500 });

				const promise = Fetcher.fetchExperimentValues(CLIENT_VERSION, evalFlagsFetcherOptions, {
					atlassianAccountId: 'account-abc',
				});

				await expect(promise).rejects.toBeInstanceOf(ResponseError);
			});
		});
	});
});
