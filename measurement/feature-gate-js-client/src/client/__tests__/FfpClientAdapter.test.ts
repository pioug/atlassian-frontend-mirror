/* eslint-disable no-console */
import { FlagClient } from '@atlaskit/flag-client/client';
import type { FlagClientOptions, FlagResult } from '@atlaskit/flag-client/types';

import { type FfpAdapterOptions, FfpClientAdapter } from '../FfpClientAdapter';
import { toFlagUser } from '../toFlagUser';
import { FeatureGateEnvironment, type FfpInitializeValues, PerimeterType } from '../types';

const mockFlagClientConstructor = jest.fn();

jest.mock('@atlaskit/flag-client/client', () => {
	const actual = jest.requireActual('@atlaskit/flag-client/client');
	return {
		// Record the options, but never deliver exposure telemetry from unit tests.
		FlagClient: class extends actual.FlagClient {
			constructor(options: FlagClientOptions) {
				mockFlagClientConstructor(options);
				super({ ...options, exposureLogging: { enabled: false } });
			}
		},
	};
});

const OPTIONS: FfpAdapterOptions = {
	environment: FeatureGateEnvironment.Production,
	targetApp: 'test-app',
	perimeter: PerimeterType.COMMERCIAL,
};

const IDENTIFIERS = { atlassianAccountId: 'aaid-1', stableId: 'stable-1' };

const flag = (
	returnType: FlagResult['returnType'],
	value: unknown,
	overrides: Partial<FlagResult> = {},
): FlagResult => ({
	returnType,
	value,
	useCodeDefault: false,
	metadata: { matchReason: 'rule_match', ruleId: 'rule-1', identifierType: 'atlassianAccountId' },
	...overrides,
});

const values = (flags: Record<string, FlagResult>): FfpInitializeValues => ({
	flags,
	requestContext: { identifiers: { atlassianAccountId: 'aaid-1', stableID: 'stable-1' } },
});

describe('toFlagUser', () => {
	test('uses Statsig custom ID names and keeps only scalar attributes', () => {
		expect(
			toFlagUser(IDENTIFIERS, {
				tier: 'premium',
				seats: 10,
				isAdmin: false,
				groups: ['a', 'b'],
				infinite: Number.POSITIVE_INFINITY,
			}),
		).toEqual({
			identifiers: { atlassianAccountId: 'aaid-1', stableID: 'stable-1' },
			attributes: { tier: 'premium', seats: 10, isAdmin: false },
		});
	});

	test('handles missing attributes', () => {
		expect(toFlagUser({ tenantId: 't-1' })).toEqual({
			identifiers: { tenantId: 't-1' },
			attributes: {},
		});
	});
});

describe('FfpClientAdapter', () => {
	let adapter: FfpClientAdapter;

	beforeEach(() => {
		adapter = new FfpClientAdapter();
		console.warn = jest.fn();
	});

	afterEach(() => {
		jest.restoreAllMocks();
		mockFlagClientConstructor.mockReset();
	});

	describe('client options', () => {
		test.each`
			environment                           | environmentType
			${FeatureGateEnvironment.Development} | ${'dev'}
			${FeatureGateEnvironment.Staging}     | ${'staging'}
			${FeatureGateEnvironment.Production}  | ${'prod'}
		`('maps $environment to $environmentType', ({ environment, environmentType }) => {
			adapter.apply({ ...OPTIONS, environment }, values({}), IDENTIFIERS);
			expect(mockFlagClientConstructor).toHaveBeenCalledWith({
				targetApp: 'test-app',
				environmentType,
			});
		});

		test.each`
			variation                     | options
			${'in FedRAMP'}               | ${{ ...OPTIONS, perimeter: PerimeterType.FEDRAMP_MODERATE }}
			${'when logging is disabled'} | ${{ ...OPTIONS, disableAllLogging: true }}
		`('disables exposure logging $variation', ({ options }) => {
			adapter.apply(options, values({}), IDENTIFIERS);
			expect(mockFlagClientConstructor).toHaveBeenCalledWith(
				expect.objectContaining({ exposureLogging: { enabled: false } }),
			);
		});
	});

	describe('lifecycle', () => {
		test('serves nothing before values are applied', () => {
			expect(adapter.has('flag')).toBe(false);
			expect(adapter.checkGate('flag', true)).toBe(false);
			expect(adapter.getConfig('flag', true)).toEqual({ value: {}, ruleId: '' });
			expect(mockFlagClientConstructor).not.toHaveBeenCalled();
		});

		test('ignores service members the FFP client does not consume', () => {
			adapter.apply(
				OPTIONS,
				{ ...values({ gate: flag('BOOLEAN', true) }), status: 'OK', targetApp: 'test-app' },
				IDENTIFIERS,
			);
			expect(adapter.checkGate('gate', true)).toBe(true);
		});

		test('replaces values for a new user without creating a new client', () => {
			adapter.apply(OPTIONS, values({ gate: flag('BOOLEAN', true) }), IDENTIFIERS);
			adapter.apply(OPTIONS, values({ other: flag('BOOLEAN', false) }), {
				atlassianAccountId: 'aaid-2',
			});

			expect(mockFlagClientConstructor).toHaveBeenCalledTimes(1);
			expect(adapter.has('gate')).toBe(false);
			expect(adapter.checkGate('other', true)).toBe(false);
		});

		test('reuses the client when values are absent and then return', () => {
			adapter.apply(OPTIONS, values({ gate: flag('BOOLEAN', true) }), IDENTIFIERS);
			adapter.apply(OPTIONS, undefined, IDENTIFIERS);
			adapter.apply(OPTIONS, values({ gate: flag('BOOLEAN', true) }), IDENTIFIERS);

			expect(mockFlagClientConstructor).toHaveBeenCalledTimes(1);
			expect(adapter.checkGate('gate', true)).toBe(true);
		});

		test('getClient returns the client that applied values serve from', () => {
			const client = adapter.getClient(OPTIONS);
			expect(client.getBooleanValue('gate', false)).toBe(false);

			adapter.apply(OPTIONS, values({ gate: flag('BOOLEAN', true) }), IDENTIFIERS);
			expect(adapter.getClient(OPTIONS)).toBe(client);
			expect(client.getBooleanValue('gate', false)).toBe(true);
			expect(mockFlagClientConstructor).toHaveBeenCalledTimes(1);
		});

		test('empties the client for a user FFP serves nothing to', () => {
			adapter.apply(OPTIONS, values({ gate: flag('BOOLEAN', true) }), IDENTIFIERS);
			adapter.apply(OPTIONS, undefined, { atlassianAccountId: 'aaid-2' });

			expect(adapter.getClient(OPTIONS).getBooleanValue('gate', false)).toBe(false);
		});

		test('empties the client when values for a new user are rejected', () => {
			adapter.apply(OPTIONS, values({ gate: flag('BOOLEAN', true) }), IDENTIFIERS);
			adapter.apply(OPTIONS, { flags: 'invalid' } as unknown as FfpInitializeValues, {
				atlassianAccountId: 'aaid-2',
			});

			expect(adapter.has('gate')).toBe(false);
			expect(adapter.getClient(OPTIONS).getBooleanValue('gate', false)).toBe(false);
		});

		test('creates no client for absent values', () => {
			adapter.apply(OPTIONS, undefined, IDENTIFIERS);
			expect(mockFlagClientConstructor).not.toHaveBeenCalled();
		});

		test('initializes again after a failed initialization, then replaces', () => {
			const initialize = jest.spyOn(FlagClient.prototype, 'initialize');
			const replace = jest.spyOn(FlagClient.prototype, 'replace');
			adapter.apply(OPTIONS, { flags: 'invalid' } as unknown as FfpInitializeValues, IDENTIFIERS);
			adapter.apply(OPTIONS, values({ gate: flag('BOOLEAN', true) }), IDENTIFIERS);
			adapter.apply(OPTIONS, values({ gate: flag('BOOLEAN', false) }), IDENTIFIERS);

			expect(mockFlagClientConstructor).toHaveBeenCalledTimes(1);
			expect(initialize).toHaveBeenCalledTimes(2);
			expect(replace).toHaveBeenCalledTimes(1);
			expect(adapter.checkGate('gate', true)).toBe(false);
		});

		test('clears when values are absent', () => {
			adapter.apply(OPTIONS, values({ gate: flag('BOOLEAN', true) }), IDENTIFIERS);
			adapter.apply(OPTIONS, undefined, IDENTIFIERS);
			expect(adapter.has('gate')).toBe(false);
		});

		test('serves nothing when the payload cannot initialize the client', () => {
			adapter.apply(OPTIONS, { flags: 'invalid' } as unknown as FfpInitializeValues, IDENTIFIERS);
			expect(adapter.has('gate')).toBe(false);
		});

		test('accepts schema version 1 and a request context without attributes', () => {
			adapter.apply(
				OPTIONS,
				{
					...values({ gate: flag('BOOLEAN', true) }),
					vs: '1',
					requestContext: { identifiers: { stableID: 'stable-1' } },
				},
				IDENTIFIERS,
			);
			expect(adapter.checkGate('gate', true)).toBe(true);
		});

		test('serves nothing when the payload has an unsupported schema version', () => {
			adapter.apply(
				OPTIONS,
				{ ...values({ gate: flag('BOOLEAN', true) }), vs: '2' } as unknown as FfpInitializeValues,
				IDENTIFIERS,
			);
			expect(adapter.has('gate')).toBe(false);
			expect(adapter.checkGate('gate', true)).toBe(false);
		});

		test('clears rather than serving the previous user when replacement fails', () => {
			adapter.apply(OPTIONS, values({ gate: flag('BOOLEAN', true) }), IDENTIFIERS);
			adapter.apply(OPTIONS, { flags: 'invalid' } as unknown as FfpInitializeValues, IDENTIFIERS);
			expect(adapter.has('gate')).toBe(false);
			expect(adapter.checkGate('gate', true)).toBe(false);
		});

		test('clears and warns when the client throws', () => {
			jest.spyOn(FlagClient.prototype, 'initialize').mockImplementation(() => {
				throw new Error('boom');
			});
			adapter.apply(OPTIONS, values({ gate: flag('BOOLEAN', true) }), IDENTIFIERS);
			expect(adapter.has('gate')).toBe(false);
			expect(console.warn).toHaveBeenCalledWith(
				'Failed to apply Feature Flag Platform values',
				expect.any(Error),
			);
		});
	});

	describe('checkGate', () => {
		beforeEach(() => {
			adapter.apply(
				OPTIONS,
				values({
					onGate: flag('BOOLEAN', true),
					defaultGate: flag('BOOLEAN', true, { useCodeDefault: true }),
					stringFlag: flag('STRING', 'on'),
				}),
				IDENTIFIERS,
			);
		});

		test('returns the FFP value for boolean flags', () => {
			expect(adapter.checkGate('onGate', true)).toBe(true);
		});

		test('returns false when FFP serves the code default', () => {
			expect(adapter.checkGate('defaultGate', true)).toBe(false);
		});

		test('returns false for missing or non-boolean flags', () => {
			expect(adapter.checkGate('missing', true)).toBe(false);
			expect(adapter.checkGate('stringFlag', true)).toBe(false);
		});

		test.each`
			fireExposure | disableExposureLogging
			${true}      | ${false}
			${false}     | ${true}
		`(
			'passes disableExposureLogging=$disableExposureLogging when fireExposure=$fireExposure',
			({ fireExposure, disableExposureLogging }) => {
				const spy = jest.spyOn(FlagClient.prototype, 'getBooleanValue');
				adapter.checkGate('onGate', fireExposure);
				expect(spy).toHaveBeenCalledWith('onGate', false, { disableExposureLogging });
			},
		);

		test('logGateExposure reads with exposure logging enabled', () => {
			const spy = jest.spyOn(FlagClient.prototype, 'getBooleanValue');
			adapter.logGateExposure('onGate');
			expect(spy).toHaveBeenCalledWith('onGate', false, { disableExposureLogging: false });
			adapter.logGateExposure('missing');
			expect(spy).toHaveBeenCalledTimes(1);
		});
	});

	describe('getConfig', () => {
		beforeEach(() => {
			adapter.apply(
				OPTIONS,
				values({
					experiment: flag('JSON', { color: 'blue', size: 2 }),
					stringConfig: flag('STRING', 'foo'),
					numberConfig: flag('NUMBER', 3),
					booleanConfig: flag('BOOLEAN', true),
					listConfig: flag('JSON', ['a', 'b']),
					defaultConfig: flag('STRING', 'ignored', { useCodeDefault: true }),
					mismatchedConfig: flag('NUMBER', 'not-a-number'),
				}),
				IDENTIFIERS,
			);
		});

		test('returns JSON object flags as experiment parameters', () => {
			expect(adapter.getConfig('experiment', true)).toEqual({
				value: { color: 'blue', size: 2 },
				ruleId: 'rule-1',
			});
		});

		test.each`
			name               | expected
			${'stringConfig'}  | ${'foo'}
			${'numberConfig'}  | ${3}
			${'booleanConfig'} | ${true}
			${'listConfig'}    | ${['a', 'b']}
		`('returns flattened dynamic config $name as { value }', ({ name, expected }) => {
			expect(adapter.getConfig(name, true)).toEqual({
				value: { value: expected },
				ruleId: 'rule-1',
			});
		});

		test.each(['defaultConfig', 'mismatchedConfig'])(
			'returns an empty config when FFP falls back for %s',
			(name) => {
				expect(adapter.getConfig(name, true)?.value).toEqual({});
			},
		);

		test('returns an empty config for missing flags, without reading or logging', () => {
			const spy = jest.spyOn(FlagClient.prototype, 'getObjectDetails');
			expect(adapter.getConfig('missing', true)).toEqual({ value: {}, ruleId: '' });
			adapter.logConfigExposure('missing');
			expect(spy).not.toHaveBeenCalled();
		});

		test('passes the exposure option to the typed read', () => {
			const spy = jest.spyOn(FlagClient.prototype, 'getObjectDetails');
			adapter.getConfig('experiment', false);
			expect(spy).toHaveBeenCalledWith('experiment', expect.anything(), {
				disableExposureLogging: true,
			});
		});
	});
});
