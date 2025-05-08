import { renderHook } from '@testing-library/react-hooks';

import { conditionalHooksFactory } from './index';

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
});
