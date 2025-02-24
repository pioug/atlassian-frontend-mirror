import AnalyticsWebClient from '@atlassiansox/analytics-web-client';
import { type Experiment, type Layer, StatsigClient } from '@statsig/js-client';
import fetchMock, { type MockResponseInit } from 'jest-fetch-mock';

import type FeatureGates from '../FeatureGates';
// eslint-disable-next-line no-duplicate-imports
import {
	FeatureGateEnvironment as FeatureGateEnvironmentType,
	PerimeterType,
	type Provider,
	type UpdateUserCompletionCallback,
} from '../FeatureGates';
import { NoFetchDataAdapter } from '../NoFetchDataAdapter';
import { CLIENT_VERSION } from '../version';

const mockStatsigClient = {
	initializeAsync: jest.fn(),
	updateUserAsync: jest.fn(),
	checkGate: jest.fn(),
	getExperiment: jest.fn(),
	getLayer: jest.fn(),
	shutdown: jest.fn(),
} satisfies Partial<StatsigClient>;

const mockStatsigClientConstructor = jest.fn();

jest.mock('@statsig/js-client', () => {
	const actual = jest.requireActual('@statsig/js-client');

	return {
		...actual,
		StatsigClient: function (...args: unknown[]) {
			mockStatsigClientConstructor(...args);
			return mockStatsigClient;
		},
	};
});

jest.mock('../NoFetchDataAdapter', () => {
	const mockDataAdapter = {
		setBootstrapData: jest.fn(),
		setData: jest.fn(),
	} satisfies Partial<NoFetchDataAdapter>;

	return {
		NoFetchDataAdapter: function () {
			return mockDataAdapter;
		},
	};
});
const mockDataAdapter = jest.mocked(new NoFetchDataAdapter());

const TARGET_APP = 'test';
const EXPECTED_VALUES_DEV_URL = `https://api.dev.atlassian.com/flags/api/v2/frontend/experimentValues`;
const EXPECTED_KEY_DEV_URL = `https://api.dev.atlassian.com/flags/api/v2/frontend/clientSdkKey/${TARGET_APP}`;
const EXPECTED_VALUES_GATEWAY_URL = `/gateway/api/flags/api/v2/frontend/experimentValues`;
const EXPECTED_KEY_GATEWAY_URL = `/gateway/api/flags/api/v2/frontend/clientSdkKey/${TARGET_APP}`;
const EVENT_ACTION_SUBJECT = 'featureGatesClient';
const CLIENT_KEY = 'client-12345-6789';

const mockFeatureFlagServiceEndpoints = (
	clientSdkKeyPromise: Promise<string>,
	experimentValuesPromise: Promise<Record<string, unknown>>,
) => {
	const getMockKeyResponse = async () =>
		await clientSdkKeyPromise
			.then((clientSdkKey) => ({
				status: 200,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					clientSdkKey,
				}),
			}))
			.catch((err) => ({
				status: 500,
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				body: JSON.stringify(err.message || err),
			}));

	const getMockExperimentValuesResponse = async () =>
		await experimentValuesPromise
			.then((experimentValues) => ({
				status: 200,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(experimentValues),
			}))
			.catch((err) => ({
				status: 500,
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				body: JSON.stringify(err.message || err),
			}));

	const responseGenerators: {
		[url: string]: () => Promise<MockResponseInit>;
	} = {
		[EXPECTED_KEY_DEV_URL]: getMockKeyResponse,
		[EXPECTED_KEY_GATEWAY_URL]: getMockKeyResponse,
		[EXPECTED_VALUES_DEV_URL]: getMockExperimentValuesResponse,
		[EXPECTED_VALUES_GATEWAY_URL]: getMockExperimentValuesResponse,
	};

	fetchMock.mockReset();
	fetchMock.mockIf(
		(req) => Object.keys(responseGenerators).includes(req.url),
		(req: Request) => responseGenerators[req.url](),
	);
};

/* eslint-disable no-console */
describe('FeatureGate client', () => {
	let FeatureGatesClass: typeof FeatureGates;
	let FeatureGateEnvironment: typeof FeatureGateEnvironmentType;
	const mockClientSdkKey = 'client-mock-sdk-key';
	const mockApiKey = 'mock-api-key';
	const mockExperimentValues = { test: '123' };
	const client = new AnalyticsWebClient({
		env: 'local',
		product: 'js-client',
	});
	let sendOperationalEventSpy: jest.SpyInstance;
	let mockProvider: Provider;

	const initialize = async (updateUserCompletionCallback?: UpdateUserCompletionCallback) => {
		await FeatureGatesClass.initialize(
			{
				apiKey: CLIENT_KEY,
				environment: FeatureGateEnvironment.Development,
				targetApp: TARGET_APP,
				updateUserCompletionCallback,
			},
			{
				atlassianAccountId: 'abc-123',
			},
			{},
		).finally(() => {
			// Clear the calls since we will want to count how many times these endpoints
			// are called by the subsequent updateUser calls, and don't really care how many
			// times they were called for initialization.
			fetchMock.mockClear();
		});
	};

	const mockAndInit = async () => {
		mockFeatureFlagServiceEndpoints(
			Promise.resolve(mockClientSdkKey),
			Promise.resolve({
				experimentValues: { test: '123' },
				customAttributes: {},
			}),
		);
		await initialize();
	};

	beforeAll(() => {
		sendOperationalEventSpy = jest.spyOn(client, 'sendOperationalEvent');
	});

	beforeEach(() => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore Remove globally saved reference to FeatureGates client between tests
		window.__FEATUREGATES_JS__ = undefined;
		jest.isolateModules(() => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const API = jest.requireActual('../FeatureGates');
			FeatureGatesClass = API.default;
			FeatureGateEnvironment = API.FeatureGateEnvironment;
		});

		mockProvider = {
			setApplyUpdateCallback: jest.fn(),
			setClientVersion: jest.fn(),
			setProfile: jest.fn(),
			getExperimentValues: jest.fn().mockResolvedValue({
				clientSdkKey: mockClientSdkKey,
				experimentValues: mockExperimentValues,
				customAttributesFromFetch: {},
			}),
			getClientSdkKey: jest.fn().mockResolvedValue(mockClientSdkKey),
			getApiKey: jest.fn().mockReturnValue(mockApiKey),
		};

		mockFeatureFlagServiceEndpoints(
			Promise.resolve(mockClientSdkKey),
			Promise.resolve({
				experimentValues: { test: '123' },
				customAttributes: {},
			}),
		);
	});

	afterEach(() => {
		jest.resetAllMocks();
		jest.clearAllMocks();
	});

	describe('initialize client', function () {
		afterEach(() => {
			fetchMock.resetMocks();
		});

		test('initialize should not return warning when client has already been initialized with the same options', async () => {
			await FeatureGatesClass.initialize(
				{
					apiKey: CLIENT_KEY,
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
				},
				{
					atlassianAccountId: 'abc-123',
				},
				undefined,
			);

			await expect(
				FeatureGatesClass.initialize(
					{
						apiKey: CLIENT_KEY,
						environment: FeatureGateEnvironment.Development,
						targetApp: TARGET_APP,
					},
					{
						atlassianAccountId: 'abc-123',
					},
					undefined,
				),
			).resolves.toBe(undefined);

			expect(mockStatsigClient.initializeAsync).toHaveBeenCalledTimes(1);
		});

		test('initialize should return warning when client has already been initialized with different options', async () => {
			console.warn = jest.fn();

			await FeatureGatesClass.initialize(
				{
					apiKey: CLIENT_KEY,
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
				},
				{
					atlassianAccountId: 'abc-123',
				},
				undefined,
			);

			await expect(
				FeatureGatesClass.initialize(
					{
						apiKey: 'apiKey-456',
						environment: FeatureGateEnvironment.Development,
						targetApp: TARGET_APP,
					},
					{
						atlassianAccountId: 'abc-123',
					},
					undefined,
				),
			).resolves.toBe(undefined);

			expect(mockStatsigClient.initializeAsync).toHaveBeenCalledTimes(1);
			expect(console.warn).toHaveBeenCalledWith(
				'Feature Gates client already initialized with different options. New options were not applied.',
			);
		});

		test('initialize should map key identifiers into a statsig user', async () => {
			await FeatureGatesClass.initialize(
				{
					apiKey: CLIENT_KEY,
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
				},
				{
					atlassianAccountId: 'abc-123',
				},
				undefined,
			);

			expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
				mockClientSdkKey,
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						stableID: expect.any(String),
					},
					custom: {},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					includeCurrentPageUrlWithEvents: false,
				}),
			);
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith({ test: '123' });
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalled();

			expect(fetchMock.mock.calls[0][0]).toEqual(EXPECTED_KEY_DEV_URL);
			expect(fetchMock.mock.calls[1][0]).toEqual(EXPECTED_VALUES_DEV_URL);
		});

		test('initialize with useGatewayUrl specified', async () => {
			await FeatureGatesClass.initialize(
				{
					apiKey: CLIENT_KEY,
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
					useGatewayURL: true,
				},
				{
					atlassianAccountId: 'abc-123',
				},
				undefined,
			);

			expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
				mockClientSdkKey,
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						stableID: expect.any(String),
					},
					custom: {},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					includeCurrentPageUrlWithEvents: false,
				}),
			);
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith({ test: '123' });
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalled();

			expect(fetchMock.mock.calls[0][0]).toEqual(EXPECTED_KEY_GATEWAY_URL);
			expect(fetchMock.mock.calls[1][0]).toEqual(EXPECTED_VALUES_GATEWAY_URL);
		});

		test('initialize accepts all identifiers', async () => {
			const customAttributes = {
				firstAttribute: 'something',
				anotherAttribute: 'somethingElse',
				numberAttribute: 123,
				booleanAttribute: false,
			};
			mockFeatureFlagServiceEndpoints(
				Promise.resolve(mockClientSdkKey),
				Promise.resolve({
					experimentValues: { test: '123' },
					customAttributes,
				}),
			);

			await FeatureGatesClass.initialize(
				{
					apiKey: CLIENT_KEY,
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
				},
				{
					atlassianAccountId: 'abc-123',
					tenantId: 'cloud-id-123',
					atlassianOrgId: 'org-id-123',
				},
				customAttributes,
			);

			expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
				mockClientSdkKey,
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						stableID: expect.any(String),
						tenantId: 'cloud-id-123',
						atlassianOrgId: 'org-id-123',
					},
					custom: customAttributes,
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					includeCurrentPageUrlWithEvents: false,
				}),
			);
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith({ test: '123' });
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalled();
		});

		test('initialize accepts custom attributes', async () => {
			await FeatureGatesClass.initialize(
				{
					apiKey: CLIENT_KEY,
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
				},
				{
					atlassianAccountId: 'abc-123',
					tenantId: 'cloud-id-123',
					atlassianOrgId: 'org-id-123',
				},
				undefined,
			);

			expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
				mockClientSdkKey,
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						stableID: expect.any(String),
						tenantId: 'cloud-id-123',
						atlassianOrgId: 'org-id-123',
					},
					custom: {},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					includeCurrentPageUrlWithEvents: false,
				}),
			);
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith({ test: '123' });
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalled();
		});

		test('initialize passes through additional client options', async () => {
			await FeatureGatesClass.initialize(
				{
					apiKey: CLIENT_KEY,
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
					eventLoggingApi: 'some-url/',
				},
				{
					atlassianAccountId: 'abc-123',
					tenantId: 'cloud-id-123',
					atlassianOrgId: 'org-id-123',
				},
				undefined,
			);

			expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
				mockClientSdkKey,
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						stableID: expect.any(String),
						tenantId: 'cloud-id-123',
						atlassianOrgId: 'org-id-123',
					},
					custom: {},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					networkConfig: expect.objectContaining({
						logEventUrl: 'some-url/rgstr',
					}),
					includeCurrentPageUrlWithEvents: false,
				}),
			);
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith({ test: '123' });
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalled();
		});

		test('initialize with no values but correct sdk key if error occurs while fetching experiment values', async () => {
			console.error = jest.fn();
			console.warn = jest.fn();

			fetchMock.resetMocks();

			fetchMock
				.mockResponseOnce(
					JSON.stringify({
						clientSdkKey: mockClientSdkKey,
					}),
					{ status: 200 },
				)
				.mockResponseOnce('something went wrong', {
					status: 500,
				});

			await expect(
				FeatureGatesClass.initialize(
					{
						apiKey: CLIENT_KEY,
						environment: FeatureGateEnvironment.Development,
						targetApp: TARGET_APP,
					},
					{
						atlassianAccountId: 'abc-123',
					},
					undefined,
				),
			).rejects.toThrow(
				'Non 2xx response status received, status: 500, body: "something went wrong"',
			);

			expect(mockStatsigClientConstructor).toHaveBeenCalledTimes(1);
			expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
				mockClientSdkKey,
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						stableID: expect.any(String),
					},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					includeCurrentPageUrlWithEvents: false,
				}),
			);
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith({});
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalled();
			expect(console.warn).toHaveBeenCalledWith('Initialising Statsig client without values');
			expect(console.error).toHaveBeenCalledWith(
				'Error occurred when trying to fetch the Feature Gates client values, ' +
					'error: Non 2xx response status received, status: 500, body: "something went wrong"',
			);
		});

		test('initialize with no values if no client side sdk is retrieved from feature flag service', async () => {
			console.error = jest.fn();
			console.warn = jest.fn();

			fetchMock.resetMocks();

			fetchMock
				.mockResponseOnce('something went wrong', {
					status: 500,
				})
				.mockResponseOnce(
					JSON.stringify({
						experimentValues: { test: '123' },
					}),
					{ status: 200 },
				);

			await expect(
				FeatureGatesClass.initialize(
					{
						apiKey: CLIENT_KEY,
						environment: FeatureGateEnvironment.Development,
						targetApp: TARGET_APP,
					},
					{
						atlassianAccountId: 'abc-123',
					},
					undefined,
				),
			).rejects.toThrow(
				'Non 2xx response status received, status: 500, body: "something went wrong"',
			);

			expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
				'client-default-key',
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						stableID: expect.any(String),
					},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					includeCurrentPageUrlWithEvents: false,
				}),
			);
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith({});
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalled();
			expect(console.warn).toHaveBeenCalledWith('Initialising Statsig client without values');
			expect(console.error).toHaveBeenCalledWith(
				'Error occurred when trying to fetch the Feature Gates client values, ' +
					'error: Non 2xx response status received, status: 500, body: "something went wrong"',
			);
		});

		test('initialize returns the same rejected promise for all calls after the initial failure', async () => {
			console.error = jest.fn();
			console.warn = jest.fn();

			mockStatsigClient.initializeAsync.mockRejectedValueOnce('Failed to initialize');

			const doInit = async () =>
				FeatureGatesClass.initialize(
					{
						apiKey: CLIENT_KEY,
						environment: FeatureGateEnvironment.Development,
						targetApp: TARGET_APP,
					},
					{
						atlassianAccountId: 'abc-123',
					},
					undefined,
				);

			await expect(doInit()).rejects.toMatch('Failed to initialize');
			// once with the fetch response, and when that fails, another time with the defaults
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalledTimes(2);
			await expect(doInit()).rejects.toMatch('Failed to initialize');
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalledTimes(2);
		});

		test('initialize returns the same resolved promise for all calls after successful initialization', async () => {
			console.error = jest.fn();
			console.warn = jest.fn();

			const doInit = async () =>
				FeatureGatesClass.initialize(
					{
						apiKey: CLIENT_KEY,
						environment: FeatureGateEnvironment.Development,
						targetApp: TARGET_APP,
					},
					{
						atlassianAccountId: 'abc-123',
					},
					undefined,
				);

			await expect(doInit()).resolves.not.toThrow();
			await expect(doInit()).resolves.not.toThrow();
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalledTimes(1);
		});

		test('initialize should disable page logging to prevent PII/UGC leak', async () => {
			await FeatureGatesClass.initialize(
				{
					apiKey: CLIENT_KEY,
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
				},
				{
					atlassianAccountId: 'abc-123',
				},
				undefined,
			);

			expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
				mockClientSdkKey,
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						stableID: expect.any(String),
					},
					custom: {},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					includeCurrentPageUrlWithEvents: false,
				}),
			);
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith({ test: '123' });
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalled();

			expect(fetchMock.mock.calls[0][0]).toEqual(EXPECTED_KEY_DEV_URL);
			expect(fetchMock.mock.calls[1][0]).toEqual(EXPECTED_VALUES_DEV_URL);
		});

		test('should fire an analytics event if an analytics web client is provided', async () => {
			const clientPromise = Promise.resolve(client);
			await FeatureGatesClass.initialize(
				{
					apiKey: CLIENT_KEY,
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
					analyticsWebClient: clientPromise,
				},
				{
					atlassianAccountId: 'abc-123',
				},
				undefined,
			);
			await expect(clientPromise).resolves.toBe(client);
			expect(sendOperationalEventSpy).toHaveBeenCalledTimes(1);
			expect(sendOperationalEventSpy).toHaveBeenCalledWith({
				action: 'initialize',
				actionSubject: EVENT_ACTION_SUBJECT,
				attributes: {
					apiKey: CLIENT_KEY,
					targetApp: TARGET_APP,
					clientVersion: CLIENT_VERSION,
					success: true,
					startTime: expect.any(Number),
					totalTime: expect.any(Number),
				},
				tags: ['measurement'],
				source: '@atlaskit/feature-gate-js-client',
			});
		});

		test('should not block initialization if analytics web client fails to initialize', async () => {
			const clientError = new Error('Failed to initialize analytics web client.');
			const clientPromise = Promise.reject(clientError);

			const fg_init_promise = FeatureGatesClass.initialize(
				{
					apiKey: CLIENT_KEY,
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
					analyticsWebClient: clientPromise,
				},
				{
					atlassianAccountId: 'abc-123',
				},
				undefined,
			);
			await expect(fg_init_promise).resolves.toBeUndefined();
			expect(sendOperationalEventSpy).toHaveBeenCalledTimes(0);
			expect(FeatureGatesClass.initializeCompleted()).toBe(true);
		});
	});

	describe('initialize client with producer', function () {
		test('initialize should not return warning when client has already been initialized with the same options', async () => {
			await FeatureGatesClass.initializeWithProvider(
				{
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
				},
				mockProvider,
				{
					atlassianAccountId: 'abc-123',
				},
				undefined,
			);

			await expect(
				FeatureGatesClass.initializeWithProvider(
					{
						environment: FeatureGateEnvironment.Development,
						targetApp: TARGET_APP,
					},
					mockProvider,
					{
						atlassianAccountId: 'abc-123',
					},
					undefined,
				),
			).resolves.toBe(undefined);

			expect(mockStatsigClient.initializeAsync).toHaveBeenCalledTimes(1);
		});

		test('initialize should return warning when client has already been initialized with different options', async () => {
			console.warn = jest.fn();

			await FeatureGatesClass.initializeWithProvider(
				{
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
				},
				mockProvider,
				{
					atlassianAccountId: 'abc-123',
				},
				undefined,
			);

			await expect(
				FeatureGatesClass.initializeWithProvider(
					{
						environment: FeatureGateEnvironment.Staging,
						targetApp: TARGET_APP,
					},
					mockProvider,
					{
						atlassianAccountId: 'abc-123',
					},
					undefined,
				),
			).resolves.toBe(undefined);

			expect(mockStatsigClient.initializeAsync).toHaveBeenCalledTimes(1);
			expect(console.warn).toHaveBeenCalledWith(
				'Feature Gates client already initialized with different options. New options were not applied.',
			);
		});

		test('initialize should set client version and apply method', async () => {
			const identifiers = {
				atlassianAccountId: 'abc-123',
			};
			const baseClientOptions = {
				environment: FeatureGateEnvironment.Development,
				targetApp: TARGET_APP,
			};

			await FeatureGatesClass.initializeWithProvider(baseClientOptions, mockProvider, identifiers);

			expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
				mockClientSdkKey,
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						stableID: expect.any(String),
					},
					custom: {},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					includeCurrentPageUrlWithEvents: false,
				}),
			);
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith({ test: '123' });
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalled();

			expect(mockProvider.setApplyUpdateCallback).toHaveBeenCalledWith(expect.any(Function));
			expect(mockProvider.setClientVersion).toHaveBeenCalledWith(CLIENT_VERSION);
		});

		test('initialize should map key identifiers into a statsig user', async () => {
			const identifiers = {
				atlassianAccountId: 'abc-123',
			};
			const baseClientOptions = {
				environment: FeatureGateEnvironment.Development,
				targetApp: TARGET_APP,
			};

			await FeatureGatesClass.initializeWithProvider(baseClientOptions, mockProvider, identifiers);

			expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
				mockClientSdkKey,
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						stableID: expect.any(String),
					},
					custom: {},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					includeCurrentPageUrlWithEvents: false,
				}),
			);
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith({ test: '123' });
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalled();

			expect(mockProvider.setProfile).toHaveBeenCalled();
			expect(mockProvider.getClientSdkKey).toHaveBeenCalled();
			expect(mockProvider.getExperimentValues).toHaveBeenCalled();
		});

		test('initialize accepts multiple identifiers', async () => {
			const identifiers = {
				atlassianAccountId: 'abc-123',
				tenantId: 'cloud-id-123',
				atlassianOrgId: 'org-id-123',
			};
			const baseClientOptions = {
				environment: FeatureGateEnvironment.Development,
				targetApp: TARGET_APP,
			};
			mockProvider.getExperimentValues = jest.fn().mockResolvedValue({
				clientSdkKey: mockClientSdkKey,
				experimentValues: { test: '123' },
			});

			await FeatureGatesClass.initializeWithProvider(baseClientOptions, mockProvider, identifiers);

			expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
				mockClientSdkKey,
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						stableID: expect.any(String),
						tenantId: 'cloud-id-123',
						atlassianOrgId: 'org-id-123',
					},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					includeCurrentPageUrlWithEvents: false,
				}),
			);
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith({ test: '123' });
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalled();

			expect(mockProvider.setProfile).toHaveBeenCalled();
			expect(mockProvider.getClientSdkKey).toHaveBeenCalled();
			expect(mockProvider.getExperimentValues).toHaveBeenCalled();
		});

		test('initialize accepts custom attributes', async () => {
			const identifiers = {
				atlassianAccountId: 'abc-123',
				tenantId: 'cloud-id-123',
				atlassianOrgId: 'org-id-123',
			};
			const baseClientOptions = {
				environment: FeatureGateEnvironment.Development,
				targetApp: TARGET_APP,
			};
			const customAttributes = {
				firstAttribute: 'something',
				anotherAttribute: 'somethingElse',
				numberAttribute: 123,
				booleanAttribute: false,
			};
			mockProvider.getExperimentValues = jest.fn().mockResolvedValue({
				clientSdkKey: mockClientSdkKey,
				experimentValues: { test: '123' },
				customAttributesFromFetch: customAttributes,
			});

			await FeatureGatesClass.initializeWithProvider(
				baseClientOptions,
				mockProvider,
				identifiers,
				customAttributes,
			);

			expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
				mockClientSdkKey,
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						stableID: expect.any(String),
						tenantId: 'cloud-id-123',
						atlassianOrgId: 'org-id-123',
					},
					custom: customAttributes,
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					includeCurrentPageUrlWithEvents: false,
				}),
			);
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith({ test: '123' });
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalled();

			expect(mockProvider.setProfile).toHaveBeenCalled();
			expect(mockProvider.getClientSdkKey).toHaveBeenCalled();
			expect(mockProvider.getExperimentValues).toHaveBeenCalled();
		});

		test('initialize passes through additional client options', async () => {
			const identifiers = {
				atlassianAccountId: 'abc-123',
				tenantId: 'cloud-id-123',
				atlassianOrgId: 'org-id-123',
			};
			const baseClientOptions = {
				environment: FeatureGateEnvironment.Development,
				targetApp: TARGET_APP,
				eventLoggingApi: 'some-url/',
			};
			mockProvider.getExperimentValues = jest.fn().mockResolvedValue({
				clientSdkKey: mockClientSdkKey,
				experimentValues: { test: '123' },
			});

			await FeatureGatesClass.initializeWithProvider(baseClientOptions, mockProvider, identifiers);

			expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
				mockClientSdkKey,
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						stableID: expect.any(String),
						tenantId: 'cloud-id-123',
						atlassianOrgId: 'org-id-123',
					},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					includeCurrentPageUrlWithEvents: false,
					networkConfig: expect.objectContaining({
						logEventUrl: 'some-url/rgstr',
					}),
				}),
			);
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith({ test: '123' });
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalled();

			expect(mockProvider.setProfile).toHaveBeenCalled();
			expect(mockProvider.getClientSdkKey).toHaveBeenCalled();
			expect(mockProvider.getExperimentValues).toHaveBeenCalled();
		});

		test('initialize with no values but correct sdk key if error occurs while getting experiment values', async () => {
			console.error = jest.fn();
			console.warn = jest.fn();

			(mockProvider.getExperimentValues as jest.Mock).mockRejectedValue(
				new Error('Non 2xx response status received, status: 500, body: "something went wrong"'),
			);

			await expect(
				FeatureGatesClass.initializeWithProvider(
					{
						environment: FeatureGateEnvironment.Development,
						targetApp: TARGET_APP,
					},
					mockProvider,
					{
						atlassianAccountId: 'abc-123',
					},
					undefined,
				),
			).rejects.toThrow(
				'Non 2xx response status received, status: 500, body: "something went wrong"',
			);

			expect(mockStatsigClientConstructor).toHaveBeenCalledTimes(1);
			expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
				mockClientSdkKey,
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						stableID: expect.any(String),
					},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					includeCurrentPageUrlWithEvents: false,
				}),
			);
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith({});
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalled();
			expect(console.warn).toHaveBeenCalledWith('Initialising Statsig client without values');
			expect(console.error).toHaveBeenCalledWith(
				'Error occurred when trying to fetch the Feature Gates client values, ' +
					'error: Non 2xx response status received, status: 500, body: "something went wrong"',
			);
		});

		test('initialize with no values if no client side sdk is retrieved from feature flag service', async () => {
			console.error = jest.fn();
			console.warn = jest.fn();

			(mockProvider.getClientSdkKey as jest.Mock).mockRejectedValue(
				new Error('Error occurred when getting client sdk key'),
			);

			await expect(
				FeatureGatesClass.initializeWithProvider(
					{
						environment: FeatureGateEnvironment.Development,
						targetApp: TARGET_APP,
					},
					mockProvider,
					{
						atlassianAccountId: 'abc-123',
					},
					undefined,
				),
			).rejects.toThrow('Error occurred when getting client sdk key');

			expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
				'client-default-key',
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						stableID: expect.any(String),
					},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					includeCurrentPageUrlWithEvents: false,
				}),
			);
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith({});
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalled();
			expect(console.warn).toHaveBeenCalledWith('Initialising Statsig client without values');
			expect(console.error).toHaveBeenCalledWith(
				'Error occurred when trying to fetch the Feature Gates client values, ' +
					'error: Error occurred when getting client sdk key',
			);
		});

		test('initialize returns the same rejected promise for all calls after the initial failure', async () => {
			console.error = jest.fn();
			console.warn = jest.fn();

			mockStatsigClient.initializeAsync.mockRejectedValueOnce('Failed to initialize');

			const doInit = async () =>
				FeatureGatesClass.initializeWithProvider(
					{
						environment: FeatureGateEnvironment.Development,
						targetApp: TARGET_APP,
					},
					mockProvider,
					{
						atlassianAccountId: 'abc-123',
					},
					undefined,
				);

			await expect(doInit()).rejects.toMatch('Failed to initialize');
			// once with the fetch response, and when that fails, another time with the defaults
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalledTimes(2);
			await expect(doInit()).rejects.toMatch('Failed to initialize');
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalledTimes(2);
		});

		test('initialize returns the same resolved promise for all calls after successful initialization', async () => {
			console.error = jest.fn();
			console.warn = jest.fn();

			const doInit = async () =>
				FeatureGatesClass.initializeWithProvider(
					{
						environment: FeatureGateEnvironment.Development,
						targetApp: TARGET_APP,
					},
					mockProvider,
					{
						atlassianAccountId: 'abc-123',
					},
					undefined,
				);

			await expect(doInit()).resolves.not.toThrow();
			await expect(doInit()).resolves.not.toThrow();
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalledTimes(1);
		});

		test('initialize should disable page logging to prevent PII/UGC leak', async () => {
			await FeatureGatesClass.initializeWithProvider(
				{
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
				},
				mockProvider,
				{
					atlassianAccountId: 'abc-123',
				},
			);

			expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
				mockClientSdkKey,
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						stableID: expect.any(String),
					},
					custom: {},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					includeCurrentPageUrlWithEvents: false,
				}),
			);
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith({ test: '123' });
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalled();
		});

		test('should fire an analytics event if an analytics web client is provided', async () => {
			const clientPromise = Promise.resolve(client);
			await FeatureGatesClass.initializeWithProvider(
				{
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
					analyticsWebClient: clientPromise,
				},
				mockProvider,
				{
					atlassianAccountId: 'abc-123',
				},
			);
			await expect(clientPromise).resolves.toBe(client);
			expect(sendOperationalEventSpy).toHaveBeenCalledTimes(1);
			expect(sendOperationalEventSpy).toHaveBeenCalledWith({
				action: 'initializeWithProvider',
				actionSubject: EVENT_ACTION_SUBJECT,
				attributes: {
					apiKey: mockApiKey,
					targetApp: TARGET_APP,
					clientVersion: CLIENT_VERSION,
					success: true,
					startTime: expect.any(Number),
					totalTime: expect.any(Number),
				},
				tags: ['measurement'],
				source: '@atlaskit/feature-gate-js-client',
			});
		});

		test('should not block initialization if analytics web client fails to initialize', async () => {
			const clientError = new Error('Failed to initialize analytics web client.');
			const clientPromise = Promise.reject(clientError);

			const fg_init_promise = FeatureGatesClass.initializeWithProvider(
				{
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
					analyticsWebClient: clientPromise,
				},
				mockProvider,
				{
					atlassianAccountId: 'abc-123',
				},
				undefined,
			);
			await expect(fg_init_promise).resolves.toBeUndefined();
			expect(sendOperationalEventSpy).toHaveBeenCalledTimes(0);
			expect(FeatureGatesClass.initializeCompleted()).toBe(true);
		});
	});

	describe('initialize client from values', function () {
		test('initialize should map key identifiers into a statsig user and defaulted initializeValues', async () => {
			await FeatureGatesClass.initializeFromValues(
				{
					sdkKey: 'client-my-sdk-key',
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
				},
				{
					atlassianAccountId: 'abc-123',
				},
				undefined,
				undefined,
			);

			expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
				'client-my-sdk-key',
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						stableID: expect.any(String),
					},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					includeCurrentPageUrlWithEvents: false,
				}),
			);
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith({ has_updates: true });
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalled();
		});

		test('initialize pass through actual initializeValues', async () => {
			await FeatureGatesClass.initializeFromValues(
				{
					sdkKey: 'client-my-sdk-key',
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
				},
				{
					atlassianAccountId: 'abc-123',
				},
				undefined,
				{
					'gate-key': { cohort: 'keyper' },
				},
			);

			expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
				'client-my-sdk-key',
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						stableID: expect.any(String),
					},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					includeCurrentPageUrlWithEvents: false,
				}),
			);
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith({
				has_updates: true,
				'gate-key': { cohort: 'keyper' },
			});
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalled();
		});

		test('initialize accepts all identifiers', async () => {
			await FeatureGatesClass.initializeFromValues(
				{
					sdkKey: 'client-my-sdk-key',
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
				},
				{
					atlassianAccountId: 'abc-123',
					tenantId: 'cloud-id-123',
					atlassianOrgId: 'org-id-123',
				},
				{
					firstAttribute: 'something',
					anotherAttribute: 'somethingElse',
					numberAttribute: 123,
					booleanAttribute: false,
				},
				undefined,
			);

			expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
				'client-my-sdk-key',
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						stableID: expect.any(String),
						tenantId: 'cloud-id-123',
						atlassianOrgId: 'org-id-123',
					},
					custom: {
						firstAttribute: 'something',
						anotherAttribute: 'somethingElse',
						numberAttribute: 123,
						booleanAttribute: false,
					},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					includeCurrentPageUrlWithEvents: false,
				}),
			);
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith({ has_updates: true });
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalled();
		});

		test('initialize accepts custom attributes', async () => {
			await FeatureGatesClass.initializeFromValues(
				{
					sdkKey: 'client-my-sdk-key',
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
				},
				{
					atlassianAccountId: 'abc-123',
					tenantId: 'cloud-id-123',
					atlassianOrgId: 'org-id-123',
				},
				undefined,
				undefined,
			);

			expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
				'client-my-sdk-key',
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						stableID: expect.any(String),
						tenantId: 'cloud-id-123',
						atlassianOrgId: 'org-id-123',
					},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					includeCurrentPageUrlWithEvents: false,
				}),
			);
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith({ has_updates: true });
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalled();
		});

		test('initialize passes through additional client options', async () => {
			await FeatureGatesClass.initializeFromValues(
				{
					sdkKey: 'client-my-sdk-key',
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
					eventLoggingApi: 'some-url/',
				},
				{
					atlassianAccountId: 'abc-123',
					tenantId: 'cloud-id-123',
					atlassianOrgId: 'org-id-123',
				},
				undefined,
				undefined,
			);

			expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
				'client-my-sdk-key',
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						stableID: expect.any(String),
						tenantId: 'cloud-id-123',
						atlassianOrgId: 'org-id-123',
					},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					networkConfig: expect.objectContaining({
						logEventUrl: 'some-url/rgstr',
					}),
					includeCurrentPageUrlWithEvents: false,
				}),
			);
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith({ has_updates: true });
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalled();
		});

		test('initialize should initialise with default key', async () => {
			await FeatureGatesClass.initializeFromValues(
				{
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
				},
				{
					atlassianAccountId: 'abc-123',
				},
				undefined,
				{ test: '123' },
			);

			expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
				'client-default-key',
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						stableID: expect.any(String),
					},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					includeCurrentPageUrlWithEvents: false,
				}),
			);
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith({
				has_updates: true,
				test: '123',
			});
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalled();
		});

		test('initialize returns the same rejected promise for all calls after the initial failure', async () => {
			console.error = jest.fn();
			console.warn = jest.fn();

			mockStatsigClient.initializeAsync.mockRejectedValueOnce('Failed to initialize');
			const doInit = async () =>
				FeatureGatesClass.initializeFromValues(
					{
						sdkKey: 'client-my-sdk-key',
						environment: FeatureGateEnvironment.Development,
						targetApp: TARGET_APP,
						eventLoggingApi: 'some-url/',
					},
					{
						atlassianAccountId: 'abc-123',
						tenantId: 'cloud-id-123',
						atlassianOrgId: 'org-id-123',
					},
					undefined,
					undefined,
				);

			await expect(doInit()).rejects.toMatch('Failed to initialize');
			await expect(doInit()).rejects.toMatch('Failed to initialize');
			await expect(doInit()).rejects.toMatch('Failed to initialize');
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalledTimes(2);
		});

		test('initialize using default values after first reject', async () => {
			console.error = jest.fn();
			console.warn = jest.fn();

			mockStatsigClient.initializeAsync.mockRejectedValueOnce(new Error('Failed to initialize'));

			await expect(
				FeatureGatesClass.initializeFromValues(
					{
						sdkKey: 'client-my-sdk-key',
						environment: FeatureGateEnvironment.Development,
						targetApp: TARGET_APP,
						eventLoggingApi: 'some-url/',
					},
					{
						atlassianAccountId: 'abc-123',
						tenantId: 'cloud-id-123',
						atlassianOrgId: 'org-id-123',
					},
					undefined,
					{ test: '123' },
				),
			).rejects.toThrow('Failed to initialize');
			expect(mockStatsigClientConstructor).toHaveBeenCalledTimes(2);
			expect(mockStatsigClientConstructor).toHaveBeenNthCalledWith(
				1,
				'client-my-sdk-key',
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						stableID: expect.any(String),
						tenantId: 'cloud-id-123',
						atlassianOrgId: 'org-id-123',
					},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					networkConfig: expect.objectContaining({
						logEventUrl: 'some-url/rgstr',
					}),
					includeCurrentPageUrlWithEvents: false,
					targetApp: TARGET_APP,
				}),
			);
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith({
				has_updates: true,
				test: '123',
			});
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalled();

			expect(mockStatsigClientConstructor).toHaveBeenNthCalledWith(
				2,
				'client-default-key',
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						stableID: expect.any(String),
						tenantId: 'cloud-id-123',
						atlassianOrgId: 'org-id-123',
					},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					networkConfig: expect.objectContaining({
						logEventUrl: 'some-url/rgstr',
					}),
					includeCurrentPageUrlWithEvents: false,
					targetApp: TARGET_APP,
				}),
			);
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith();
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalled();

			expect(console.warn).toHaveBeenCalledWith(
				'Initialising Statsig client with default sdk key and without values',
			);
			expect(console.error).toHaveBeenCalledWith(
				'Error occurred when trying to initialise the Statsig client, error: Failed to initialize',
			);
		});

		test('initialize returns the same resolved promise for all calls after successful initialization', async () => {
			console.error = jest.fn();
			console.warn = jest.fn();

			const doInit = () =>
				FeatureGatesClass.initializeFromValues(
					{
						sdkKey: 'client-my-sdk-key',
						environment: FeatureGateEnvironment.Development,
						targetApp: TARGET_APP,
						eventLoggingApi: 'some-url/',
					},
					{
						atlassianAccountId: 'abc-123',
						tenantId: 'cloud-id-123',
						atlassianOrgId: 'org-id-123',
					},
					undefined,
					undefined,
				);

			await expect(doInit()).resolves.not.toThrow();
			await expect(doInit()).resolves.not.toThrow();
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalledTimes(1);
		});

		test('initialize should disable page logging to prevent PII/UGC leak', async () => {
			await FeatureGatesClass.initializeFromValues(
				{
					sdkKey: 'client-my-sdk-key',
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
				},
				{
					atlassianAccountId: 'abc-123',
				},
				undefined,
				undefined,
			);

			expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
				'client-my-sdk-key',
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						stableID: expect.any(String),
					},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					includeCurrentPageUrlWithEvents: false,
				}),
			);
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith({ has_updates: true });
			expect(mockStatsigClient.initializeAsync).toHaveBeenCalled();
		});

		test('should fire an analytics event if an analytics web client is provided', async () => {
			const clientPromise = Promise.resolve(client);
			await FeatureGatesClass.initializeFromValues(
				{
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
					analyticsWebClient: clientPromise,
				},
				{
					atlassianAccountId: 'abc-123',
				},
			);
			await expect(clientPromise).resolves.toBe(client);
			expect(sendOperationalEventSpy).toHaveBeenCalledTimes(1);
			expect(sendOperationalEventSpy).toHaveBeenCalledWith({
				action: 'initializeFromValues',
				actionSubject: EVENT_ACTION_SUBJECT,
				attributes: {
					targetApp: TARGET_APP,
					clientVersion: CLIENT_VERSION,
					success: true,
					startTime: expect.any(Number),
					totalTime: expect.any(Number),
				},
				tags: ['measurement'],
				source: '@atlaskit/feature-gate-js-client',
			});
		});

		test('should not block initialization if analytics web client fails to initialize', async () => {
			const clientError = new Error('Failed to initialize analytics web client.');
			const clientPromise = Promise.reject(clientError);
			const fg_promise = FeatureGatesClass.initializeFromValues(
				{
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
					analyticsWebClient: clientPromise,
				},
				{
					atlassianAccountId: 'abc-123',
				},
				undefined,
			);
			await expect(fg_promise).resolves.toBeUndefined();
			expect(sendOperationalEventSpy).toHaveBeenCalledTimes(0);
			expect(FeatureGatesClass.initializeCompleted()).toBe(true);
		});
	});

	describe('getExperimentValue', () => {
		beforeEach(mockAndInit);

		test('evaluating a flag without setting fireExposureEvent will call StatsigClient.getExperiment', () => {
			FeatureGatesClass.getExperimentValue('test-experiment', 'cohort', 'control');
			expect(mockStatsigClient.getExperiment).toHaveBeenCalledWith('test-experiment', {
				disableExposureLog: false,
			});
		});

		test('evaluating a flag with fireExposureEvent set to true will call StatsigClient.getExperiment', () => {
			FeatureGatesClass.getExperimentValue('test-experiment', 'control', true);
			expect(mockStatsigClient.getExperiment).toHaveBeenCalledWith('test-experiment', {
				disableExposureLog: false,
			});
		});

		test('evaluating a flag with fireExposureEvent set to false will call StatsigClient.getExperiment with disableExposureLog', () => {
			FeatureGatesClass.getExperimentValue('test-experiment', 'cohort', 'control', {
				fireExperimentExposure: false,
			});
			expect(mockStatsigClient.getExperiment).toHaveBeenCalledWith('test-experiment', {
				disableExposureLog: true,
			});
		});

		test('evaluating a flag with fireExposureEvent set to undefined will call StatsigClient.getExperiment', () => {
			FeatureGatesClass.getExperimentValue('test-experiment', 'cohort', 'control', {
				fireExperimentExposure: undefined,
			});
			expect(mockStatsigClient.getExperiment).toHaveBeenCalledWith('test-experiment', {
				disableExposureLog: false,
			});
		});

		test('catches any exception and logs a warning on the first occurrences of an error', () => {
			console.warn = jest.fn();

			mockStatsigClient.getExperiment.mockReturnValue({
				get: jest.fn().mockImplementation(() => {
					throw new Error('mock error');
				}),
				details: { reason: 'mock' },
				value: { cohort: 'test' },
			} as unknown as Experiment);

			FeatureGatesClass.getExperimentValue('test-experiment', 'cohort', 'control', {
				fireExperimentExposure: true,
			});

			FeatureGatesClass.getExperimentValue('test-experiment', 'cohort', 'control', {
				fireExperimentExposure: true,
			});

			expect(console.warn).toHaveBeenCalledWith({
				msg: 'An error has occurred getting the experiment value. Only the first occurrence of this error is logged.',
				experimentName: 'test-experiment',
				defaultValue: 'control',
				options: {
					fireExperimentExposure: true,
				},
				error: new Error('mock error'),
			});
			expect(console.warn).toHaveBeenCalledTimes(1);
		});
	});

	describe('getExperiment', () => {
		beforeEach(mockAndInit);

		test('catches any exception and logs a warning on the first occurrences of an error', () => {
			console.warn = jest.fn();

			mockStatsigClient.getExperiment.mockImplementation(() => {
				throw new Error('mock error');
			});

			FeatureGatesClass.getExperiment('test-experiment');
			FeatureGatesClass.getExperiment('test-experiment');

			expect(console.warn).toHaveBeenCalledWith({
				msg: 'An error has occurred getting the experiment. Only the first occurrence of this error is logged.',
				experimentName: 'test-experiment',
				error: new Error('mock error'),
			});
			expect(console.warn).toHaveBeenCalledTimes(1);
		});

		test('defaults to sending the exposure event when no options are provided', () => {
			FeatureGatesClass.getExperiment('test-experiment');
			expect(mockStatsigClient.getExperiment).toHaveBeenCalledWith('test-experiment', {
				disableExposureLog: false,
			});
		});

		test('defaults to sending the exposure event when options are provided, but fireExperimentExposure is not set', () => {
			FeatureGatesClass.getExperiment('test-experiment', {});
			expect(mockStatsigClient.getExperiment).toHaveBeenCalledWith('test-experiment', {
				disableExposureLog: false,
			});
		});

		test('does not send the exposure event if the fireExperimentExposure option is set to false', () => {
			FeatureGatesClass.getExperiment('test-experiment', {
				fireExperimentExposure: false,
			});
			expect(mockStatsigClient.getExperiment).toHaveBeenCalledWith('test-experiment', {
				disableExposureLog: true,
			});
		});
	});

	describe('getLayer', () => {
		beforeEach(mockAndInit);

		test('catches any exception and logs a warning on the first occurrences of an error', () => {
			console.warn = jest.fn();

			mockStatsigClient.getLayer.mockImplementation(() => {
				throw new Error('mock error');
			});

			FeatureGatesClass.getLayer('test-layer');
			FeatureGatesClass.getLayer('test-layer');

			expect(console.warn).toHaveBeenCalledWith({
				msg: 'An error has occurred getting the layer. Only the first occurrence of this error is logged.',
				layerName: 'test-layer',
				error: new Error('mock error'),
			});
			expect(console.warn).toHaveBeenCalledTimes(1);
		});

		test('defaults to sending the exposure event when no options are provided', () => {
			FeatureGatesClass.getLayer('test-layer');
			expect(mockStatsigClient.getLayer).toHaveBeenCalledTimes(1);
		});

		test('defaults to sending the exposure event when options are provided, but fireExperimentExposure is not set', () => {
			FeatureGatesClass.getLayer('test-layer', {});
			expect(mockStatsigClient.getLayer).toHaveBeenCalledTimes(1);
		});

		test('does not send the exposure event if the fireExperimentExposure option is set to false', () => {
			FeatureGatesClass.getLayer('test-layer', {
				fireLayerExposure: false,
			});
			expect(mockStatsigClient.getLayer).toHaveBeenCalledWith('test-layer', {
				disableExposureLog: true,
			});
		});
	});

	describe('getLayerValue', () => {
		beforeEach(mockAndInit);

		test('evaluating a flag without setting fireExposureEvent will call StatsigClient.getLayer', () => {
			FeatureGatesClass.getLayerValue('test-layer', 'cohort', 'control');
			expect(mockStatsigClient.getLayer).toHaveBeenCalledWith('test-layer', {
				disableExposureLog: false,
			});
		});

		test('evaluating a flag with fireExposureEvent set to true will call StatsigClient.getLayer', () => {
			FeatureGatesClass.getLayerValue('test-layer', 'control', 'control', {
				fireLayerExposure: true,
			});
			expect(mockStatsigClient.getLayer).toHaveBeenCalledWith('test-layer', {
				disableExposureLog: false,
			});
		});

		test('evaluating a flag with fireExposureEvent set to false will call StatsigClient.getLayer with disableExposureLog', () => {
			FeatureGatesClass.getLayerValue('test-layer', 'cohort', 'control', {
				fireLayerExposure: false,
			});
			expect(mockStatsigClient.getLayer).toHaveBeenCalledWith('test-layer', {
				disableExposureLog: true,
			});
		});

		test('evaluating a flag with fireExposureEvent set to undefined will call StatsigClient.getLayer', () => {
			FeatureGatesClass.getLayerValue('test-layer', 'cohort', 'control', {
				fireLayerExposure: undefined,
			});
			expect(mockStatsigClient.getLayer).toHaveBeenCalledWith('test-layer', {
				disableExposureLog: false,
			});
		});

		test('catches any exception and logs a warning on the first occurrences of an error', () => {
			console.warn = jest.fn();

			mockStatsigClient.getLayer.mockReturnValue({
				get: jest.fn().mockImplementation(() => {
					throw new Error('mock error');
				}),
				details: { reason: 'mock' },
				__value: { cohort: 'test' },
			} as unknown as Layer);

			FeatureGatesClass.getLayerValue('test-layer', 'cohort', 'control', {
				fireLayerExposure: true,
			});

			FeatureGatesClass.getLayerValue('test-layer', 'cohort', 'control', {
				fireLayerExposure: true,
			});

			expect(console.warn).toHaveBeenCalledWith({
				msg: 'An error has occurred getting the layer value. Only the first occurrence of this error is logged.',
				layerName: 'test-layer',
				defaultValue: 'control',
				options: {
					fireLayerExposure: true,
				},
				error: new Error('mock error'),
			});
			expect(console.warn).toHaveBeenCalledTimes(1);
		});
	});

	describe('checkGate', () => {
		beforeEach(mockAndInit);

		test('calls StatsigClient.checkGate with the provided gate name', () => {
			FeatureGatesClass.checkGate('myGate');
			expect(mockStatsigClient.checkGate).toHaveBeenCalledWith('myGate', {
				disableExposureLog: false,
			});
		});

		test('calls StatsigClient.checkGate with the provided gate name when fireGateExposure is explicitly true', () => {
			FeatureGatesClass.checkGate('myGate', { fireGateExposure: true });
			expect(mockStatsigClient.checkGate).toHaveBeenCalledWith('myGate', {
				disableExposureLog: false,
			});
		});

		test('calls StatsigClient.checkGate with the provided gate name when fireGateExposure is false', () => {
			FeatureGatesClass.checkGate('myGate', { fireGateExposure: false });
			expect(mockStatsigClient.checkGate).toHaveBeenCalledWith('myGate', {
				disableExposureLog: true,
			});
		});

		test('catches any exception and logs a warning on the first occurrences of an error', () => {
			console.warn = jest.fn();

			mockStatsigClient.checkGate.mockImplementation(() => {
				throw new Error('mock error');
			});

			FeatureGatesClass.checkGate('test-gate');
			FeatureGatesClass.checkGate('test-gate');

			expect(console.warn).toHaveBeenCalledWith({
				msg: 'An error has occurred checking the feature gate. Only the first occurrence of this error is logged.',
				gateName: 'test-gate',
				error: new Error('mock error'),
			});
			expect(console.warn).toHaveBeenCalledTimes(1);
		});
	});

	describe('shutdownStatsig', () => {
		beforeEach(mockAndInit);

		test('should call the shutdown function on the client', async () => {
			FeatureGatesClass.shutdownStatsig();
			expect(mockStatsigClient.shutdown).toHaveBeenCalledTimes(1);
		});
	});

	describe('updateUser', () => {
		afterEach(() => {
			fetchMock.resetMocks();
		});

		test('should throw an error if called before an initialization has started', async () => {
			await expect(
				FeatureGatesClass.updateUser(
					{
						apiKey: 'apiKey-456',
						environment: FeatureGateEnvironment.Development,
						perimeter: PerimeterType.COMMERCIAL,
						targetApp: TARGET_APP,
					},
					{
						atlassianAccountId: 'abc-456',
					},
					undefined,
				),
			).rejects.toThrow();
			expect(fetchMock).not.toBeCalled();
			expect(mockStatsigClient.updateUserAsync).not.toBeCalled();
		});

		test('should change the initialize result from a rejected promise to a resolved once if the updateUser puts the client back into a valid state', async () => {
			mockStatsigClient.initializeAsync.mockRejectedValueOnce('Initialization error');
			await expect(initialize()).rejects.toMatch('Initialization error');

			await FeatureGatesClass.updateUser(
				{
					apiKey: 'apiKey-456',
					environment: FeatureGateEnvironment.Development,
					perimeter: PerimeterType.COMMERCIAL,
					targetApp: TARGET_APP,
				},
				{ atlassianAccountId: 'abc-456' },
				undefined,
			);

			await expect(initialize()).resolves.not.toThrow();
		});

		test('should not change the initialize result from a resolved promise to a rejected promise if the updateUser call fails', async () => {
			await initialize();

			mockStatsigClient.updateUserAsync.mockRejectedValue('mock error');
			await expect(
				FeatureGatesClass.updateUser(
					{
						apiKey: 'apiKey-456',
						environment: FeatureGateEnvironment.Development,
						perimeter: PerimeterType.COMMERCIAL,
						targetApp: TARGET_APP,
					},
					{ atlassianAccountId: 'abc-456' },
					undefined,
				),
			).rejects.toThrowError();

			await expect(initialize()).resolves.not.toThrow();
		});

		test('should keep the initialize promise in a rejected state if the updateUser call also fails', async () => {
			mockStatsigClient.initializeAsync.mockRejectedValueOnce('Initialization error');
			await expect(initialize()).rejects.toMatch('Initialization error');

			mockStatsigClient.updateUserAsync.mockRejectedValue('mock error');
			await expect(
				FeatureGatesClass.updateUser(
					{
						apiKey: 'apiKey-456',
						environment: FeatureGateEnvironment.Development,
						perimeter: PerimeterType.COMMERCIAL,
						targetApp: TARGET_APP,
					},
					{ atlassianAccountId: 'abc-456' },
					undefined,
				),
			).rejects.toThrowError();
			await expect(initialize()).rejects.toMatch('Initialization error');
		});

		test('should perform a call to the experimentValues endpoint to fetch the new user values', async () => {
			await initialize();
			mockFeatureFlagServiceEndpoints(
				Promise.resolve(mockClientSdkKey),
				Promise.resolve({
					experimentValues: { test: '456' },
					customAttributes: {},
				}),
			);

			await FeatureGatesClass.updateUser(
				{
					apiKey: 'apiKey-456',
					environment: FeatureGateEnvironment.Development,
					perimeter: PerimeterType.COMMERCIAL,
					targetApp: TARGET_APP,
				},
				{ atlassianAccountId: 'abc-456' },
				undefined,
			);

			expect(fetchMock.mock.calls.length).toEqual(1);
			expect(fetchMock.mock.calls[0][0]).toEqual(EXPECTED_VALUES_DEV_URL);
			expect(mockStatsigClient.updateUserAsync).toHaveBeenCalledWith({
				userID: 'abc-456',
				customIDs: {
					atlassianAccountId: 'abc-456',
					stableID: expect.any(String),
				},
				custom: {},
			});
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith({ test: '456' });
		});

		test('should not change the user if the call to the experimentValues endpoint fails', async () => {
			const updateUserCompletionCallback = jest.fn();
			await initialize(updateUserCompletionCallback);
			mockFeatureFlagServiceEndpoints(
				Promise.resolve(mockClientSdkKey),
				Promise.reject(new Error('Failed to fetch experimentValues')),
			);

			await expect(
				FeatureGatesClass.updateUser(
					{
						apiKey: 'apiKey-456',
						environment: FeatureGateEnvironment.Development,
						perimeter: PerimeterType.COMMERCIAL,
						targetApp: TARGET_APP,
					},
					{ atlassianAccountId: 'abc-456' },
					undefined,
				),
			).rejects.toThrowError('Failed to fetch experimentValues');

			expect(mockStatsigClient.updateUserAsync).not.toHaveBeenCalled();
			expect(updateUserCompletionCallback).toHaveBeenCalledWith(
				false,
				expect.stringContaining('Failed to fetch experimentValues'),
			);
			await expect(initialize()).resolves.not.toThrow();
		});

		test("should return immediately if the user isn't actually changing", async () => {
			await initialize();
			await expect(
				FeatureGatesClass.updateUser(
					{
						apiKey: CLIENT_KEY,
						environment: FeatureGateEnvironment.Development,
						perimeter: PerimeterType.COMMERCIAL,
						targetApp: TARGET_APP,
					},
					{ atlassianAccountId: 'abc-123' },
					{},
				),
			).resolves.not.toThrow();

			expect(fetchMock).not.toBeCalled();
			expect(mockStatsigClient.updateUserAsync).not.toBeCalled();
		});
	});

	describe('updateUserWithProvider', () => {
		const initializeWithProvider = async (
			updateUserCompletionCallback?: UpdateUserCompletionCallback,
		) => {
			await FeatureGatesClass.initializeWithProvider(
				{
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
					updateUserCompletionCallback,
				},
				mockProvider,
				{
					atlassianAccountId: 'abc-123',
				},
				{},
			).finally(() => {
				// Clear the calls since we will want to count how many times these endpoints
				// are called by the subsequent updateUser calls, and don't really care how many
				// times they were called for initialization.
				jest.clearAllMocks();
			});
		};

		test('should throw an error if called before an initialization has started', async () => {
			await expect(
				FeatureGatesClass.updateUserWithProvider(
					{
						atlassianAccountId: 'abc-456',
					},
					undefined,
				),
			).rejects.toThrow();
			expect(mockProvider.getExperimentValues).not.toHaveBeenCalled();
			expect(mockStatsigClient.updateUserAsync).not.toBeCalled();

			expect(mockProvider.setProfile).toHaveBeenCalledTimes(0);
		});

		test('should change the initialize result from a rejected promise to a resolved once if the updateUser puts the client back into a valid state', async () => {
			mockStatsigClient.initializeAsync.mockRejectedValueOnce('Initialization error');
			await expect(initializeWithProvider()).rejects.toMatch('Initialization error');

			await FeatureGatesClass.updateUserWithProvider({ atlassianAccountId: 'abc-456' }, undefined);

			expect(mockProvider.setProfile).toHaveBeenCalledTimes(1);

			await expect(initializeWithProvider()).resolves.not.toThrow();
		});

		test('should not change the initialize result from a resolved promise to a rejected promise if the updateUser call fails', async () => {
			await initializeWithProvider();

			mockStatsigClient.updateUserAsync.mockRejectedValue('mock error');
			await expect(
				FeatureGatesClass.updateUserWithProvider({ atlassianAccountId: 'abc-456' }, undefined),
			).rejects.toThrowError();

			expect(mockProvider.setProfile).toHaveBeenCalledTimes(2);
			await expect(initializeWithProvider()).resolves.not.toThrow();
		});

		test('should keep the initialize promise in a rejected state if the updateUser call also fails', async () => {
			mockStatsigClient.initializeAsync.mockRejectedValueOnce('Initialization error');
			await expect(initializeWithProvider()).rejects.toMatch('Initialization error');

			mockStatsigClient.updateUserAsync.mockRejectedValue('mock error');
			await expect(
				FeatureGatesClass.updateUserWithProvider({ atlassianAccountId: 'abc-456' }, undefined),
			).rejects.toThrowError();

			expect(mockProvider.setProfile).toHaveBeenCalledTimes(2);
			await expect(initializeWithProvider()).rejects.toMatch('Initialization error');
		});

		test('should perform a call to the experimentValues endpoint to fetch the new user values', async () => {
			await initializeWithProvider();

			await FeatureGatesClass.updateUserWithProvider({ atlassianAccountId: 'abc-456' }, undefined);

			expect(mockProvider.setProfile).toHaveBeenCalled();
			expect(mockProvider.getExperimentValues).toHaveBeenCalled();

			expect(mockStatsigClient.updateUserAsync).toHaveBeenCalledWith({
				userID: 'abc-456',
				customIDs: {
					atlassianAccountId: 'abc-456',
					stableID: expect.any(String),
				},
				custom: {},
			});
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith(mockExperimentValues);

			expect(mockProvider.setProfile).toHaveBeenCalledTimes(1);
		});

		test('should not change the user if the call to the experimentValues endpoint fails', async () => {
			const updateUserCompletionCallback = jest.fn();
			await initializeWithProvider(updateUserCompletionCallback);

			mockProvider.getExperimentValues = jest
				.fn()
				.mockRejectedValue(new Error('Failed to fetch experimentValues'));

			await expect(
				FeatureGatesClass.updateUserWithProvider({ atlassianAccountId: 'abc-456' }, undefined),
			).rejects.toThrowError('Failed to fetch experimentValues');

			expect(mockStatsigClient.updateUserAsync).not.toHaveBeenCalled();
			expect(updateUserCompletionCallback).toHaveBeenCalledWith(
				false,
				expect.stringContaining('Failed to fetch experimentValues'),
			);

			expect(mockProvider.setProfile).toHaveBeenCalledTimes(2);
			await expect(initializeWithProvider()).resolves.not.toThrow();
		});

		test("should return immediately if the user isn't actually changing", async () => {
			await initializeWithProvider();
			await expect(
				FeatureGatesClass.updateUserWithProvider({ atlassianAccountId: 'abc-123' }, {}),
			).resolves.not.toThrow();

			expect(mockProvider.getExperimentValues).not.toHaveBeenCalled();
			expect(mockStatsigClient.updateUserAsync).not.toHaveBeenCalled();

			expect(mockProvider.setProfile).toHaveBeenCalledTimes(1);
		});

		test("should return immediately if hasn't been initialised with provider", async () => {
			await FeatureGatesClass.initializeFromValues(
				{
					environment: FeatureGateEnvironmentType.Development,
					targetApp: '',
				},
				{
					atlassianAccountId: 'abc-123',
				},
				{},
				{},
			);
			await expect(
				FeatureGatesClass.updateUserWithProvider({ atlassianAccountId: 'abc-123' }, {}),
			).rejects.toThrow(
				new Error(
					'Cannot update user using provider as the client was not initialised with a provider',
				),
			);

			expect(mockProvider.getExperimentValues).not.toHaveBeenCalled();
			expect(mockStatsigClient.updateUserAsync).not.toHaveBeenCalled();

			expect(mockProvider.setProfile).toHaveBeenCalledTimes(0);
		});
	});

	describe('updateUserWithValues', () => {
		test('should throw an error if called before an initialization has started', async () => {
			await expect(
				FeatureGatesClass.updateUserWithValues(
					{
						atlassianAccountId: 'abc-456',
					},
					{},
					{},
				),
			).rejects.toThrow();
		});

		test('should change the initialize result from a rejected promise to a resolved once if the updateUser puts the client back into a valid state', async () => {
			mockStatsigClient.initializeAsync.mockRejectedValueOnce('Initialization error');
			await expect(initialize()).rejects.toMatch('Initialization error');

			await FeatureGatesClass.updateUserWithValues(
				{
					atlassianAccountId: 'abc-456',
				},
				{},
				{},
			);

			await expect(initialize()).resolves.not.toThrow();
		});

		test('should not change the initialize result from a resolved promise to a rejected promise if the updateUserWithValues call fails', async () => {
			await initialize();

			mockStatsigClient.updateUserAsync.mockRejectedValue('mock error');
			await expect(
				FeatureGatesClass.updateUserWithValues(
					{
						atlassianAccountId: 'abc-456',
					},
					{},
					{},
				),
			).rejects.toThrowError();

			await expect(initialize()).resolves.not.toThrow();
		});

		test('should keep the initialize promise in a rejected state if the updateUser call also fails', async () => {
			mockStatsigClient.initializeAsync.mockRejectedValueOnce('Initialization error');
			await expect(initialize()).rejects.toMatch('Initialization error');

			mockStatsigClient.updateUserAsync.mockRejectedValue('mock error');
			await expect(
				FeatureGatesClass.updateUserWithValues(
					{
						atlassianAccountId: 'abc-456',
					},
					{},
					{},
				),
			).rejects.toThrowError();
			await expect(initialize()).rejects.toMatch('Initialization error');
		});

		test("should return immediately if the user isn't actually changing", async () => {
			await initialize();
			await expect(
				FeatureGatesClass.updateUserWithValues(
					{
						atlassianAccountId: 'abc-123',
					},
					{},
					{},
				),
			).resolves.not.toThrow();

			expect(mockProvider.getExperimentValues).not.toHaveBeenCalled();
			expect(mockStatsigClient.updateUserAsync).not.toHaveBeenCalled();
		});
	});
});
