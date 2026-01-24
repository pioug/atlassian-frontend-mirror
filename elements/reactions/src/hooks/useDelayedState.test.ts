import { act, renderHook } from '@testing-library/react';

import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';

import { useDelayedState } from './useDelayedState';

jest.useFakeTimers();

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

describe('useDelayedState', () => {
	it('should initialize with the provided initial state', () => {
		const initialState = 'initial';
		const { result } = renderHook(() => useDelayedState(initialState, 1000));

		expect(result.current[0]).toBe(initialState);
	});

	it('should update state immediately when immediate is true', () => {
		const { result } = renderHook(() => useDelayedState('initial', 1000));

		act(() => {
			result.current[1]('new value', true);
		});

		expect(result.current[0]).toBe('new value');
	});

	it('should update state immediately when delay is 0', () => {
		const { result } = renderHook(() => useDelayedState('initial', 0));

		act(() => {
			result.current[1]('new value', false);
		});

		expect(result.current[0]).toBe('new value');
	});

	it('should update state after delay when immediate is false', () => {
		const { result } = renderHook(() => useDelayedState('initial', 1000));

		act(() => {
			result.current[1]('new value');
		});

		// State should not change immediately
		expect(result.current[0]).toBe('initial');

		// Fast-forward time
		act(() => {
			jest.advanceTimersByTime(1000);
		});

		// State should update after delay
		expect(result.current[0]).toBe('new value');
	});

	it('should clear previous timeout when scheduling a new update', () => {
		const { result } = renderHook(() => useDelayedState('initial', 1000));

		act(() => {
			result.current[1]('first update');
		});

		// Schedule another update before the first one completes
		act(() => {
			result.current[1]('second update');
		});

		// Fast-forward time
		act(() => {
			jest.advanceTimersByTime(1000);
		});

		// Should only have the second update
		expect(result.current[0]).toBe('second update');
	});

	it('should clear timeout on unmount', () => {
		const { result, unmount } = renderHook(() => useDelayedState('initial', 1000));

		act(() => {
			result.current[1]('new value');
		});

		// Spy on clearTimeout
		const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');

		// Unmount the component
		unmount();

		// Verify clearTimeout was called
		expect(clearTimeoutSpy).toHaveBeenCalled();
	});
});
