/** @jsx jsx */
import { CSSProperties, FC, useMemo } from 'react';

import { css, jsx } from '@emotion/react';

import { BREAKPOINTS_LIST, GRID_COLUMNS } from './config';
import { UNSAFE_media as media } from './media-helper';
import type {
  Breakpoint,
  BreakpointCSSObject,
  GridItemProps,
  ResponsiveObject,
  SpanObject,
  StartObject,
} from './types';

// when in doubt simply span all columns
const baseGridItemStyles = css({
  gridColumn: `1 / span ${GRID_COLUMNS}`,
});

const hideMediaQueries = BREAKPOINTS_LIST.reduce(
  (acc, breakpoint) => ({
    ...acc,
    [breakpoint]: css({
      // eslint-disable-next-line @repo/internal/styles/no-nested-styles
      [media.above[breakpoint]]: { display: 'none' },
    }),
  }),
  {} as BreakpointCSSObject,
);

const gridSpanMediaQueries = BREAKPOINTS_LIST.reduce(
  (acc, breakpoint) => ({
    ...acc,
    [breakpoint]: css({
      // eslint-disable-next-line @repo/internal/styles/no-nested-styles
      [media.above[breakpoint]]: {
        display: 'block', // required to reset the display: none we might cascade with `span="none"`
        gridColumnEnd: `span var(--grid-item-${breakpoint}-span, 12)`,
      },
    }),
  }),
  {} as BreakpointCSSObject,
);

const gridStartMediaQueries = BREAKPOINTS_LIST.reduce(
  (acc, breakpoint) => ({
    ...acc,
    [breakpoint]: css({
      // eslint-disable-next-line @repo/internal/styles/no-nested-styles
      [media.above[breakpoint]]: {
        gridColumnStart: `var(--grid-item-${breakpoint}-start, 'auto')`,
      },
    }),
  }),
  {} as BreakpointCSSObject,
);

/**
 * Build a set of responsive css variables given a responsive object
 *
 */
function buildCSSVarsFromConfig<
  T extends ResponsiveObject<any> = SpanObject | StartObject,
  K extends string = 'start' | 'span',
>({
  responsiveObject,
  key,
  prefix,
  isValidBreakpointValue = () => true,
}: {
  responsiveObject: T;
  key: K;
  prefix: string;
  /**
   * Is the value valid to assign to a CSS variable?  We have scenarios where the value should not map across into a CSS Var.
   *
   * By default this is not required as regardless of this check, `undefined` values are always treated as invalid and ignored.
   *
   * @example
   * `span="none"` should not exist as `grid-column-end: span none` is invalid
   * ```ts
   * buildCSSVarsFromConfig(
   *   { xs: 'none', md: 6 },
   *   'span',
   *   (value) => value !== 'none'`
   * )
   * ```
   */
  isValidBreakpointValue?: (value: T[Breakpoint]) => boolean;
}): CSSProperties {
  /**
   * This coerces an object of `{ xs: 12, sm: 'auto', … }` down to `[['xs', 12], ['sm', 'auto], …]`.  Split out for readability.
   */
  const entries = Object.entries(responsiveObject) as [keyof T, T[keyof T]][];

  return entries.reduce((acc, [breakpoint, value]) => {
    if (typeof value === 'undefined' || !isValidBreakpointValue(value)) {
      return acc;
    }

    return {
      ...acc,
      [`--${prefix}-${String(breakpoint)}-${key}` as const]: value,
    };
  }, {});
}

/**
 * __Grid item__
 *
 * A grid item is designed to be nested in a `Grid`. Grid items can span one or many columns.
 *
 * - [Code](https://atlassian.design/components/grid)
 *
 * @example
 * ```jsx
 * import Grid, { GridItem } from '@atlaskit/grid';
 *
 * const App = () => (
 *   <Grid>
 *     <GridItem span="6">half-width content</GridItem>
 *     <GridItem span="6">half-width content</GridItem>
 *   </Grid>
 * );
 * ```
 */
export const GridItem: FC<GridItemProps> = ({
  testId,
  children,
  start: startProp = 'auto',
  span: spanProp = 12,
}) => {
  // If `prop` isn't a responsive object, we set the value against the `xs` breakpoint, eg. `span={6}` is the same as `span={{ xs: 6 }}`
  const span: SpanObject =
    typeof spanProp === 'object' ? spanProp : { xs: spanProp };
  const spanStyles = useMemo(
    () =>
      buildCSSVarsFromConfig({
        responsiveObject: span,
        key: 'span',
        prefix: 'grid-item',
        // We don't want a css var like `--grid-item-xs-span: none` as it's invalid and unused.
        isValidBreakpointValue: (value) => value !== 'none',
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `span` will change references easily, but we still need to allow content or key changes to update
    [JSON.stringify(span)],
  );

  // If `prop` isn't a responsive object, we set the value against the `xs` breakpoint, eg. `start={6}` is the same as `start={{ xs: 6 }}`
  const start: StartObject =
    typeof startProp === 'object' ? startProp : { xs: startProp };
  const startStyles = useMemo(
    () =>
      buildCSSVarsFromConfig({
        responsiveObject: start,
        key: 'start',
        prefix: 'grid-item',
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `start` will change references easily, but we still need to allow content or key changes to update
    [JSON.stringify(start)],
  );

  /**
   * Generate all media queries for breakpoints that are available during this render.  This is to avoid rendering media queries for all breakpoints if none are used.
   */
  const mediaQueryStyles = useMemo(
    () =>
      BREAKPOINTS_LIST.reduce((acc, breakpoint) => {
        const styles: ReturnType<typeof css>[] = [];

        if (breakpoint in span) {
          if (span[breakpoint] === 'none') {
            styles.push(hideMediaQueries[breakpoint]);
          } else {
            styles.push(gridSpanMediaQueries[breakpoint]);
          }
        }
        if (breakpoint in start) {
          styles.push(gridStartMediaQueries[breakpoint]);
        }

        if (!styles.length) {
          return acc;
        }

        return [...acc, ...styles];
      }, [] as ReturnType<typeof css>[]),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `start` and `span` will change references easily, but we still need to allow content or key changes to update.  This _should_ be more performant than running on every render as I don't expect this to change.
    [JSON.stringify(span), JSON.stringify(start)],
  );

  return (
    <div
      style={{ ...startStyles, ...spanStyles }}
      css={[baseGridItemStyles, ...mediaQueryStyles]}
      data-testid={testId}
    >
      {children}
    </div>
  );
};
