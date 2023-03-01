import { BREAKPOINTS_CONFIG, BREAKPOINTS_LIST } from './config';
import type { Breakpoint } from './types';

type MediaQuery = `@media (${string})`;
type ResponsiveMediaObject = Record<Breakpoint, MediaQuery>;

/**
 * This is an object of usable media query helpers using our internal breakpoints configuration.
 *
 *  WARNING: This is exported as `UNSAFE` because this may not be the final home for it.  Do not use it unless you're willing to bring in another package at a later date.
 */
export const UNSAFE_media: Record<
  'above' | 'below' | 'between',
  ResponsiveMediaObject
> = {
  above: BREAKPOINTS_LIST.reduce(
    (acc, breakpoint) => ({
      ...acc,
      [breakpoint]: `@media (min-width: ${BREAKPOINTS_CONFIG[breakpoint].min}px)`,
    }),
    {} as ResponsiveMediaObject,
  ),
  below: BREAKPOINTS_LIST.reduce(
    (acc, breakpoint) => ({
      ...acc,
      [breakpoint]: `@media (max-width: ${BREAKPOINTS_CONFIG[breakpoint].max}px)`,
    }),
    {} as ResponsiveMediaObject,
  ),
  between: BREAKPOINTS_LIST.reduce(
    (acc, breakpoint) => ({
      ...acc,
      [breakpoint]: `@media (min-width: ${BREAKPOINTS_CONFIG[breakpoint].min}px) and (max-width: ${BREAKPOINTS_CONFIG[breakpoint].max}px)`,
    }),
    {} as ResponsiveMediaObject,
  ),
};
