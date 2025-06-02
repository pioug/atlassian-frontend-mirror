import React from 'react';

import { act, render, screen } from '@testing-library/react';

import UFOInteractionContext, { type UFOInteractionContextType } from '../../interaction-context';
import UFOInteractionIDContext, { DefaultInteractionID } from '../../interaction-id-context';
import UFOLoadHold from '../UFOLoadHold';

// Mock functions to track calls
const mockHold = jest.fn();
const mockHoldExperimental = jest.fn();
const mockTracePress = jest.fn();

// Create a proper mock context that satisfies the UFOInteractionContextType interface
const createMockContext = (
	overrides: Partial<UFOInteractionContextType> = {},
): UFOInteractionContextType => ({
	hold: mockHold,
	tracePress: mockTracePress,
	labelStack: [],
	segmentIdMap: new Map(),
	addMark: jest.fn(),
	addCustomData: jest.fn(),
	addCustomTimings: jest.fn(),
	addApdex: jest.fn(),
	holdExperimental: mockHoldExperimental,
	...overrides,
});

describe('UFOLoadHold', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		// Reset the default interaction ID
		DefaultInteractionID.current = null;
	});

	describe('basic functionality', () => {
		it('should call hold when component mounts with context', () => {
			const mockContext = createMockContext();

			render(
				<UFOInteractionIDContext.Provider value={DefaultInteractionID}>
					<UFOInteractionContext.Provider value={mockContext}>
						<UFOLoadHold name="test-hold" />
					</UFOInteractionContext.Provider>
				</UFOInteractionIDContext.Provider>,
			);

			expect(mockHold).toHaveBeenCalledWith('test-hold');
			expect(mockHold).toHaveBeenCalledTimes(1);
		});

		it('should not call hold when context is null', () => {
			render(
				<UFOInteractionIDContext.Provider value={DefaultInteractionID}>
					<UFOInteractionContext.Provider value={null}>
						<UFOLoadHold name="test-hold" />
					</UFOInteractionContext.Provider>
				</UFOInteractionIDContext.Provider>,
			);

			expect(mockHold).not.toHaveBeenCalled();
		});

		it('should not call hold when hold prop is false', () => {
			const mockContext = createMockContext();

			render(
				<UFOInteractionIDContext.Provider value={DefaultInteractionID}>
					<UFOInteractionContext.Provider value={mockContext}>
						<UFOLoadHold name="test-hold" hold={false} />
					</UFOInteractionContext.Provider>
				</UFOInteractionIDContext.Provider>,
			);

			expect(mockHold).not.toHaveBeenCalled();
		});

		it('should call hold with default name when name is not provided', () => {
			const mockContext = createMockContext();

			render(
				<UFOInteractionIDContext.Provider value={DefaultInteractionID}>
					<UFOInteractionContext.Provider value={mockContext}>
						<UFOLoadHold name="" />
					</UFOInteractionContext.Provider>
				</UFOInteractionIDContext.Provider>,
			);

			expect(mockHold).toHaveBeenCalledWith('');
		});
	});

	describe('experimental mode', () => {
		it('should call holdExperimental when experimental prop is true and holdExperimental exists', () => {
			const mockContext = createMockContext();

			render(
				<UFOInteractionIDContext.Provider value={DefaultInteractionID}>
					<UFOInteractionContext.Provider value={mockContext}>
						<UFOLoadHold name="experimental-hold" experimental={true} />
					</UFOInteractionContext.Provider>
				</UFOInteractionIDContext.Provider>,
			);

			expect(mockHoldExperimental).toHaveBeenCalledWith('experimental-hold');
			expect(mockHold).not.toHaveBeenCalled();
		});

		it('should fall back to regular hold when experimental is true but holdExperimental is not available', () => {
			const mockContext = createMockContext({ holdExperimental: undefined });

			render(
				<UFOInteractionIDContext.Provider value={DefaultInteractionID}>
					<UFOInteractionContext.Provider value={mockContext}>
						<UFOLoadHold name="experimental-hold" experimental={true} />
					</UFOInteractionContext.Provider>
				</UFOInteractionIDContext.Provider>,
			);

			expect(mockHold).toHaveBeenCalledWith('experimental-hold');
			expect(mockHoldExperimental).not.toHaveBeenCalled();
		});

		it('should call regular hold when experimental is false', () => {
			const mockContext = createMockContext();

			render(
				<UFOInteractionIDContext.Provider value={DefaultInteractionID}>
					<UFOInteractionContext.Provider value={mockContext}>
						<UFOLoadHold name="regular-hold" experimental={false} />
					</UFOInteractionContext.Provider>
				</UFOInteractionIDContext.Provider>,
			);

			expect(mockHold).toHaveBeenCalledWith('regular-hold');
			expect(mockHoldExperimental).not.toHaveBeenCalled();
		});
	});

	describe('children rendering', () => {
		it('should render children when provided', () => {
			const mockContext = createMockContext();

			render(
				<UFOInteractionIDContext.Provider value={DefaultInteractionID}>
					<UFOInteractionContext.Provider value={mockContext}>
						<UFOLoadHold name="test-hold">
							<div>Loading content</div>
						</UFOLoadHold>
					</UFOInteractionContext.Provider>
				</UFOInteractionIDContext.Provider>,
			);

			expect(screen.getByText('Loading content')).toBeInTheDocument();
		});

		it('should render multiple children', () => {
			const mockContext = createMockContext();

			render(
				<UFOInteractionIDContext.Provider value={DefaultInteractionID}>
					<UFOInteractionContext.Provider value={mockContext}>
						<UFOLoadHold name="test-hold">
							<div>First child</div>
							<div>Second child</div>
						</UFOLoadHold>
					</UFOInteractionContext.Provider>
				</UFOInteractionIDContext.Provider>,
			);

			expect(screen.getByText('First child')).toBeInTheDocument();
			expect(screen.getByText('Second child')).toBeInTheDocument();
		});

		it('should render null when no children are provided', () => {
			const mockContext = createMockContext();

			const { container } = render(
				<UFOInteractionIDContext.Provider value={DefaultInteractionID}>
					<UFOInteractionContext.Provider value={mockContext}>
						<UFOLoadHold name="test-hold" />
					</UFOInteractionContext.Provider>
				</UFOInteractionIDContext.Provider>,
			);

			expect(container.firstChild).toBeNull();
		});
	});

	describe('interaction ID tracking', () => {
		it('should call hold again when interaction ID changes', () => {
			const mockContext = createMockContext();

			const { rerender } = render(
				<UFOInteractionIDContext.Provider value={DefaultInteractionID}>
					<UFOInteractionContext.Provider value={mockContext}>
						<UFOLoadHold name="test-hold" />
					</UFOInteractionContext.Provider>
				</UFOInteractionIDContext.Provider>,
			);

			// Should be called once initially
			expect(mockHold).toHaveBeenCalledTimes(1);
			expect(mockHold).toHaveBeenCalledWith('test-hold');

			// Clear the mock to test the next change
			mockHold.mockClear();

			// Simulate an interaction starting by setting the interaction ID
			act(() => {
				DefaultInteractionID.current = 'interaction-1';
			});

			// The subscription system should trigger a re-render
			rerender(
				<UFOInteractionIDContext.Provider value={DefaultInteractionID}>
					<UFOInteractionContext.Provider value={mockContext}>
						<UFOLoadHold name="test-hold" />
					</UFOInteractionContext.Provider>
				</UFOInteractionIDContext.Provider>,
			);

			// Should be called again due to interaction ID change
			expect(mockHold).toHaveBeenCalledTimes(1);
			expect(mockHold).toHaveBeenCalledWith('test-hold');
		});

		it('should automatically react to interaction ID changes via subscription', () => {
			let holdCallCount = 0;
			const trackingMockHold = jest.fn(() => {
				holdCallCount++;
			});
			const trackingMockContext = createMockContext({ hold: trackingMockHold });

			render(
				<UFOInteractionIDContext.Provider value={DefaultInteractionID}>
					<UFOInteractionContext.Provider value={trackingMockContext}>
						<UFOLoadHold name="subscription-test" />
					</UFOInteractionContext.Provider>
				</UFOInteractionIDContext.Provider>,
			);

			// Should be called once initially
			expect(holdCallCount).toBe(1);

			// Set interaction ID - this should trigger the subscription
			act(() => {
				DefaultInteractionID.current = 'subscription-test-1';
			});

			// The subscription should have triggered a state update and re-render
			expect(holdCallCount).toBe(2);

			// Change interaction ID again
			act(() => {
				DefaultInteractionID.current = 'subscription-test-2';
			});

			// Should trigger again
			expect(holdCallCount).toBe(3);
		});

		it('should handle rapid interaction ID changes', () => {
			let holdCallCount = 0;
			const trackingMockHold = jest.fn(() => {
				holdCallCount++;
			});
			const trackingMockContext = createMockContext({ hold: trackingMockHold });

			render(
				<UFOInteractionIDContext.Provider value={DefaultInteractionID}>
					<UFOInteractionContext.Provider value={trackingMockContext}>
						<UFOLoadHold name="rapid-test" />
					</UFOInteractionContext.Provider>
				</UFOInteractionIDContext.Provider>,
			);

			// Initial call
			expect(holdCallCount).toBe(1);

			// Rapid changes
			act(() => {
				DefaultInteractionID.current = 'rapid-1';
				DefaultInteractionID.current = 'rapid-2';
				DefaultInteractionID.current = 'rapid-3';
			});

			// Should handle all changes (final count depends on React batching)
			expect(holdCallCount).toBeGreaterThan(1);
		});
	});

	describe('cleanup and lifecycle', () => {
		it('should handle component unmounting gracefully', () => {
			const mockContext = createMockContext();

			const { unmount } = render(
				<UFOInteractionIDContext.Provider value={DefaultInteractionID}>
					<UFOInteractionContext.Provider value={mockContext}>
						<UFOLoadHold name="cleanup-test" />
					</UFOInteractionContext.Provider>
				</UFOInteractionIDContext.Provider>,
			);

			expect(mockHold).toHaveBeenCalledWith('cleanup-test');

			// Should not throw when unmounting
			expect(() => unmount()).not.toThrow();
		});

		it('should handle context changes', () => {
			const mockContext1 = createMockContext();
			const mockContext2 = createMockContext();

			const { rerender } = render(
				<UFOInteractionIDContext.Provider value={DefaultInteractionID}>
					<UFOInteractionContext.Provider value={mockContext1}>
						<UFOLoadHold name="context-change-test" />
					</UFOInteractionContext.Provider>
				</UFOInteractionIDContext.Provider>,
			);

			expect(mockContext1.hold).toHaveBeenCalledWith('context-change-test');

			// Change context
			rerender(
				<UFOInteractionIDContext.Provider value={DefaultInteractionID}>
					<UFOInteractionContext.Provider value={mockContext2}>
						<UFOLoadHold name="context-change-test" />
					</UFOInteractionContext.Provider>
				</UFOInteractionIDContext.Provider>,
			);

			expect(mockContext2.hold).toHaveBeenCalledWith('context-change-test');
		});

		it('should handle prop changes', () => {
			const mockContext = createMockContext();

			const { rerender } = render(
				<UFOInteractionIDContext.Provider value={DefaultInteractionID}>
					<UFOInteractionContext.Provider value={mockContext}>
						<UFOLoadHold name="prop-change-test" hold={true} />
					</UFOInteractionContext.Provider>
				</UFOInteractionIDContext.Provider>,
			);

			expect(mockHold).toHaveBeenCalledWith('prop-change-test');
			mockHold.mockClear();

			// Change hold prop to false
			rerender(
				<UFOInteractionIDContext.Provider value={DefaultInteractionID}>
					<UFOInteractionContext.Provider value={mockContext}>
						<UFOLoadHold name="prop-change-test" hold={false} />
					</UFOInteractionContext.Provider>
				</UFOInteractionIDContext.Provider>,
			);

			// Should not be called when hold is false
			expect(mockHold).not.toHaveBeenCalled();

			// Change hold prop back to true
			rerender(
				<UFOInteractionIDContext.Provider value={DefaultInteractionID}>
					<UFOInteractionContext.Provider value={mockContext}>
						<UFOLoadHold name="prop-change-test" hold={true} />
					</UFOInteractionContext.Provider>
				</UFOInteractionIDContext.Provider>,
			);

			// Should be called again when hold is true
			expect(mockHold).toHaveBeenCalledWith('prop-change-test');
		});
	});

	describe('edge cases', () => {
		it('should handle undefined interaction context gracefully', () => {
			render(
				<UFOInteractionIDContext.Provider value={DefaultInteractionID}>
					<UFOLoadHold name="undefined-context-test" />
				</UFOInteractionIDContext.Provider>,
			);

			// Should not throw and should not call hold
			expect(mockHold).not.toHaveBeenCalled();
		});

		it('should handle special characters in name', () => {
			const mockContext = createMockContext();
			const specialName = 'test-hold-with-special-chars-!@#$%^&*()';

			render(
				<UFOInteractionIDContext.Provider value={DefaultInteractionID}>
					<UFOInteractionContext.Provider value={mockContext}>
						<UFOLoadHold name={specialName} />
					</UFOInteractionContext.Provider>
				</UFOInteractionIDContext.Provider>,
			);

			expect(mockHold).toHaveBeenCalledWith(specialName);
		});

		it('should handle very long names', () => {
			const mockContext = createMockContext();
			const longName = 'a'.repeat(1000);

			render(
				<UFOInteractionIDContext.Provider value={DefaultInteractionID}>
					<UFOInteractionContext.Provider value={mockContext}>
						<UFOLoadHold name={longName} />
					</UFOInteractionContext.Provider>
				</UFOInteractionIDContext.Provider>,
			);

			expect(mockHold).toHaveBeenCalledWith(longName);
		});

		it('should handle null interaction ID context', () => {
			const mockContext = createMockContext();

			render(
				<UFOInteractionIDContext.Provider value={null as any}>
					<UFOInteractionContext.Provider value={mockContext}>
						<UFOLoadHold name="null-id-context-test" />
					</UFOInteractionContext.Provider>
				</UFOInteractionIDContext.Provider>,
			);

			// Should still call hold (the interaction ID context being null doesn't prevent holds)
			expect(mockHold).toHaveBeenCalledWith('null-id-context-test');
		});
	});
});
