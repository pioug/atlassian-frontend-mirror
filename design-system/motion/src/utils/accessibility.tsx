/**
 * Use for any programatic motions needed at runtime.
 * Will return `true` if the current user prefers reduced motion.
 * This is generally set through OS preferences/settings.
 */
export const isReducedMotion = (): boolean => {
  if (typeof window === 'undefined' || !('matchMedia' in window)) {
    return false;
  }

  const { matches } = window.matchMedia('(prefers-reduced-motion: reduce)');
  return matches;
};

/**
 * Use for any CSS based motion (animation or transition).
 * Always put at the end of your declaration for correct use of the cascade.
 * Reduced motion preference is generally set through OS preferences/settings.
 */
export const prefersReducedMotion = () => ({
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none',
    transition: 'none',
  },
});
