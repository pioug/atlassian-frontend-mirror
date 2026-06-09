import { renderHook } from '@testing-library/react';

import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

describe('usePopoverId', () => {
	it('returns a non-empty string', () => {
		const { result } = renderHook(() => usePopoverId());
		expect(typeof result.current).toBe('string');
		expect(result.current.length).toBeGreaterThan(0);
	});

	it('returns the same id across re-renders', () => {
		const { result, rerender } = renderHook(() => usePopoverId());
		const first = result.current;

		rerender();

		expect(result.current).toBe(first);
	});

	it('returns distinct ids for distinct instances', () => {
		const { result: a } = renderHook(() => usePopoverId());
		const { result: b } = renderHook(() => usePopoverId());

		expect(a.current).not.toBe(b.current);
	});
});
