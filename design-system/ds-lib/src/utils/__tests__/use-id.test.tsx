import { renderHook } from '@testing-library/react';

import { useId } from '../use-id';

describe('useId', () => {
	it('returns a unique selector-safe identifier', () => {
		const { result: useIdResult } = renderHook(() => useId());
		expect(useIdResult.current).toMatch(/^_r[\d]+_$/);
	});

	it('returns selector-safe id when React.useId is available', () => {
		const { result: useIdResult } = renderHook(() => useId());
		// Our useId uses `_` instead of `:` so it works with document.querySelector(…)
		expect(useIdResult.current).not.toContain(':');
		expect(useIdResult.current).not.toContain('«');
		expect(useIdResult.current).not.toContain('»');
	});
});
