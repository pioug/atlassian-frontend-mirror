import fetchMock from 'jest-fetch-mock';

import { isFedRamp } from '@atlaskit/atlassian-context';

import Client from '../client';
import type FeatureGates from '../client/FeatureGates';
// eslint-disable-next-line no-duplicate-imports
import type {
	FeatureGateEnvironment as FeatureGateEnvironmentType,
	Identifiers,
	PerimeterType as PerimeterTypeType,
} from '../client/FeatureGates';
import {
	DEV_BASE_URL,
	FEDM_PROD_BASE_URL,
	GATEWAY_BASE_URL,
	PROD_BASE_URL,
} from '../client/fetcher/Fetcher';
import { type ClientOptions } from '../client/types';

jest.mock('@atlaskit/atlassian-context', () => ({
	isFedRamp: jest.fn(),
}));

const isFedRampMock = jest.mocked(isFedRamp);

const statsigInitSpy = jest.fn();
jest.mock('@statsig/js-client', () => {
	const actual = jest.requireActual('@statsig/js-client');
	return {
		...actual,
		StatsigClient: function (...args: unknown[]) {
			statsigInitSpy(...args);
			return new actual.StatsigClient(...args);
		},
	};
});

describe('FeatureGate client Statsig integration test', () => {
	const MOCK_CLIENT_SDK_KEY = 'client-mockSdkKey';
	const CLIENT_SDK_KEY = 'client-sdkKey';
	const TARGET_APP = 'jira_web';
	const API_KEY = 'apiKey-123';

	const TEST_IDENTIFIERS = { atlassianAccountId: 'abc-123' };

	const TEST_INITIALIZE_VALUES = { test: '123' };

	const TEST_STATSIG_OPTIONS = {
		environment: {
			tier: 'development',
		},
		networkConfig: expect.objectContaining({
			logEventUrl: 'https://xp.atlassian.com/v1/rgstr',
		}),
		includeCurrentPageUrlWithEvents: false,
		targetApp: 'jira_web',
		dataAdapter: expect.anything(),
		overrideAdapter: expect.anything(),
	};

	const TEST_STATSIG_USER = {
		userID: 'abc-123',
		customIDs: TEST_IDENTIFIERS,
	};

	let FeatureGatesClass: typeof FeatureGates;
	let FeatureGateEnvironment: typeof FeatureGateEnvironmentType;
	let PerimeterType: typeof PerimeterTypeType;

	/* eslint-disable no-console */

	beforeEach(() => {
		console.error = jest.fn();
		console.warn = jest.fn();

		isFedRampMock.mockReturnValue(false);

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore Remove globally saved reference to FeatureGates client between tests
		window.__FEATUREGATES_JS__ = undefined;

		jest.isolateModules(() => {
			const FG_API = jest.requireActual('../client/FeatureGates');
			FeatureGatesClass = FG_API.default;
			FeatureGateEnvironment = FG_API.FeatureGateEnvironment;
			PerimeterType = FG_API.PerimeterType;
		});

		statsigInitSpy.mockClear();
	});

	describe('initialize client', function () {
		beforeEach(() => {
			fetchMock.enableMocks();
			fetchMock
				.mockResponseOnce(
					JSON.stringify({
						clientSdkKey: MOCK_CLIENT_SDK_KEY,
					}),
					{ status: 200 },
				)
				.mockResponseOnce(
					JSON.stringify({
						experimentValues: TEST_INITIALIZE_VALUES,
					}),
					{ status: 200 },
				);
		});

		afterEach(() => {
			fetchMock.resetMocks();
		});

		afterAll(() => {
			jest.resetAllMocks();
		});

		test('initialize successfully', async () => {
			await initializeFeatureGates(TEST_IDENTIFIERS);

			expect(statsigInitSpy).toHaveBeenCalledTimes(1);
			expect(statsigInitSpy).toHaveBeenCalledWith(MOCK_CLIENT_SDK_KEY, TEST_STATSIG_USER, {
				...TEST_STATSIG_OPTIONS,
				apiKey: API_KEY, // apiKey added
			});
			const client = (FeatureGatesClass as unknown as { client: Client }).client;
			const bootstrapData = JSON.parse(client['dataAdapter'].bootstrapResult?.data ?? '{}');
			expect(bootstrapData).toEqual(TEST_INITIALIZE_VALUES);

			expect(fetchMock).toHaveBeenCalledWith(
				`${DEV_BASE_URL}/api/v2/frontend/clientSdkKey/jira_web`, // commercial base url for environment
				expect.objectContaining({}),
			);

			expectTestCohortNotEnrolled();
		});

		test('initialize successfully with commercial perimeter specified', async () => {
			await initializeFeatureGates(TEST_IDENTIFIERS, {
				perimeter: PerimeterType.COMMERCIAL,
			});

			expect(fetchMock).toHaveBeenCalledWith(
				`${DEV_BASE_URL}/api/v2/frontend/clientSdkKey/jira_web`, // commercial base url for environment
				expect.objectContaining({}),
			);
		});

		test('initialize should initialize with defaults when no identifiers provided', async () => {
			fetchMock.resetMocks();
			fetchMock
				.mockResponseOnce(
					JSON.stringify({
						clientSdkKey: MOCK_CLIENT_SDK_KEY,
					}),
					{ status: 200 },
				)
				.mockResponseOnce('something went wrong', {
					status: 500,
				});

			await expect(initializeFeatureGates({})).rejects.toThrow(
				'Non 2xx response status received, status: 500, body: "something went wrong"',
			);

			expect(statsigInitSpy).toHaveBeenCalledTimes(1);
			expect(statsigInitSpy).toHaveBeenCalledWith(
				MOCK_CLIENT_SDK_KEY,
				{
					customIDs: {},
				},
				{
					...TEST_STATSIG_OPTIONS,
					apiKey: API_KEY, // apiKey added
				},
			);

			expectTestCohortNotEnrolled();
		});

		describe('initialize in fedramp-moderate perimeter', function () {
			beforeEach(() => {
				fetchMock.resetMocks();
				fetchMock
					.mockResponseOnce(
						JSON.stringify({
							clientSdkKey: MOCK_CLIENT_SDK_KEY,
						}),
						{ status: 200 },
					)
					.mockResponseOnce(
						JSON.stringify({
							experimentValues: TEST_INITIALIZE_VALUES,
						}),
						{ status: 200 },
					);
			});

			test('initialize fails for fedramp-moderate perimeter and FeatureGateEnvironment.Development', async () => {
				await expect(
					initializeFeatureGates(TEST_IDENTIFIERS, {
						environment: FeatureGateEnvironment.Development, // not valid for fedramp-moderate perimeter
						perimeter: PerimeterType.FEDRAMP_MODERATE,
					}),
				).rejects.toThrow('Invalid environment "development" for "fedramp-moderate" perimeter');
				expect(fetchMock).not.toHaveBeenCalled();
			});

			test('initialize succeeds for fedramp-moderate perimeter and FeatureGateEnvironment.Production', async () => {
				await initializeFeatureGates(TEST_IDENTIFIERS, {
					environment: FeatureGateEnvironment.Production,
					perimeter: PerimeterType.FEDRAMP_MODERATE,
				});
				expect(statsigInitSpy).toHaveBeenCalledTimes(1);
				expect(statsigInitSpy).toHaveBeenCalledWith(MOCK_CLIENT_SDK_KEY, TEST_STATSIG_USER, {
					...TEST_STATSIG_OPTIONS,
					environment: {
						tier: 'production',
					},
					disableLogging: true, // disableAllLogging in FedRAMP
					apiKey: API_KEY, // apiKey added
				});
				const client = (FeatureGatesClass as unknown as { client: Client }).client;
				const bootstrapData = JSON.parse(client['dataAdapter'].bootstrapResult?.data ?? '{}');
				expect(bootstrapData).toEqual(TEST_INITIALIZE_VALUES);

				// call FFS with base url for environment and perimeter
				expect(fetchMock).toHaveBeenCalledWith(
					`${FEDM_PROD_BASE_URL}/api/v2/frontend/clientSdkKey/jira_web`,
					expect.objectContaining({}),
				);
				expect(fetchMock).toHaveBeenCalledWith(
					`${FEDM_PROD_BASE_URL}/api/v2/frontend/experimentValues`,
					expect.objectContaining({}),
				);
			});

			test('useGatewayUrl takes precedence over perimeter and environment to build FFS base url', async () => {
				await initializeFeatureGates(TEST_IDENTIFIERS, {
					environment: FeatureGateEnvironment.Production,
					useGatewayURL: true,
					perimeter: PerimeterType.FEDRAMP_MODERATE,
				});

				// call FFS using gateway base url
				expect(fetchMock).toHaveBeenCalledWith(
					`${GATEWAY_BASE_URL}/api/v2/frontend/clientSdkKey/jira_web`,
					expect.objectContaining({}),
				);
				expect(fetchMock).toHaveBeenCalledWith(
					`${GATEWAY_BASE_URL}/api/v2/frontend/experimentValues`,
					expect.objectContaining({}),
				);
			});

			test('perimeter defaults to PerimeterType.FEDRAMP_MODERATE if the code is running in a FedRAMP environment', async () => {
				isFedRampMock.mockReturnValue(true);
				await initializeFeatureGates(TEST_IDENTIFIERS, {
					environment: FeatureGateEnvironment.Production,
				});
				expect(statsigInitSpy).toHaveBeenCalledTimes(1);
				expect(statsigInitSpy).toHaveBeenCalledWith(MOCK_CLIENT_SDK_KEY, TEST_STATSIG_USER, {
					...TEST_STATSIG_OPTIONS,
					environment: {
						tier: 'production',
					},
					disableLogging: true, // disableAllLogging in FedRAMP
					apiKey: API_KEY, // apiKey added
				});
				const client = (FeatureGatesClass as unknown as { client: Client }).client;
				const bootstrapData = JSON.parse(client['dataAdapter'].bootstrapResult?.data ?? '{}');
				expect(bootstrapData).toEqual(TEST_INITIALIZE_VALUES);

				// call FFS with base url for environment and perimeter
				expect(fetchMock).toHaveBeenCalledWith(
					`${FEDM_PROD_BASE_URL}/api/v2/frontend/clientSdkKey/jira_web`,
					expect.objectContaining({}),
				);
				expect(fetchMock).toHaveBeenCalledWith(
					`${FEDM_PROD_BASE_URL}/api/v2/frontend/experimentValues`,
					expect.objectContaining({}),
				);
			});

			test('perimeter can be set explicitly to commercial even when running in a FedRAMP environment', async () => {
				isFedRampMock.mockReturnValue(true);
				await initializeFeatureGates(TEST_IDENTIFIERS, {
					environment: FeatureGateEnvironment.Production,
					perimeter: PerimeterType.COMMERCIAL,
				});
				expect(statsigInitSpy).toHaveBeenCalledTimes(1);
				expect(statsigInitSpy).toHaveBeenCalledWith(MOCK_CLIENT_SDK_KEY, TEST_STATSIG_USER, {
					...TEST_STATSIG_OPTIONS,
					environment: {
						tier: 'production',
					},
					apiKey: API_KEY, // apiKey added
				});
				const client = (FeatureGatesClass as unknown as { client: Client }).client;
				const bootstrapData = JSON.parse(client['dataAdapter'].bootstrapResult?.data ?? '{}');
				expect(bootstrapData).toEqual(TEST_INITIALIZE_VALUES);

				// call FFS with base url for environment and perimeter
				expect(fetchMock).toHaveBeenCalledWith(
					`${PROD_BASE_URL}/api/v2/frontend/clientSdkKey/jira_web`,
					expect.objectContaining({}),
				);
				expect(fetchMock).toHaveBeenCalledWith(
					`${PROD_BASE_URL}/api/v2/frontend/experimentValues`,
					expect.objectContaining({}),
				);
			});

			test('perimeter defaults to PerimeterType.COMMERCIAL if the code is running in a non-FedRAMP environment', async () => {
				isFedRampMock.mockReturnValue(false);
				await initializeFeatureGates(TEST_IDENTIFIERS, {
					environment: FeatureGateEnvironment.Production,
				});
				expect(statsigInitSpy).toHaveBeenCalledTimes(1);
				expect(statsigInitSpy).toHaveBeenCalledWith(MOCK_CLIENT_SDK_KEY, TEST_STATSIG_USER, {
					...TEST_STATSIG_OPTIONS,
					environment: {
						tier: 'production',
					},
					apiKey: API_KEY, // apiKey added
				});
				const client = (FeatureGatesClass as unknown as { client: Client }).client;
				const bootstrapData = JSON.parse(client['dataAdapter'].bootstrapResult?.data ?? '{}');
				expect(bootstrapData).toEqual(TEST_INITIALIZE_VALUES);

				// call FFS with base url for environment and perimeter
				expect(fetchMock).toHaveBeenCalledWith(
					`${PROD_BASE_URL}/api/v2/frontend/clientSdkKey/jira_web`,
					expect.objectContaining({}),
				);
				expect(fetchMock).toHaveBeenCalledWith(
					`${PROD_BASE_URL}/api/v2/frontend/experimentValues`,
					expect.objectContaining({}),
				);
			});

			test('perimeter can be set explicitly to FedRAMP even when running in a non-FedRAMP environment', async () => {
				isFedRampMock.mockReturnValue(false);
				await initializeFeatureGates(TEST_IDENTIFIERS, {
					environment: FeatureGateEnvironment.Production,
					perimeter: PerimeterType.FEDRAMP_MODERATE,
				});
				expect(statsigInitSpy).toHaveBeenCalledTimes(1);
				expect(statsigInitSpy).toHaveBeenCalledWith(MOCK_CLIENT_SDK_KEY, TEST_STATSIG_USER, {
					...TEST_STATSIG_OPTIONS,
					environment: {
						tier: 'production',
					},
					disableLogging: true, // disableAllLogging in FedRAMP
					apiKey: API_KEY, // apiKey added
				});
				const client = (FeatureGatesClass as unknown as { client: Client }).client;
				const bootstrapData = JSON.parse(client['dataAdapter'].bootstrapResult?.data ?? '{}');
				expect(bootstrapData).toEqual(TEST_INITIALIZE_VALUES);

				// call FFS with base url for environment and perimeter
				expect(fetchMock).toHaveBeenCalledWith(
					`${FEDM_PROD_BASE_URL}/api/v2/frontend/clientSdkKey/jira_web`,
					expect.objectContaining({}),
				);
				expect(fetchMock).toHaveBeenCalledWith(
					`${FEDM_PROD_BASE_URL}/api/v2/frontend/experimentValues`,
					expect.objectContaining({}),
				);
			});
		});
	});

	describe('initializeFromValues client', function () {
		test('initializeFromValues successfully', async () => {
			await FeatureGatesClass.initializeFromValues(
				{
					sdkKey: CLIENT_SDK_KEY,
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
				},
				TEST_IDENTIFIERS,
				undefined,
				TEST_INITIALIZE_VALUES,
			);

			expect(statsigInitSpy).toHaveBeenCalledTimes(1);
			expect(statsigInitSpy).toHaveBeenCalledWith(
				CLIENT_SDK_KEY,
				TEST_STATSIG_USER,
				TEST_STATSIG_OPTIONS,
			);
			const client = (FeatureGatesClass as unknown as { client: Client }).client;
			const bootstrapData = JSON.parse(client['dataAdapter'].bootstrapResult?.data ?? '{}');
			expect(bootstrapData).toEqual(TEST_INITIALIZE_VALUES);

			expectTestCohortNotEnrolled();
		});

		test('initializeFromValues should initialize when no identifiers are provided', async () => {
			await FeatureGatesClass.initializeFromValues(
				{
					sdkKey: CLIENT_SDK_KEY,
					environment: FeatureGateEnvironment.Development,
					targetApp: TARGET_APP,
				},
				{},
				undefined,
				TEST_INITIALIZE_VALUES,
			);

			expect(statsigInitSpy).toHaveBeenCalledTimes(1);
			expect(statsigInitSpy).toHaveBeenCalledWith(
				CLIENT_SDK_KEY,
				{
					customIDs: {},
				},
				TEST_STATSIG_OPTIONS,
			);
			const client = (FeatureGatesClass as unknown as { client: Client }).client;
			const bootstrapData = JSON.parse(client['dataAdapter'].bootstrapResult?.data ?? '{}');
			expect(bootstrapData).toEqual(TEST_INITIALIZE_VALUES);

			expectTestCohortNotEnrolled();
		});
	});

	function initializeFeatureGates(
		identifiers: Identifiers,
		clientOptions: Partial<ClientOptions> = {},
	) {
		return FeatureGatesClass.initialize(
			{
				apiKey: API_KEY,
				environment: FeatureGateEnvironment.Development,
				targetApp: TARGET_APP,
				...clientOptions,
			},
			identifiers,
			undefined,
		);
	}

	function expectTestCohortNotEnrolled() {
		expect(FeatureGatesClass.getExperimentValue('test', 'cohort', 'not-enrolled')).toEqual(
			'not-enrolled',
		);
	}
});
