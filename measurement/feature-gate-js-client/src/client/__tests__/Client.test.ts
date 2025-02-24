/* eslint-disable no-console */
import type { StatsigClient } from '@statsig/js-client';

import { Client } from '../Client';
import { NoFetchDataAdapter } from '../NoFetchDataAdapter';
import { FeatureGateEnvironment, Provider } from '../types';

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

describe('applyUpdateCallback', () => {
	const experimentValues = {
		feature: 'value',
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
		const client = new Client();
		client['statsigClient'] = mockStatsigClient as unknown as StatsigClient;
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
		const client = new Client();
		client['statsigClient'] = mockStatsigClient as unknown as StatsigClient;
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
		const client = new Client();
		client['statsigClient'] = mockStatsigClient as unknown as StatsigClient;
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
