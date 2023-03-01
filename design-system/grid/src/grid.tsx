/* eslint-disable @repo/internal/react/consistent-css-prop-usage */
/** @jsx jsx */
import { createContext, FC, ReactNode, useContext } from 'react';

import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import { BREAKPOINTS_CONFIG, BREAKPOINTS_LIST } from './config';
import { UNSAFE_media as media } from './media-helper';

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
};

const breakPointMediaQueries = BREAKPOINTS_LIST.reduce(
  (configs, breakpoint) => {
    const config = BREAKPOINTS_CONFIG[breakpoint];

    return Object.assign(configs, {
      [media.between[breakpoint]]: {
        gap: config.gutter,
        gridTemplateColumns: `repeat(var(--ds-grid-columns), 1fr)`,
        '--ds-grid-columns': config.columns,
        paddingInline: config.margin,
        marginInline: 'auto',
      },
    });
  },
  {},
);

// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const gridMediaQueryStyles = css(breakPointMediaQueries);

const baseStyles = css({
  display: 'grid',
  boxSizing: 'border-box',
  width: '100%',
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
export const Grid: FC<GridProps> = ({ testId, children, maxWidth }) => {
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
        maxWidth && gridMaxWidthMap[maxWidth],
        gridMediaQueryStyles,
      ]}
    >
      <GridContext.Provider value={true}>{children}</GridContext.Provider>
    </div>
  );
};
