/** @jsx jsx */
import { CSSProperties, FC, useMemo } from 'react';

import { css, jsx } from '@emotion/react';

import { BREAKPOINTS_LIST, GRID_COLUMNS } from './config';
import { UNSAFE_media as media } from './media-helper';
import type {
  BreakpointCSSObject,
  GridItemProps,
  SpanObject,
  StartObject,
} from './types';

// when in doubt simply span all columns
const baseGridItemStyles = css({
  gridColumn: `1 / span ${GRID_COLUMNS}`,
});

const gridSpanMediaQueries = BREAKPOINTS_LIST.reduce(
  (acc, breakpoint) => ({
    ...acc,
    [breakpoint]: css({
      // eslint-disable-next-line @repo/internal/styles/no-nested-styles
      [media.above[breakpoint]]: {
        gridColumnEnd: `span var(--ds-${breakpoint}-span)`,
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
        gridColumnStart: `var(--ds-${breakpoint}-start)`,
      },
    }),
  }),
  {} as BreakpointCSSObject,
);

function buildCSSVarsFromConfig(prop: SpanObject, key: 'span'): CSSProperties;
function buildCSSVarsFromConfig(prop: StartObject, key: 'start'): CSSProperties;
function buildCSSVarsFromConfig(
  prop: SpanObject | StartObject,
  key: 'start' | 'span',
): CSSProperties {
  if (typeof prop !== 'object') {
    return { [`--ds-xs-${key}` as const]: prop };
  }

  /**
   * This coerces an object of `{ xs: 12, sm: 'auto', … }` down to `[['xs', 12], ['sm', 'auto], …]`.  Split out for readability.
   */
  const entries = Object.entries(prop) as [
    keyof typeof prop,
    typeof prop[keyof typeof prop],
  ][];

  return entries.reduce((acc, [breakpoint, value]) => {
    if (typeof value === 'undefined') {
      return acc;
    }

    return {
      ...acc,
      [`--ds-${breakpoint}-${key}` as const]: value,
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
  const span: SpanObject =
    typeof spanProp === 'object' ? spanProp : { xs: spanProp };
  const spanStyles = useMemo(
    () => buildCSSVarsFromConfig(span, 'span'),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `span` will change references easily, but its keys should only change when expected…
    [Object.keys(span).join()],
  );

  const start: StartObject =
    typeof startProp === 'object' ? startProp : { xs: startProp };
  const startStyles = useMemo(
    () => buildCSSVarsFromConfig(start, 'start'),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `start` will change references easily, but its keys should only change when expected…
    [Object.keys(start).join()],
  );

  /**
   * Generate all media queries for breakpoints that are available during this render.  This is to avoid rendering media queries for all breakpoints if none are used.
   */
  const mediaQueryStyles = useMemo(
    () =>
      BREAKPOINTS_LIST.reduce((acc, breakpoint) => {
        const styles: ReturnType<typeof css>[] = [];

        if (breakpoint in span) {
          styles.push(gridSpanMediaQueries[breakpoint]);
        }
        if (breakpoint in start) {
          styles.push(gridStartMediaQueries[breakpoint]);
        }

        if (!styles.length) {
          return acc;
        }

        return [...acc, ...styles];
      }, [] as ReturnType<typeof css>[]),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `start` and `span` will change references easily, but their keys should only change when expected…
    [Object.keys(start).join(), Object.keys(span).join()],
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
