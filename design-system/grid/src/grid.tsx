/* eslint-disable @repo/internal/react/consistent-css-prop-usage */
/** @jsx jsx */
import { createContext, FC, ReactNode, useContext } from 'react';

import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import { BREAKPOINTS } from './config';

export type GridProps = {
  /**
   * A test id for automated testing
   */
  testId?: string;
  /**
   * If set, will restrict the max-width of the Grid to pre-defined values.
   */
  maxWidth?: GridMaxWidth;
  /**
   * The grid items.
   */
  children?: ReactNode;
};

type GridMaxWidth = keyof typeof gridMaxWidthMap;

const breakpointEntries = Object.entries(BREAKPOINTS);
const breakPointMediaQueries = breakpointEntries.reduce(
  (configs, [_, config]) => {
    return Object.assign(configs, {
      [`@media (min-width: ${config.min}px) and (max-width: ${config.max}px)`]:
        {
          gap: config.gap,
          gridTemplateColumns: `repeat(var(--ds-grid-columns), 1fr)`,
          '--ds-grid-columns': config.columns,
          paddingInline: config.offset,
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

const gridMaxWidthMap = {
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
