import AnalyticsWebClient from '@atlassiansox/analytics-web-client';
import fetchMock, { type MockResponseInit } from 'jest-fetch-mock';
import Statsig, { type DynamicConfig, type Layer } from 'statsig-js-lite';

import type FeatureGates from '../index';
// eslint-disable-next-line no-duplicate-imports
import type {
	FeatureGateEnvironment as FeatureGateEnvironmentType,
	UpdateUserCompletionCallback,
} from '../index';
import { CLIENT_VERSION } from '../version';

jest.mock('statsig-js-lite', () => {
	const statsig = jest.requireActual('statsig-js-lite');

	return {
		...statsig,
		default: {
			initialize: jest.fn(),
			checkGate: jest.fn(),
			checkGateWithExposureLoggingDisabled: jest.fn(),
			getExperiment: jest.fn(),
			getExperimentWithExposureLoggingDisabled: jest.fn(),
			getLayer: jest.fn(),
			getLayerWithExposureLoggingDisabled: jest.fn(),
			setOverrides: jest.fn(),
			shutdown: jest.fn(),
			updateUserWithValues: jest.fn().mockReturnValue(true),
		},
		__esModule: true,
	};
});
// @ts-ignore
const StatsigMocked: jest.Mocked<typeof Statsig> = Statsig;

const TARGET_APP = 'test';
const EXPECTED_VALUES_DEV_URL = `https://api.dev.atlassian.com/flags/api/v2/frontend/experimentValues`;
const EXPECTED_KEY_DEV_URL = `https://api.dev.atlassian.com/flags/api/v2/frontend/clientSdkKey/${TARGET_APP}`;
const EXPECTED_VALUES_GATEWAY_URL = `/gateway/api/flags/api/v2/frontend/experimentValues`;
const EXPECTED_KEY_GATEWAY_URL = `/gateway/api/flags/api/v2/frontend/clientSdkKey/${TARGET_APP}`;
const EVENT_ACTION_SUBJECT = 'featureGatesClient';
const CLIENT_KEY = 'client-12345-6789';

/* eslint-disable no-console */

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

describe('FeatureGate client', () => {
	let FeatureGatesClass: typeof FeatureGates;
	let FeatureGateEnvironment: typeof FeatureGateEnvironmentType;
	const mockClientSdkKey = 'client-mock-sdk-key';
	const client = new AnalyticsWebClient({
		env: 'local',
		product: 'js-client',
	});
	let sendOperationalEventSpy: jest.SpyInstance;

	beforeAll(() => {
		sendOperationalEventSpy = jest.spyOn(client, 'sendOperationalEvent');
		fetchMock.enableMocks();
	});

	afterAll(() => {
		fetchMock.disableMocks();
	});

	beforeEach(() => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore Remove globally saved reference to FeatureGates client between tests
		window.__FEATUREGATES_JS__ = undefined;
		jest.isolateModules(() => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const API = jest.requireActual('../index');
			FeatureGatesClass = API.default;
			FeatureGateEnvironment = API.FeatureGateEnvironment;
		});

		StatsigMocked.updateUserWithValues.mockReturnValue(true);
	});

	afterEach(() => {
		fetchMock.mockReset();
		jest.resetAllMocks();
		jest.clearAllMocks();
	});

	describe('initialize client', function () {
		beforeEach(() => {
			mockFeatureFlagServiceEndpoints(
				Promise.resolve(mockClientSdkKey),
				Promise.resolve({
					experimentValues: { test: '123' },
					customAttributes: {},
				}),
			);
		});

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

			expect(StatsigMocked.initialize).toHaveBeenCalledTimes(1);
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

			expect(StatsigMocked.initialize).toHaveBeenCalledTimes(1);
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

			expect(StatsigMocked.initialize).toHaveBeenCalledWith(
				mockClientSdkKey,
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
					},
					custom: {},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					initializeValues: {
						test: '123',
					},
					disableCurrentPageLogging: true,
				}),
			);

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

			expect(StatsigMocked.initialize).toHaveBeenCalledWith(
				mockClientSdkKey,
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
					},
					custom: {},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					initializeValues: {
						test: '123',
					},
					disableCurrentPageLogging: true,
				}),
			);

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

			expect(StatsigMocked.initialize).toHaveBeenCalledWith(
				mockClientSdkKey,
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						tenantId: 'cloud-id-123',
						atlassianOrgId: 'org-id-123',
					},
					custom: customAttributes,
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					initializeValues: {
						test: '123',
					},
					disableCurrentPageLogging: true,
				}),
			);
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

			expect(StatsigMocked.initialize).toHaveBeenCalledWith(
				mockClientSdkKey,
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						tenantId: 'cloud-id-123',
						atlassianOrgId: 'org-id-123',
					},
					custom: {},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					initializeValues: {
						test: '123',
					},
					disableCurrentPageLogging: true,
				}),
			);
		});

		test('initialize passes through additional client options', async () => {
			await FeatureGatesClass.initialize(
				{
					apiKey: CLIENT_KEY,
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
					eventLoggingApi: 'some-url',
				},
				{
					atlassianAccountId: 'abc-123',
					tenantId: 'cloud-id-123',
					atlassianOrgId: 'org-id-123',
				},
				undefined,
			);

			expect(StatsigMocked.initialize).toHaveBeenCalledWith(
				mockClientSdkKey,
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						tenantId: 'cloud-id-123',
						atlassianOrgId: 'org-id-123',
					},
					custom: {},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					initializeValues: {
						test: '123',
					},
					eventLoggingApi: 'some-url',
					disableCurrentPageLogging: true,
				}),
			);
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

			expect(StatsigMocked.initialize).toHaveBeenCalledTimes(1);
			expect(StatsigMocked.initialize).toHaveBeenCalledWith(
				mockClientSdkKey,
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
					},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					initializeValues: {},
					disableCurrentPageLogging: true,
				}),
			);
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

			expect(StatsigMocked.initialize).toHaveBeenCalledWith(
				'client-default-key',
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
					},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					initializeValues: {},
					disableCurrentPageLogging: true,
				}),
			);
			expect(console.warn).toHaveBeenCalledWith('Initialising Statsig client without values');
			expect(console.error).toHaveBeenCalledWith(
				'Error occurred when trying to fetch the Feature Gates client values, ' +
					'error: Non 2xx response status received, status: 500, body: "something went wrong"',
			);
		});

		test('initialize returns the same rejected promise for all calls after the initial failure', async () => {
			console.error = jest.fn();
			console.warn = jest.fn();

			StatsigMocked.initialize.mockRejectedValueOnce('Failed to initialize').mockResolvedValue();

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
			expect(StatsigMocked.initialize).toBeCalledTimes(2);
			await expect(doInit()).rejects.toMatch('Failed to initialize');
			expect(StatsigMocked.initialize).toBeCalledTimes(2);
		});

		test('initialize returns the same resolved promise for all calls after successful initialization', async () => {
			console.error = jest.fn();
			console.warn = jest.fn();

			StatsigMocked.initialize.mockResolvedValueOnce(undefined);
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
			expect(StatsigMocked.initialize).toBeCalledTimes(1);
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

			expect(StatsigMocked.initialize).toHaveBeenCalledWith(
				mockClientSdkKey,
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
					},
					custom: {},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					initializeValues: {
						test: '123',
					},
					disableCurrentPageLogging: true,
				}),
			);

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

			expect(StatsigMocked.initialize).toHaveBeenCalledWith(
				'client-my-sdk-key',
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
					},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					initializeValues: {},
					disableCurrentPageLogging: true,
				}),
			);
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

			expect(StatsigMocked.initialize).toHaveBeenCalledWith(
				'client-my-sdk-key',
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
					},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					initializeValues: {
						'gate-key': { cohort: 'keyper' },
					},
					disableCurrentPageLogging: true,
				}),
			);
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

			expect(StatsigMocked.initialize).toHaveBeenCalledWith(
				'client-my-sdk-key',
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
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
					initializeValues: {},
					disableCurrentPageLogging: true,
				}),
			);
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

			expect(StatsigMocked.initialize).toHaveBeenCalledWith(
				'client-my-sdk-key',
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						tenantId: 'cloud-id-123',
						atlassianOrgId: 'org-id-123',
					},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					initializeValues: {},
					disableCurrentPageLogging: true,
				}),
			);
		});

		test('initialize passes through additional client options', async () => {
			await FeatureGatesClass.initializeFromValues(
				{
					sdkKey: 'client-my-sdk-key',
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
					eventLoggingApi: 'some-url',
				},
				{
					atlassianAccountId: 'abc-123',
					tenantId: 'cloud-id-123',
					atlassianOrgId: 'org-id-123',
				},
				undefined,
				undefined,
			);

			expect(StatsigMocked.initialize).toHaveBeenCalledWith(
				'client-my-sdk-key',
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						tenantId: 'cloud-id-123',
						atlassianOrgId: 'org-id-123',
					},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					initializeValues: {},
					eventLoggingApi: 'some-url',
					disableCurrentPageLogging: true,
				}),
			);
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

			expect(StatsigMocked.initialize).toHaveBeenCalledWith(
				'client-default-key',
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
					},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					initializeValues: { test: '123' },
					disableCurrentPageLogging: true,
				}),
			);
		});

		test('initialize returns the same rejected promise for all calls after the initial failure', async () => {
			console.error = jest.fn();
			console.warn = jest.fn();

			StatsigMocked.initialize.mockRejectedValueOnce('Failed to initialize');
			const doInit = async () =>
				FeatureGatesClass.initializeFromValues(
					{
						sdkKey: 'client-my-sdk-key',
						environment: FeatureGateEnvironment.Development,
						targetApp: TARGET_APP,
						eventLoggingApi: 'some-url',
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
			expect(StatsigMocked.initialize).toBeCalledTimes(2);
		});

		test('initialize using default values after first reject', async () => {
			console.error = jest.fn();
			console.warn = jest.fn();

			StatsigMocked.initialize.mockRejectedValueOnce(new Error('Failed to initialize'));

			await expect(
				FeatureGatesClass.initializeFromValues(
					{
						sdkKey: 'client-my-sdk-key',
						environment: FeatureGateEnvironment.Development,
						targetApp: TARGET_APP,
						eventLoggingApi: 'some-url',
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
			expect(StatsigMocked.initialize).toBeCalledTimes(2);
			expect(StatsigMocked.initialize).toHaveBeenNthCalledWith(
				1,
				'client-my-sdk-key',
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						tenantId: 'cloud-id-123',
						atlassianOrgId: 'org-id-123',
					},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					initializeValues: { test: '123' },
					eventLoggingApi: 'some-url',
					disableCurrentPageLogging: true,
					targetApp: TARGET_APP,
				}),
			);

			expect(StatsigMocked.initialize).toHaveBeenNthCalledWith(
				2,
				'client-default-key',
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
						tenantId: 'cloud-id-123',
						atlassianOrgId: 'org-id-123',
					},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					initializeValues: {},
					eventLoggingApi: 'some-url',
					disableCurrentPageLogging: true,
					targetApp: TARGET_APP,
				}),
			);

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

			StatsigMocked.initialize.mockResolvedValueOnce(undefined);
			const doInit = () =>
				FeatureGatesClass.initializeFromValues(
					{
						sdkKey: 'client-my-sdk-key',
						environment: FeatureGateEnvironment.Development,
						targetApp: TARGET_APP,
						eventLoggingApi: 'some-url',
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
			expect(StatsigMocked.initialize).toBeCalledTimes(1);
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

			expect(StatsigMocked.initialize).toHaveBeenCalledWith(
				'client-my-sdk-key',
				{
					userID: 'abc-123',
					customIDs: {
						atlassianAccountId: 'abc-123',
					},
				},
				expect.objectContaining({
					environment: {
						tier: 'development',
					},
					initializeValues: {},
					disableCurrentPageLogging: true,
				}),
			);
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
		test('evaluating a flag without setting fireExposureEvent will call Statsig.getExperiment', () => {
			FeatureGatesClass.getExperimentValue('test-experiment', 'cohort', 'control');
			expect(StatsigMocked.getExperiment).toBeCalledWith('test-experiment');
		});

		test('evaluating a flag with fireExposureEvent set to true will call Statsig.getExperiment', () => {
			FeatureGatesClass.getExperimentValue('test-experiment', 'control', true);
			expect(StatsigMocked.getExperiment).toBeCalledWith('test-experiment');
		});

		test('evaluating a flag with fireExposureEvent set to false will call Statsig.getExperimentWithExposureLoggingDisabled', () => {
			FeatureGatesClass.getExperimentValue('test-experiment', 'cohort', 'control', {
				fireExperimentExposure: false,
			});
			expect(StatsigMocked.getExperimentWithExposureLoggingDisabled).toBeCalledWith(
				'test-experiment',
			);
		});

		test('evaluating a flag with fireExposureEvent set to undefined will call Statsig.getExperiment', () => {
			FeatureGatesClass.getExperimentValue('test-experiment', 'cohort', 'control', {
				fireExperimentExposure: undefined,
			});
			expect(StatsigMocked.getExperiment).toBeCalledWith('test-experiment');
		});

		test('catches any exception and logs a warning on the first occurrences of an error', () => {
			console.warn = jest.fn();

			StatsigMocked.getExperiment.mockReturnValueOnce({
				get: jest.fn().mockImplementation(() => {
					throw new Error('mock error');
				}),
			} as unknown as DynamicConfig);

			FeatureGatesClass.getExperimentValue('test-experiment', 'cohort', 'control', {
				fireExperimentExposure: true,
			});

			FeatureGatesClass.getExperimentValue('test-experiment', 'cohort', 'control', {
				fireExperimentExposure: true,
			});

			expect(console.warn).toBeCalledWith({
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
		test('catches any exception and logs a warning on the first occurrences of an error', () => {
			console.warn = jest.fn();

			StatsigMocked.getExperiment.mockImplementation(() => {
				throw new Error('mock error');
			});

			FeatureGatesClass.getExperiment('test-experiment');
			FeatureGatesClass.getExperiment('test-experiment');

			expect(console.warn).toBeCalledWith({
				msg: 'An error has occurred getting the experiment. Only the first occurrence of this error is logged.',
				experimentName: 'test-experiment',
				error: new Error('mock error'),
			});
			expect(console.warn).toHaveBeenCalledTimes(1);
		});

		test('defaults to sending the exposure event when no options are provided', () => {
			FeatureGatesClass.getExperiment('test-experiment');
			expect(StatsigMocked.getExperiment).toHaveBeenCalledTimes(1);
		});

		test('defaults to sending the exposure event when options are provided, but fireExperimentExposure is not set', () => {
			FeatureGatesClass.getExperiment('test-experiment', {});
			expect(StatsigMocked.getExperiment).toHaveBeenCalledTimes(1);
		});

		test('does not send the exposure event if the fireExperimentExposure option is set to false', () => {
			FeatureGatesClass.getExperiment('test-experiment', {
				fireExperimentExposure: false,
			});
			expect(StatsigMocked.getExperimentWithExposureLoggingDisabled).toHaveBeenCalledTimes(1);
		});
	});

	describe('getLayer', () => {
		test('catches any exception and logs a warning on the first occurrences of an error', () => {
			console.warn = jest.fn();

			StatsigMocked.getLayer.mockImplementation(() => {
				throw new Error('mock error');
			});

			FeatureGatesClass.getLayer('test-layer');
			FeatureGatesClass.getLayer('test-layer');

			expect(console.warn).toBeCalledWith({
				msg: 'An error has occurred getting the layer. Only the first occurrence of this error is logged.',
				layerName: 'test-layer',
				error: new Error('mock error'),
			});
			expect(console.warn).toHaveBeenCalledTimes(1);
		});

		test('defaults to sending the exposure event when no options are provided', () => {
			FeatureGatesClass.getLayer('test-layer');
			expect(StatsigMocked.getLayer).toHaveBeenCalledTimes(1);
		});

		test('defaults to sending the exposure event when options are provided, but fireExperimentExposure is not set', () => {
			FeatureGatesClass.getLayer('test-layer', {});
			expect(StatsigMocked.getLayer).toHaveBeenCalledTimes(1);
		});

		test('does not send the exposure event if the fireExperimentExposure option is set to false', () => {
			FeatureGatesClass.getLayer('test-layer', {
				fireLayerExposure: false,
			});
			expect(StatsigMocked.getLayerWithExposureLoggingDisabled).toHaveBeenCalledTimes(1);
		});
	});

	describe('getLayerValue', () => {
		test('evaluating a flag without setting fireExposureEvent will call Statsig.getLayer', () => {
			FeatureGatesClass.getLayerValue('test-layer', 'cohort', 'control');
			expect(StatsigMocked.getLayer).toBeCalledWith('test-layer');
		});

		test('evaluating a flag with fireExposureEvent set to true will call Statsig.getLayer', () => {
			FeatureGatesClass.getLayerValue('test-layer', 'control', 'control', {
				fireLayerExposure: true,
			});
			expect(StatsigMocked.getLayer).toBeCalledWith('test-layer');
		});

		test('evaluating a flag with fireExposureEvent set to false will call Statsig.getLayerWithExposureLoggingDisabled', () => {
			FeatureGatesClass.getLayerValue('test-layer', 'cohort', 'control', {
				fireLayerExposure: false,
			});
			expect(StatsigMocked.getLayerWithExposureLoggingDisabled).toBeCalledWith('test-layer');
		});

		test('evaluating a flag with fireExposureEvent set to undefined will call Statsig.getLayer', () => {
			FeatureGatesClass.getLayerValue('test-layer', 'cohort', 'control', {
				fireLayerExposure: undefined,
			});
			expect(StatsigMocked.getLayer).toBeCalledWith('test-layer');
		});

		test('catches any exception and logs a warning on the first occurrences of an error', () => {
			console.warn = jest.fn();

			StatsigMocked.getLayer.mockReturnValueOnce({
				get: jest.fn().mockImplementation(() => {
					throw new Error('mock error');
				}),
			} as unknown as Layer);

			FeatureGatesClass.getLayerValue('test-layer', 'cohort', 'control', {
				fireLayerExposure: true,
			});

			FeatureGatesClass.getLayerValue('test-layer', 'cohort', 'control', {
				fireLayerExposure: true,
			});

			expect(console.warn).toBeCalledWith({
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
		test('calls Statsig.checkGate with the provided gate name', () => {
			FeatureGatesClass.checkGate('myGate');
			expect(StatsigMocked.checkGate).toHaveBeenCalledWith('myGate');
		});

		test('calls Statsig.checkGate with the provided gate name when fireGateExposure is explicitly true', () => {
			FeatureGatesClass.checkGate('myGate', { fireGateExposure: true });
			expect(StatsigMocked.checkGate).toHaveBeenCalledWith('myGate');
		});

		test('calls Statsig.checkGateWithExposureLoggingDisabled with the provided gate name when fireGateExposure is false', () => {
			FeatureGatesClass.checkGate('myGate', { fireGateExposure: false });
			expect(StatsigMocked.checkGateWithExposureLoggingDisabled).toHaveBeenCalledWith('myGate');
		});

		test('catches any exception and logs a warning on the first occurrences of an error', () => {
			console.warn = jest.fn();

			StatsigMocked.checkGate.mockImplementation(() => {
				throw new Error('mock error');
			});

			FeatureGatesClass.checkGate('test-gate');
			FeatureGatesClass.checkGate('test-gate');

			expect(console.warn).toBeCalledWith({
				msg: 'An error has occurred checking the feature gate. Only the first occurrence of this error is logged.',
				gateName: 'test-gate',
				error: new Error('mock error'),
			});
			expect(console.warn).toHaveBeenCalledTimes(1);
		});
	});

	describe('shutdownStatsig', () => {
		test('should call the shutdown function on the client', () => {
			FeatureGatesClass.shutdownStatsig();
			expect(StatsigMocked.shutdown).toHaveBeenCalledTimes(1);
		});
	});

	describe('updateUser', () => {
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

		beforeEach(() => {
			mockFeatureFlagServiceEndpoints(
				Promise.resolve(mockClientSdkKey),
				Promise.resolve({
					experimentValues: { test: '123' },
					customAttributes: {},
				}),
			);
		});

		afterEach(() => {
			fetchMock.resetMocks();
		});

		test('should throw an error if called before an initialization has started', async () => {
			await expect(
				FeatureGatesClass.updateUser(
					{
						apiKey: 'apiKey-456',
						environment: FeatureGateEnvironment.Development,
						targetApp: TARGET_APP,
					},
					{
						atlassianAccountId: 'abc-456',
					},
					undefined,
				),
			).rejects.toThrow();
			expect(fetchMock).not.toBeCalled();
			expect(StatsigMocked.updateUserWithValues).not.toBeCalled();
		});

		test('should change the initialize result from a rejected promise to a resolved once if the updateUser puts the client back into a valid state', async () => {
			StatsigMocked.initialize.mockRejectedValueOnce('Initialization error');
			await expect(initialize()).rejects.toMatch('Initialization error');

			StatsigMocked.updateUserWithValues.mockReturnValue(true);
			await FeatureGatesClass.updateUser(
				{
					apiKey: 'apiKey-456',
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
				},
				{ atlassianAccountId: 'abc-456' },
				undefined,
			);

			await expect(initialize()).resolves.not.toThrow();
		});

		test('should not change the initialize result from a resolved promise to a rejected promise if the updateUser call fails', async () => {
			await initialize();

			StatsigMocked.updateUserWithValues.mockReturnValue(false);
			await expect(
				FeatureGatesClass.updateUser(
					{
						apiKey: 'apiKey-456',
						environment: FeatureGateEnvironment.Development,
						targetApp: TARGET_APP,
					},
					{ atlassianAccountId: 'abc-456' },
					undefined,
				),
			).rejects.toThrowError();

			await expect(initialize()).resolves.not.toThrow();
		});

		test('should keep the initialize promise in a rejected state if the updateUser call also fails', async () => {
			StatsigMocked.initialize.mockRejectedValueOnce('Initialization error');
			await expect(initialize()).rejects.toMatch('Initialization error');

			StatsigMocked.updateUserWithValues.mockReturnValue(false);
			await expect(
				FeatureGatesClass.updateUser(
					{
						apiKey: 'apiKey-456',
						environment: FeatureGateEnvironment.Development,
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

			StatsigMocked.updateUserWithValues.mockReturnValue(true);
			await FeatureGatesClass.updateUser(
				{
					apiKey: 'apiKey-456',
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
				},
				{ atlassianAccountId: 'abc-456' },
				undefined,
			);

			expect(fetchMock.mock.calls.length).toEqual(1);
			expect(fetchMock.mock.calls[0][0]).toEqual(EXPECTED_VALUES_DEV_URL);
			expect(StatsigMocked.updateUserWithValues).toHaveBeenCalledWith(
				{
					userID: 'abc-456',
					customIDs: {
						atlassianAccountId: 'abc-456',
					},
					custom: {},
				},
				{ test: '456' },
			);
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
						targetApp: TARGET_APP,
					},
					{ atlassianAccountId: 'abc-456' },
					undefined,
				),
			).rejects.toThrowError('Failed to fetch experimentValues');

			expect(StatsigMocked.updateUserWithValues).not.toHaveBeenCalled();
			expect(updateUserCompletionCallback).toBeCalledWith(
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
						targetApp: TARGET_APP,
					},
					{ atlassianAccountId: 'abc-123' },
					{},
				),
			).resolves.not.toThrow();

			expect(fetchMock).not.toBeCalled();
			expect(StatsigMocked.updateUserWithValues).not.toBeCalled();
		});
	});

	describe('updateUserWithValues', () => {
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
				undefined,
			).finally(() => {
				// Clear the calls since we will want to count how many times these endpoints
				// are called by the subsequent updateUser calls, and don't really care how many
				// times they were called for initialization.
				fetchMock.mockClear();
			});
		};

		beforeEach(() => {
			// Required for initialize
			mockFeatureFlagServiceEndpoints(
				Promise.resolve(mockClientSdkKey),
				Promise.resolve({
					experimentValues: { test: '123' },
					customAttributes: {},
				}),
			);
		});

		afterEach(() => {
			fetchMock.resetMocks();
		});

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
			StatsigMocked.initialize.mockRejectedValueOnce('Initialization error');
			await expect(initialize()).rejects.toMatch('Initialization error');

			StatsigMocked.updateUserWithValues.mockReturnValue(true);
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

			StatsigMocked.updateUserWithValues.mockReturnValue(false);
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
			StatsigMocked.initialize.mockRejectedValueOnce('Initialization error');
			await expect(initialize()).rejects.toMatch('Initialization error');

			StatsigMocked.updateUserWithValues.mockReturnValue(false);
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

			expect(fetchMock).not.toBeCalled();
			expect(StatsigMocked.updateUserWithValues).not.toBeCalled();
		});
	});

	describe('setOverrides', () => {
		beforeEach(() => {
			FeatureGatesClass.clearAllOverrides();
		});

		test('should populate all of the fields if the provided object is empty', () => {
			FeatureGatesClass.setOverrides({});
			expect(StatsigMocked.setOverrides).toBeCalledWith({
				gates: {},
				configs: {},
				layers: {},
			});
		});

		test('should populate the "configs" field if it is missing from the provided overrides', () => {
			FeatureGatesClass.setOverrides({
				gates: {},
				layers: {},
			});
			expect(StatsigMocked.setOverrides).toBeCalledWith({
				gates: {},
				configs: {},
				layers: {},
			});
		});

		test('should populate the "gates" field if it is missing from the provided overrides', () => {
			FeatureGatesClass.setOverrides({
				configs: {},
				layers: {},
			});
			expect(StatsigMocked.setOverrides).toBeCalledWith({
				gates: {},
				configs: {},
				layers: {},
			});
		});

		test('should populate the "layers" field if it is missing from the provided overrides', () => {
			FeatureGatesClass.setOverrides({
				gates: {},
				layers: {},
			});
			expect(StatsigMocked.setOverrides).toBeCalledWith({
				gates: {},
				configs: {},
				layers: {},
			});
		});
	});
});
