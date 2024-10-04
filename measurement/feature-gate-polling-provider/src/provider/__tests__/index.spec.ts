import Fetcher, {
	type ClientOptions,
	type CustomAttributes,
	FeatureGateEnvironment,
	type FrontendExperimentsResponse,
	type FrontendExperimentsResult,
	type Identifiers,
} from '@atlaskit/feature-gate-fetcher';

import Broadcast from '../../Broadcast';
import FeatureGatesDB from '../../database/FeatureGatesDB';
import { type ExperiemntValuesEntry } from '../../database/types';
import PollingProvider, {
	EXPERIMENT_VALUES_STALE_TIMEOUT_MS,
	type ProviderOptions,
} from '../index';
import Refresh from '../Refresh';
import { type FeatureGateState } from '../types';
import { getFrontendExperimentsResult } from '../utils';

jest.mock('@atlaskit/feature-gate-fetcher', () => ({
	...jest.requireActual('@atlaskit/feature-gate-fetcher'),
	fetchExperimentValues: jest.fn(),
	fetchClientSdk: jest.fn(),
}));

jest.mock('../../Broadcast');
jest.mock('../Refresh');
jest.mock('../../database/FeatureGatesDB');

const mockClientSdkKey = 'mock-client-sdk-key';
const mockCustomAttributesFromFetch = { attributes: '1234' };
const mockExperimentValues = {
	value: '12345',
};

const mockClientOptions: ClientOptions = {
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
	pollingInterval: 30,
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

const getMockEVEntry = (timestamp: number): ExperiemntValuesEntry => ({
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
	const mockApplyUpdate = jest.fn();
	let provider: PollingProvider;
	const RealDate = Date.now;

	beforeEach(() => {
		// eslint-disable-next-line no-console
		console.warn = jest.fn();
		global.Date.now = jest.fn(() => mockCurrentDate);
		mockedFetcher.fetchExperimentValues.mockResolvedValue(mockExperimentValuesResponse);
		mockedFetcher.fetchClientSdk.mockResolvedValue({ clientSdkKey: mockClientSdkKey });
		provider = new PollingProvider(providerOptions);
		provider.setApplyUpdateCallback(mockApplyUpdate);
		provider.setClientVersion(mockClientVersion);
		mockedFeatureGateDB = jest.mocked(FeatureGatesDB);
	});

	afterEach(() => {
		global.Date.now = RealDate;
		jest.resetAllMocks();
		jest.clearAllMocks();
	});

	describe('getExperimentValues', function () {
		test('get values from fetch when db does not have entry', async () => {
			mockedFeatureGateDB.mock.instances[0].getExperimentValues = jest.fn().mockResolvedValue(null);
			await expect(
				provider.getExperimentValues(mockClientOptions, mockIdentifiers, mockCustomAttributes),
			).resolves.toStrictEqual(expectedExperimentValuesResult);
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

			await expect(mockedRefresh.mock.instances[0].stop).toHaveBeenCalled();
			await expect(mockedRefresh.mock.instances[0].updateProfile).toHaveBeenCalledWith(
				expectedProfileHash,
				expectedRulesetProfile,
				0,
			);
			await expect(mockedRefresh.mock.instances[0].start).toHaveBeenCalled();

			await expect(mockedBroadcast.mock.instances[0].updateUserContext).toHaveBeenCalledWith(
				expectedProfileHash,
			);

			const expectedFGState: ExperiemntValuesEntry = {
				profileHash: expectedProfileHash,
				rulesetProfile: expectedRulesetProfile,
				experimentValuesResponse: mockExperimentValuesResponse,
				timestamp: mockCurrentDate,
			};

			await expect(mockedBroadcast.mock.instances[0].sendFeatureGateState).toHaveBeenCalledWith(
				expectedFGState,
			);

			await expect(mockApplyUpdate).toHaveBeenCalledWith(expectedExperimentValuesResult);

			await expect(mockedRefresh.mock.instances[0].setTimestamp).toHaveBeenCalledWith(
				mockCurrentDate,
			);

			await expect(mockedFeatureGateDB.mock.instances[0].setExperimentValues).toHaveBeenCalledWith(
				expectedFGState,
			);

			expect(provider['currentProfileHash']).toBe(expectedProfileHash);
			expect(provider['lastUpdatedTimestamp']).toBe(mockCurrentDate);
		});

		test('error thrown when db does not have entry and fetch rejects', async () => {
			mockedFeatureGateDB.mock.instances[0].getExperimentValues = jest.fn().mockResolvedValue(null);
			mockedFetcher.fetchExperimentValues.mockRejectedValue(
				new Error('failed to fetch experiment values'),
			);

			await expect(
				provider.getExperimentValues(mockClientOptions, mockIdentifiers, mockCustomAttributes),
			).rejects.toThrow('failed to fetch experiment values');
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

			await expect(mockedRefresh.mock.instances[0].stop).toHaveBeenCalled();
			await expect(mockedRefresh.mock.instances[0].updateProfile).toHaveBeenCalledWith(
				expectedProfileHash,
				expectedRulesetProfile,
				0,
			);
			await expect(mockedRefresh.mock.instances[0].start).toHaveBeenCalled();

			await expect(mockedBroadcast.mock.instances[0].updateUserContext).toHaveBeenCalledWith(
				expectedProfileHash,
			);

			await expect(mockedBroadcast.mock.instances[0].sendFeatureGateState).toHaveBeenCalledTimes(0);
			await expect(mockApplyUpdate).toHaveBeenCalledTimes(0);
			await expect(mockedRefresh.mock.instances[0].setTimestamp).toHaveBeenCalledTimes(0);
			await expect(mockedFeatureGateDB.mock.instances[0].setExperimentValues).toHaveBeenCalledTimes(
				0,
			);

			expect(provider['currentProfileHash']).toBe(expectedProfileHash);
			expect(provider['lastUpdatedTimestamp']).toBe(0);
		});

		test('get values from fetch when db has fresh entry', async () => {
			const dbEntryTimestamp = mockCurrentDate - 10;
			const mockDBEntry = getMockEVEntry(dbEntryTimestamp);

			const experimentValuesFromDB = {
				value: 'value-from-db',
			};

			mockDBEntry.experimentValuesResponse.experimentValues = experimentValuesFromDB;

			mockedFeatureGateDB.mock.instances[0].getExperimentValues = jest
				.fn()
				.mockResolvedValue(mockDBEntry);
			await expect(
				provider.getExperimentValues(mockClientOptions, mockIdentifiers, mockCustomAttributes),
			).resolves.toStrictEqual(getFrontendExperimentsResult(mockDBEntry.experimentValuesResponse));

			await new Promise(process.nextTick);

			await expect(mockedFetcher.fetchExperimentValues).toHaveBeenCalledTimes(0);
			await expect(mockedFeatureGateDB.mock.instances[0].setExperimentValues).toHaveBeenCalledTimes(
				0,
			);

			await expect(mockedRefresh.mock.instances[0].stop).toHaveBeenCalled();
			await expect(mockedRefresh.mock.instances[0].updateProfile).toHaveBeenCalledWith(
				expectedProfileHash,
				expectedRulesetProfile,
				dbEntryTimestamp,
			);
			await expect(mockedRefresh.mock.instances[0].start).toHaveBeenCalled();

			await expect(mockedBroadcast.mock.instances[0].updateUserContext).toHaveBeenCalledWith(
				expectedProfileHash,
			);

			await expect(mockedBroadcast.mock.instances[0].sendFeatureGateState).toHaveBeenCalledTimes(0);
			await expect(mockApplyUpdate).toHaveBeenCalledTimes(0);
			await expect(mockedRefresh.mock.instances[0].setTimestamp).toHaveBeenCalledTimes(0);
			await expect(mockedFeatureGateDB.mock.instances[0].setExperimentValues).toHaveBeenCalledTimes(
				0,
			);

			expect(provider['currentProfileHash']).toBe(expectedProfileHash);
			expect(provider['lastUpdatedTimestamp']).toBe(dbEntryTimestamp);
		});

		test('Does not update when apply update has not been set', async () => {
			provider['applyUpdate'] = undefined;

			await expect(
				provider.getExperimentValues(mockClientOptions, mockIdentifiers, mockCustomAttributes),
			).resolves.toStrictEqual(expectedExperimentValuesResult);
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

			await new Promise(process.nextTick);

			// eslint-disable-next-line no-console
			expect(console.warn).toHaveBeenCalledWith(
				'No apply update callback has been set. Cannot update experiment values.',
			);

			await expect(mockedRefresh.mock.instances[0].stop).toHaveBeenCalled();
			await expect(mockedRefresh.mock.instances[0].updateProfile).toHaveBeenCalledWith(
				expectedProfileHash,
				expectedRulesetProfile,
				0,
			);
			await expect(mockedRefresh.mock.instances[0].start).toHaveBeenCalled();

			await expect(mockedBroadcast.mock.instances[0].updateUserContext).toHaveBeenCalledWith(
				expectedProfileHash,
			);

			const expectedFGState: ExperiemntValuesEntry = {
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

			await expect(mockedFeatureGateDB.mock.instances[0].setExperimentValues).toHaveBeenCalledWith(
				expectedFGState,
			);

			expect(provider['currentProfileHash']).toBe(expectedProfileHash);
			expect(provider['lastUpdatedTimestamp']).toBe(mockCurrentDate);
		});

		test('triggers values refetch when stale data is retrieved from the db', async () => {
			const staleDbEntryTimestamp = mockCurrentDate - (EXPERIMENT_VALUES_STALE_TIMEOUT_MS + 100);

			const mockDBEntry = getMockEVEntry(staleDbEntryTimestamp);

			const experimentValuesFromDB = {
				value: 'value-from-db',
			};

			mockDBEntry.experimentValuesResponse.experimentValues = experimentValuesFromDB;

			mockedFeatureGateDB.mock.instances[0].getExperimentValues = jest
				.fn()
				.mockResolvedValue(mockDBEntry);
			await expect(
				provider.getExperimentValues(mockClientOptions, mockIdentifiers, mockCustomAttributes),
			).resolves.toStrictEqual(getFrontendExperimentsResult(mockDBEntry.experimentValuesResponse));

			await new Promise(process.nextTick);

			await expect(mockedFetcher.fetchExperimentValues).toHaveBeenCalledTimes(0);
			await expect(mockedFeatureGateDB.mock.instances[0].setExperimentValues).toHaveBeenCalledTimes(
				0,
			);

			await expect(mockedRefresh.mock.instances[0].stop).toHaveBeenCalled();
			await expect(mockedRefresh.mock.instances[0].updateProfile).toHaveBeenCalledWith(
				expectedProfileHash,
				expectedRulesetProfile,
				0,
			);
			await expect(mockedRefresh.mock.instances[0].start).toHaveBeenCalled();

			await expect(mockedBroadcast.mock.instances[0].updateUserContext).toHaveBeenCalledWith(
				expectedProfileHash,
			);

			await expect(mockedBroadcast.mock.instances[0].sendFeatureGateState).toHaveBeenCalledTimes(0);
			await expect(mockApplyUpdate).toHaveBeenCalledTimes(0);
			await expect(mockedRefresh.mock.instances[0].setTimestamp).toHaveBeenCalledTimes(0);
			await expect(mockedFeatureGateDB.mock.instances[0].setExperimentValues).toHaveBeenCalledTimes(
				0,
			);

			expect(provider['currentProfileHash']).toBe(expectedProfileHash);
			expect(provider['lastUpdatedTimestamp']).toBe(staleDbEntryTimestamp);
		});

		test('get values from fetch when db has not been initialised', async () => {
			mockedFeatureGateDB.mockImplementation(() => {
				throw new Error('Error starting indexDB db');
			});

			const newProvider = new PollingProvider(providerOptions);
			newProvider.setClientVersion(mockClientVersion);
			newProvider.setApplyUpdateCallback(mockApplyUpdate);

			// eslint-disable-next-line no-console
			expect(console.warn).toHaveBeenCalledWith('Error when trying to start DB, {}');

			await expect(
				newProvider.getExperimentValues(mockClientOptions, mockIdentifiers, mockCustomAttributes),
			).resolves.toStrictEqual({
				experimentValues: mockExperimentValues,
				customAttributesFromFetch: mockCustomAttributesFromFetch,
				clientSdkKey: undefined,
			});
			await expect(mockedRefresh.mock.instances[1].stop).toHaveBeenCalled();
			await expect(mockedRefresh.mock.instances[1].updateProfile).toHaveBeenCalledWith(
				expectedProfileHash,
				expectedRulesetProfile,
				0,
			);
			await expect(mockedRefresh.mock.instances[1].start).toHaveBeenCalled();

			await expect(mockedBroadcast.mock.instances[1].updateUserContext).toHaveBeenCalledWith(
				expectedProfileHash,
			);

			const expectedFGState: ExperiemntValuesEntry = {
				profileHash: expectedProfileHash,
				rulesetProfile: expectedRulesetProfile,
				experimentValuesResponse: mockExperimentValuesResponse,
				timestamp: mockCurrentDate,
			};

			await expect(mockedBroadcast.mock.instances[1].sendFeatureGateState).toHaveBeenCalledWith(
				expectedFGState,
			);

			await expect(mockApplyUpdate).toHaveBeenCalledWith(expectedExperimentValuesResult);

			await expect(mockedRefresh.mock.instances[1].setTimestamp).toHaveBeenCalledWith(
				mockCurrentDate,
			);

			await expect(mockedFeatureGateDB.mock.instances[1].setExperimentValues).toHaveBeenCalledTimes(
				0,
			);

			expect(newProvider['currentProfileHash']).toBe(expectedProfileHash);
			expect(newProvider['lastUpdatedTimestamp']).toBe(mockCurrentDate);
		});
	});

	describe('getClientSdkKey', function () {
		test('get sdk key from fetch when db does not have entry', async () => {
			mockedFeatureGateDB.mock.instances[0].getClientSdkKey = jest.fn().mockResolvedValue(null);

			await expect(provider.getClientSdkKey(mockClientOptions)).resolves.toBe(mockClientSdkKey);

			await new Promise(process.nextTick);

			await expect(mockedFetcher.fetchClientSdk).toHaveBeenCalledWith(mockClientVersion, {
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
			mockedFeatureGateDB.mock.instances[0].getClientSdkKey = jest.fn().mockResolvedValue(null);

			mockedFetcher.fetchClientSdk.mockRejectedValue(new Error('failed to fetch client sdk key'));

			await expect(provider.getClientSdkKey(mockClientOptions)).rejects.toThrow(
				'failed to fetch client sdk key',
			);
			await expect(mockedFetcher.fetchClientSdk).toHaveBeenCalledWith(mockClientVersion, {
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
			const mockDBEntry = {
				clientSdkKey: mockClientSdkKey + 'FromDB',
				targetApp: mockClientOptions.targetApp,
				timestamp: mockCurrentDate,
			};

			mockedFeatureGateDB.mock.instances[0].getClientSdkKey = jest
				.fn()
				.mockResolvedValue(mockDBEntry);

			await expect(provider.getClientSdkKey(mockClientOptions)).resolves.toBe(
				mockDBEntry.clientSdkKey,
			);

			await new Promise(process.nextTick);

			await expect(mockedFetcher.fetchClientSdk).toHaveBeenCalledTimes(0);
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

			// eslint-disable-next-line no-console
			expect(console.warn).toHaveBeenCalledWith('Error when trying to start DB, {}');

			await expect(newProvider.getClientSdkKey(mockClientOptions)).resolves.toBe(mockClientSdkKey);

			await new Promise(process.nextTick);

			await expect(mockedFetcher.fetchClientSdk).toHaveBeenCalledWith(mockClientVersion, {
				apiKey: '123',
				environment: 'development',
				fetchTimeoutMs: 15,
				targetApp: 'targetApp_web',
				useGatewayURL: true,
			});

			await expect(mockedFeatureGateDB.mock.instances[1].getClientSdkKey).toHaveBeenCalledTimes(0);
			await expect(mockedFeatureGateDB.mock.instances[1].setClientSdkKey).toHaveBeenCalledTimes(0);
		});
	});

	describe('getApiKey', () => {
		test('get api key from provider options', () => {
			expect(provider.getApiKey()).toBe(providerOptions.apiKey);
		});
	});

	describe('getProfileHashAndProfile', () => {
		test('get ', () => {
			expect(
				provider['getProfileHashAndProfile'](
					mockClientOptions,
					mockIdentifiers,
					mockCustomAttributes,
				),
			).toStrictEqual({
				profileHash: expectedProfileHash,
				rulesetProfile: expectedRulesetProfile,
			});
		});
	});

	describe('processFeatureGateUpdate', () => {
		test('update is not done when it is for a different profile hash ', async () => {
			const dbEntryTimestamp = mockCurrentDate - 10;
			const mockDBEntry = getMockEVEntry(dbEntryTimestamp);

			const experimentValuesFromDB = {
				value: 'value-from-db',
			};

			mockDBEntry.experimentValuesResponse.experimentValues = experimentValuesFromDB;

			mockedFeatureGateDB.mock.instances[0].getExperimentValues = jest
				.fn()
				.mockResolvedValue(mockDBEntry);

			// getExperimentValues returns fresh db entry values
			await expect(
				provider.getExperimentValues(mockClientOptions, mockIdentifiers, mockCustomAttributes),
			).resolves.toStrictEqual(getFrontendExperimentsResult(mockDBEntry.experimentValuesResponse));

			expect(provider['currentProfileHash']).toBe(expectedProfileHash);
			expect(provider['lastUpdatedTimestamp']).toBe(dbEntryTimestamp);

			await new Promise(process.nextTick);

			await expect(mockedFetcher.fetchExperimentValues).toHaveBeenCalledTimes(0);

			const mockFGState: FeatureGateState = {
				profileHash: 'different-profile-hash',
				experimentValuesResponse: mockExperimentValuesResponse,
				timestamp: mockCurrentDate,
			};

			// Update is not done when
			provider['processFeatureGateUpdate'](mockFGState);
		});
	});
});
