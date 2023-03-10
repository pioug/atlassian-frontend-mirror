import type { ReactNode } from 'react';

import { css } from '@emotion/react';

export type Breakpoint = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/**
 * Builds an object for each breakpoint, eg. `{ xxs?: T, xs?: T, sm?: T, … }`
 */
export type ResponsiveObject<T> = Partial<Record<Breakpoint, T>>;

export type SpanOptions =
  | 'none'
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12;
export type SpanObject = ResponsiveObject<SpanOptions>;

export type StartOptions = 'auto' | SpanOptions;
export type StartObject = ResponsiveObject<StartOptions>;

export type GridItemProps = {
  /**
   * A test id for automated testing.
   */
  testId?: string;
  /**
   * Content of the Grid item.
   */
  children: ReactNode;
  /**
   * The column at which the GridItem will start, set per-breakpoint or via a shorthand to apply across every breakpoint.  For reference, this roughly maps to [grid-column-start](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column-start).
   *
   * - `'auto'` will flow normally and start at the next available column.
   * - A number (`1`–`12`) results in the GridItem starting at that column number.
   *
   * When set per-breakpoint, this value cascades upwards, eg. `xs` applies to `sm` and so on until hitting another defined value.
   *
   * See @link https://staging.atlassian.design/components/grid/usage#cascading-responsive-objects for details on cascading.
   *
   * @default 'auto'
   */
  start?: StartOptions | StartObject;
  /**
   * The number of columns the GridItem will span, set per-breakpoint or via a shorthand to apply across every breakpoint.  For reference, this roughly maps the "span #" (where the number is this prop) in For reference, this roughly maps to [grid-column-end](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column-end).
   *
   * - `'none'` will hide this column entirely
   * - A number (`1`–`12`) results in the GridItem spanning that many columns
   *
   * ⚠️ If you're using the responsive object syntax, the default span for breakpoints you do not define is `12`.  This may be what you want and is intentional, eg. mobile will span full-width by default.
   *
   * When set per-breakpoint, this value cascades upwards, eg. `xs` applies to `sm` and so on until hitting another defined value.
   *
   * See @link https://staging.atlassian.design/components/grid/usage#cascading-responsive-objects for details on cascading.
   *
   * @default 12
   */
  span?: SpanOptions | SpanObject;
};

export type BreakpointCSSObject = Record<Breakpoint, ReturnType<typeof css>>;
