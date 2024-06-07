import { act, renderHook } from '@testing-library/react-hooks';

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
});
