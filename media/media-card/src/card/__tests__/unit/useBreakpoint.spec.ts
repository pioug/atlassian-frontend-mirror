import { renderHook } from '@testing-library/react-hooks';
import { useBreakpoint } from '../../useBreakpoint';
import { Breakpoint } from '../../ui/common';

/*
  NOTE: Breakpoint sizes below 600 will result in a Breakpoint.SMALL value
  See packages/media/media-card/src/card/ui/styles.ts for reference
*/

const createDivRef = (width?: number) =>
	({
		current: {
			getBoundingClientRect: () => ({ width }),
		},
	}) as React.RefObject<HTMLDivElement>;

describe('useBreakpoint', () => {
	it.each([
		[Breakpoint.SMALL, undefined, createDivRef(600)],
		[Breakpoint.SMALL, '', createDivRef(600)],
		[Breakpoint.SMALL, 0, createDivRef(600)],
		[Breakpoint.SMALL, 100, createDivRef(600)],
		[Breakpoint.SMALL, '100', createDivRef(600)],
		[Breakpoint.SMALL, '100%', createDivRef()],
		[Breakpoint.SMALL, '100%', createDivRef(599)],
		[Breakpoint.LARGE, '20%', createDivRef(600)],
		[Breakpoint.LARGE, '100%', createDivRef(600)],
	])(
		'should return %s breakpoint for dimensionWidth of %s, divRef.width of %s',
		(expectedBreakpoint, dimensionWidth, divRef) => {
			const { result } = renderHook(() => useBreakpoint(dimensionWidth, divRef));

			expect(result.current).toEqual(expectedBreakpoint);
		},
	);
});
