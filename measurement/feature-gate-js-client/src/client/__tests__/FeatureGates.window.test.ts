import type FeatureGates from '../../index';

describe('window test', () => {
	test('can use overrides the moment added to window', async () => {
		// set this up before property is attached to window
		let featureGates: typeof FeatureGates;
		Object.defineProperty(window, '__FEATUREGATES_JS__', {
			configurable: true,
			get: () => featureGates,
			set: (value) => {
				featureGates = value;
				featureGates.overrideGate('testGate', true);
				featureGates.overrideConfig('testConfig', { monkey: 'banana' });
			},
		});

		// simulate importing the client, and check that the overrides are applied
		const { default: staticClient, FeatureGateEnvironment } = await import('../../index');
		staticClient.initializeFromValues(
			{
				environment: FeatureGateEnvironment.Development,
				targetApp: 'exp-platform_test',
				localMode: true,
			},
			{ randomizationId: '1234' },
		);
		expect(staticClient.checkGate('testGate')).toBe(true);
		expect(staticClient.getExperimentValue('testConfig', 'monkey', 'peel')).toBe('banana');
		staticClient.shutdownStatsig();
	});
});
