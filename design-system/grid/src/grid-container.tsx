/* eslint-disable @repo/internal/react/consistent-css-prop-usage */
/** @jsx jsx */
import { createContext, FC } from 'react';

import { css, jsx } from '@emotion/react';

import {
  gapMediaQueries,
  inlinePaddingMediaQueries,
} from './grid-media-querys';
import type { BaseGridProps } from './types';

export type GridContainerProps = BaseGridProps;

const containerBaseStyles = css({
  display: 'grid',
  boxSizing: 'border-box',
  width: '100%',
  gridTemplateColumns: `1fr`,
  marginInline: 'auto',
});

const gridMaxWidthMap: Record<
  NonNullable<GridContainerProps['maxWidth']>,
  ReturnType<typeof css>
> = {
  wide: css({ maxWidth: 1128 }),
  narrow: css({ maxWidth: 744 }),
} as const;

/**
 * __Grid container context__
 *
 * A grid container context used to detect to detect wether a component is inside a grid container.
 *
 */
export const GridContainerContext = createContext(false);

/**
 * __GridContainer__
 *
 * A grid container is a grid with one column whith the purpose of stacking grids on top of each other
 * while maintaining the responsive gaps between grids
 * - [Code](https://atlassian.design/components/grid-container)
 *
 * @example
 * ```jsx
 * import Grid, { GridItem, GridContainer } from '@atlaskit/grid';
 *
 * const App = () => (
 *  <GridContainer>
 *    <Grid>
 *      <GridItem></GridItem>
 *    </Grid>
 *    <Grid>
 *      <GridItem></GridItem>
 *    </Grid>
 *  <GridContainer>
 * );
 * ```
 */
export const GridContainer: FC<GridContainerProps> = ({
  testId,
  children,
  maxWidth,
  hasInlinePadding = true,
}) => {
  return (
    <div
      data-testid={testId}
      css={[
        containerBaseStyles,
        gapMediaQueries,
        maxWidth && gridMaxWidthMap[maxWidth],
        hasInlinePadding && inlinePaddingMediaQueries,
      ]}
    >
      <GridContainerContext.Provider value={true}>
        {children}
      </GridContainerContext.Provider>
    </div>
  );
};
