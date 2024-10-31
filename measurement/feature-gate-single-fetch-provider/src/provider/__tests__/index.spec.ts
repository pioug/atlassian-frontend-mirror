import Fetcher from '@atlaskit/feature-gate-fetcher';
import {
	type BaseClientOptions,
	type CustomAttributes,
	FeatureGateEnvironment,
	type Identifiers,
	type OptionsWithDefaults,
	PerimeterType,
} from '@atlaskit/feature-gate-js-client';

import SingleFetchProvider, { type ProviderOptions } from '../index';

jest.mock('@atlaskit/feature-gate-fetcher', () => ({
	...jest.requireActual('@atlaskit/feature-gate-fetcher'),
	fetchExperimentValues: jest.fn(),
	fetchClientSdkKey: jest.fn(),
}));

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
		mockedFetcher.fetchClientSdkKey.mockResolvedValue({ clientSdkKey: mockClientSdkKey });
		provider = new SingleFetchProvider(providerOptions);
		provider.setClientVersion(mockClientVersion);
	});

	afterEach(() => {
		jest.resetAllMocks();
		jest.clearAllMocks();
	});

	describe('getExperimentValues', function () {
		test('successfully', async () => {
			provider.setProfile(mockClientOptions, mockIdentifiers, mockCustomAttributes);

			await expect(provider.getExperimentValues()).resolves.toStrictEqual({
				experimentValues: mockExperimentValues,
				customAttributesFromFetch: mockCustomAttributesFromFetch,
				clientSdkKey: mockClientSdkKey,
			});
			await expect(mockedFetcher.fetchExperimentValues).toHaveBeenCalledWith(
				mockClientVersion,
				{
					apiKey: '123',
					environment: 'development',
					perimeter: 'commercial',
					fetchTimeoutMs: 12,
					targetApp: 'targetApp_web',
					useGatewayURL: true,
				},
				mockIdentifiers,
				mockCustomAttributes,
			);
		});

		test('error thrown when fetch rejects', async () => {
			provider.setProfile(mockClientOptions, mockIdentifiers, mockCustomAttributes);

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
					perimeter: 'commercial',
					fetchTimeoutMs: 12,
					targetApp: 'targetApp_web',
					useGatewayURL: true,
				},
				mockIdentifiers,
				mockCustomAttributes,
			);
		});

		test('error thrown when clientVersion is not set', async () => {
			provider['clientVersion'] = undefined;
			provider.setProfile(mockClientOptions, mockIdentifiers, mockCustomAttributes);

			await expect(provider.getExperimentValues()).rejects.toThrow(
				'Client version has not been set',
			);
		});

		test('error thrown when profile is not set', async () => {
			await expect(provider.getExperimentValues()).rejects.toThrow('Profile has not been set');
		});
	});

	describe('getClientSdkKey', function () {
		test('successfully', async () => {
			provider.setProfile(mockClientOptions, mockIdentifiers, mockCustomAttributes);

			await expect(provider.getClientSdkKey()).resolves.toBe(mockClientSdkKey);
			await expect(mockedFetcher.fetchClientSdkKey).toHaveBeenCalledWith(mockClientVersion, {
				apiKey: '123',
				environment: 'development',
				perimeter: 'commercial',
				fetchTimeoutMs: 12,
				targetApp: 'targetApp_web',
				useGatewayURL: true,
			});
		});

		test('error thrown when fetch rejects', async () => {
			provider.setProfile(mockClientOptions, mockIdentifiers, mockCustomAttributes);

			mockedFetcher.fetchClientSdkKey.mockRejectedValue(
				new Error('failed to fetch client sdk key'),
			);

			await expect(provider.getClientSdkKey()).rejects.toThrow('failed to fetch client sdk key');
			await expect(mockedFetcher.fetchClientSdkKey).toHaveBeenCalledWith(mockClientVersion, {
				apiKey: '123',
				environment: 'development',
				perimeter: 'commercial',
				fetchTimeoutMs: 12,
				targetApp: 'targetApp_web',
				useGatewayURL: true,
			});
		});

		test('error thrown when clientVersion is not set', async () => {
			provider['clientVersion'] = undefined;
			provider.setProfile(mockClientOptions, mockIdentifiers, mockCustomAttributes);

			await expect(provider.getClientSdkKey()).rejects.toThrow('Client version has not been set');
		});

		test('error thrown when profile is not set', async () => {
			await expect(provider.getClientSdkKey()).rejects.toThrow('Profile has not been set');
		});
	});

	describe('getApiKey', () => {
		test('get api key from provider options', () => {
			expect(provider.getApiKey()).toBe(providerOptions.apiKey);
		});
	});
});
