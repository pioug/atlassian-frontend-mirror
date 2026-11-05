import { useTopNavBreakpoints } from './use-top-nav-breakpoints';

/**
 * Use the enclosing TopNav's border-box width, matching its 48rem sm breakpoint.
 * Until that width is measured, use an icon-only fallback: the server cannot know
 * the container width, and text buttons can overlap at narrow widths.
 */
export function useIsCompactTopNav(): boolean {
	const breakpoints = useTopNavBreakpoints();
	return breakpoints ? !breakpoints.hasMeasured || breakpoints.belowSm : false;
}
