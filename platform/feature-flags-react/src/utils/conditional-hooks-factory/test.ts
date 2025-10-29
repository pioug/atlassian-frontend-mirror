import { renderHook } from '@testing-library/react-hooks';

import {
	conditionalHooksFactory,
	DO_NOT_USE_THIS_IN_PRODUCTION_EVER_resetConditionalHooksFactoryCache,
} from './index';

describe('conditionalHooksFactory', () => {
	const originalNodeEnv = process.env.NODE_ENV;

	afterEach(() => {
		process.env.NODE_ENV = originalNodeEnv;
	});

	it('should call the new hook when condition is true', () => {
		const condition = jest.fn(() => true);
		const oldHook = jest.fn();
		const newHook = jest.fn();

		const conditionalHook = conditionalHooksFactory(condition, newHook, oldHook);

		conditionalHook();

		expect(condition).toHaveBeenCalledTimes(1);
		expect(oldHook).not.toHaveBeenCalled();
		expect(newHook).toHaveBeenCalledTimes(1);
	});

	it('should call the old hook when condition is false', () => {
		const condition = jest.fn(() => false);
		const oldHook = jest.fn();
		const newHook = jest.fn();

		const conditionalHook = conditionalHooksFactory(condition, newHook, oldHook);

		conditionalHook();

		expect(condition).toHaveBeenCalledTimes(1);
		expect(oldHook).toHaveBeenCalledTimes(1);
		expect(newHook).not.toHaveBeenCalled();
	});

	it('should throw an error if the condition changes between renders, and call the same hook', () => {
		const condition = jest.fn(() => true);
		const oldHook = jest.fn();
		const newHook = jest.fn();

		const conditionalHook = conditionalHooksFactory(condition, newHook, oldHook);

		expect(() => {
			renderHook(() => {
				conditionalHook();
			});
			condition.mockReturnValue(false);
			conditionalHook();
		}).toThrow('Conditional hook called with different condition, this breaks the rules of hooks!');

		expect(condition).toHaveBeenCalledTimes(2);
		expect(oldHook).not.toHaveBeenCalled();
		expect(newHook).toHaveBeenCalledTimes(1);
	});

	it('should not throw an error if the condition changes between rerenders and the env is production', () => {
		process.env.NODE_ENV = 'production';

		const condition = jest.fn(() => true);
		const oldHook = jest.fn();
		const newHook = jest.fn();

		const conditionalHook = conditionalHooksFactory(condition, newHook, oldHook);

		expect(() => {
			renderHook(() => {
				conditionalHook();
			});
			condition.mockReturnValue(false);
			conditionalHook();
		}).not.toThrow();

		expect(condition).toHaveBeenCalledTimes(2);
		expect(oldHook).not.toHaveBeenCalled();
		expect(newHook).toHaveBeenCalledTimes(2);
	});

	it('resets cached condition and respects updated value', () => {
		const condition = jest.fn(() => true);
		const oldHook = jest.fn();
		const newHook = jest.fn();

		// Create the hook instance
		const conditionalHook = conditionalHooksFactory(condition, newHook, oldHook);

		// First call with condition = true
		conditionalHook();
		expect(newHook).toHaveBeenCalledTimes(1);
		expect(oldHook).not.toHaveBeenCalled();

		// Here, we're simulating a situation similar to starting up a new test case where the feature gate might need to be mocked differently.
		// For practicality though, we're keeping this as a single test case, but the behaviour is similar enough to reflect that scenario.

		// Clear the cache to allow re-evaluation of the condition
		DO_NOT_USE_THIS_IN_PRODUCTION_EVER_resetConditionalHooksFactoryCache();

		// Now change the condition and call again - this should work without throwing
		// since we cleared the cache
		condition.mockReturnValue(false);
		conditionalHook();

		expect(condition).toHaveBeenCalledTimes(2);
		expect(oldHook).toHaveBeenCalledTimes(1);
		expect(newHook).toHaveBeenCalledTimes(1); // Still only called once
	});
});
