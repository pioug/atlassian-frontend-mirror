/* eslint-disable no-console */

import type { StatsigClient } from '@statsig/js-client';

import { isolationContextId } from '@atlaskit/atlassian-context/isolation-context-id';

import { Client } from '../Client';
import { NoFetchDataAdapter } from '../NoFetchDataAdapter';
import { FeatureGateEnvironment, type Provider } from '../types';

jest.mock('@atlaskit/atlassian-context/isolation-context-id', () => ({
	isolationContextId: jest.fn(),
}));

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

afterEach(() => {
	jest.resetAllMocks();
	jest.clearAllMocks();
});

describe('Statsig exposure logging by isolation context', () => {
	test.each([
		{
			icId: 'ic-em8',
			loggingOptions: {},
			expectedLoggingOptions: { loggingEnabled: 'disabled' },
			disableExposureLog: true,
		},
		{
			icId: 'ic-em8',
			loggingOptions: { loggingEnabled: 'always' },
			expectedLoggingOptions: { loggingEnabled: 'always' },
			disableExposureLog: false,
		},
		{
			icId: 'ic-em8',
			loggingOptions: { disableAllLogging: false },
			expectedLoggingOptions: { disableLogging: false },
			disableExposureLog: false,
		},
		{
			icId: 'ic-dr6',
			loggingOptions: { loggingEnabled: 'always' },
			expectedLoggingOptions: { loggingEnabled: 'always' },
			disableExposureLog: false,
		},
		{
			icId: undefined,
			loggingOptions: { loggingEnabled: 'always' },
			expectedLoggingOptions: { loggingEnabled: 'always' },
			disableExposureLog: false,
		},
	])(
		'applies logging options $expectedLoggingOptions for $icId and loads its values',
		async ({ icId, loggingOptions, expectedLoggingOptions, disableExposureLog }) => {
			jest.mocked(isolationContextId).mockReturnValue(icId);
			mockStatsigClient.checkGate.mockReturnValue(true);
			const client = new Client();
			const initializeValues = { feature: 'value' };
			const clientOptions = {
				environment: FeatureGateEnvironment.Production,
				targetApp: 'test_target-app',
				sdkKey: 'client-sdk-key',
				...loggingOptions,
			} as const;

			await client.initializeFromValues(
				clientOptions,
				{ atlassianAccountId: 'foo' },
				undefined,
				initializeValues,
			);

			expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
				'client-sdk-key',
				expect.anything(),
				expect.objectContaining(expectedLoggingOptions),
			);
			expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith(initializeValues);
			expect(client.checkGate('automatic-gate')).toBe(true);
			expect(mockStatsigClient.checkGate).toHaveBeenCalledWith('automatic-gate', {
				disableExposureLog,
			});

			mockStatsigClient.checkGate.mockClear();
			client.manuallyLogGateExposure('manual-gate');
			if (disableExposureLog) {
				expect(mockStatsigClient.checkGate).not.toHaveBeenCalled();
			} else {
				expect(mockStatsigClient.checkGate).toHaveBeenCalledWith('manual-gate');
			}
		},
	);
});

describe('applyUpdateCallback', () => {
	const experimentValues = {
		feature: 'value',
	};

	/** A client in the state an initialize method leaves it in, with Statsig running. */
	const createReadyClient = (): Client => {
		const client = new Client();
		client['statsigClient'] = mockStatsigClient as unknown as StatsigClient;
		client['initOptions'] = {
			environment: FeatureGateEnvironment.Development,
			targetApp: 'test_target-app',
		} as Client['initOptions'];
		client['currentIdentifiers'] = { atlassianAccountId: 'foo' };
		client['valuesApplied'] = true;
		return client;
	};

	beforeEach(() => {
		console.warn = jest.fn();
	});

	test.each`
		variation                  | initCompleted | initWithDefaults
		${'both true'}             | ${true}       | ${true}
		${'initCompleted true'}    | ${true}       | ${false}
		${'initWithDefaults true'} | ${false}      | ${true}
	`('should apply update when - $variation', ({ initCompleted, initWithDefaults }) => {
		const client = createReadyClient();
		client['initCompleted'] = initCompleted;
		client['initWithDefaults'] = initWithDefaults;

		client['applyUpdateCallback']({
			experimentValues,
			customAttributesFromFetch: {},
		});
		expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledWith(experimentValues);

		expect(console.warn).toHaveBeenCalledTimes(0);
	});

	test('do not apply update if init was not completed and not with defaults', () => {
		const client = createReadyClient();
		client['initCompleted'] = false;
		client['initWithDefaults'] = false;

		client['applyUpdateCallback']({
			experimentValues,
			customAttributesFromFetch: {},
		});
		expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledTimes(0);

		expect(console.warn).toHaveBeenCalledTimes(0);
	});

	test('console warn when apply update fails', () => {
		const client = createReadyClient();
		client['initCompleted'] = true;
		client['initWithDefaults'] = false;

		const error = new Error('Error when setting values');

		mockDataAdapter.setBootstrapData.mockImplementation(() => {
			throw error;
		});

		client['applyUpdateCallback']({
			experimentValues,
			customAttributesFromFetch: {},
		});
		expect(mockDataAdapter.setBootstrapData).toHaveBeenCalledTimes(1);

		expect(console.warn).toHaveBeenCalledWith('Error when attempting to apply update', error);
	});

	test('provider applyUpdateCallback', async () => {
		class MockProvider implements Provider {
			setClientVersion = jest.fn();
			setProfile = jest.fn();
			setApplyUpdateCallback = jest.fn((callback) => callback());
			getExperimentValues = jest.fn(async () => ({
				experimentValues: {},
				customAttributesFromFetch: undefined,
			}));
			getClientSdkKey = jest.fn(async () => 'client-sdk-key');
			getApiKey = jest.fn(() => 'api-key');
		}

		const client = new Client();
		const provider = new MockProvider();

		client['applyUpdateCallback'] = function () {
			expect(this).toBe(client);
		};

		await client.initializeWithProvider(
			{
				environment: FeatureGateEnvironment.Development,
				targetApp: 'test_target-app',
			},
			provider,
			{ atlassianAccountId: 'foo' },
		);

		expect(provider.setApplyUpdateCallback).toHaveBeenCalledTimes(1);
		expect.assertions(2);
	});
});
