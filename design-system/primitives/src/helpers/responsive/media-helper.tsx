import { UNSAFE_BREAKPOINTS_CONFIG } from './constants';

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
    xxs: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.xxs.min})`,
    xs: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.xs.min})`,
    sm: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.sm.min})`,
    md: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.md.min})`,
    lg: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.lg.min})`,
    xl: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.xl.min})`,
    xxl: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.xxl.min})`,
  } as const,
  below: {
    /**
     * A media query to target viewports below the min width of a given breakpoint.
     * Note that `media.below.xxs` is intentionally omitted as this would be `@media (max-width: 0rem)`
     */
    xs: `@media (max-width: ${UNSAFE_BREAKPOINTS_CONFIG.xs.below})`,
    sm: `@media (max-width: ${UNSAFE_BREAKPOINTS_CONFIG.sm.below})`,
    md: `@media (max-width: ${UNSAFE_BREAKPOINTS_CONFIG.md.below})`,
    lg: `@media (max-width: ${UNSAFE_BREAKPOINTS_CONFIG.lg.below})`,
    xl: `@media (max-width: ${UNSAFE_BREAKPOINTS_CONFIG.xl.below})`,
    xxl: `@media (max-width: ${UNSAFE_BREAKPOINTS_CONFIG.xxl.below})`,
  } as const,
  /**
   * A media query to target viewports exactly between the min and max of a given breakpoint.
   */
  only: {
    xxs: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.xxs.min}) and (max-width: ${UNSAFE_BREAKPOINTS_CONFIG.xxs.max})`,
    xs: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.xs.min}) and (max-width: ${UNSAFE_BREAKPOINTS_CONFIG.xs.max})`,
    sm: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.sm.min}) and (max-width: ${UNSAFE_BREAKPOINTS_CONFIG.sm.max})`,
    md: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.md.min}) and (max-width: ${UNSAFE_BREAKPOINTS_CONFIG.md.max})`,
    lg: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.lg.min}) and (max-width: ${UNSAFE_BREAKPOINTS_CONFIG.lg.max})`,
    xl: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.xl.min}) and (max-width: ${UNSAFE_BREAKPOINTS_CONFIG.xl.max})`,
    xxl: `@media (min-width: ${UNSAFE_BREAKPOINTS_CONFIG.xxl.min}) and (max-width: ${UNSAFE_BREAKPOINTS_CONFIG.xxl.max})`,
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
