import { isSSR } from '../../core-utils/is-ssr';

// export for testing
export function isSsrButNoBreakoutScriptObserved(): boolean {
	return isSSR() && !window.__SSR_BREAKOUT_OBSERVED;
}
