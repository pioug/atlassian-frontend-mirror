import FeatureGates from '@atlaskit/feature-gate-js-client/feature-gates';
import { FeatureGateEnvironment } from '@atlaskit/feature-gate-js-client/types';

let killswitch: typeof import('./killswitch').killswitch;

beforeEach(() => {
	jest.isolateModules(() => {
		killswitch = jest.requireActual('./killswitch').killswitch;
	});
});

// Exercise the SDK's real type validation and exposure options with a config override.
beforeAll(async () => {
	await FeatureGates.initializeFromValues(
		{
			environment: FeatureGateEnvironment.Development,
			targetApp: 'platform-killswitch_test',
			localMode: true,
		},
		{},
	);
});

afterAll(() => {
	FeatureGates.shutdownStatsig();
});

afterEach(() => {
	FeatureGates.clearConfigOverride('killswitch');
	jest.restoreAllMocks();
});

it('matches configured names case-insensitively and leaves other names off', () => {
	FeatureGates.overrideConfig('killswitch', { value: ['RELAY-GET-QUERIES'] });

	expect(killswitch('relay-get-queries')).toBe(true);
	expect(killswitch('Relay-Get-Queries')).toBe(true);
	expect(killswitch('other')).toBe(false);
});

it('returns false when the config is missing', () => {
	expect(killswitch('relay-get-queries')).toBe(false);
});

it.each([true, 'relay-get-queries', ['relay-get-queries', 42]])(
	'returns false for malformed config %j',
	(value) => {
		FeatureGates.overrideConfig('killswitch', { value });
		expect(killswitch('relay-get-queries')).toBe(false);
	},
);

it.each([undefined, null, true, 'relay-get-queries', ['relay-get-queries', 42]])(
	'returns false when the SDK bypasses validation and returns %j',
	(value) => {
		const read = jest.spyOn(FeatureGates, 'getExperimentValue').mockReturnValue(value);

		expect(killswitch('relay-get-queries')).toBe(false);
		expect(killswitch('other')).toBe(false);
		expect(read).toHaveBeenCalledTimes(1);
	},
);

it('waits for initialization without reading or caching the default', () => {
	const ready = jest.spyOn(FeatureGates, 'initializeCompleted').mockReturnValue(false);
	const read = jest.spyOn(FeatureGates, 'getExperimentValue');
	FeatureGates.overrideConfig('killswitch', { value: ['relay-get-queries'] });

	expect(killswitch('relay-get-queries')).toBe(false);
	expect(killswitch('relay-get-queries')).toBe(false);
	expect(read).not.toHaveBeenCalled();

	ready.mockReturnValue(true);
	expect(killswitch('relay-get-queries')).toBe(true);
	expect(read).toHaveBeenCalledTimes(1);
});

it('reads once after initialization and reuses the cached names', () => {
	const ready = jest.spyOn(FeatureGates, 'initializeCompleted');
	const read = jest.spyOn(FeatureGates, 'getExperimentValue');
	FeatureGates.overrideConfig('killswitch', { value: ['relay-get-queries'] });

	expect(killswitch('relay-get-queries')).toBe(true);
	FeatureGates.overrideConfig('killswitch', { value: [] });
	expect(killswitch('RELAY-GET-QUERIES')).toBe(true);
	expect(killswitch('other')).toBe(false);
	expect(read).toHaveBeenCalledTimes(1);
	expect(ready).toHaveBeenCalledTimes(1);
});

it('also caches an empty initialized config', () => {
	const read = jest.spyOn(FeatureGates, 'getExperimentValue');
	expect(killswitch('relay-get-queries')).toBe(false);
	expect(killswitch('other')).toBe(false);
	expect(read).toHaveBeenCalledTimes(1);
});

it('disables experiment exposure events', () => {
	const read = jest.spyOn(FeatureGates, 'getExperimentValue');
	killswitch('relay-get-queries');
	expect(read).toHaveBeenCalledWith('killswitch', 'value', [], {
		fireExperimentExposure: false,
		typeGuard: expect.any(Function),
	});
	read.mockRestore();
});
