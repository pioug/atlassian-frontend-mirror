import { useEffect, useState } from 'react';

import { bind } from 'bind-event-listener';

import { isMatchMediaAvailable } from './is-match-media-available';
import { isReducedMotion } from './is-reduced-motion';

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
