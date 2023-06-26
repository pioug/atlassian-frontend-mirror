import { UNSAFE_BREAKPOINTS_CONFIG } from './constants';

/**
 * This is an object of usable media query helpers using our internal breakpoints configuration.
 *
 * @internal This explicitly has and should not be used outside of ADS-owned repos (via sourcegraph); to be removed following an internal deprecation and migration.
 */
export const UNSAFE_media = {
  /**
   * A media query to target viewports above the min width of a given breakpoint.
   * Note that `media.above.xs` is redundant and should not be used, but it's included for programatic purposes.
   */
  above: {
    /**
     * `above.xxs` is redundant and no media query should be used, but it's included for programatic purposes…
     */
    xxs: `@media all`,
    xs: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.xs.min})`,
    sm: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.sm.min})`,
    md: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.md.min})`,
    lg: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.lg.min})`,
    xl: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.xl.min})`,
  } as const,
  /**
   * A media query to target viewports below the min width of a given breakpoint.  We do this by testing the inverse, eg. below = not above…
   *
   * NOTE: `below.xxs` is intentionally not included as it could lead to incorrect usages as it's never accessible as this would be `xxs: '@media not all',`
   *
   * We use this syntax as a more compatible way to ensure media queries do not overlap, eg. `media.above.md` and `media.below.md` should not both trigger at once.
   * This is well describe in this: @see https://stackoverflow.com/a/13649011
   *
   * Ideally we would use media queries level 4 to improve this interface, but this works and browser support might not be sufficient yet: @see https://www.w3.org/TR/mediaqueries-4/
   *
   * @internal Not intended to be used outside of DST at this stage.
   * @experimental Not intended to be used outside of DST at this stage.
   */
  below: {
    xs: `@media not all and (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.xs.min})`,
    sm: `@media not all and (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.sm.min})`,
    md: `@media not all and (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.md.min})`,
    lg: `@media not all and (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.lg.min})`,
    xl: `@media not all and (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.xl.min})`,
  } as const,
  /**
   * A media query to target viewports exactly between the min and max of a given breakpoint.
   * Ideally we would use media queries level 4 to improve this interface, but this works and browser support might not be sufficient yet: @see https://www.w3.org/TR/mediaqueries-4/
   *
   * @internal Not intended to be used outside of DST at this stage.
   * @experimental Not intended to be used outside of DST at this stage.
   */
  only: {
    xxs: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.xxs.min}) and (max-width: ${UNSAFE_BREAKPOINTS_CONFIG.xxs.max})`,
    xs: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.xs.min}) and (max-width: ${UNSAFE_BREAKPOINTS_CONFIG.xs.max})`,
    sm: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.sm.min}) and (max-width: ${UNSAFE_BREAKPOINTS_CONFIG.sm.max})`,
    md: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.md.min}) and (max-width: ${UNSAFE_BREAKPOINTS_CONFIG.md.max})`,
    lg: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.lg.min}) and (max-width: ${UNSAFE_BREAKPOINTS_CONFIG.lg.max})`,
    xl: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.xl.min})`,
  } as const,
};

/**
 * This is an object of usable media query helpers using our internal breakpoints configuration.
 *
 * We strictly only export `media.above` at this stage as we want makers to build mobile-first.
 */
export const media = {
  above: UNSAFE_media.above,
} as const;
