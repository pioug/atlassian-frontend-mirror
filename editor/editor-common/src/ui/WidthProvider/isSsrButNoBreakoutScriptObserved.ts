import { isSSR } from './isSSR';

// export for testing
export function isSsrButNoBreakoutScriptObserved(): boolean {
	return isSSR() && !window.__SSR_BREAKOUT_OBSERVED;
}
