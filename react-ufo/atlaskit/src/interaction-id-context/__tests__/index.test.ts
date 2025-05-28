import React, { useContext } from 'react';

import { renderHook } from '@testing-library/react';

import UFOInteractionIDContext, {
	DefaultInteractionID,
	getInteractionId,
	type InteractionIDContextType,
	subscribeToInteractionIdChanges,
	useInteractionId,
} from '../index';

// Mock the feature flag
jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

const { fg } = require('@atlaskit/platform-feature-flags');

describe('InteractionIDContext', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		// Reset the default interaction ID
		DefaultInteractionID.current = null;
		// Enable feature flag by default
		fg.mockReturnValue(true);
	});

	describe('DefaultInteractionID', () => {
		it('should have initial value of null', () => {
			expect(DefaultInteractionID.current).toBeNull();
		});

		it('should allow setting and getting values', () => {
			DefaultInteractionID.current = 'test-interaction-1';
			expect(DefaultInteractionID.current).toBe('test-interaction-1');

			DefaultInteractionID.current = 'test-interaction-2';
			expect(DefaultInteractionID.current).toBe('test-interaction-2');

			DefaultInteractionID.current = null;
			expect(DefaultInteractionID.current).toBeNull();
		});

		it('should handle string values', () => {
			const testId = 'complex-interaction-id-with-special-chars-123!@#';
			DefaultInteractionID.current = testId;
			expect(DefaultInteractionID.current).toBe(testId);
		});
	});

	describe('ObservableInteractionID with feature flag enabled', () => {
		beforeEach(() => {
			fg.mockReturnValue(true);
		});

		it('should notify subscribers when value changes', () => {
			const listener1 = jest.fn();
			const listener2 = jest.fn();

			const unsubscribe1 = subscribeToInteractionIdChanges(listener1);
			const unsubscribe2 = subscribeToInteractionIdChanges(listener2);

			// Change the value
			DefaultInteractionID.current = 'interaction-1';

			expect(listener1).toHaveBeenCalledWith('interaction-1');
			expect(listener2).toHaveBeenCalledWith('interaction-1');
			expect(listener1).toHaveBeenCalledTimes(1);
			expect(listener2).toHaveBeenCalledTimes(1);

			// Change again
			DefaultInteractionID.current = 'interaction-2';

			expect(listener1).toHaveBeenCalledWith('interaction-2');
			expect(listener2).toHaveBeenCalledWith('interaction-2');
			expect(listener1).toHaveBeenCalledTimes(2);
			expect(listener2).toHaveBeenCalledTimes(2);

			// Cleanup
			unsubscribe1();
			unsubscribe2();
		});

		it('should not notify subscribers when value is set to the same value', () => {
			const listener = jest.fn();
			const unsubscribe = subscribeToInteractionIdChanges(listener);

			// Set initial value
			DefaultInteractionID.current = 'same-value';
			expect(listener).toHaveBeenCalledWith('same-value');
			expect(listener).toHaveBeenCalledTimes(1);

			// Set to same value again
			DefaultInteractionID.current = 'same-value';
			expect(listener).toHaveBeenCalledTimes(1); // Should not be called again

			unsubscribe();
		});

		it('should handle null values in notifications', () => {
			const listener = jest.fn();
			const unsubscribe = subscribeToInteractionIdChanges(listener);

			// Set to non-null value first
			DefaultInteractionID.current = 'test-value';
			expect(listener).toHaveBeenCalledWith('test-value');

			// Set to null
			DefaultInteractionID.current = null;
			expect(listener).toHaveBeenCalledWith(null);
			expect(listener).toHaveBeenCalledTimes(2);

			unsubscribe();
		});

		it('should allow unsubscribing from notifications', () => {
			const listener = jest.fn();
			const unsubscribe = subscribeToInteractionIdChanges(listener);

			// Change value - should notify
			DefaultInteractionID.current = 'before-unsubscribe';
			expect(listener).toHaveBeenCalledWith('before-unsubscribe');
			expect(listener).toHaveBeenCalledTimes(1);

			// Unsubscribe
			unsubscribe();

			// Change value again - should not notify
			DefaultInteractionID.current = 'after-unsubscribe';
			expect(listener).toHaveBeenCalledTimes(1); // Should not increase
		});

		it('should handle rapid value changes', () => {
			const listener = jest.fn();
			const unsubscribe = subscribeToInteractionIdChanges(listener);

			// Rapid changes
			DefaultInteractionID.current = 'rapid-1';
			DefaultInteractionID.current = 'rapid-2';
			DefaultInteractionID.current = 'rapid-3';
			DefaultInteractionID.current = 'rapid-4';

			expect(listener).toHaveBeenCalledTimes(4);
			expect(listener).toHaveBeenNthCalledWith(1, 'rapid-1');
			expect(listener).toHaveBeenNthCalledWith(2, 'rapid-2');
			expect(listener).toHaveBeenNthCalledWith(3, 'rapid-3');
			expect(listener).toHaveBeenNthCalledWith(4, 'rapid-4');

			unsubscribe();
		});
	});

	describe('ObservableInteractionID with feature flag disabled', () => {
		beforeEach(() => {
			fg.mockReturnValue(false);
		});

		it('should still allow setting and getting values', () => {
			DefaultInteractionID.current = 'test-without-flag';
			expect(DefaultInteractionID.current).toBe('test-without-flag');
		});

		it('should not notify subscribers when feature flag is disabled', () => {
			const listener = jest.fn();
			const unsubscribe = subscribeToInteractionIdChanges(listener);

			// Change the value
			DefaultInteractionID.current = 'no-notification';

			// Should not be called because feature flag is disabled
			expect(listener).not.toHaveBeenCalled();

			unsubscribe();
		});

		it('should return no-op unsubscribe function when feature flag is disabled', () => {
			const listener = jest.fn();
			const unsubscribe = subscribeToInteractionIdChanges(listener);

			// Should not throw when calling unsubscribe
			expect(() => unsubscribe()).not.toThrow();

			// Multiple calls should also not throw
			expect(() => unsubscribe()).not.toThrow();
			expect(() => unsubscribe()).not.toThrow();
		});
	});

	describe('subscribeToInteractionIdChanges', () => {
		beforeEach(() => {
			fg.mockReturnValue(true);
		});

		it('should return a function', () => {
			const listener = jest.fn();
			const unsubscribe = subscribeToInteractionIdChanges(listener);
			expect(typeof unsubscribe).toBe('function');
			unsubscribe();
		});

		it('should handle multiple listeners independently', () => {
			const listener1 = jest.fn();
			const listener2 = jest.fn();
			const listener3 = jest.fn();

			const unsubscribe1 = subscribeToInteractionIdChanges(listener1);
			const unsubscribe2 = subscribeToInteractionIdChanges(listener2);
			const unsubscribe3 = subscribeToInteractionIdChanges(listener3);

			// All should be notified
			DefaultInteractionID.current = 'multi-listener-test';
			expect(listener1).toHaveBeenCalledWith('multi-listener-test');
			expect(listener2).toHaveBeenCalledWith('multi-listener-test');
			expect(listener3).toHaveBeenCalledWith('multi-listener-test');

			// Unsubscribe middle listener
			unsubscribe2();

			// Only remaining listeners should be notified
			DefaultInteractionID.current = 'after-middle-unsubscribe';
			expect(listener1).toHaveBeenCalledWith('after-middle-unsubscribe');
			expect(listener2).toHaveBeenCalledTimes(1); // Should not increase
			expect(listener3).toHaveBeenCalledWith('after-middle-unsubscribe');

			// Cleanup
			unsubscribe1();
			unsubscribe3();
		});
	});

	describe('getInteractionId', () => {
		it('should return the DefaultInteractionID', () => {
			const result = getInteractionId();
			expect(result).toBe(DefaultInteractionID);
		});

		it('should return the same instance on multiple calls', () => {
			const result1 = getInteractionId();
			const result2 = getInteractionId();
			expect(result1).toBe(result2);
			expect(result1).toBe(DefaultInteractionID);
		});
	});

	describe('useInteractionId', () => {
		it('should return the DefaultInteractionID', () => {
			const result = useInteractionId();
			expect(result).toBe(DefaultInteractionID);
		});

		it('should return the same instance on multiple calls', () => {
			const result1 = useInteractionId();
			const result2 = useInteractionId();
			expect(result1).toBe(result2);
			expect(result1).toBe(DefaultInteractionID);
		});
	});

	describe('UFOInteractionIDContext', () => {
		it('should have DefaultInteractionID as default value', () => {
			// Set a value to test
			DefaultInteractionID.current = 'context-test';

			const { result } = renderHook(() => useContext(UFOInteractionIDContext));
			expect(result.current).toBe(DefaultInteractionID);
			expect(result.current.current).toBe('context-test');
		});

		it('should allow providing custom interaction ID context', () => {
			const customContext: InteractionIDContextType = {
				current: 'custom-value',
			};

			const wrapper = ({ children }: { children: React.ReactNode }) =>
				React.createElement(UFOInteractionIDContext.Provider, { value: customContext }, children);

			const { result } = renderHook(() => useContext(UFOInteractionIDContext), {
				wrapper,
			});

			expect(result.current).toBe(customContext);
			expect(result.current.current).toBe('custom-value');
		});
	});

	describe('InteractionIDContextType', () => {
		it('should accept null values', () => {
			const context: InteractionIDContextType = {
				current: null,
			};
			expect(context.current).toBeNull();
		});

		it('should accept string values', () => {
			const context: InteractionIDContextType = {
				current: 'test-string',
			};
			expect(context.current).toBe('test-string');
		});
	});

	describe('edge cases', () => {
		beforeEach(() => {
			fg.mockReturnValue(true);
		});

		it('should handle setting the same value multiple times', () => {
			const listener = jest.fn();
			const unsubscribe = subscribeToInteractionIdChanges(listener);

			DefaultInteractionID.current = 'same';
			DefaultInteractionID.current = 'same';
			DefaultInteractionID.current = 'same';

			// Should only be called once
			expect(listener).toHaveBeenCalledTimes(1);
			expect(listener).toHaveBeenCalledWith('same');

			unsubscribe();
		});

		it('should handle empty string values', () => {
			const listener = jest.fn();
			const unsubscribe = subscribeToInteractionIdChanges(listener);

			DefaultInteractionID.current = '';
			expect(listener).toHaveBeenCalledWith('');
			expect(DefaultInteractionID.current).toBe('');

			unsubscribe();
		});

		it('should handle special characters in values', () => {
			const specialValue = '!@#$%^&*()_+-=[]{}|;:,.<>?`~';
			const listener = jest.fn();
			const unsubscribe = subscribeToInteractionIdChanges(listener);

			DefaultInteractionID.current = specialValue;
			expect(listener).toHaveBeenCalledWith(specialValue);
			expect(DefaultInteractionID.current).toBe(specialValue);

			unsubscribe();
		});
	});

	describe('feature flag runtime behavior', () => {
		it('should respect feature flag changes during runtime', () => {
			const listener = jest.fn();

			// Start with flag enabled
			fg.mockReturnValue(true);
			const unsubscribe = subscribeToInteractionIdChanges(listener);

			DefaultInteractionID.current = 'flag-enabled';
			expect(listener).toHaveBeenCalledWith('flag-enabled');

			// Disable flag
			fg.mockReturnValue(false);

			// Should not notify when flag is disabled
			DefaultInteractionID.current = 'flag-disabled';
			expect(listener).toHaveBeenCalledTimes(1); // Should not increase

			// Re-enable flag
			fg.mockReturnValue(true);

			// Should notify again when flag is re-enabled
			DefaultInteractionID.current = 'flag-re-enabled';
			expect(listener).toHaveBeenCalledWith('flag-re-enabled');
			expect(listener).toHaveBeenCalledTimes(2);

			unsubscribe();
		});

		it('should handle subscription when flag is disabled', () => {
			fg.mockReturnValue(false);

			const listener = jest.fn();
			const unsubscribe = subscribeToInteractionIdChanges(listener);

			// Should return a no-op function
			expect(typeof unsubscribe).toBe('function');

			// Should not throw when called
			expect(() => unsubscribe()).not.toThrow();

			// Value changes should not notify
			DefaultInteractionID.current = 'no-flag-test';
			expect(listener).not.toHaveBeenCalled();
		});
	});
});
