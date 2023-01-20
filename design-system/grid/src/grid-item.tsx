/* eslint-disable @repo/internal/react/consistent-css-prop-usage */
/** @jsx jsx */
import { FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { Breakpoint, BREAKPOINTS } from './config';

const breakpointEntries = Object.entries(BREAKPOINTS);

type ResponsiveColumn = {
  [breakpoint in Exclude<Breakpoint, 'sm' | 'xs'>]?:
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
} & {
  [breakpoint in Extract<Breakpoint, 'sm'>]?: 1 | 2 | 3 | 4 | 5 | 6;
} & {
  [breakpoint in Extract<Breakpoint, 'xs'>]?: 1 | 2 | 3 | 4;
};

export type GridItemProps = {
  /**
   * A test id for automated testing.
   */
  testId?: string;
  /**
   * Content of the Grid item.
   */
  children?: ReactNode;
  /**
   * Offset in columns from the start of the row.
   */
  offset?: ResponsiveColumn;
  /**
   * Number of columns the item is meant to span.
   */
  span?: ResponsiveColumn;
};

// when in doubt simply span all columns
const baseGridItemStyles = css({
  gridColumn: '1 / span var(--ds-grid-columns)',
});

const gridItemMediaQueryStyles = breakpointEntries.reduce(
  (configs, [breakpoint, config]) => {
    return Object.assign(configs, {
      [breakpoint]: css({
        // eslint-disable-next-line @repo/internal/styles/no-nested-styles
        [`@media (min-width: ${config.min}px)`]: {
          gridColumnStart: `var(--ds-${breakpoint}-start)`,
          gridColumnEnd: `span var(--ds-${breakpoint}-span)`,
        },
      }),
    });
  },
  {} as { [key in Breakpoint]: ReturnType<typeof css> },
);

const emptyObject = {} as const;

/**
 * __Grid item__
 *
 * A grid item is designed to be nested in a `Grid`. Grid items can span one or many columns.
 *
 * - [Code](https://atlassian.design/components/grid)
 */
export const GridItem: FC<GridItemProps> = ({
  testId,
  children,
  offset = emptyObject,
  span = emptyObject,
}) => {
  const spanStyles = Object.fromEntries(
    Object.entries(span).map(([breakpoint, val]) => [
      `--ds-${breakpoint}-span`,
      val,
    ]),
  );
  const offsetStyles = Object.fromEntries(
    Object.entries(offset).map(([breakpoint, val]) => [
      `--ds-${breakpoint}-start`,
      val,
    ]),
  );
  const mediaQueryStyles = [baseGridItemStyles].concat(
    Object.keys(gridItemMediaQueryStyles)
      .filter((breakpoint) => breakpoint in span)
      .map((breakpoint) => gridItemMediaQueryStyles[breakpoint as Breakpoint]),
  );

  return (
    <div
      style={Object.assign(offsetStyles, spanStyles)}
      css={mediaQueryStyles}
      data-testid={testId}
    >
      {children}
    </div>
  );
};
