/* eslint-disable @repo/internal/react/consistent-css-prop-usage */
/** @jsx jsx */
import { createContext, FC, ReactNode, useContext } from 'react';

import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import {
  UNSAFE_BREAKPOINTS_CONFIG,
  UNSAFE_buildAboveMediaQueryCSS,
} from '@atlaskit/primitives/responsive';

import { GRID_COLUMNS } from './config';

export type GridProps = {
  /**
   * A test id for automated testing
   */
  testId?: string;
  /**
   * If set, will restrict the max-width of the Grid to pre-defined values.
   *
   * `'narrow'` = 744px
   * `'wide'` = 1128px
   */
  maxWidth?: 'narrow' | 'wide';
  /**
   * The grid items.
   */
  children: ReactNode;
  /**
   * Remove inline padding from grid.
   *
   * @default true
   */
  hasInlinePadding?: boolean;
};

const gapMediaQueries = Object.values(
  UNSAFE_buildAboveMediaQueryCSS((breakpoint) => ({
    gap: UNSAFE_BREAKPOINTS_CONFIG[breakpoint].gridItemGutter,
  })),
);

const inlinePaddingMediaQueries = Object.values(
  UNSAFE_buildAboveMediaQueryCSS((breakpoint) => ({
    paddingInline: UNSAFE_BREAKPOINTS_CONFIG[breakpoint].gridMargin,
  })),
);

const baseStyles = css({
  display: 'grid',
  boxSizing: 'border-box',
  width: '100%',
  gridTemplateColumns: `repeat(${GRID_COLUMNS}, 1fr)`,
  marginInline: 'auto',
});

const gridMaxWidthMap: Record<
  NonNullable<GridProps['maxWidth']>,
  ReturnType<typeof css>
> = {
  wide: css({ maxWidth: 1128 }),
  narrow: css({ maxWidth: 744 }),
} as const;

const GridContext = createContext(false);

/**
 * __Grid__
 *
 * A grid is a responsive layout component designed to manage the content of a page.
 *
 * - [Code](https://atlassian.design/components/grid)
 *
 * @example
 * ```jsx
 * import Grid, { GridItem } from '@atlaskit/grid';
 *
 * const App = () => (
 *   <Grid>
 *     <GridItem></GridItem>
 *   </Grid>
 * );
 * ```
 */
export const Grid: FC<GridProps> = ({
  testId,
  children,
  maxWidth,
  hasInlinePadding = true,
}) => {
  const isNested = useContext(GridContext);

  invariant(
    !isNested,
    '@atlaskit/grid: Nesting grids are not supported at this time, please only use a top-level grid.',
  );

  return (
    <div
      data-testid={testId}
      css={[
        baseStyles,
        gapMediaQueries,
        maxWidth && gridMaxWidthMap[maxWidth],
        hasInlinePadding && inlinePaddingMediaQueries,
      ]}
    >
      <GridContext.Provider value={true}>{children}</GridContext.Provider>
    </div>
  );
};
