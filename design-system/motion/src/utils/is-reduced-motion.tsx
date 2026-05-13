import { isMatchMediaAvailable } from './is-match-media-available';

/**
 * Use for any programatic motions needed at runtime.
 * Will return `true` if the current user prefers reduced motion.
 * This is generally set through OS preferences/settings.
 */
export const isReducedMotion = (): boolean => {
	if (!isMatchMediaAvailable()) {
		return false;
	}

	const { matches } = window.matchMedia('(prefers-reduced-motion: reduce)');
	return matches;
};
