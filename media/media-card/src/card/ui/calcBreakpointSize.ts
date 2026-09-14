import { Breakpoint } from './common';

type BreakpointSize = [Breakpoint, number];

const breakpointSizes: Array<BreakpointSize> = [
	[Breakpoint.SMALL, 599],
	[Breakpoint.LARGE, Infinity],
];

export const calcBreakpointSize = (wrapperWidth: number = 0): Breakpoint => {
	const [breakpoint] = breakpointSizes.find(([_breakpoint, limit]) => wrapperWidth <= limit) || [
		Breakpoint.SMALL,
	];
	return breakpoint;
};
