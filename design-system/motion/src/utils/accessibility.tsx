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
  const [prefersReducedMotion, setPrefersReducedMotion] =
    useState(isReducedMotion);

  useEffect(() => {
    if (!isMatchMediaAvailable()) {
      return;
    }

    const mediaQueryList = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );

    const onChange = (event: MediaQueryListEvent) =>
      setPrefersReducedMotion(event.matches);

    return bind(mediaQueryList, {
      type: 'change',
      listener: onChange,
    });
  }, []);

  return prefersReducedMotion;
};

/**
 * Use for any CSS based motion (animation or transition).
 * Always put at the end of your declaration for correct use of the cascade.
 * Reduced motion preference is generally set through OS preferences/settings.
 */
export const reduceMotionAsPerUserPreference = {
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none',
    transition: 'none',
  },
} as const;

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-4709 Internal documentation for deprecation (no external access)}
 * Use the sibling export `reduceMotionAsPerUserPreference` instead.
 */
export const prefersReducedMotion = () => reduceMotionAsPerUserPreference;
