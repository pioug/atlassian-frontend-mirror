/** @jsx jsx */
import { createContext, type FC, useContext } from 'react';

import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import { GRID_COLUMNS } from './config';
import { GridContainerContext } from './grid-container';
import {
  gapMediaQueries,
  inlinePaddingMediaQueries,
} from './grid-media-querys';
import type { BaseGridProps } from './types';

export type GridProps = BaseGridProps;

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
  wide: css({ maxWidth: '70.5rem' }),
  narrow: css({ maxWidth: '46.5rem' }),
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
  hasInlinePadding,
}) => {
  const isNested = useContext(GridContext);
  const isWithinContainer = useContext(GridContainerContext);
  // while not within a GridContainer hasInlinePadding either undefined or true means setting the padding on by default
  const showInlinePadding = hasInlinePadding !== false;

  invariant(
    !isNested,
    '@atlaskit/grid: Nesting grids are not supported at this time, please only use a top-level grid or leverage GridContainer.',
  );

  return (
    <div
      data-testid={testId}
      css={[
        baseStyles,
        // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
        gapMediaQueries,
        !isWithinContainer && maxWidth && gridMaxWidthMap[maxWidth],
        // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
        !isWithinContainer && showInlinePadding && inlinePaddingMediaQueries,
      ]}
    >
      <GridContext.Provider value={true}>{children}</GridContext.Provider>
    </div>
  );
};
