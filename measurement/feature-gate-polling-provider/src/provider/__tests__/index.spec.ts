import Fetcher, {
	type ClientOptions,
	type CustomAttributes,
	FeatureGateEnvironment,
	type Identifiers,
} from '@atlaskit/feature-gate-fetcher';

import FeatureGatesDB from '../../database/FeatureGatesDB';
import { type ExperiemntValuesEntry } from '../../database/types';
import PollingProvider, {
	EXPERIMENT_VALUES_STALE_TIMEOUT_MS,
	type ProviderOptions,
} from '../index';

jest.mock('@atlaskit/feature-gate-fetcher', () => ({
	...jest.requireActual('@atlaskit/feature-gate-fetcher'),
	fetchExperimentValues: jest.fn(),
	fetchClientSdk: jest.fn(),
}));

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
	readyTimeoutInMilliseconds: 15,
	pollingInterval: 30,
	useGatewayURL: true,
};
const mockClientVersion = 'mockVersion';
const mockCurrentDate = 1727256325239;

const getMockEVEntry = (timestamp: number): ExperiemntValuesEntry => ({
	profileHash: 'profileHash',
	context: {
		identifiers: mockIdentifiers,
		customAttributes: mockCustomAttributes,
		environment: mockClientOptions.environment,
		targetApp: mockClientOptions.targetApp,
	},
	experimentValues: {
		experimentValues: mockExperimentValues,
		customAttributesFromFetch: mockCustomAttributesFromFetch,
	},
	timestamp,
});

describe('PollingProvider', () => {
	const mockedFetcher = jest.mocked(Fetcher);
	let mockedFeatureGateDB = jest.mocked(FeatureGatesDB);
	const mockApplyUpdate = jest.fn();
	let provider: PollingProvider;
	const RealDate = Date.now;

	beforeEach(() => {
		// eslint-disable-next-line no-console
		console.warn = jest.fn();
		global.Date.now = jest.fn(() => mockCurrentDate);
		mockedFetcher.fetchExperimentValues.mockResolvedValue({
			experimentValues: mockExperimentValues,
			customAttributes: mockCustomAttributesFromFetch,
		});
		mockedFetcher.fetchClientSdk.mockResolvedValue({ clientSdkKey: mockClientSdkKey });
		provider = new PollingProvider(providerOptions);
		provider.setApplyUpdateCallback(mockApplyUpdate);
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
				provider.getExperimentValues(
					mockClientVersion,
					mockClientOptions,
					mockIdentifiers,
					mockCustomAttributes,
				),
			).resolves.toStrictEqual({
				experimentValues: mockExperimentValues,
				customAttributesFromFetch: mockCustomAttributesFromFetch,
				clientSdkKey: undefined,
			});
			await expect(mockedFetcher.fetchExperimentValues).toHaveBeenCalledWith(
				mockClientVersion,
				{
					apiKey: '123',
					environment: 'development',
					readyTimeoutInMilliseconds: 15,
					pollingInterval: 30,
					targetApp: 'targetApp_web',
					useGatewayURL: true,
				},
				mockIdentifiers,
				mockCustomAttributes,
			);
		});

		test('error thrown when db does not have entry and fetch rejects', async () => {
			mockedFeatureGateDB.mock.instances[0].getExperimentValues = jest.fn().mockResolvedValue(null);
			mockedFetcher.fetchExperimentValues.mockRejectedValue(
				new Error('failed to fetch experiment values'),
			);

			await expect(
				provider.getExperimentValues(
					mockClientVersion,
					mockClientOptions,
					mockIdentifiers,
					mockCustomAttributes,
				),
			).rejects.toThrow('failed to fetch experiment values');
			await expect(mockedFetcher.fetchExperimentValues).toHaveBeenCalledWith(
				mockClientVersion,
				{
					apiKey: '123',
					environment: 'development',
					readyTimeoutInMilliseconds: 15,
					pollingInterval: 30,
					targetApp: 'targetApp_web',
					useGatewayURL: true,
				},
				mockIdentifiers,
				mockCustomAttributes,
			);
		});

		test('get values from fetch when db has fresh entry', async () => {
			const mockDBEntry = getMockEVEntry(mockCurrentDate);

			const experimentValuesFromDB = {
				value: 'value-from-db',
			};

			mockDBEntry.experimentValues.experimentValues = experimentValuesFromDB;

			mockedFeatureGateDB.mock.instances[0].getExperimentValues = jest
				.fn()
				.mockResolvedValue(mockDBEntry);
			await expect(
				provider.getExperimentValues(
					mockClientVersion,
					mockClientOptions,
					mockIdentifiers,
					mockCustomAttributes,
				),
			).resolves.toStrictEqual(mockDBEntry.experimentValues);

			await new Promise(process.nextTick);

			await expect(mockedFetcher.fetchExperimentValues).toHaveBeenCalledTimes(0);
			await expect(mockedFeatureGateDB.mock.instances[0].setExperimentValues).toHaveBeenCalledTimes(
				0,
			);
		});

		test('does not trigger refresh after db entry is found when apply update has not been set', async () => {
			provider['applyUpdate'] = undefined;

			const mockDBEntry = getMockEVEntry(
				mockCurrentDate - (EXPERIMENT_VALUES_STALE_TIMEOUT_MS + 100),
			);

			const experimentValuesFromDB = {
				value: 'value-from-db',
			};

			mockDBEntry.experimentValues.experimentValues = experimentValuesFromDB;

			mockedFeatureGateDB.mock.instances[0].getExperimentValues = jest
				.fn()
				.mockResolvedValue(mockDBEntry);
			await expect(
				provider.getExperimentValues(
					mockClientVersion,
					mockClientOptions,
					mockIdentifiers,
					mockCustomAttributes,
				),
			).resolves.toStrictEqual(mockDBEntry.experimentValues);

			await new Promise(process.nextTick);

			// eslint-disable-next-line no-console
			expect(console.warn).toHaveBeenCalledWith(
				'No apply update callback has been set. Cannot update experiment values.',
			);

			await expect(mockedFetcher.fetchExperimentValues).toHaveBeenCalledTimes(0);
			await expect(mockedFeatureGateDB.mock.instances[0].setExperimentValues).toHaveBeenCalledTimes(
				0,
			);
			await expect(mockApplyUpdate).toHaveBeenCalledTimes(0);
		});

		test('triggers values refetch when stale data is retrieved from the db', async () => {
			const mockDBEntry = getMockEVEntry(
				mockCurrentDate - (EXPERIMENT_VALUES_STALE_TIMEOUT_MS + 100),
			);

			const experimentValuesFromDB = {
				value: 'value-from-db',
			};

			mockDBEntry.experimentValues.experimentValues = experimentValuesFromDB;

			mockedFeatureGateDB.mock.instances[0].getExperimentValues = jest
				.fn()
				.mockResolvedValue(mockDBEntry);
			await expect(
				provider.getExperimentValues(
					mockClientVersion,
					mockClientOptions,
					mockIdentifiers,
					mockCustomAttributes,
				),
			).resolves.toStrictEqual(mockDBEntry.experimentValues);

			await new Promise(process.nextTick);

			await expect(mockedFetcher.fetchExperimentValues).toHaveBeenCalledWith(
				mockClientVersion,
				{
					apiKey: '123',
					environment: 'development',
					readyTimeoutInMilliseconds: 15,
					pollingInterval: 30,
					targetApp: 'targetApp_web',
					useGatewayURL: true,
					perimeter: undefined,
				},
				mockIdentifiers,
				mockCustomAttributes,
			);

			const expectedSetDBEntry = getMockEVEntry(mockCurrentDate);
			expectedSetDBEntry.profileHash =
				'8e3c96eb13880fc945411b9300db02903a32b62d9af731c8c6b37207f2201289';
			await expect(mockedFeatureGateDB.mock.instances[0].setExperimentValues).toHaveBeenCalledWith(
				expectedSetDBEntry,
			);
			await expect(mockApplyUpdate).toHaveBeenCalledWith(expectedSetDBEntry.experimentValues);
		});

		test('get values from fetch when db has not been initialised', async () => {
			mockedFeatureGateDB = jest.fn().mockRejectedValue(new Error('Error starting indexDB db'));

			const newProvider = new PollingProvider(providerOptions);
			await expect(
				newProvider.getExperimentValues(
					mockClientVersion,
					mockClientOptions,
					mockIdentifiers,
					mockCustomAttributes,
				),
			).resolves.toStrictEqual({
				experimentValues: mockExperimentValues,
				customAttributesFromFetch: mockCustomAttributesFromFetch,
				clientSdkKey: undefined,
			});
			await expect(mockedFetcher.fetchExperimentValues).toHaveBeenCalledWith(
				mockClientVersion,
				{
					apiKey: '123',
					environment: 'development',
					readyTimeoutInMilliseconds: 15,
					pollingInterval: 30,
					targetApp: 'targetApp_web',
					useGatewayURL: true,
				},
				mockIdentifiers,
				mockCustomAttributes,
			);
		});
	});

	describe('getClientSdkKey', function () {
		test('get sdk key from fetch when db does not have entry', async () => {
			mockedFeatureGateDB.mock.instances[0].getClientSdkKey = jest.fn().mockResolvedValue(null);

			await expect(provider.getClientSdkKey(mockClientVersion, mockClientOptions)).resolves.toBe(
				mockClientSdkKey,
			);

			await new Promise(process.nextTick);

			await expect(mockedFetcher.fetchClientSdk).toHaveBeenCalledWith(mockClientVersion, {
				apiKey: '123',
				environment: 'development',
				readyTimeoutInMilliseconds: 15,
				pollingInterval: 30,
				targetApp: 'targetApp_web',
				useGatewayURL: true,
			});

			await expect(mockedFeatureGateDB.mock.instances[0].setClientSdkKey).toHaveBeenCalledWith({
				clientSdkKey: mockClientSdkKey,
				targetApp: mockClientOptions.targetApp,
				timestamp: mockCurrentDate,
			});
		});

		test('error thrown when db does not have entry and fetch rejects', async () => {
			mockedFeatureGateDB.mock.instances[0].getClientSdkKey = jest.fn().mockResolvedValue(null);

			mockedFetcher.fetchClientSdk.mockRejectedValue(new Error('failed to fetch client sdk key'));

			await expect(provider.getClientSdkKey(mockClientVersion, mockClientOptions)).rejects.toThrow(
				'failed to fetch client sdk key',
			);
			await expect(mockedFetcher.fetchClientSdk).toHaveBeenCalledWith(mockClientVersion, {
				apiKey: '123',
				environment: 'development',
				readyTimeoutInMilliseconds: 15,
				pollingInterval: 30,
				targetApp: 'targetApp_web',
				useGatewayURL: true,
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

			await expect(provider.getClientSdkKey(mockClientVersion, mockClientOptions)).resolves.toBe(
				mockDBEntry.clientSdkKey,
			);

			await new Promise(process.nextTick);

			await expect(mockedFetcher.fetchClientSdk).toHaveBeenCalledTimes(0);
			await expect(mockedFeatureGateDB.mock.instances[0].setClientSdkKey).toHaveBeenCalledTimes(0);
		});

		test('get sdk key from fetch when db has not been initialised', async () => {
			const mockDBEntry = {
				clientSdkKey: mockClientSdkKey + 'FromDB',
				targetApp: mockClientOptions.targetApp,
				timestamp: mockCurrentDate,
			};

			mockedFeatureGateDB.mock.instances[0].getClientSdkKey = jest
				.fn()
				.mockResolvedValue(mockDBEntry);

			mockedFeatureGateDB = jest.fn().mockRejectedValue(new Error('Error starting indexDB db'));

			const newProvider = new PollingProvider(providerOptions);

			await expect(newProvider.getClientSdkKey(mockClientVersion, mockClientOptions)).resolves.toBe(
				mockClientSdkKey,
			);
		});
	});

	describe('getApiKey', () => {
		test('get api key from provider options', () => {
			expect(provider.getApiKey()).toBe(providerOptions.apiKey);
		});
	});
});
