import fetchMock from 'jest-fetch-mock';

import Fetcher from '@atlaskit/feature-gate-fetcher/Fetcher';
import {
	type BaseClientOptions,
	type CustomAttributes,
	FeatureGateEnvironment,
	type Identifiers,
	type OptionsWithDefaults,
	PerimeterType,
} from '@atlaskit/feature-gate-js-client/types';

import SingleFetchProvider, { type ProviderOptions } from '../index';

jest.mock('@atlaskit/feature-gate-fetcher/Fetcher', () => ({
	...jest.requireActual('@atlaskit/feature-gate-fetcher/Fetcher'),
	__esModule: true,
	default: {
		fetchEvalFlags: jest.fn(),
		fetchExperimentValues: jest.fn(),
		fetchClientSdkKey: jest.fn(),
	},
}));

fetchMock.enableMocks();

const mockClientSdkKey = 'mock-client-sdk-key';
const mockCustomAttributesFromFetch = { attributes: '1234' };
const mockExperimentValues = {
	value: '12345',
};

const mockFfpValues = {
	requestContext: { identifiers: { stableID: 'stable-abc' }, attributes: {} },
	flags: {},
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
	includeFfpFlags: true,
};
const mockClientVersion = 'mockVersion';

describe('SingeFetchProvider', () => {
	const mockedFetcher = jest.mocked(Fetcher);
	let provider: SingleFetchProvider;

	beforeEach(() => {
		// jest.resetAllMocks also resets fetchMock's own implementation, so restore it
		fetchMock.resetMocks();
		mockedFetcher.fetchEvalFlags.mockResolvedValue({
			statsig: {
				experimentValues: mockExperimentValues,
				customAttributes: mockCustomAttributesFromFetch,
				clientSdkKey: mockClientSdkKey,
			},
			ffp: mockFfpValues,
			status: { statsig: 'OK', ffp: 'OK' },
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
				ffp: mockFfpValues,
				status: { statsig: 'OK', ffp: 'OK' },
			});
			await expect(mockedFetcher.fetchEvalFlags).toHaveBeenCalledWith(
				mockClientVersion,
				{
					apiKey: '123',
					environment: 'development',
					perimeter: 'commercial',
					fetchTimeoutMs: 12,
					targetApp: 'targetApp_web',
					useGatewayURL: true,
					includeFfpFlags: true,
				},
				mockIdentifiers,
				mockCustomAttributes,
			);
		});

		test('fetches Statsig values only and disables FFP without includeFfpFlags', async () => {
			provider = new SingleFetchProvider({ ...providerOptions, includeFfpFlags: false });
			provider.setClientVersion(mockClientVersion);
			provider.setProfile(mockClientOptions, mockIdentifiers, mockCustomAttributes);
			mockedFetcher.fetchExperimentValues.mockResolvedValue({
				experimentValues: mockExperimentValues,
				customAttributes: mockCustomAttributesFromFetch,
				clientSdkKey: mockClientSdkKey,
			});

			await expect(provider.getExperimentValues()).resolves.toStrictEqual({
				experimentValues: mockExperimentValues,
				customAttributesFromFetch: mockCustomAttributesFromFetch,
				clientSdkKey: mockClientSdkKey,
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
					fetchTimeoutMs: 12,
					targetApp: 'targetApp_web',
					useGatewayURL: true,
					includeFfpFlags: false,
				},
				mockIdentifiers,
				mockCustomAttributes,
			);
		});

		test('error thrown when fetch rejects', async () => {
			provider.setProfile(mockClientOptions, mockIdentifiers, mockCustomAttributes);

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
					fetchTimeoutMs: 12,
					targetApp: 'targetApp_web',
					useGatewayURL: true,
					includeFfpFlags: true,
				},
				mockIdentifiers,
				mockCustomAttributes,
			);
		});

		test('error thrown when the service reports no usable provider', async () => {
			// Use the real fetcher, which rejects such a response, against a mocked network
			const actualFetcher: typeof Fetcher = jest.requireActual(
				'@atlaskit/feature-gate-fetcher/Fetcher',
			).default;
			mockedFetcher.fetchEvalFlags.mockImplementation((...args) =>
				actualFetcher.fetchEvalFlags(...args),
			);
			fetchMock.mockResponseOnce(
				JSON.stringify({
					statsig: null,
					ffp: null,
					status: { statsig: 'UNAVAILABLE', ffp: 'DISABLED' },
				}),
			);
			provider.setProfile(mockClientOptions, mockIdentifiers, mockCustomAttributes);

			await expect(provider.getExperimentValues()).rejects.toThrow(
				'Feature flag values are unavailable (Statsig: UNAVAILABLE, FFP: DISABLED)',
			);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		});

		test('falls back to empty Statsig values and the request attributes when only FFP responds', async () => {
			mockedFetcher.fetchEvalFlags.mockResolvedValue({
				ffp: mockFfpValues,
				status: { statsig: 'DISABLED', ffp: 'OK' },
			});
			provider.setProfile(mockClientOptions, mockIdentifiers, mockCustomAttributes);

			await expect(provider.getExperimentValues()).resolves.toStrictEqual({
				experimentValues: {},
				customAttributesFromFetch: mockCustomAttributes,
				clientSdkKey: undefined,
				ffp: mockFfpValues,
				status: { statsig: 'DISABLED', ffp: 'OK' },
				disabledProviders: ['statsig'],
			});
		});

		test('omits the section of an unavailable provider and does not fetch again', async () => {
			mockedFetcher.fetchEvalFlags.mockResolvedValue({
				statsig: {
					experimentValues: mockExperimentValues,
					customAttributes: mockCustomAttributesFromFetch,
					clientSdkKey: mockClientSdkKey,
				},
				ffp: null,
				status: { statsig: 'OK', ffp: 'UNAVAILABLE' },
			});
			provider.setProfile(mockClientOptions, mockIdentifiers, mockCustomAttributes);

			await expect(provider.getExperimentValues()).resolves.toStrictEqual({
				experimentValues: mockExperimentValues,
				customAttributesFromFetch: mockCustomAttributesFromFetch,
				clientSdkKey: mockClientSdkKey,
				ffp: undefined,
				status: { statsig: 'OK', ffp: 'UNAVAILABLE' },
			});
			expect(mockedFetcher.fetchEvalFlags).toHaveBeenCalledTimes(1);
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
				includeFfpFlags: true,
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
				includeFfpFlags: true,
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
