import { ResponseError } from '@atlaskit/feature-gate-fetcher/errors';
import Fetcher from '@atlaskit/feature-gate-fetcher/Fetcher';
import type { EvalFlagsResponse } from '@atlaskit/feature-gate-fetcher/types';
import {
	type BaseClientOptions,
	type CustomAttributes,
	FeatureGateEnvironment,
	type FrontendExperimentsResult,
	type Identifiers,
	type OptionsWithDefaults,
	PerimeterType,
} from '@atlaskit/feature-gate-js-client/types';

import Broadcast from '../../Broadcast';
import FeatureGatesDB from '../../database/FeatureGatesDB';
import { type ExperimentValuesEntry } from '../../database/types';
import PollingProvider, { type ProviderOptions } from '../index';
import Refresh from '../Refresh';
import { type FeatureGateState } from '../types';
import { createHash, getFrontendExperimentsResult } from '../utils';

jest.mock('@atlaskit/feature-gate-fetcher/Fetcher', () => ({
	...jest.requireActual('@atlaskit/feature-gate-fetcher/Fetcher'),
	fetchEvalFlags: jest.fn(),
	fetchExperimentValues: jest.fn(),
	fetchClientSdkKey: jest.fn(),
}));

jest.mock('../utils', () => ({
	...jest.requireActual('../utils'),
	createHash: jest.fn(),
}));

jest.mock('../../Broadcast');
jest.mock('../Refresh');
jest.mock('../../database/FeatureGatesDB');

const mockClientSdkKey = 'mock-client-sdk-key';
const mockCustomAttributesFromFetch = { attributes: '1234' };
const mockExperimentValues = {
	value: '12345',
};

const mockClientOptions: OptionsWithDefaults<BaseClientOptions> = {
	environment: FeatureGateEnvironment.Development,
	perimeter: PerimeterType.COMMERCIAL,
	targetApp: 'targetApp_web',
};

const mockIdentifiers: Identifiers = {
	atlassianAccountId: 'abc-123',
	tenantId: '123-abc',
};

const mockCustomAttributes: CustomAttributes = {
	value: 'custom attribute value',
};
const providerOptions: ProviderOptions = {
	apiKey: '123',
	initialFetchTimeout: 15,
	pollingInterval: 30000,
	useGatewayURL: true,
	includeFfpFlags: true,
};
const mockClientVersion = 'mockVersion';
const mockCurrentDate = 1727256325239;
const expectedProfileHash =
	'evalFlags.v1.8e3c96eb13880fc945411b9300db02903a32b62d9af731c8c6b37207f2201289';
const expectedRulesetProfile = {
	customAttributes: mockCustomAttributes,
	identifiers: mockIdentifiers,
	environment: FeatureGateEnvironment.Development,
	perimeter: PerimeterType.COMMERCIAL,
	targetApp: 'targetApp_web',
};
const mockFfpValues = {
	requestContext: { identifiers: { stableID: 'stable-abc' }, attributes: {} },
	flags: {},
};
const mockExperimentValuesResponse: EvalFlagsResponse = {
	statsig: {
		experimentValues: mockExperimentValues,
		customAttributes: mockCustomAttributesFromFetch,
	},
	ffp: mockFfpValues,
	status: { statsig: 'OK', ffp: 'OK' },
};
const expectedExperimentValuesResult: FrontendExperimentsResult = {
	experimentValues: mockExperimentValues,
	customAttributesFromFetch: mockCustomAttributesFromFetch,
	clientSdkKey: undefined,
	ffp: mockFfpValues,
	status: { statsig: 'OK', ffp: 'OK' },
};

const getMockEVEntry = (timestamp: number): ExperimentValuesEntry => ({
	profileHash: 'profileHash',
	rulesetProfile: {
		identifiers: mockIdentifiers,
		customAttributes: mockCustomAttributes,
		environment: mockClientOptions.environment,
		perimeter: mockClientOptions.perimeter,
		targetApp: mockClientOptions.targetApp,
	},
	evalFlagsResponse: {
		statsig: {
			experimentValues: mockExperimentValues,
			customAttributes: mockCustomAttributesFromFetch,
		},
		status: { statsig: 'OK', ffp: 'DISABLED' },
	},
	timestamp,
});

describe('PollingProvider', () => {
	const mockedFetcher = jest.mocked(Fetcher);
	let mockedFeatureGateDB = jest.mocked(FeatureGatesDB);
	let mockedBroadcast = jest.mocked(Broadcast);
	let mockedRefresh = jest.mocked(Refresh);
	const mockCreateHash = jest.mocked(createHash);
	const mockApplyUpdate = jest.fn();
	let provider: PollingProvider;
	const RealDate = Date.now;

	const setProfile = (p: PollingProvider = provider) => {
		p['currentProfileHash'] = expectedProfileHash;
		p['currentRulesetProfile'] = expectedRulesetProfile;
	};

	beforeEach(() => {
		// eslint-disable-next-line no-console
		console.warn = jest.fn();
		global.Date.now = jest.fn(() => mockCurrentDate);
		mockedFetcher.fetchEvalFlags.mockResolvedValue(mockExperimentValuesResponse);
		mockedFetcher.fetchClientSdkKey.mockResolvedValue({ clientSdkKey: mockClientSdkKey });
		provider = new PollingProvider(providerOptions);
		provider.setApplyUpdateCallback(mockApplyUpdate);
		provider.setClientVersion(mockClientVersion);
		mockedFeatureGateDB = jest.mocked(FeatureGatesDB);
		mockCreateHash.mockResolvedValue(
			'8e3c96eb13880fc945411b9300db02903a32b62d9af731c8c6b37207f2201289',
		);
	});

	afterEach(() => {
		global.Date.now = RealDate;
		jest.resetAllMocks();
		jest.clearAllMocks();
	});

	describe('setProfile', function () {
		test('sets profile as expected', async () => {
			await provider.setProfile(mockClientOptions, mockIdentifiers, mockCustomAttributes);

			await expect(mockedRefresh.mock.instances[0].updateProfile).toHaveBeenCalledWith(
				expectedProfileHash,
				expectedRulesetProfile,
				mockCurrentDate,
			);
			await expect(mockedRefresh.mock.instances[0].start).toHaveBeenCalledTimes(1);
			await expect(mockedBroadcast.mock.instances[0].updateUserContext).toHaveBeenCalledWith(
				expectedProfileHash,
			);

			expect(provider['currentRulesetProfile']).toEqual(expectedRulesetProfile);
			expect(provider['currentProfileHash']).toEqual(expectedProfileHash);
			expect(provider['lastUpdatedTimestamp']).toBe(0);
		});

		test('does not update lastUpdatedTimestamp if profile has not changed', async () => {
			provider['currentProfileHash'] = expectedProfileHash;
			provider['lastUpdatedTimestamp'] = -1;

			await provider.setProfile(mockClientOptions, mockIdentifiers, mockCustomAttributes);

			await expect(mockedRefresh.mock.instances[0].updateProfile).toHaveBeenCalledWith(
				expectedProfileHash,
				expectedRulesetProfile,
				mockCurrentDate,
			);
			await expect(mockedRefresh.mock.instances[0].start).toHaveBeenCalledTimes(1);
			await expect(mockedBroadcast.mock.instances[0].updateUserContext).toHaveBeenCalledWith(
				expectedProfileHash,
			);

			expect(provider['currentRulesetProfile']).toEqual(expectedRulesetProfile);
			expect(provider['currentProfileHash']).toEqual(expectedProfileHash);
			expect(provider['lastUpdatedTimestamp']).toBe(-1);
		});

		test('sets profile as expected when no last updated time', async () => {
			await provider.setProfile(mockClientOptions, mockIdentifiers, mockCustomAttributes);

			await expect(mockedRefresh.mock.instances[0].updateProfile).toHaveBeenCalledWith(
				expectedProfileHash,
				expectedRulesetProfile,
				mockCurrentDate,
			);
			await expect(mockedRefresh.mock.instances[0].start).toHaveBeenCalledTimes(1);
			await expect(mockedBroadcast.mock.instances[0].updateUserContext).toHaveBeenCalledWith(
				expectedProfileHash,
			);

			expect(provider['currentRulesetProfile']).toEqual(expectedRulesetProfile);
			expect(provider['currentProfileHash']).toEqual(expectedProfileHash);
			expect(provider['lastUpdatedTimestamp']).toEqual(0);
		});

		test('can get experiment values after setting profile', async () => {
			await provider.setProfile(mockClientOptions, mockIdentifiers, mockCustomAttributes);

			mockedFeatureGateDB.mock.instances[0].getExperimentValues = jest.fn().mockResolvedValue(null);
			await expect(provider.getExperimentValues()).resolves.toStrictEqual(
				expectedExperimentValuesResult,
			);
			await expect(mockedFetcher.fetchEvalFlags).toHaveBeenCalledWith(
				mockClientVersion,
				{
					apiKey: '123',
					environment: 'development',
					perimeter: 'commercial',
					fetchTimeoutMs: 15,
					targetApp: 'targetApp_web',
					useGatewayURL: true,
					includeFfpFlags: true,
				},
				mockIdentifiers,
				mockCustomAttributes,
			);
		});

		test('can get client sdk key after setting profile', async () => {
			await provider.setProfile(mockClientOptions, mockIdentifiers, mockCustomAttributes);

			mockedFeatureGateDB.mock.instances[0].getClientSdkKey = jest.fn().mockResolvedValue(null);

			await expect(provider.getClientSdkKey()).resolves.toBe(mockClientSdkKey);

			await new Promise(process.nextTick);

			await expect(mockedFetcher.fetchClientSdkKey).toHaveBeenCalledWith(mockClientVersion, {
				apiKey: '123',
				environment: 'development',
				perimeter: 'commercial',
				fetchTimeoutMs: 15,
				targetApp: 'targetApp_web',
				useGatewayURL: true,
			});
		});

		describe('without includeFfpFlags', () => {
			const statsigOnlyProviderOptions: ProviderOptions = {
				...providerOptions,
				includeFfpFlags: false,
			};

			test('keys the values by a profile hash with its own prefix', async () => {
				const statsigOnlyProvider = new PollingProvider(statsigOnlyProviderOptions);

				await statsigOnlyProvider.setProfile(
					mockClientOptions,
					mockIdentifiers,
					mockCustomAttributes,
				);

				expect(statsigOnlyProvider['currentProfileHash']).toBe(
					'experimentValues.v2.8e3c96eb13880fc945411b9300db02903a32b62d9af731c8c6b37207f2201289',
				);
			});

			test('fetches Statsig values only and disables FFP', async () => {
				mockedFetcher.fetchExperimentValues.mockResolvedValue({
					experimentValues: mockExperimentValues,
					customAttributes: mockCustomAttributesFromFetch,
				});
				const statsigOnlyProvider = new PollingProvider(statsigOnlyProviderOptions);
				statsigOnlyProvider.setApplyUpdateCallback(mockApplyUpdate);
				statsigOnlyProvider.setClientVersion(mockClientVersion);
				await statsigOnlyProvider.setProfile(
					mockClientOptions,
					mockIdentifiers,
					mockCustomAttributes,
				);

				await expect(statsigOnlyProvider.getExperimentValues()).resolves.toStrictEqual({
					experimentValues: mockExperimentValues,
					customAttributesFromFetch: mockCustomAttributesFromFetch,
					clientSdkKey: undefined,
					ffp: undefined,
					status: { statsig: 'OK', ffp: 'DISABLED' },
					disabledProviders: ['ffp'],
				});
				expect(mockedFetcher.fetchEvalFlags).not.toHaveBeenCalled();
				expect(mockedFetcher.fetchExperimentValues).toHaveBeenCalledWith(
					mockClientVersion,
					{
						apiKey: '123',
						environment: 'development',
						perimeter: 'commercial',
						fetchTimeoutMs: 15,
						targetApp: 'targetApp_web',
						useGatewayURL: true,
						includeFfpFlags: false,
					},
					mockIdentifiers,
					mockCustomAttributes,
				);
			});
		});
	});

	describe('getExperimentValues', function () {
		test('get values from fetch when db does not have entry', async () => {
			setProfile();

			mockedFeatureGateDB.mock.instances[0].getExperimentValues = jest.fn().mockResolvedValue(null);
			await expect(provider.getExperimentValues()).resolves.toStrictEqual(
				expectedExperimentValuesResult,
			);
			await expect(mockedFetcher.fetchEvalFlags).toHaveBeenCalledWith(
				mockClientVersion,
				{
					apiKey: '123',
					environment: 'development',
					perimeter: 'commercial',
					fetchTimeoutMs: 15,
					targetApp: 'targetApp_web',
					useGatewayURL: true,
					includeFfpFlags: true,
				},
				mockIdentifiers,
				mockCustomAttributes,
			);

			const expectedFGState: ExperimentValuesEntry = {
				profileHash: expectedProfileHash,
				rulesetProfile: expectedRulesetProfile,
				evalFlagsResponse: mockExperimentValuesResponse,
				timestamp: mockCurrentDate,
			};

			await expect(mockedBroadcast.mock.instances[0].sendFeatureGateState).toHaveBeenCalledWith(
				expectedFGState,
			);

			await expect(mockApplyUpdate).toHaveBeenCalledTimes(0);

			await expect(mockedRefresh.mock.instances[0].setTimestamp).toHaveBeenCalledWith(
				mockCurrentDate,
			);
			await expect(mockedRefresh.mock.instances[0].start).toHaveBeenCalledTimes(1);

			await expect(mockedFeatureGateDB.mock.instances[0].setExperimentValues).toHaveBeenCalledWith(
				expectedFGState,
			);

			expect(provider['currentRulesetProfile']).toBe(expectedRulesetProfile);
			expect(provider['currentProfileHash']).toBe(expectedProfileHash);
			expect(provider['lastUpdatedTimestamp']).toStrictEqual(mockCurrentDate);
		});

		test('error thrown when db does not have entry and fetch rejects', async () => {
			setProfile();

			mockedFeatureGateDB.mock.instances[0].getExperimentValues = jest.fn().mockResolvedValue(null);
			mockedFetcher.fetchEvalFlags.mockRejectedValue(
				new Error('failed to fetch experiment values'),
			);

			await expect(provider.getExperimentValues()).rejects.toThrow(
				'failed to fetch experiment values',
			);
			await expect(mockedFetcher.fetchEvalFlags).toHaveBeenCalledWith(
				mockClientVersion,
				{
					apiKey: '123',
					environment: 'development',
					perimeter: 'commercial',
					fetchTimeoutMs: 15,
					targetApp: 'targetApp_web',
					useGatewayURL: true,
					includeFfpFlags: true,
				},
				mockIdentifiers,
				mockCustomAttributes,
			);

			await expect(mockedBroadcast.mock.instances[0].sendFeatureGateState).toHaveBeenCalledTimes(0);
			await expect(mockApplyUpdate).toHaveBeenCalledTimes(0);
			await expect(mockedRefresh.mock.instances[0].setTimestamp).toHaveBeenCalledWith(0);
			await expect(mockedRefresh.mock.instances[0].start).toHaveBeenCalledTimes(1);
			await expect(mockedFeatureGateDB.mock.instances[0].setExperimentValues).toHaveBeenCalledTimes(
				0,
			);

			expect(provider['currentRulesetProfile']).toBe(expectedRulesetProfile);
			expect(provider['currentProfileHash']).toBe(expectedProfileHash);
			expect(provider['lastUpdatedTimestamp']).toStrictEqual(0);
		});

		test('does not get values from fetch when db has fresh entry', async () => {
			setProfile();

			const dbEntryTimestamp = mockCurrentDate - 10;
			const mockDBEntry = getMockEVEntry(dbEntryTimestamp);

			const experimentValuesFromDB = {
				value: 'value-from-db',
			};

			mockDBEntry.evalFlagsResponse = {
				statsig: {
					experimentValues: experimentValuesFromDB,
					customAttributes: mockCustomAttributesFromFetch,
				},
				ffp: mockFfpValues,
				status: { statsig: 'OK', ffp: 'OK' },
			};

			mockedFeatureGateDB.mock.instances[0].getExperimentValues = jest
				.fn()
				.mockResolvedValue(mockDBEntry);
			await expect(provider.getExperimentValues()).resolves.toStrictEqual(
				getFrontendExperimentsResult(mockDBEntry.evalFlagsResponse, mockCustomAttributes),
			);

			await new Promise(process.nextTick);

			await expect(mockedFetcher.fetchEvalFlags).toHaveBeenCalledTimes(0);
			await expect(mockedFeatureGateDB.mock.instances[0].setExperimentValues).toHaveBeenCalledTimes(
				0,
			);

			await expect(mockedBroadcast.mock.instances[0].sendFeatureGateState).toHaveBeenCalledTimes(0);
			await expect(mockApplyUpdate).toHaveBeenCalledTimes(0);
			await expect(mockedRefresh.mock.instances[0].setTimestamp).toHaveBeenCalledWith(
				dbEntryTimestamp,
			);
			await expect(mockedRefresh.mock.instances[0].start).toHaveBeenCalledTimes(1);
			await expect(mockedFeatureGateDB.mock.instances[0].setExperimentValues).toHaveBeenCalledTimes(
				0,
			);

			expect(provider['currentRulesetProfile']).toBe(expectedRulesetProfile);
			expect(provider['currentProfileHash']).toBe(expectedProfileHash);
			expect(provider['lastUpdatedTimestamp']).toEqual(dbEntryTimestamp);
		});

		test('get values from fetch when db has not been initialised', async () => {
			setProfile();

			mockedFeatureGateDB.mockImplementation(() => {
				throw new Error('Error starting indexDB db');
			});

			const newProvider = new PollingProvider(providerOptions);
			newProvider.setClientVersion(mockClientVersion);
			setProfile(newProvider);
			newProvider.setApplyUpdateCallback(mockApplyUpdate);

			// eslint-disable-next-line no-console
			expect(console.warn).toHaveBeenCalledWith('Error when trying to start DB, {}');

			await expect(newProvider.getExperimentValues()).resolves.toStrictEqual(
				expectedExperimentValuesResult,
			);

			const expectedFGState: ExperimentValuesEntry = {
				profileHash: expectedProfileHash,
				rulesetProfile: expectedRulesetProfile,
				evalFlagsResponse: mockExperimentValuesResponse,
				timestamp: mockCurrentDate,
			};

			await expect(mockedBroadcast.mock.instances[1].sendFeatureGateState).toHaveBeenCalledWith(
				expectedFGState,
			);

			await expect(mockApplyUpdate).toHaveBeenCalledTimes(0);

			await expect(mockedRefresh.mock.instances[1].setTimestamp).toHaveBeenCalledWith(
				mockCurrentDate,
			);
			await expect(mockedRefresh.mock.instances[1].start).toHaveBeenCalledTimes(1);

			await expect(mockedFeatureGateDB.mock.instances[1].setExperimentValues).toHaveBeenCalledTimes(
				0,
			);

			expect(newProvider['currentRulesetProfile']).toBe(expectedRulesetProfile);
			expect(newProvider['currentProfileHash']).toBe(expectedProfileHash);
			expect(newProvider['lastUpdatedTimestamp']).toEqual(mockCurrentDate);
		});
	});

	describe('getClientSdkKey', function () {
		test('get sdk key from fetch when db does not have entry', async () => {
			setProfile();

			mockedFeatureGateDB.mock.instances[0].getClientSdkKey = jest.fn().mockResolvedValue(null);

			await expect(provider.getClientSdkKey()).resolves.toBe(mockClientSdkKey);

			await new Promise(process.nextTick);

			await expect(mockedFetcher.fetchClientSdkKey).toHaveBeenCalledWith(mockClientVersion, {
				apiKey: '123',
				environment: 'development',
				perimeter: 'commercial',
				fetchTimeoutMs: 15,
				targetApp: 'targetApp_web',
				useGatewayURL: true,
			});

			await expect(mockedFeatureGateDB.mock.instances[0].setClientSdkKey).toHaveBeenCalledWith({
				clientSdkKey: mockClientSdkKey,
				targetApp: mockClientOptions.targetApp,
				environment: mockClientOptions.environment,
				perimeter: mockClientOptions.perimeter,
				timestamp: mockCurrentDate,
			});

			await expect(mockedFeatureGateDB.mock.instances[0].getClientSdkKey).toHaveBeenCalledWith({
				targetApp: mockClientOptions.targetApp,
				environment: mockClientOptions.environment,
				perimeter: mockClientOptions.perimeter,
			});
		});

		test('error thrown when db does not have entry and fetch rejects', async () => {
			setProfile();

			mockedFeatureGateDB.mock.instances[0].getClientSdkKey = jest.fn().mockResolvedValue(null);

			mockedFetcher.fetchClientSdkKey.mockRejectedValue(
				new Error('failed to fetch client sdk key'),
			);

			await expect(provider.getClientSdkKey()).rejects.toThrow('failed to fetch client sdk key');
			await expect(mockedFetcher.fetchClientSdkKey).toHaveBeenCalledWith(mockClientVersion, {
				apiKey: '123',
				environment: 'development',
				perimeter: 'commercial',
				fetchTimeoutMs: 15,
				targetApp: 'targetApp_web',
				useGatewayURL: true,
			});

			await expect(mockedFeatureGateDB.mock.instances[0].getClientSdkKey).toHaveBeenCalledWith({
				targetApp: mockClientOptions.targetApp,
				environment: mockClientOptions.environment,
				perimeter: mockClientOptions.perimeter,
			});
		});

		test('get sdk key from fetch when db has entry', async () => {
			setProfile();

			const mockDBEntry = {
				clientSdkKey: mockClientSdkKey + 'FromDB',
				targetApp: mockClientOptions.targetApp,
				timestamp: mockCurrentDate,
			};

			mockedFeatureGateDB.mock.instances[0].getClientSdkKey = jest
				.fn()
				.mockResolvedValue(mockDBEntry);

			await expect(provider.getClientSdkKey()).resolves.toBe(mockDBEntry.clientSdkKey);

			await new Promise(process.nextTick);

			await expect(mockedFetcher.fetchClientSdkKey).toHaveBeenCalledTimes(0);
			await expect(mockedFeatureGateDB.mock.instances[0].getClientSdkKey).toHaveBeenCalledWith({
				targetApp: mockClientOptions.targetApp,
				environment: mockClientOptions.environment,
				perimeter: mockClientOptions.perimeter,
			});
			await expect(mockedFeatureGateDB.mock.instances[0].setClientSdkKey).toHaveBeenCalledTimes(0);
		});

		test('get sdk key from fetch when db has not been initialised', async () => {
			mockedFeatureGateDB.mockImplementation(() => {
				throw new Error('Error starting indexDB db');
			});

			const newProvider = new PollingProvider(providerOptions);
			newProvider.setClientVersion(mockClientVersion);
			setProfile(newProvider);

			// eslint-disable-next-line no-console
			expect(console.warn).toHaveBeenCalledWith('Error when trying to start DB, {}');

			await expect(newProvider.getClientSdkKey()).resolves.toBe(mockClientSdkKey);

			await new Promise(process.nextTick);

			await expect(mockedFetcher.fetchClientSdkKey).toHaveBeenCalledWith(mockClientVersion, {
				apiKey: '123',
				environment: 'development',
				perimeter: 'commercial',
				fetchTimeoutMs: 15,
				targetApp: 'targetApp_web',
				useGatewayURL: true,
			});

			await expect(mockedFeatureGateDB.mock.instances[1].getClientSdkKey).toHaveBeenCalledTimes(0);
			await expect(mockedFeatureGateDB.mock.instances[1].setClientSdkKey).toHaveBeenCalledTimes(0);
		});

		test('error thrown when clientVersions have not been set', async () => {
			setProfile();
			provider['clientVersion'] = undefined;

			await expect(provider.getClientSdkKey()).rejects.toThrow('Client version has not been set');
			await expect(mockedFetcher.fetchClientSdkKey).toHaveBeenCalledTimes(0);

			await expect(mockedFeatureGateDB.mock.instances[0].getClientSdkKey).toHaveBeenCalledTimes(0);
		});

		test('error thrown when profile has not been set - options missing', async () => {
			setProfile();
			provider['currentRulesetProfile'] = undefined;

			await expect(provider.getClientSdkKey()).rejects.toThrow('Profile has not been set');
			await expect(mockedFetcher.fetchClientSdkKey).toHaveBeenCalledTimes(0);

			await expect(mockedFeatureGateDB.mock.instances[0].getClientSdkKey).toHaveBeenCalledTimes(0);
		});

		test('error thrown when profile has not been set - identifiers missing', async () => {
			setProfile();
			provider['currentRulesetProfile'] = undefined;

			await expect(provider.getClientSdkKey()).rejects.toThrow('Profile has not been set');
			await expect(mockedFetcher.fetchClientSdkKey).toHaveBeenCalledTimes(0);

			await expect(mockedFeatureGateDB.mock.instances[0].getClientSdkKey).toHaveBeenCalledTimes(0);
		});
	});

	describe('getApiKey', () => {
		test('get api key from provider options', () => {
			expect(provider.getApiKey()).toBe(providerOptions.apiKey);
		});
	});

	describe('getProfileHashAndProfile', () => {
		test('get ', async () => {
			await expect(
				provider['getProfileHashAndProfile'](
					mockClientOptions,
					mockIdentifiers,
					mockCustomAttributes,
				),
			).resolves.toStrictEqual({
				profileHash: expectedProfileHash,
				rulesetProfile: expectedRulesetProfile,
			});
		});
	});

	describe('processFeatureGateUpdate', () => {
		test('update is not done when it is for a different profile hash ', async () => {
			provider['currentProfileHash'] = expectedProfileHash;

			const mockFGState: FeatureGateState = {
				profileHash: 'different-profile-hash',
				evalFlagsResponse: mockExperimentValuesResponse,
				timestamp: mockCurrentDate,
			};

			provider['processFeatureGateUpdate'](mockFGState);

			await expect(mockApplyUpdate).toHaveBeenCalledTimes(0);
		});

		test('does not apply update if applyUpdate function is not set', async () => {
			provider['currentProfileHash'] = expectedProfileHash;
			provider['applyUpdate'] = undefined;

			const mockFGState: FeatureGateState = {
				profileHash: expectedProfileHash,
				evalFlagsResponse: mockExperimentValuesResponse,
				timestamp: mockCurrentDate,
			};

			provider['processFeatureGateUpdate'](mockFGState);

			await expect(mockApplyUpdate).toHaveBeenCalledTimes(0);

			// eslint-disable-next-line no-console
			expect(console.warn).toHaveBeenCalledWith(
				'No apply update callback has been set. Cannot update experiment values.',
			);
		});
	});
	describe('provider health', () => {
		const polledStatsig = {
			experimentValues: { value: 'polled' },
			customAttributes: mockCustomAttributesFromFetch,
		};

		const pollEntry = (evalFlagsResponse: EvalFlagsResponse): ExperimentValuesEntry => ({
			profileHash: expectedProfileHash,
			rulesetProfile: expectedRulesetProfile,
			evalFlagsResponse,
			timestamp: mockCurrentDate,
		});

		beforeEach(() => {
			setProfile();
			provider['lastEvalFlags'] = {
				profileHash: expectedProfileHash,
				response: mockExperimentValuesResponse,
			};
		});

		test('a poll that finds FFP unavailable keeps the last OK FFP section', () => {
			provider['featureGateUpdateHttpHandler'](
				pollEntry({
					statsig: polledStatsig,
					ffp: null,
					status: { statsig: 'OK', ffp: 'UNAVAILABLE' },
				}),
			);

			expect(mockApplyUpdate).toHaveBeenCalledWith({
				experimentValues: polledStatsig.experimentValues,
				customAttributesFromFetch: mockCustomAttributesFromFetch,
				clientSdkKey: undefined,
				ffp: mockFfpValues,
				// The status reported is the one fetched, so the outage is still reported
				status: { statsig: 'OK', ffp: 'UNAVAILABLE' },
			});
			// The merged values are cached and broadcast as OK
			const merged = pollEntry({
				statsig: polledStatsig,
				ffp: mockFfpValues,
				status: { statsig: 'OK', ffp: 'OK' },
			});
			expect(mockedFeatureGateDB.mock.instances[0].setExperimentValues).toHaveBeenCalledWith(
				merged,
			);
			expect(mockedBroadcast.mock.instances[0].sendFeatureGateState).toHaveBeenCalledWith(merged);
		});

		test('a poll that finds Statsig unavailable keeps the last OK Statsig section', () => {
			provider['featureGateUpdateHttpHandler'](
				pollEntry({ ffp: mockFfpValues, status: { statsig: 'UNAVAILABLE', ffp: 'OK' } }),
			);

			expect(mockApplyUpdate).toHaveBeenCalledWith({
				...expectedExperimentValuesResult,
				status: { statsig: 'UNAVAILABLE', ffp: 'OK' },
			});
		});

		test('a provider that is now disabled is applied as returned', () => {
			provider['featureGateUpdateHttpHandler'](
				pollEntry({ statsig: polledStatsig, status: { statsig: 'OK', ffp: 'DISABLED' } }),
			);

			expect(mockApplyUpdate).toHaveBeenCalledWith(
				expect.objectContaining({ ffp: undefined, status: { statsig: 'OK', ffp: 'DISABLED' } }),
			);
		});

		test('sections are not kept from another profile', () => {
			provider['lastEvalFlags'] = {
				profileHash: 'another-profile-hash',
				response: mockExperimentValuesResponse,
			};

			provider['featureGateUpdateHttpHandler'](
				pollEntry({ statsig: polledStatsig, status: { statsig: 'OK', ffp: 'UNAVAILABLE' } }),
			);

			expect(mockApplyUpdate).toHaveBeenCalledWith(expect.objectContaining({ ffp: undefined }));
		});

		test('values read from the cache keep the last OK section on the next poll', async () => {
			provider['lastEvalFlags'] = undefined;
			mockedFeatureGateDB.mock.instances[0].getExperimentValues = jest.fn().mockResolvedValue({
				...getMockEVEntry(mockCurrentDate),
				evalFlagsResponse: mockExperimentValuesResponse,
			});

			// Values from the cache are not reported again
			await expect(provider.getExperimentValues()).resolves.toStrictEqual({
				experimentValues: mockExperimentValues,
				customAttributesFromFetch: mockCustomAttributesFromFetch,
				clientSdkKey: undefined,
				ffp: mockFfpValues,
			});

			provider['featureGateUpdateHttpHandler'](
				pollEntry({ statsig: polledStatsig, status: { statsig: 'OK', ffp: 'UNAVAILABLE' } }),
			);
			expect(mockApplyUpdate).toHaveBeenCalledWith(expect.objectContaining({ ffp: mockFfpValues }));
		});

		test('values broadcast by another tab are applied without a status', () => {
			provider['featureGateUpdateBroadcastHandler']({
				profileHash: expectedProfileHash,
				evalFlagsResponse: mockExperimentValuesResponse,
				timestamp: mockCurrentDate,
			});

			const expected: FrontendExperimentsResult = { ...expectedExperimentValuesResult };
			delete expected.status;
			expect(mockApplyUpdate).toHaveBeenCalledWith(expected);
			expect(mockApplyUpdate.mock.calls[0][0]).not.toHaveProperty('status');
		});
	});
	describe('retries after the initial fetch', () => {
		beforeEach(() => {
			setProfile();
			mockedRefresh.mock.instances[0].start = jest.fn();
			mockedRefresh.mock.instances[0].stop = jest.fn();
			mockedRefresh.mock.instances[0].setFetchedStatus = jest.fn();
		});

		test('reports the fetched status to the refresh loop', async () => {
			mockedFetcher.fetchEvalFlags.mockResolvedValue({
				...mockExperimentValuesResponse,
				status: { statsig: 'OK', ffp: 'UNAVAILABLE' },
			});

			await provider.getExperimentValues();

			expect(mockedRefresh.mock.instances[0].setFetchedStatus).toHaveBeenCalledWith({
				statsig: 'OK',
				ffp: 'UNAVAILABLE',
			});
			expect(mockedRefresh.mock.instances[0].start).toHaveBeenCalled();
		});

		test.each([403, 404])('stops polling after a %s', async (status) => {
			mockedFetcher.fetchEvalFlags.mockRejectedValue(
				new ResponseError('Non 2xx response status received', status, '{}'),
			);

			await expect(provider.getExperimentValues()).rejects.toThrow();

			expect(mockedRefresh.mock.instances[0].start).not.toHaveBeenCalled();
			expect(mockedRefresh.mock.instances[0].stop).toHaveBeenCalled();
		});

		test('rejects and keeps polling, without caching, when no provider is usable', async () => {
			// Use the real fetcher, which rejects such a response, against a stubbed network
			const actualFetcher: typeof Fetcher = jest.requireActual(
				'@atlaskit/feature-gate-fetcher/Fetcher',
			).default;
			mockedFetcher.fetchEvalFlags.mockImplementation((...args) =>
				actualFetcher.fetchEvalFlags(...args),
			);
			const originalFetch = global.fetch;
			global.fetch = jest.fn().mockResolvedValue({
				ok: true,
				status: 200,
				text: async () =>
					JSON.stringify({
						statsig: null,
						ffp: null,
						status: { statsig: 'UNAVAILABLE', ffp: 'DISABLED' },
					}),
			});
			try {
				await expect(provider.getExperimentValues()).rejects.toThrow(
					'Feature flag values are unavailable (Statsig: UNAVAILABLE, FFP: DISABLED)',
				);
			} finally {
				global.fetch = originalFetch;
			}

			expect(mockedRefresh.mock.instances[0].start).toHaveBeenCalled();
			expect(mockedRefresh.mock.instances[0].stop).not.toHaveBeenCalled();
			expect(mockedRefresh.mock.instances[0].setFetchedStatus).not.toHaveBeenCalled();
			expect(mockedFeatureGateDB.mock.instances[0].setExperimentValues).not.toHaveBeenCalled();
			expect(mockApplyUpdate).not.toHaveBeenCalled();
		});

		test.each([429, 503])('keeps polling after a %s', async (status) => {
			mockedFetcher.fetchEvalFlags.mockRejectedValue(
				new ResponseError('Non 2xx response status received', status, '{}'),
			);

			await expect(provider.getExperimentValues()).rejects.toThrow();

			expect(mockedRefresh.mock.instances[0].start).toHaveBeenCalled();
			expect(mockedRefresh.mock.instances[0].stop).not.toHaveBeenCalled();
		});

		test('reports the status of values broadcast by another tab', () => {
			provider['featureGateUpdateBroadcastHandler']({
				profileHash: expectedProfileHash,
				evalFlagsResponse: {
					...mockExperimentValuesResponse,
					status: { statsig: 'OK', ffp: 'OK' },
				},
				timestamp: mockCurrentDate,
			});

			expect(mockedRefresh.mock.instances[0].setFetchedStatus).toHaveBeenCalledWith({
				statsig: 'OK',
				ffp: 'OK',
			});
		});
	});
});
