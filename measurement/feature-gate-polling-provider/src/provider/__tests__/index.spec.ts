import Fetcher, { type FrontendExperimentsResponse } from '@atlaskit/feature-gate-fetcher';
import {
	type BaseClientOptions,
	type CustomAttributes,
	FeatureGateEnvironment,
	type FrontendExperimentsResult,
	type Identifiers,
} from '@atlaskit/feature-gate-js-client';

import Broadcast from '../../Broadcast';
import FeatureGatesDB from '../../database/FeatureGatesDB';
import { type ExperimentValuesEntry } from '../../database/types';
import PollingProvider, { type ProviderOptions } from '../index';
import Refresh from '../Refresh';
import { type FeatureGateState } from '../types';
import { createHash, getFrontendExperimentsResult } from '../utils';

jest.mock('@atlaskit/feature-gate-fetcher', () => ({
	...jest.requireActual('@atlaskit/feature-gate-fetcher'),
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

const mockClientOptions: BaseClientOptions = {
	environment: FeatureGateEnvironment.Development,
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
};
const mockClientVersion = 'mockVersion';
const mockCurrentDate = 1727256325239;
const expectedProfileHash = 'v2.8e3c96eb13880fc945411b9300db02903a32b62d9af731c8c6b37207f2201289';
const expectedRulesetProfile = {
	customAttributes: mockCustomAttributes,
	identifiers: mockIdentifiers,
	environment: FeatureGateEnvironment.Development,
	targetApp: 'targetApp_web',
	perimeter: undefined,
};
const mockExperimentValuesResponse: FrontendExperimentsResponse = {
	experimentValues: mockExperimentValues,
	customAttributes: mockCustomAttributesFromFetch,
};
const expectedExperimentValuesResult: FrontendExperimentsResult = {
	experimentValues: mockExperimentValues,
	customAttributesFromFetch: mockCustomAttributesFromFetch,
	clientSdkKey: undefined,
};

const getMockEVEntry = (timestamp: number): ExperimentValuesEntry => ({
	profileHash: 'profileHash',
	rulesetProfile: {
		identifiers: mockIdentifiers,
		customAttributes: mockCustomAttributes,
		environment: mockClientOptions.environment,
		targetApp: mockClientOptions.targetApp,
	},
	experimentValuesResponse: {
		experimentValues: mockExperimentValues,
		customAttributes: mockCustomAttributesFromFetch,
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
		mockedFetcher.fetchExperimentValues.mockResolvedValue(mockExperimentValuesResponse);
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
			await expect(mockedFetcher.fetchExperimentValues).toHaveBeenCalledWith(
				mockClientVersion,
				{
					apiKey: '123',
					environment: 'development',
					fetchTimeoutMs: 15,
					targetApp: 'targetApp_web',
					useGatewayURL: true,
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
				fetchTimeoutMs: 15,
				targetApp: 'targetApp_web',
				useGatewayURL: true,
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
			await expect(mockedFetcher.fetchExperimentValues).toHaveBeenCalledWith(
				mockClientVersion,
				{
					apiKey: '123',
					environment: 'development',
					fetchTimeoutMs: 15,
					targetApp: 'targetApp_web',
					useGatewayURL: true,
				},
				mockIdentifiers,
				mockCustomAttributes,
			);

			const expectedFGState: ExperimentValuesEntry = {
				profileHash: expectedProfileHash,
				rulesetProfile: expectedRulesetProfile,
				experimentValuesResponse: mockExperimentValuesResponse,
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
			mockedFetcher.fetchExperimentValues.mockRejectedValue(
				new Error('failed to fetch experiment values'),
			);

			await expect(provider.getExperimentValues()).rejects.toThrow(
				'failed to fetch experiment values',
			);
			await expect(mockedFetcher.fetchExperimentValues).toHaveBeenCalledWith(
				mockClientVersion,
				{
					apiKey: '123',
					environment: 'development',
					fetchTimeoutMs: 15,
					targetApp: 'targetApp_web',
					useGatewayURL: true,
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

			mockDBEntry.experimentValuesResponse.experimentValues = experimentValuesFromDB;

			mockedFeatureGateDB.mock.instances[0].getExperimentValues = jest
				.fn()
				.mockResolvedValue(mockDBEntry);
			await expect(provider.getExperimentValues()).resolves.toStrictEqual(
				getFrontendExperimentsResult(mockDBEntry.experimentValuesResponse),
			);

			await new Promise(process.nextTick);

			await expect(mockedFetcher.fetchExperimentValues).toHaveBeenCalledTimes(0);
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

			await expect(newProvider.getExperimentValues()).resolves.toStrictEqual({
				experimentValues: mockExperimentValues,
				customAttributesFromFetch: mockCustomAttributesFromFetch,
				clientSdkKey: undefined,
			});

			const expectedFGState: ExperimentValuesEntry = {
				profileHash: expectedProfileHash,
				rulesetProfile: expectedRulesetProfile,
				experimentValuesResponse: mockExperimentValuesResponse,
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
				experimentValuesResponse: mockExperimentValuesResponse,
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
				experimentValuesResponse: mockExperimentValuesResponse,
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
});
