jest.mock('../client/version', () => ({
	CLIENT_VERSION: 'test-version',
}));

describe('FeatureGate client Statsig module import integration test', () => {
	/* eslint-disable no-console */
	beforeEach(() => {
		console.error = jest.fn();
		console.warn = jest.fn();

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore Remove globally saved reference to FeatureGates client between tests
		window.__FEATUREGATES_JS__ = undefined;
	});

	afterEach(() => {
		jest.resetModules();
	});

	test('should load module successfully when another client has already initialized', async () => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore Remove globally saved reference to FeatureGates client between tests
		window.__FEATUREGATES_JS__ = {
			getPackageVersion: () => 'test-version',
		};

		const FeatureGates = require('../client/FeatureGates').default;

		expect(FeatureGates.getPackageVersion()).toEqual('test-version');
		expect(console.warn).not.toHaveBeenCalled();
	});

	test('should load module successfully when a legacy client has already initialized', async () => {
		const fakeLegacyClient = {
			abc: 'def',
		};
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore Remove globally saved reference to FeatureGates client between tests
		window.__FEATUREGATES_JS__ = fakeLegacyClient;

		const FeatureGates = require('../client/FeatureGates').default;

		expect(FeatureGates).toEqual(fakeLegacyClient);
		expect(console.warn).toHaveBeenCalledWith(
			'Multiple versions of FeatureGateClients found on the current page.\n      ' +
				'The currently bound version is 4.10.0 or earlier when module version test-version was loading.',
		);
	});

	test('should warn when a client is already initialized and is of a different version', async () => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore Remove globally saved reference to FeatureGates client between tests
		window.__FEATUREGATES_JS__ = {
			getPackageVersion: () => '4.11.0',
		};

		require('../client/FeatureGates').default;

		expect(console.warn).toHaveBeenCalledWith(
			'Multiple versions of FeatureGateClients found on the current page.\n      ' +
				'The currently bound version is 4.11.0 when module version test-version was loading.',
		);
	});
});
