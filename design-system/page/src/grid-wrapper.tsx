import React, { useContext, useMemo } from 'react';

import { defaultGridColumns, defaultSpacing } from './constants';
import { Grid } from './grid';
import { GridColumnContext } from './grid-column';
import { GridContext } from './grid-context';
import type { GridProps } from './types';

/**
 * __Grid__
 *
 * A grid contains one or more `GridColumn` to provide a grid layout.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/page)
 */
const GridWrapper = ({
  spacing = defaultSpacing,
  columns,
  layout,
  testId,
  children,
}: GridProps) => {
  /**
   * isRoot is `true` only in the default context (i.e. no ancestor Grid).
   */
  const { isRoot } = useContext(GridContext);
  const { medium } = useContext(GridColumnContext);

  /**
   * The colspan of the current containing GridColumn provides
   * the default amount of columns in a nested grid.
   */
  const defaultColumns = medium > 0 ? medium : defaultGridColumns;

  const contextValue = useMemo(
    () => ({
      isRoot: false,
      isNested: !isRoot,
      spacing,
      columns: columns ?? defaultColumns,
    }),
    [spacing, columns, isRoot, defaultColumns],
  );

  return (
    <GridContext.Provider value={contextValue}>
      <Grid layout={layout} testId={testId}>
        {children}
      </Grid>
    </GridContext.Provider>
  );
};

export default GridWrapper;
