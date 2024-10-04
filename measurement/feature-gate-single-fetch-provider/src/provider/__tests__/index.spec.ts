import Fetcher, {
	type ClientOptions,
	type CustomAttributes,
	FeatureGateEnvironment,
	type Identifiers,
} from '@atlaskit/feature-gate-fetcher';

import SingleFetchProvider, { type ProviderOptions } from '../index';

jest.mock('@atlaskit/feature-gate-fetcher', () => ({
	...jest.requireActual('@atlaskit/feature-gate-fetcher'),
	fetchExperimentValues: jest.fn(),
	fetchClientSdk: jest.fn(),
}));

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
	fetchTimeoutMs: 12,
	useGatewayURL: true,
};
const mockClientVersion = 'mockVersion';

describe('SingeFetchProvider', () => {
	const mockedFetcher = jest.mocked(Fetcher);
	let provider: SingleFetchProvider;

	beforeEach(() => {
		mockedFetcher.fetchExperimentValues.mockResolvedValue({
			experimentValues: mockExperimentValues,
			customAttributes: mockCustomAttributesFromFetch,
			clientSdkKey: mockClientSdkKey,
		});
		mockedFetcher.fetchClientSdk.mockResolvedValue({ clientSdkKey: mockClientSdkKey });
		provider = new SingleFetchProvider(providerOptions);
		provider.setClientVersion(mockClientVersion);
	});

	afterEach(() => {
		jest.resetAllMocks();
		jest.clearAllMocks();
	});

	describe('getExperimentValues', function () {
		test('successfully', async () => {
			await expect(
				provider.getExperimentValues(mockClientOptions, mockIdentifiers, mockCustomAttributes),
			).resolves.toStrictEqual({
				experimentValues: mockExperimentValues,
				customAttributesFromFetch: mockCustomAttributesFromFetch,
				clientSdkKey: mockClientSdkKey,
			});
			await expect(mockedFetcher.fetchExperimentValues).toHaveBeenCalledWith(
				mockClientVersion,
				{
					apiKey: '123',
					environment: 'development',
					fetchTimeoutMs: 12,
					targetApp: 'targetApp_web',
					useGatewayURL: true,
				},
				mockIdentifiers,
				mockCustomAttributes,
			);
		});

		test('error thrown when fetch rejects', async () => {
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
					fetchTimeoutMs: 12,
					targetApp: 'targetApp_web',
					useGatewayURL: true,
				},
				mockIdentifiers,
				mockCustomAttributes,
			);
		});
	});

	describe('getClientSdkKey', function () {
		test('successfully', async () => {
			await expect(provider.getClientSdkKey(mockClientOptions)).resolves.toBe(mockClientSdkKey);
			await expect(mockedFetcher.fetchClientSdk).toHaveBeenCalledWith(mockClientVersion, {
				apiKey: '123',
				environment: 'development',
				fetchTimeoutMs: 12,
				targetApp: 'targetApp_web',
				useGatewayURL: true,
			});
		});

		test('error thrown when fetch rejects', async () => {
			mockedFetcher.fetchClientSdk.mockRejectedValue(new Error('failed to fetch client sdk key'));

			await expect(provider.getClientSdkKey(mockClientOptions)).rejects.toThrow(
				'failed to fetch client sdk key',
			);
			await expect(mockedFetcher.fetchClientSdk).toHaveBeenCalledWith(mockClientVersion, {
				apiKey: '123',
				environment: 'development',
				fetchTimeoutMs: 12,
				targetApp: 'targetApp_web',
				useGatewayURL: true,
			});
		});
	});

	describe('getApiKey', () => {
		test('get api key from provider options', () => {
			expect(provider.getApiKey()).toBe(providerOptions.apiKey);
		});
	});
});
