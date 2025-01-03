/* eslint-disable no-console */
import Statsig from 'statsig-js-lite';

import { Client } from '../Client';

jest.mock('statsig-js-lite', () => {
	const statsig = jest.requireActual('statsig-js-lite');

	return {
		...statsig,
		default: {
			initialize: jest.fn(),
			checkGate: jest.fn(),
			checkGateWithExposureLoggingDisabled: jest.fn(),
			getExperiment: jest.fn(),
			getExperimentWithExposureLoggingDisabled: jest.fn(),
			getLayer: jest.fn(),
			getLayerWithExposureLoggingDisabled: jest.fn(),
			setOverrides: jest.fn(),
			shutdown: jest.fn(),
			updateUserWithValues: jest.fn().mockReturnValue(true),
			setInitializeValues: jest.fn(),
		},
		__esModule: true,
	};
});
// @ts-ignore
const StatsigMocked: jest.Mocked<typeof Statsig> = Statsig;

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
		client['initCompleted'] = initCompleted;
		client['initWithDefaults'] = initWithDefaults;

		client['applyUpdateCallback']({
			experimentValues,
			customAttributesFromFetch: {},
		});
		expect(StatsigMocked.setInitializeValues).toHaveBeenCalledWith(experimentValues);

		expect(console.warn).toHaveBeenCalledTimes(0);
	});

	test('do not apply update if init was not completed and not with defaults', () => {
		const client = new Client();
		client['initCompleted'] = false;
		client['initWithDefaults'] = false;

		client['applyUpdateCallback']({
			experimentValues,
			customAttributesFromFetch: {},
		});
		expect(StatsigMocked.setInitializeValues).toHaveBeenCalledTimes(0);

		expect(console.warn).toHaveBeenCalledTimes(0);
	});

	test('console warn when apply update fails', () => {
		const client = new Client();
		client['initCompleted'] = true;
		client['initWithDefaults'] = false;

		const error = new Error('Error when setting values');

		StatsigMocked.setInitializeValues.mockImplementation(() => {
			throw error;
		});

		client['applyUpdateCallback']({
			experimentValues,
			customAttributesFromFetch: {},
		});
		expect(StatsigMocked.setInitializeValues).toHaveBeenCalledTimes(1);

		expect(console.warn).toHaveBeenCalledWith('Error when attempting to apply update', error);
	});
});
