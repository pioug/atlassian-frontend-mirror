import { UNSAFE_BREAKPOINTS_CONFIG } from './constants';

/**
 * To ensure min-width and max-width do both target at the same time, we subtract a value.
 * We use a fractional value here as used in other libraries and described in @link https://www.w3.org/TR/mediaqueries-4/#mq-min-max: "…possibility of fractional viewport sizes which can occur as a result of non-integer pixel densities…"
 */
const BELOW_PRECISION = 0.02;

/**
 * This is the full internal version.  The import has been separated to only expose as-needed.
 */
const internalMedia = {
  /**
   * A media query to target viewports above the min width of a given breakpoint.
   * Note that `media.above.xs` is redundant and should not be used, but it's included for programatic purposes.
   */
  above: {
    /**
     * `above.xxs` is redundant and no media query should be used, but it's included for programatic purposes…
     *
     * Eg. this is `@media (min-width: 0px)`
     */
    xxs: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.xxs.min}px)`,
    xs: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.xs.min}px)`,
    sm: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.sm.min}px)`,
    md: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.md.min}px)`,
    lg: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.lg.min}px)`,
    xl: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.xl.min}px)`,
    xxl: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.xxl.min}px)`,
  } as const,
  below: {
    /**
     * A media query to target viewports below the min width of a given breakpoint.
     * Note that `media.below.xxs` is intentionally omitted as this would be `@media (max-width: 0px)`
     */
    xs: `@media (max-width: ${
      UNSAFE_BREAKPOINTS_CONFIG.xs.min - BELOW_PRECISION
    }px)`,
    sm: `@media (max-width: ${
      UNSAFE_BREAKPOINTS_CONFIG.sm.min - BELOW_PRECISION
    }px)`,
    md: `@media (max-width: ${
      UNSAFE_BREAKPOINTS_CONFIG.md.min - BELOW_PRECISION
    }px)`,
    lg: `@media (max-width: ${
      UNSAFE_BREAKPOINTS_CONFIG.lg.min - BELOW_PRECISION
    }px)`,
    xl: `@media (max-width: ${
      UNSAFE_BREAKPOINTS_CONFIG.xl.min - BELOW_PRECISION
    }px)`,
    xxl: `@media (max-width: ${
      UNSAFE_BREAKPOINTS_CONFIG.xxl.min - BELOW_PRECISION
    }px)`,
  } as const,
  /**
   * A media query to target viewports exactly between the min and max of a given breakpoint.
   */
  only: {
    xxs: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.xxs.min}px) and (max-width: ${UNSAFE_BREAKPOINTS_CONFIG.xxs.max}px)`,
    xs: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.xs.min}px) and (max-width: ${UNSAFE_BREAKPOINTS_CONFIG.xs.max}px)`,
    sm: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.sm.min}px) and (max-width: ${UNSAFE_BREAKPOINTS_CONFIG.sm.max}px)`,
    md: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.md.min}px) and (max-width: ${UNSAFE_BREAKPOINTS_CONFIG.md.max}px)`,
    lg: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.lg.min}px) and (max-width: ${UNSAFE_BREAKPOINTS_CONFIG.lg.max}px)`,
    xl: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.xl.min}px) and (max-width: ${UNSAFE_BREAKPOINTS_CONFIG.xl.max}px)`,
    xxl: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.xxl.min}px) and (max-width: ${UNSAFE_BREAKPOINTS_CONFIG.xxl.max}px)`,
  } as const,
};

/**
 * This is an object of usable media query helpers using our internal breakpoints configuration.
 *
 * @experimental Unsafe for usage as the API is not finalized.
 */
export const UNSAFE_media = {
  above: internalMedia.above,
  below: internalMedia.below,
} as const;

/**
 * With these types:
 * ```
 * type MediaQuery = `@media (${string})`;
 * type ResponsiveMediaObject = Record<Breakpoint, MediaQuery>;
 * ```
 *
 * TODO: This `media` object as of typescript@4.9, would benefit from satisfies, eg.:
 * ```
 * const UNSAFE_media = { … } satisfies Record<'above' | 'only', ResponsiveMediaObject> & { below: Omit<ResponsiveMediaObject, 'xxs'> }
 * ```
 */
