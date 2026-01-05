import { act, renderHook } from '@testing-library/react';

import { useColumnResize } from './index';

describe('useColumnResize', () => {
	it('should return empty sizes if no sizes argument provided', () => {
		const { result } = renderHook(() => useColumnResize(undefined));

		expect(result.current.columnCustomSizes).toBeUndefined();
	});

	it('should return initial column custom sizes argument by default', () => {
		const { result } = renderHook(() =>
			useColumnResize({
				summary: 100,
			}),
		);

		expect(result.current.columnCustomSizes).toStrictEqual({ summary: 100 });
	});

	it('onColumnResize should override existing column sizes', () => {
		const { result } = renderHook(() =>
			useColumnResize({
				summary: 100,
				assignee: 50,
			}),
		);

		act(() => {
			result.current.onColumnResize('summary', 0);
		});

		expect(result.current.columnCustomSizes).toStrictEqual({
			summary: 0,
			assignee: 50,
		});
	});

	it('onColumnResize should merge value for given column name', () => {
		const { result } = renderHook(() =>
			useColumnResize({
				summary: 100,
			}),
		);

		act(() => {
			result.current.onColumnResize('assignee', 50);
		});

		expect(result.current.columnCustomSizes).toStrictEqual({
			summary: 100,
			assignee: 50,
		});
	});
});
