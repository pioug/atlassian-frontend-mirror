/* eslint-disable @repo/internal/react/consistent-css-prop-usage */
/** @jsx jsx */
import { createContext, CSSProperties, FC, ReactNode, useContext } from 'react';

import { css, jsx } from '@emotion/react';

import { BREAKPOINTS } from './config';

export type GridProps = {
  /**
   * A test id for automated testing
   */
  testId?: string;
  /**
   * If set to `fluid` the grid will fill all available whitespace.
   */
  width?: GridFlow;
  /**
   * The grid items.
   */
  children?: ReactNode;
};

type GridFlow = keyof typeof gridFlowMap;

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
});

const gridFlowMap = {
  fluid: css({ maxWidth: 'none' }),
  wide: css({
    minWidth: 1128,
    maxWidth: 1128,
    // TODO how should this work with the spec'd breakpoints
    // eslint-disable-next-line @repo/internal/styles/no-nested-styles
    [`@media screen and (max-width: 1128px)`]: {
      minWidth: 'unset',
    },
  }),
  narrow: css({
    minWidth: 744,
    maxWidth: 744,
    // TODO how should this work with the spec'd breakpoints
    // eslint-disable-next-line @repo/internal/styles/no-nested-styles
    [`@media screen and (max-width: 744px)`]: {
      minWidth: 'unset',
    },
  }),
} as const;

const GridContext = createContext(false);

const nestedStyles: CSSProperties = {
  paddingInline: 0,
  marginInline: 0,
};

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
export const Grid: FC<GridProps> = ({ testId, children, width }) => {
  const isNested = useContext(GridContext);
  return (
    <div
      data-testid={testId}
      style={isNested ? nestedStyles : undefined}
      css={[baseStyles, width && gridFlowMap[width], gridMediaQueryStyles]}
    >
      <GridContext.Provider value={true}>{children}</GridContext.Provider>
    </div>
  );
};
