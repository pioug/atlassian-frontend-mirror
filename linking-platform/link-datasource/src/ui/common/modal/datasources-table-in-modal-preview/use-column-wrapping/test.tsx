import { act, renderHook } from '@testing-library/react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { useColumnWrapping } from './index';

describe('useColumnWrapping', () => {
	it('should return empty set of wrapped column keys if no initial keys provided', () => {
		const { result } = renderHook(() => useColumnWrapping(undefined));

		expect(result.current.wrappedColumnKeys).toStrictEqual([]);
	});

	it('should return initial wrapped column keys', () => {
		const initialWrappedColumnKeys: string[] = [];

		const { result } = renderHook(() => useColumnWrapping(initialWrappedColumnKeys));

		expect(result.current.wrappedColumnKeys).toBe(initialWrappedColumnKeys);
	});

	it('should add and delete wrapped keys', () => {
		const initialWrappedColumnKeys: string[] = [];

		const { result } = renderHook(() => useColumnWrapping(initialWrappedColumnKeys));

		expect(result.current.wrappedColumnKeys).toStrictEqual([]);

		act(() => {
			result.current.onWrappedColumnChange('foo', true);
		});

		expect(result.current.wrappedColumnKeys).toStrictEqual(['foo']);

		act(() => {
			result.current.onWrappedColumnChange('bar', true);
		});

		expect(result.current.wrappedColumnKeys).toStrictEqual(['foo', 'bar']);

		act(() => {
			result.current.onWrappedColumnChange('foo', false);
		});

		expect(result.current.wrappedColumnKeys).toStrictEqual(['bar']);

		act(() => {
			result.current.onWrappedColumnChange('bar', false);
		});

		expect(result.current.wrappedColumnKeys).toStrictEqual([]);
	});

	it('should handle redundant commands', () => {
		const initialWrappedColumnKeys: string[] = [];

		const { result } = renderHook(() => useColumnWrapping(initialWrappedColumnKeys));

		expect(result.current.wrappedColumnKeys).toStrictEqual([]);

		act(() => {
			result.current.onWrappedColumnChange('foo', false);
			result.current.onWrappedColumnChange('foo', false);
		});

		expect(result.current.wrappedColumnKeys).toStrictEqual([]);

		act(() => {
			result.current.onWrappedColumnChange('foo', true);
			result.current.onWrappedColumnChange('foo', true);
		});

		expect(result.current.wrappedColumnKeys).toStrictEqual(['foo']);

		act(() => {
			result.current.onWrappedColumnChange('foo', false);
		});

		expect(result.current.wrappedColumnKeys).toStrictEqual([]);
	});

	it('should not return onWrappedColumnsChange when the gate is off', () => {
		failGate('platform_lp_sllv_table_settings_menu');

		const { result } = renderHook(() => useColumnWrapping(['foo']));

		expect(result.current.onWrappedColumnsChange).toBeUndefined();
	});

	it('should only keep the last wrap change when multiple keys are updated in one tick when the gate is off', () => {
		failGate('platform_lp_sllv_table_settings_menu');

		const { result } = renderHook(() => useColumnWrapping([]));

		act(() => {
			result.current.onWrappedColumnChange('foo', true);
			result.current.onWrappedColumnChange('bar', true);
		});

		expect(result.current.wrappedColumnKeys).toStrictEqual(['bar']);
	});

	it('should apply every wrap change when multiple keys are updated in one tick when the gate is on', () => {
		passGate('platform_lp_sllv_table_settings_menu');

		const { result } = renderHook(() => useColumnWrapping([]));

		act(() => {
			result.current.onWrappedColumnChange('foo', true);
			result.current.onWrappedColumnChange('bar', true);
		});

		expect(result.current.wrappedColumnKeys).toStrictEqual(['foo', 'bar']);
	});

	it('should replace all wrapped keys in one update when the gate is on', () => {
		passGate('platform_lp_sllv_table_settings_menu');

		const { result } = renderHook(() => useColumnWrapping(['foo']));

		act(() => {
			result.current.onWrappedColumnsChange?.(['foo', 'bar', 'baz']);
		});

		expect(result.current.wrappedColumnKeys).toStrictEqual(['foo', 'bar', 'baz']);

		act(() => {
			result.current.onWrappedColumnsChange?.([]);
		});

		expect(result.current.wrappedColumnKeys).toStrictEqual([]);
	});
});
