import { renderHook } from '@testing-library/react';

import usePrevious from './index';

describe('usePrevious()', () => {
	it('should return undefined for the initial render', () => {
		const { result } = renderHook(() => {
			return usePrevious(0);
		});

		expect(result.current).toBeUndefined();
	});

	it('should return zero on the subsequent render', () => {
		const { result, rerender } = renderHook(() => {
			return usePrevious(0);
		});

		rerender();

		expect(result.current).toEqual(0);
	});
});
