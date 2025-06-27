import { type CheckGateOptions, type GetExperimentValueOptions } from '../../client/types';
import Subscriptions, { ALL_FEATURE_VALUES } from '../Subscriptions';

const checkGateOptions: CheckGateOptions = {
	fireGateExposure: false,
};

const getExperimentValueOptions: GetExperimentValueOptions<string> = {
	fireExperimentExposure: false,
};

describe('Subscriptions', () => {
	const callback = jest.fn();
	const otherCallback = jest.fn();
	const checkGate = jest.fn();
	const getExperimentValue = jest.fn();
	let subscriptions: Subscriptions;
	let subscribeSpy: jest.SpyInstance;
	let unsubscribeSpy: jest.SpyInstance;
	let emitSpy: jest.SpyInstance;
	let gateName: string;
	let experimentName: string;
	let parameterName: string;
	let defaultValue: string;

	beforeEach(() => {
		subscriptions = new Subscriptions();
		subscribeSpy = jest.spyOn((subscriptions as any).emitter, 'on');
		unsubscribeSpy = jest.spyOn((subscriptions as any).emitter, 'off');
		emitSpy = jest.spyOn((subscriptions as any).emitter, 'emit');
		gateName = 'gate-name';
		experimentName = 'experiment-name';
		parameterName = 'parameter-name';
		defaultValue = 'default-value';
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('onGateUpdated', () => {
		test('can listen on a gate', () => {
			subscriptions.onGateUpdated(gateName, callback, checkGate, {});
			expect(subscribeSpy).toHaveBeenCalledWith(gateName, expect.any(Function));
		});

		test('can unlisten on a gate', () => {
			const off = subscriptions.onGateUpdated(gateName, callback, checkGate, {});
			off();
			expect(unsubscribeSpy).toHaveBeenCalledWith(gateName, expect.any(Function));
		});

		test.each`
			variation      | option
			${'no option'} | ${undefined}
			${'option'}    | ${checkGateOptions}
		`(
			'can trigger gate callback on a listening flag key with $variation, it gets flag from `checkGate` function provided',
			({ option }) => {
				const newValue = true;
				checkGate.mockReturnValue(false);
				subscriptions.onGateUpdated(gateName, callback, checkGate, option);
				checkGate.mockReturnValue(newValue);
				subscriptions.anyUpdated();

				expect(emitSpy).toHaveBeenCalledWith(gateName);
				expect(checkGate).toHaveBeenCalledWith(gateName, { fireGateExposure: false });
				expect(callback).toHaveBeenCalledWith(newValue);
			},
		);

		test('can trigger multiple callbacks on same listening gate', () => {
			const newValue = true;
			checkGate.mockReturnValue(false);
			subscriptions.onGateUpdated(gateName, callback, checkGate, {});
			subscriptions.onGateUpdated(gateName, otherCallback, checkGate, {});
			subscriptions.onGateUpdated(gateName, callback, checkGate, {});
			checkGate.mockReturnValue(newValue);
			subscriptions.anyUpdated();

			expect(emitSpy).toHaveBeenCalledWith(ALL_FEATURE_VALUES);
			expect(emitSpy).toHaveBeenCalledWith(gateName);
			expect(callback).toHaveBeenCalledTimes(1);
			expect(callback).toHaveBeenCalledWith(newValue);
			expect(otherCallback).toHaveBeenCalledWith(newValue);
		});

		test('not trigger a callback after a gate got unlisten', () => {
			const off = subscriptions.onGateUpdated(gateName, callback, checkGate, {});
			off();
			subscriptions.anyUpdated();

			expect(emitSpy).toHaveBeenCalledWith(ALL_FEATURE_VALUES);
			expect(emitSpy).not.toHaveBeenCalledWith(gateName);
			expect(callback).not.toHaveBeenCalled();
		});
	});

	describe('onExperimentValueUpdated', () => {
		test('can listen on an experiment value', () => {
			subscriptions.onExperimentValueUpdated(
				experimentName,
				parameterName,
				defaultValue,
				callback,
				getExperimentValue,
				{},
			);
			expect(subscribeSpy).toHaveBeenCalledWith(
				`${experimentName}.${parameterName}`,
				expect.any(Function),
			);
		});

		test('can unlisten on an experiment value', () => {
			const off = subscriptions.onExperimentValueUpdated(
				experimentName,
				parameterName,
				defaultValue,
				callback,
				getExperimentValue,
				{},
			);
			off();
			expect(unsubscribeSpy).toHaveBeenCalledWith(
				`${experimentName}.${parameterName}`,
				expect.any(Function),
			);
		});

		test.each`
			variation      | option
			${'no option'} | ${undefined}
			${'option'}    | ${getExperimentValueOptions}
		`(
			'can trigger experiment callback on a listening flag key with $variation, it gets flag from `getExperimentValue` function provided',
			({ option }) => {
				const newValue = 'some new value';
				getExperimentValue.mockReturnValue('oldValue');
				subscriptions.onExperimentValueUpdated(
					experimentName,
					parameterName,
					defaultValue,
					callback,
					getExperimentValue,
					option,
				);
				getExperimentValue.mockReturnValue(newValue);
				subscriptions.anyUpdated();

				expect(emitSpy).toHaveBeenCalledWith(`${experimentName}.${parameterName}`);
				expect(getExperimentValue).toHaveBeenCalledWith(
					experimentName,
					parameterName,
					defaultValue,
					{ fireExperimentExposure: false },
				);
				expect(callback).toHaveBeenCalledWith(newValue);
			},
		);

		test('can trigger multiple callbacks on same listening experiment', () => {
			const newValue = 'some new value';
			getExperimentValue.mockReturnValue('oldValue');
			subscriptions.onExperimentValueUpdated(
				experimentName,
				parameterName,
				defaultValue,
				callback,
				getExperimentValue,
				{},
			);
			subscriptions.onExperimentValueUpdated(
				experimentName,
				parameterName,
				defaultValue,
				otherCallback,
				getExperimentValue,
				{},
			);
			subscriptions.onExperimentValueUpdated(
				experimentName,
				parameterName,
				defaultValue,
				callback,
				getExperimentValue,
				{},
			);
			getExperimentValue.mockReturnValue(newValue);
			subscriptions.anyUpdated();

			expect(emitSpy).toHaveBeenCalledWith(`${experimentName}.${parameterName}`);
			expect(callback).toHaveBeenCalledTimes(1);
			expect(callback).toHaveBeenCalledWith(newValue);
			expect(otherCallback).toHaveBeenCalledWith(newValue);
		});

		test('not trigger a callback after a experiment got unlisten', () => {
			const off = subscriptions.onExperimentValueUpdated(
				experimentName,
				parameterName,
				defaultValue,
				callback,
				getExperimentValue,
				{},
			);
			off();
			subscriptions.anyUpdated();

			expect(emitSpy).toHaveBeenCalledWith(ALL_FEATURE_VALUES);
			expect(emitSpy).not.toHaveBeenCalledWith(`${experimentName}.${parameterName}`);
			expect(checkGate).not.toHaveBeenCalled();
			expect(callback).not.toHaveBeenCalled();
		});
	});

	test('can subscribe to all flags', () => {
		subscriptions.onAnyUpdated(callback);
		expect(subscribeSpy).toHaveBeenCalledTimes(1);
		expect(subscribeSpy).toHaveBeenCalledWith(ALL_FEATURE_VALUES, callback);
	});

	test('can trigger all flags', () => {
		subscriptions.onAnyUpdated(callback);
		subscriptions.anyUpdated();

		expect(emitSpy).toHaveBeenCalledTimes(1);
		expect(emitSpy).toHaveBeenCalledWith(ALL_FEATURE_VALUES);
		expect(callback).toHaveBeenCalledTimes(1);
	});

	test('can unsubscribe to all flags', () => {
		const unsubscribe = subscriptions.onAnyUpdated(callback);
		unsubscribe();
		subscriptions.anyUpdated();

		expect(emitSpy).toHaveBeenCalledTimes(1);
		expect(emitSpy).toHaveBeenCalledWith(ALL_FEATURE_VALUES);
		expect(callback).not.toHaveBeenCalled();
	});
});
