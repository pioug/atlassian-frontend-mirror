import once from '@atlaskit/ds-lib/once';

/**
 * Returns `true` when the user prefers reduced motion.
 *
 * Safe for SSR (returns `false` when `window` is unavailable).
 *
 * The result is cached after the first call via `once`. This avoids
 * calling `matchMedia` on every render. The trade-off is that if a user
 * toggles the OS reduced-motion setting mid-session, the change won't
 * take effect until the next page load. This is acceptable because
 * toggling this system-level preference mid-session is extremely rare,
 * and a page refresh is a reasonable expectation for system accessibility
 * settings to take effect.
 */
export const prefersReducedMotion = once((): boolean => {
	if (typeof window === 'undefined' || !('matchMedia' in window)) {
		return false;
	}
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}) as () => boolean;
