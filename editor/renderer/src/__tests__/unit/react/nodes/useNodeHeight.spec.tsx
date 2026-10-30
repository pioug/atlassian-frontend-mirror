import { act, renderHook } from '@testing-library/react';

import { defaultSchema } from '@atlaskit/adf-schema/schema-default';

import { useNodeHeight } from '../../../../react/nodes/useNodeHeight';

const node = defaultSchema.nodes.extension.create({ extensionType: 'test', extensionKey: 'macro' });

describe('host-scheduled extension min-height removal', () => {
	beforeEach(() => jest.useFakeTimers());
	afterEach(() => jest.useRealTimers());

	it('keeps the same timer on a content rerender and clears the reservation', () => {
		const cleanup = jest.fn();
		const schedule = jest.fn((_node, remove: () => void) => {
			const timer = setTimeout(remove, 5000);
			return () => {
				clearTimeout(timer);
				cleanup();
			};
		});
		const { result, rerender, unmount } = renderHook(() =>
			useNodeHeight({ nodePresetMinHeight: '150', node, scheduleRemoval: schedule }),
		);
		expect(result.current).toEqual({
			presetMinHeight: '150',
			presetHeight: undefined,
			hasExpired: false,
		});
		act(() => jest.advanceTimersByTime(4000));
		rerender();
		act(() => jest.advanceTimersByTime(1000));
		expect(result.current).toEqual({
			presetMinHeight: undefined,
			presetHeight: undefined,
			hasExpired: true,
		});
		expect(schedule).toHaveBeenCalledTimes(1);
		expect(schedule).toHaveBeenCalledWith(node, expect.any(Function), 'minHeight');
		unmount();
		expect(cleanup).toHaveBeenCalledTimes(1);
	});

	it('cancels the timer when the node unmounts', () => {
		const schedule = (_node: unknown, remove: () => void) => {
			const timer = setTimeout(remove, 5000);
			return () => clearTimeout(timer);
		};
		const { unmount } = renderHook(() =>
			useNodeHeight({ nodePresetMinHeight: '150', node, scheduleRemoval: schedule }),
		);
		expect(jest.getTimerCount()).toBe(1);
		unmount();
		expect(jest.getTimerCount()).toBe(0);
	});

	it('starts a fresh timeout when an expired value changes', () => {
		const schedule = (_node: unknown, remove: () => void) => {
			const timer = setTimeout(remove, 1000);
			return () => clearTimeout(timer);
		};
		const { result, rerender } = renderHook(
			({ value }) => useNodeHeight({ nodePresetMinHeight: value, node, scheduleRemoval: schedule }),
			{
				initialProps: { value: '150' },
			},
		);
		act(() => jest.advanceTimersByTime(1000));
		expect(result.current.presetMinHeight).toBeUndefined();
		rerender({ value: '200' });
		expect(result.current.presetMinHeight).toBe('200');
		expect(result.current.hasExpired).toBe(false);
		act(() => jest.advanceTimersByTime(999));
		expect(result.current.presetMinHeight).toBe('200');
		act(() => jest.advanceTimersByTime(1));
		expect(result.current.presetMinHeight).toBeUndefined();
	});

	it('cancels both temporary timers when viewport sizing becomes available', () => {
		const schedule = jest.fn((_node: unknown, remove: () => void) => {
			const timer = setTimeout(remove, 1000);
			return () => clearTimeout(timer);
		});
		const { result, rerender } = renderHook(
			({ hasViewportSize }) =>
				useNodeHeight({
					nodePresetMinHeight: '150',
					nodePresetHeight: 21,
					node,
					scheduleRemoval: schedule,
					hasViewportSize,
				}),
			{ initialProps: { hasViewportSize: false } },
		);
		expect(jest.getTimerCount()).toBe(2);
		rerender({ hasViewportSize: true });
		expect(jest.getTimerCount()).toBe(0);
		expect(result.current).toEqual({
			presetMinHeight: undefined,
			presetHeight: undefined,
			hasExpired: false,
		});
		expect(schedule).toHaveBeenCalledTimes(2);
	});

	it('preserves a height when the host declines to schedule removal', () => {
		const schedule = jest.fn(() => undefined);
		const { result } = renderHook(() =>
			useNodeHeight({ nodePresetMinHeight: '150', node, scheduleRemoval: schedule }),
		);
		act(() => jest.advanceTimersByTime(10000));
		expect(result.current).toEqual({
			presetMinHeight: '150',
			presetHeight: undefined,
			hasExpired: false,
		});
	});

	it('does not schedule when there is no height', () => {
		const schedule = jest.fn(() => undefined);
		const { result } = renderHook(() => useNodeHeight({ node, scheduleRemoval: schedule }));
		expect(result.current).toEqual({
			presetMinHeight: undefined,
			presetHeight: undefined,
			hasExpired: false,
		});
		expect(schedule).not.toHaveBeenCalled();
	});
	it.each([0, 21])('expires a fixed height without requiring min-height: %s', (fixedHeight) => {
		const schedule = (_node: unknown, remove: () => void) => {
			const timer = setTimeout(remove, 5000);
			return () => clearTimeout(timer);
		};
		const { result } = renderHook(() =>
			useNodeHeight({ node, scheduleRemoval: schedule, nodePresetHeight: fixedHeight }),
		);
		expect(result.current).toEqual({
			presetMinHeight: undefined,
			presetHeight: fixedHeight,
			hasExpired: false,
		});
		act(() => jest.advanceTimersByTime(5000));
		expect(result.current).toEqual({
			presetMinHeight: undefined,
			presetHeight: undefined,
			hasExpired: true,
		});
	});
	it('expires height and min-height separately without restarting the remaining timer', () => {
		const cleanup = jest.fn();
		const schedule = jest.fn(
			(_node: unknown, remove: () => void, property: 'height' | 'minHeight') => {
				const timer = setTimeout(remove, property === 'height' ? 1000 : 2000);
				return () => {
					clearTimeout(timer);
					cleanup();
				};
			},
		);
		const { result, unmount } = renderHook(() =>
			useNodeHeight({
				nodePresetMinHeight: '150',
				node,
				scheduleRemoval: schedule,
				nodePresetHeight: 300,
			}),
		);
		expect(result.current).toEqual({
			presetMinHeight: '150',
			presetHeight: 300,
			hasExpired: false,
		});
		act(() => jest.advanceTimersByTime(1000));
		expect(result.current).toEqual({
			presetMinHeight: '150',
			presetHeight: undefined,
			hasExpired: true,
		});
		act(() => jest.advanceTimersByTime(1000));
		expect(result.current).toEqual({
			presetMinHeight: undefined,
			presetHeight: undefined,
			hasExpired: true,
		});
		expect(schedule).toHaveBeenCalledTimes(2);
		unmount();
		expect(cleanup).toHaveBeenCalledTimes(2);
	});
});
