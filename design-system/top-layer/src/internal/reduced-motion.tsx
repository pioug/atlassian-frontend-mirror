import once from '@atlaskit/ds-lib/once';

/**
 * Returns `true` when the user prefers reduced motion. Returns `false` when `window` or
 * `matchMedia` is not available, for example during SSR.
 *
 * `once` caches the first result, so `matchMedia` does not run on every render. The trade-off: if
 * the user changes the OS setting during a session, the change takes effect on the next page load.
 * This is acceptable because users rarely change this setting during a session, and a page refresh
 * is a reasonable expectation for a system accessibility setting. See
 * `notes/decisions/audit-decisions.md` (decision 8).
 */
export const prefersReducedMotion: () => boolean = once(
	function getPrefersReducedMotion(): boolean {
		if (typeof window === 'undefined' || !('matchMedia' in window)) {
			return false;
		}
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	},
);
