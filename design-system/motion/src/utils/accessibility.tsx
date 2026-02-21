import { useEffect, useState } from 'react';

import { bind } from 'bind-event-listener';

const isMatchMediaAvailable = (): boolean =>
	typeof window !== 'undefined' && 'matchMedia' in window;

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

/**
 * A React hook version of {@link isReducedMotion}.
 * Useful for React components that need to re-render if the user's motion
 * preference changes at runtime.
 */
export const useIsReducedMotion = (): boolean => {
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(isReducedMotion);

	useEffect(() => {
		if (!isMatchMediaAvailable()) {
			return;
		}

		const mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');

		const onChange = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);

		return bind(mediaQueryList, {
			type: 'change',
			listener: onChange,
		});
	}, []);

	return prefersReducedMotion;
};

// Ticket for adding an ESLint rule to recommend that any `animation` or `transition` styles are
// disabled based on the user's motion preference: https://product-fabric.atlassian.net/browse/DSP-23842
// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required
/**
 * Use for any CSS based motion (animation or transition).
 * Always put at the end of your declaration for correct use of the cascade.
 * Reduced motion preference is generally set through OS preferences/settings.
 *
 * @deprecated This is not fully compatible with Compiled CSS and will be removed in the future.
 * You should hardcode the `prefers-reduced-motion` media query in your file instead.
 */
export const reduceMotionAsPerUserPreference = {
	'@media (prefers-reduced-motion: reduce)': {
		animation: 'none',
		transition: 'none',
	},
} as const;

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-4709 Internal documentation for deprecation (no external access)}
 * This is not compatible with Compiled CSS and will be removed in the future.
 * You should hardcode the `prefers-reduced-motion` media query in your file instead.
 */
export const prefersReducedMotion = (): {
	readonly '@media (prefers-reduced-motion: reduce)': {
		readonly animation: 'none';
		readonly transition: 'none';
	};
} => reduceMotionAsPerUserPreference;
