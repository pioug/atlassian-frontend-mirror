import type { StatsigClient } from '@statsig/js-client';
import fetchMock from 'jest-fetch-mock';

/* eslint-disable no-console */
import type { FlagClientOptions, FlagResult } from '@atlaskit/flag-client/types';

import { Client } from '../Client';
import { type EvalFlagsResponse } from '../fetcher/types';
import {
	FeatureGateEnvironment,
	type FfpInitializeValues,
	type FrontendExperimentsResult,
	type Provider,
} from '../types';

const mockStatsigClient = {
	initializeAsync: jest.fn(),
	updateUserAsync: jest.fn(),
	updateUserSync: jest.fn(),
	checkGate: jest.fn(),
	getFeatureGate: jest.fn(),
	getExperiment: jest.fn(),
	getLayer: jest.fn(),
	shutdown: jest.fn(),
} satisfies Partial<StatsigClient>;

const mockStatsigClientConstructor = jest.fn();
const mockFlagClientConstructor = jest.fn();

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

jest.mock('@atlaskit/flag-client/client', () => {
	const actual = jest.requireActual('@atlaskit/flag-client/client');
	return {
		// Never deliver exposure telemetry from unit tests.
		FlagClient: class extends actual.FlagClient {
			constructor(options: FlagClientOptions) {
				mockFlagClientConstructor(options);
				super({ ...options, exposureLogging: { enabled: false } });
			}
		},
	};
});

fetchMock.enableMocks();

const OPTIONS = {
	environment: FeatureGateEnvironment.Development,
	targetApp: 'test-app',
};

/** Fetch options for initialize and updateUser that include FFP flags. */
const FFP_FETCH_OPTIONS = { ...OPTIONS, apiKey: 'api-key', includeFfpFlags: true };
const IDENTIFIERS = { atlassianAccountId: 'aaid-1' };
const REQUEST_CONTEXT = { identifiers: { atlassianAccountId: 'aaid-1' } };
const STATSIG_VALUES = { feature_gates: {}, dynamic_configs: {}, layer_configs: {} };

const flag = (returnType: FlagResult['returnType'], value: unknown): FlagResult => ({
	returnType,
	value,
	useCodeDefault: false,
	metadata: { matchReason: 'rule_match', ruleId: 'rule-1' },
});

const FFP_VALUES: FfpInitializeValues = {
	requestContext: REQUEST_CONTEXT,
	flags: {
		'ffp-gate': flag('BOOLEAN', true),
		'ffp-experiment': flag('JSON', { color: 'blue' }),
		'ffp-config': flag('STRING', 'foo'),
	},
};

const statsigExperiment = (value: Record<string, unknown>) => ({
	name: 'statsig-experiment',
	value,
	ruleID: 'statsig-rule',
	groupName: null,
	details: { reason: 'Bootstrap:Recognized', time: 0 },
	get: jest.fn(),
});

describe('Client with Feature Flag Platform values', () => {
	let client: Client;

	beforeEach(() => {
		console.warn = jest.fn();
		console.error = jest.fn();
		mockStatsigClient.checkGate.mockReturnValue(false);
		mockStatsigClient.getExperiment.mockReturnValue(statsigExperiment({ color: 'red' }));
		mockStatsigClient.getFeatureGate.mockReturnValue({ details: { reason: 'Unrecognized' } });
		client = new Client({ localStorageKey: 'tmp-ffp-test-overrides' });
	});

	afterEach(() => {
		window.localStorage.clear();
		fetchMock.resetMocks();
		jest.clearAllMocks();
	});

	const initWithFfp = (ffpValues: FfpInitializeValues | undefined) =>
		client.initializeFromValues(OPTIONS, IDENTIFIERS, {}, { ...STATSIG_VALUES }, ffpValues);

	describe('reads', () => {
		beforeEach(async () => {
			await initWithFfp(FFP_VALUES);
		});

		test('checkGate serves FFP boolean flags without consulting Statsig', () => {
			expect(client.checkGate('ffp-gate')).toBe(true);
			expect(mockStatsigClient.checkGate).not.toHaveBeenCalled();
		});

		test('checkGate falls back to Statsig for keys FFP does not serve', () => {
			mockStatsigClient.checkGate.mockReturnValue(true);
			expect(client.checkGate('statsig-gate', { fireGateExposure: false })).toBe(true);
			expect(mockStatsigClient.checkGate).toHaveBeenCalledWith('statsig-gate', {
				disableExposureLog: true,
			});
		});

		test('getExperimentValue reads FFP experiment parameters', () => {
			expect(client.getExperimentValue('ffp-experiment', 'color', 'yellow')).toBe('blue');
			expect(client.getExperimentValue('ffp-experiment', 'missing', 'yellow')).toBe('yellow');
			expect(mockStatsigClient.getExperiment).not.toHaveBeenCalled();
		});

		test('getExperimentValue reads flattened dynamic configs through the value parameter', () => {
			expect(client.getExperimentValue('ffp-config', 'value', 'default')).toBe('foo');
			// The default type guard still applies
			expect(client.getExperimentValue('ffp-config', 'value', 1)).toBe(1);
		});

		test('getExperiment returns a config built from the FFP flag', () => {
			const config = client.getExperiment('ffp-experiment');
			expect(config.value).toEqual({ color: 'blue' });
			expect(config._ruleID).toBe('rule-1');
		});

		test('getExperiment falls back to Statsig for keys FFP does not serve', () => {
			expect(client.getExperiment('statsig-experiment').value).toEqual({ color: 'red' });
			expect(mockStatsigClient.getExperiment).toHaveBeenCalled();
		});

		test('existence checks include FFP flags', () => {
			expect(client.isGateExist('ffp-gate')).toBe(true);
			expect(client.isExperimentExist('ffp-experiment')).toBe(true);
			expect(client.isGateExist('statsig-gate')).toBe(false);
		});

		test('manual exposures for FFP flags do not go to Statsig', () => {
			client.manuallyLogGateExposure('ffp-gate');
			client.manuallyLogExperimentExposure('ffp-experiment');
			expect(mockStatsigClient.checkGate).not.toHaveBeenCalled();
			expect(mockStatsigClient.getExperiment).not.toHaveBeenCalled();

			client.manuallyLogGateExposure('statsig-gate');
			expect(mockStatsigClient.checkGate).toHaveBeenCalledWith('statsig-gate');
		});

		test('local overrides take precedence over FFP values, without consulting Statsig', () => {
			client.overrideGate('ffp-gate', false);
			client.overrideConfig('ffp-experiment', { color: 'green' });

			expect(client.checkGate('ffp-gate')).toBe(false);
			expect(client.getExperiment('ffp-experiment').value).toEqual({ color: 'green' });
			expect(client.getExperiment('ffp-experiment')._evaluationDetails.reason).toBe(
				'LocalOverride',
			);
			expect(mockStatsigClient.checkGate).not.toHaveBeenCalled();
			expect(mockStatsigClient.getExperiment).not.toHaveBeenCalled();
		});

		test('an FFP gate that is not a boolean returns false, without consulting Statsig', async () => {
			await client.updateUserWithValues({ atlassianAccountId: 'aaid-2' }, {}, STATSIG_VALUES, {
				requestContext: REQUEST_CONTEXT,
				flags: { 'string-gate': flag('STRING', 'on') },
			});
			expect(client.checkGate('string-gate')).toBe(false);
			expect(mockStatsigClient.checkGate).not.toHaveBeenCalled();
		});
	});

	test('serves only Statsig when no FFP values are provided', async () => {
		await initWithFfp(undefined);
		expect(client.checkGate('ffp-gate')).toBe(false);
		expect(mockStatsigClient.checkGate).toHaveBeenCalledWith('ffp-gate', {
			disableExposureLog: false,
		});
	});

	test('updateUserWithValues replaces and clears FFP values', async () => {
		await initWithFfp(FFP_VALUES);

		await client.updateUserWithValues({ atlassianAccountId: 'aaid-2' }, {}, STATSIG_VALUES, {
			requestContext: REQUEST_CONTEXT,
			flags: { 'new-gate': flag('BOOLEAN', true) },
		});
		expect(client.checkGate('new-gate')).toBe(true);
		expect(client.isGateExist('ffp-gate')).toBe(false);

		await client.updateUserWithValues({ atlassianAccountId: 'aaid-3' }, {}, STATSIG_VALUES);
		expect(client.isGateExist('new-gate')).toBe(false);
	});

	test("serves the new user's FFP values even when the Statsig user update fails", async () => {
		await initWithFfp(FFP_VALUES);
		mockStatsigClient.updateUserAsync.mockRejectedValueOnce(new Error('update failed'));

		await expect(
			client.updateUserWithValues({ atlassianAccountId: 'aaid-2' }, {}, STATSIG_VALUES, {
				requestContext: REQUEST_CONTEXT,
				flags: { 'new-gate': flag('BOOLEAN', true) },
			}),
		).rejects.toThrow();
		expect(client.checkGate('new-gate')).toBe(true);
		expect(client.isGateExist('ffp-gate')).toBe(false);
		expect(client.isCurrentUser({ atlassianAccountId: 'aaid-2' }, {})).toBe(true);
	});

	test('initializeWithProvider applies FFP values from the provider', async () => {
		const provider: Provider = {
			setClientVersion: jest.fn(),
			setProfile: jest.fn().mockResolvedValue(undefined),
			getClientSdkKey: jest.fn().mockResolvedValue('client-key'),
			getExperimentValues: jest.fn().mockResolvedValue({
				experimentValues: STATSIG_VALUES,
				customAttributesFromFetch: {},
				ffp: FFP_VALUES,
			}),
		};

		await client.initializeWithProvider(OPTIONS, provider, IDENTIFIERS);
		expect(client.checkGate('ffp-gate')).toBe(true);
	});

	describe('network initialization', () => {
		const EVAL_FLAGS_URL = 'https://api.dev.atlassian.com/flags/api/v1/evalFlags';
		const CLIENT_KEY_URL =
			'https://api.dev.atlassian.com/flags/api/v2/frontend/clientSdkKey/test-app';

		const mockService = (response: EvalFlagsResponse) => {
			fetchMock.mockIf(
				(req) => [EVAL_FLAGS_URL, CLIENT_KEY_URL].includes(req.url),
				async (req) =>
					JSON.stringify(req.url === CLIENT_KEY_URL ? { clientSdkKey: 'client-key' } : response),
			);
		};

		test('initialize fetches evalFlags and serves both platforms', async () => {
			mockService({
				statsig: { experimentValues: STATSIG_VALUES, customAttributes: {} },
				ffp: FFP_VALUES,
				status: { statsig: 'OK', ffp: 'OK' },
			});

			await client.initialize(FFP_FETCH_OPTIONS, IDENTIFIERS, {});

			expect(fetchMock.mock.calls.map(([url]) => url)).toContain(EVAL_FLAGS_URL);
			expect(client.checkGate('ffp-gate')).toBe(true);
			mockStatsigClient.checkGate.mockReturnValue(true);
			expect(client.checkGate('statsig-gate')).toBe(true);
		});

		test('without includeFfpFlags, fetches Statsig values only', async () => {
			const EXPERIMENT_VALUES_URL =
				'https://api.dev.atlassian.com/flags/api/v2/frontend/experimentValues';
			fetchMock.mockIf(
				(req) => [EXPERIMENT_VALUES_URL, CLIENT_KEY_URL].includes(req.url),
				async (req) =>
					JSON.stringify(
						req.url === CLIENT_KEY_URL
							? { clientSdkKey: 'client-key' }
							: { experimentValues: STATSIG_VALUES, customAttributes: {} },
					),
			);

			await client.initialize({ ...OPTIONS, apiKey: 'api-key' }, IDENTIFIERS, {});
			await client.updateUser(
				{ ...OPTIONS, apiKey: 'api-key', perimeter: 'commercial' },
				{ atlassianAccountId: 'aaid-2' },
				{},
			);

			const urls = fetchMock.mock.calls.map(([url]) => url);
			expect(urls.filter((url) => url === EXPERIMENT_VALUES_URL)).toHaveLength(2);
			expect(urls).not.toContain(EVAL_FLAGS_URL);
			expect(client.initializeCompleted()).toBe(true);
			expect(client.isGateExist('ffp-gate')).toBe(false);
			mockStatsigClient.checkGate.mockReturnValue(true);
			expect(client.checkGate('statsig-gate')).toBe(true);
		});

		test('initialize succeeds with FFP values only', async () => {
			mockService({ ffp: FFP_VALUES, status: { statsig: 'DISABLED', ffp: 'OK' } });

			await client.initialize(FFP_FETCH_OPTIONS, IDENTIFIERS, {});

			expect(client.initializeCompleted()).toBe(true);
			expect(client.checkGate('ffp-gate')).toBe(true);
		});

		test('updateUser applies FFP values from evalFlags', async () => {
			mockService({
				statsig: { experimentValues: STATSIG_VALUES, customAttributes: {} },
				status: { statsig: 'OK', ffp: 'DISABLED' },
			});
			await client.initialize(FFP_FETCH_OPTIONS, IDENTIFIERS, {});
			expect(client.isGateExist('ffp-gate')).toBe(false);

			mockService({
				statsig: { experimentValues: STATSIG_VALUES, customAttributes: {} },
				ffp: FFP_VALUES,
				status: { statsig: 'OK', ffp: 'OK' },
			});
			await client.updateUser(
				{ ...FFP_FETCH_OPTIONS, perimeter: 'commercial' },
				{ atlassianAccountId: 'aaid-2' },
				{},
			);
			expect(client.checkGate('ffp-gate')).toBe(true);
		});

		test('ignores the section of a provider that is not OK', async () => {
			mockService({
				statsig: { experimentValues: STATSIG_VALUES, customAttributes: {} },
				ffp: FFP_VALUES,
				status: { statsig: 'OK', ffp: 'UNAVAILABLE' },
			});

			await client.initialize(FFP_FETCH_OPTIONS, IDENTIFIERS, {});

			expect(client.initializeCompleted()).toBe(true);
			expect(client.isGateExist('ffp-gate')).toBe(false);
		});

		describe('when no provider is usable', () => {
			test.each([
				[{ statsig: 'UNAVAILABLE', ffp: 'DISABLED' }],
				[{ statsig: 'DISABLED', ffp: 'UNAVAILABLE' }],
				[{ statsig: 'UNAVAILABLE', ffp: 'UNAVAILABLE' }],
			] as const)('initialize rejects for %j, as for a failed fetch', async (status) => {
				mockService({ status });

				await expect(client.initialize(FFP_FETCH_OPTIONS, IDENTIFIERS, {})).rejects.toThrow(
					`Feature flag values are unavailable (Statsig: ${status.statsig}, FFP: ${status.ffp})`,
				);

				expect(client.initializeCompleted()).toBe(false);
			});

			test('initialize leaves Statsig usable without values, with the SDK key', async () => {
				mockService({ status: { statsig: 'UNAVAILABLE', ffp: 'DISABLED' } });

				await expect(client.initialize(FFP_FETCH_OPTIONS, IDENTIFIERS, {})).rejects.toThrow(
					'Feature flag values are unavailable',
				);

				expect(mockStatsigClientConstructor).toHaveBeenCalledTimes(1);
				expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
					'client-key',
					expect.anything(),
					expect.anything(),
				);
				expect(client.checkGate('statsig-gate')).toBe(false);
				expect(mockStatsigClient.checkGate).toHaveBeenCalledWith('statsig-gate', {
					disableExposureLog: false,
				});
				expect(console.error).toHaveBeenCalledWith(
					expect.stringContaining('Feature flag values are unavailable'),
				);
			});

			test("updateUser rejects and keeps serving the previous user's values", async () => {
				mockService({
					statsig: { experimentValues: STATSIG_VALUES, customAttributes: {} },
					ffp: FFP_VALUES,
					status: { statsig: 'OK', ffp: 'OK' },
				});
				await client.initialize(FFP_FETCH_OPTIONS, IDENTIFIERS, {});

				mockService({ status: { statsig: 'UNAVAILABLE', ffp: 'DISABLED' } });
				await expect(
					client.updateUser(
						{ ...FFP_FETCH_OPTIONS, perimeter: 'commercial' },
						{ atlassianAccountId: 'aaid-2' },
						{},
					),
				).rejects.toThrow('Feature flag values are unavailable');

				expect(client.isCurrentUser(IDENTIFIERS, {})).toBe(true);
				expect(mockStatsigClient.updateUserAsync).not.toHaveBeenCalled();
				expect(client.checkGate('ffp-gate')).toBe(true);
				expect(client.initializeCompleted()).toBe(true);
			});
		});
	});

	describe('provider decoupling', () => {
		const EVAL_FLAGS_URL = 'https://api.dev.atlassian.com/flags/api/v1/evalFlags';
		const CLIENT_KEY_URL =
			'https://api.dev.atlassian.com/flags/api/v2/frontend/clientSdkKey/test-app';
		const STATSIG_SECTION = { experimentValues: STATSIG_VALUES, customAttributes: {} };

		const mockService = (response: EvalFlagsResponse, { keyFails = false } = {}) => {
			fetchMock.mockIf(
				(req) => [EVAL_FLAGS_URL, CLIENT_KEY_URL].includes(req.url),
				async (req) => {
					if (req.url === EVAL_FLAGS_URL) {
						return JSON.stringify(response);
					}
					return keyFails
						? { status: 500, body: 'key unavailable' }
						: JSON.stringify({ clientSdkKey: 'client-key' });
				},
			);
		};

		const initialize = () => client.initialize(FFP_FETCH_OPTIONS, IDENTIFIERS, {});

		/** Initializes with a provider and returns its update callback. */
		const initializeWithUpdates = async (initial: FrontendExperimentsResult) => {
			let applyUpdate: ((result: FrontendExperimentsResult) => void) | undefined;
			const provider: Provider = {
				setClientVersion: jest.fn(),
				setProfile: jest.fn().mockResolvedValue(undefined),
				getClientSdkKey: jest.fn().mockResolvedValue('client-key'),
				getExperimentValues: jest.fn().mockResolvedValue(initial),
				setApplyUpdateCallback: (callback) => {
					applyUpdate = callback;
				},
			};
			await client.initializeWithProvider(OPTIONS, provider, IDENTIFIERS);
			return (result: FrontendExperimentsResult) => applyUpdate?.(result);
		};

		const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

		describe('when the Feature Flag Service disables Statsig', () => {
			beforeEach(async () => {
				mockService({ ffp: FFP_VALUES, status: { statsig: 'DISABLED', ffp: 'OK' } });
				await initialize();
			});

			test('never creates the Statsig client', () => {
				expect(client.initializeCompleted()).toBe(true);
				expect(mockStatsigClientConstructor).not.toHaveBeenCalled();
			});

			test('serves FFP keys from FFP', () => {
				expect(client.checkGate('ffp-gate')).toBe(true);
				expect(client.getExperimentValue('ffp-experiment', 'color', 'yellow')).toBe('blue');
			});

			test('returns defaults for every other key', () => {
				expect(client.checkGate('statsig-gate')).toBe(false);
				expect(client.isGateExist('statsig-gate')).toBe(false);
				expect(client.getExperimentValue('statsig-experiment', 'color', 'yellow')).toBe('yellow');
				expect(client.isExperimentExist('statsig-experiment')).toBe(false);
				expect(client.getLayerValue('statsig-layer', 'param', 'fallback')).toBe('fallback');
			});

			test('still serves local overrides', () => {
				client.overrideGate('statsig-gate', true);
				client.overrideConfig('statsig-experiment', { color: 'green' });
				expect(client.checkGate('statsig-gate')).toBe(true);
				expect(client.getExperimentValue('statsig-experiment', 'color', 'yellow')).toBe('green');
			});

			test('logs no Statsig exposures', () => {
				client.manuallyLogGateExposure('statsig-gate');
				client.manuallyLogExperimentExposure('statsig-experiment');
				client.manuallyLogLayerExposure('statsig-layer', 'param');
				client.shutdownStatsig();
				expect(console.warn).not.toHaveBeenCalled();
			});

			test('updateUser keeps Statsig stopped', async () => {
				mockService({
					ffp: { flags: { 'new-gate': flag('BOOLEAN', true) }, requestContext: REQUEST_CONTEXT },
					status: { statsig: 'DISABLED', ffp: 'OK' },
				});
				await client.updateUser(
					{ ...FFP_FETCH_OPTIONS, perimeter: 'commercial' },
					{ atlassianAccountId: 'aaid-2' },
					{},
				);
				expect(client.checkGate('new-gate')).toBe(true);
				expect(mockStatsigClientConstructor).not.toHaveBeenCalled();
			});

			test('updateUser starts Statsig once it is enabled again', async () => {
				mockService({ statsig: STATSIG_SECTION, status: { statsig: 'OK', ffp: 'DISABLED' } });
				await client.updateUser(
					{ ...FFP_FETCH_OPTIONS, perimeter: 'commercial' },
					{ atlassianAccountId: 'aaid-2' },
					{},
				);
				expect(mockStatsigClientConstructor).toHaveBeenCalledTimes(1);
				expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
					'client-key',
					expect.objectContaining({ customIDs: { atlassianAccountId: 'aaid-2' } }),
					expect.anything(),
				);
				mockStatsigClient.checkGate.mockReturnValue(true);
				expect(client.checkGate('statsig-gate')).toBe(true);
			});
		});

		test('initialize does not wait for the SDK key when Statsig is disabled', async () => {
			mockService(
				{ ffp: FFP_VALUES, status: { statsig: 'DISABLED', ffp: 'OK' } },
				{ keyFails: true },
			);
			await expect(initialize()).resolves.toBeUndefined();
			expect(client.checkGate('ffp-gate')).toBe(true);
		});

		test('a failed SDK key fetch still applies FFP values when Statsig is enabled', async () => {
			mockService(
				{ statsig: STATSIG_SECTION, ffp: FFP_VALUES, status: { statsig: 'OK', ffp: 'OK' } },
				{ keyFails: true },
			);
			await expect(initialize()).rejects.toThrow();
			expect(client.checkGate('ffp-gate')).toBe(true);
			// Statsig still starts, without values
			expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
				'client-default-key',
				expect.anything(),
				expect.anything(),
			);
		});

		test('never creates the FFP client when the Feature Flag Service disables FFP', async () => {
			mockService({
				statsig: STATSIG_SECTION,
				ffp: FFP_VALUES,
				status: { statsig: 'OK', ffp: 'DISABLED' },
			});
			await initialize();

			expect(mockFlagClientConstructor).not.toHaveBeenCalled();
			mockStatsigClient.checkGate.mockReturnValue(true);
			expect(client.checkGate('ffp-gate')).toBe(true);
			expect(mockStatsigClient.checkGate).toHaveBeenCalledWith('ffp-gate', {
				disableExposureLog: false,
			});
		});

		test('a provider update that disables Statsig shuts it down', async () => {
			const applyUpdate = await initializeWithUpdates({
				experimentValues: STATSIG_VALUES,
				customAttributesFromFetch: {},
				ffp: FFP_VALUES,
			});
			expect(mockStatsigClientConstructor).toHaveBeenCalledTimes(1);

			applyUpdate({
				experimentValues: {},
				customAttributesFromFetch: {},
				ffp: FFP_VALUES,
				status: { statsig: 'DISABLED', ffp: 'OK' },
				disabledProviders: ['statsig'],
			});

			expect(mockStatsigClient.shutdown).toHaveBeenCalledTimes(1);
			expect(client.checkGate('statsig-gate')).toBe(false);
			expect(mockStatsigClient.checkGate).not.toHaveBeenCalled();
			expect(client.checkGate('ffp-gate')).toBe(true);
		});

		test('a provider update that enables Statsig again starts it', async () => {
			const applyUpdate = await initializeWithUpdates({
				experimentValues: {},
				customAttributesFromFetch: {},
				ffp: FFP_VALUES,
				status: { statsig: 'DISABLED', ffp: 'OK' },
				disabledProviders: ['statsig'],
			});
			expect(mockStatsigClientConstructor).not.toHaveBeenCalled();
			const onUpdated = jest.fn();
			client.onAnyUpdated(onUpdated);

			applyUpdate({
				experimentValues: STATSIG_VALUES,
				customAttributesFromFetch: {},
				ffp: FFP_VALUES,
				status: { statsig: 'OK', ffp: 'OK' },
			});
			await settle();

			expect(mockStatsigClientConstructor).toHaveBeenCalledTimes(1);
			expect(mockStatsigClientConstructor).toHaveBeenCalledWith(
				'client-key',
				expect.anything(),
				expect.anything(),
			);
			expect(onUpdated).toHaveBeenCalled();
			mockStatsigClient.checkGate.mockReturnValue(true);
			expect(client.checkGate('statsig-gate')).toBe(true);
		});

		test('a Statsig start overtaken by a disable does not create the client', async () => {
			const applyUpdate = await initializeWithUpdates({
				experimentValues: {},
				customAttributesFromFetch: {},
				status: { statsig: 'DISABLED', ffp: 'DISABLED' },
				disabledProviders: ['statsig', 'ffp'],
			});
			const enabled = { experimentValues: STATSIG_VALUES, customAttributesFromFetch: {} };
			applyUpdate(enabled);
			applyUpdate({ ...enabled, disabledProviders: ['statsig'] });
			await settle();

			expect(mockStatsigClientConstructor).not.toHaveBeenCalled();
		});

		test('reuses one FFP client when FFP is disabled and enabled again', async () => {
			const applyUpdate = await initializeWithUpdates({
				experimentValues: STATSIG_VALUES,
				customAttributesFromFetch: {},
				ffp: FFP_VALUES,
			});
			applyUpdate({
				experimentValues: STATSIG_VALUES,
				customAttributesFromFetch: {},
				status: { statsig: 'OK', ffp: 'DISABLED' },
				disabledProviders: ['ffp'],
			});
			expect(client.isGateExist('ffp-gate')).toBe(false);

			applyUpdate({
				experimentValues: STATSIG_VALUES,
				customAttributesFromFetch: {},
				ffp: FFP_VALUES,
			});
			expect(client.checkGate('ffp-gate')).toBe(true);
			expect(mockFlagClientConstructor).toHaveBeenCalledTimes(1);
		});
	});

	describe('provider health reporting', () => {
		const EVAL_FLAGS_URL = 'https://api.dev.atlassian.com/flags/api/v1/evalFlags';
		const sendOperationalEvent = jest.fn();
		const analyticsWebClient = Promise.resolve({ sendOperationalEvent });

		const degradedEvents = () =>
			sendOperationalEvent.mock.calls
				.map(([event]) => event)
				.filter((event) => event.action === 'degraded');

		const initializeWith = async (response: EvalFlagsResponse) => {
			fetchMock.mockResponse(async (req) =>
				JSON.stringify(req.url === EVAL_FLAGS_URL ? response : { clientSdkKey: 'client-key' }),
			);
			await client.initialize({ ...FFP_FETCH_OPTIONS, analyticsWebClient }, IDENTIFIERS, {});
			// Let the analytics client promise settle
			await analyticsWebClient;
			await Promise.resolve();
		};

		test.each([
			[{ statsig: 'OK', ffp: 'UNAVAILABLE' }],
			[{ statsig: 'UNAVAILABLE', ffp: 'OK' }],
			[{ statsig: 'DISABLED', ffp: 'DISABLED' }],
		] as const)('resolves and reports degraded values when the status is %j', async (status) => {
			await initializeWith({ status });

			expect(client.initializeCompleted()).toBe(true);
			expect(degradedEvents()).toEqual([
				{
					action: 'degraded',
					actionSubject: 'featureGatesClientValues',
					attributes: {
						targetApp: 'test-app',
						clientVersion: expect.any(String),
						trigger: 'initialize',
						statsigStatus: status.statsig,
						ffpStatus: status.ffp,
					},
					tags: ['measurement'],
					source: '@atlaskit/feature-gate-js-client',
				},
			]);
			expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('degraded'));
		});

		test.each([
			[{ statsig: 'OK', ffp: 'OK' }],
			[{ statsig: 'OK', ffp: 'DISABLED' }],
			[{ statsig: 'DISABLED', ffp: 'OK' }],
		] as const)('does not report when the status is %j', async (status) => {
			await initializeWith({
				statsig: { experimentValues: STATSIG_VALUES, customAttributes: {} },
				ffp: FFP_VALUES,
				status,
			});

			expect(degradedEvents()).toEqual([]);
		});

		test('reports degraded values applied by a provider update', async () => {
			let applyUpdate: ((result: FrontendExperimentsResult) => void) | undefined;
			const provider: Provider = {
				setClientVersion: jest.fn(),
				setProfile: jest.fn().mockResolvedValue(undefined),
				getClientSdkKey: jest.fn().mockResolvedValue('client-key'),
				getExperimentValues: jest.fn().mockResolvedValue({
					experimentValues: STATSIG_VALUES,
					customAttributesFromFetch: {},
					ffp: FFP_VALUES,
					status: { statsig: 'OK', ffp: 'OK' },
				}),
				setApplyUpdateCallback: (callback) => {
					applyUpdate = callback;
				},
			};
			await client.initializeWithProvider(
				{ ...OPTIONS, analyticsWebClient },
				provider,
				IDENTIFIERS,
			);

			applyUpdate?.({
				experimentValues: STATSIG_VALUES,
				customAttributesFromFetch: {},
				ffp: FFP_VALUES,
				status: { statsig: 'OK', ffp: 'UNAVAILABLE' },
			});
			await analyticsWebClient;
			await Promise.resolve();

			expect(degradedEvents()).toEqual([
				expect.objectContaining({
					attributes: expect.objectContaining({
						trigger: 'providerUpdate',
						ffpStatus: 'UNAVAILABLE',
					}),
				}),
			]);
			// The provider kept the last FFP values it served
			expect(client.checkGate('ffp-gate')).toBe(true);
		});
	});

	describe('ffpClient', () => {
		test('is undefined until an initialize method is called', () => {
			expect(client.ffpClient).toBeUndefined();
			expect(mockFlagClientConstructor).not.toHaveBeenCalled();
		});

		test('serves FFP values', async () => {
			await initWithFfp(FFP_VALUES);
			const ffpClient = client.ffpClient!;
			expect(ffpClient.getBooleanValue('ffp-gate', false)).toBe(true);
			expect(ffpClient.getStringValue('ffp-config', 'default')).toBe('foo');
			expect(ffpClient.getObjectValue('ffp-experiment', {})).toEqual({ color: 'blue' });
			expect(ffpClient.getBooleanDetails('ffp-gate', false)).toMatchObject({
				value: true,
				metadata: { ruleId: 'rule-1' },
			});
		});

		test('returns the default for keys FFP does not serve, without consulting Statsig', async () => {
			mockStatsigClient.checkGate.mockReturnValue(true);
			await initWithFfp(FFP_VALUES);
			expect(client.ffpClient!.getBooleanValue('statsig-gate', false)).toBe(false);
			expect(mockStatsigClient.checkGate).not.toHaveBeenCalled();
		});

		test('does not apply local overrides', async () => {
			await initWithFfp(FFP_VALUES);
			client.overrideGate('ffp-gate', false);
			expect(client.checkGate('ffp-gate')).toBe(false);
			expect(client.ffpClient!.getBooleanValue('ffp-gate', false)).toBe(true);
		});

		test('is the same instance across user updates and serves the new user', async () => {
			await initWithFfp(FFP_VALUES);
			const ffpClient = client.ffpClient;
			await client.updateUserWithValues({ atlassianAccountId: 'aaid-2' }, {}, STATSIG_VALUES, {
				requestContext: REQUEST_CONTEXT,
				flags: { 'ffp-gate': flag('BOOLEAN', false) },
			});
			expect(client.ffpClient).toBe(ffpClient);
			expect(ffpClient!.getBooleanValue('ffp-gate', true)).toBe(false);
		});

		test('stops serving the previous user when FFP serves nothing to the new one', async () => {
			await initWithFfp(FFP_VALUES);
			const ffpClient = client.ffpClient!;
			await client.updateUserWithValues({ atlassianAccountId: 'aaid-2' }, {}, STATSIG_VALUES);
			expect(ffpClient.getBooleanValue('ffp-gate', false)).toBe(false);
			expect(ffpClient.getBooleanDetails('ffp-gate', false).metadata.matchReason).toBe(
				'flag_not_found',
			);
		});

		test('stops serving the previous user when the new values are rejected', async () => {
			await initWithFfp(FFP_VALUES);
			const ffpClient = client.ffpClient!;
			await client.updateUserWithValues({ atlassianAccountId: 'aaid-2' }, {}, STATSIG_VALUES, {
				vs: '99',
				flags: FFP_VALUES.flags,
			} as unknown as FfpInitializeValues);
			expect(ffpClient.getBooleanValue('ffp-gate', false)).toBe(false);
		});

		test('returns defaults before FFP values arrive, then serves them from the same instance', async () => {
			await initWithFfp(undefined);
			const ffpClient = client.ffpClient!;
			expect(ffpClient.getBooleanValue('ffp-gate', false)).toBe(false);

			await client.updateUserWithValues(
				{ atlassianAccountId: 'aaid-2' },
				{},
				STATSIG_VALUES,
				FFP_VALUES,
			);
			expect(client.ffpClient).toBe(ffpClient);
			expect(ffpClient.getBooleanValue('ffp-gate', false)).toBe(true);
			expect(mockFlagClientConstructor).toHaveBeenCalledTimes(1);
		});

		test('creates no FFP client when FFP serves nothing and it is never read', async () => {
			await initWithFfp(undefined);
			await client.updateUserWithValues({ atlassianAccountId: 'aaid-2' }, {}, STATSIG_VALUES);
			expect(mockFlagClientConstructor).not.toHaveBeenCalled();
		});
	});
});
