import { reduceMotionAsPerUserPreference } from './reduce-motion-as-per-user-preference';

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
