import { renderHook } from '@testing-library/react';

import { usePanelContentEnter } from '../../use-panel-content-enter';

type MotionState = Parameters<typeof usePanelContentEnter>[0];

it('keeps the opening fade attached when the shorter panel slide finishes', () => {
	const { result, rerender } = renderHook(
		({ state }: { state: MotionState }) => usePanelContentEnter(state),
		{ initialProps: { state: 'entering' as MotionState } },
	);
	expect(result.current).toBe(true);
	rerender({ state: 'visible' });
	expect(result.current).toBe(true);
	rerender({ state: 'exiting' });
	expect(result.current).toBe(false);
	rerender({ state: 'entering' });
	expect(result.current).toBe(true);
	rerender({ state: 'visible' });
	expect(result.current).toBe(true);
});

it('does not animate content initially mounted as visible', () => {
	const { result } = renderHook(() => usePanelContentEnter('visible'));
	expect(result.current).toBe(false);
});
