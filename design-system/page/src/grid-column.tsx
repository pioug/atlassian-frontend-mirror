/** @jsx jsx */
import { createContext, useContext, useMemo } from 'react';

import { css, jsx } from '@emotion/core';

import {
  defaultMedium,
  spacingMapping,
  varColumnsNum,
  varColumnSpan,
} from './constants';
import { GridContext } from './grid-context';
import type { GridColumnProps, GridSpacing } from './types';

// IE11 and Edge both have rounding issues for flexbox which is why a width of
// 99.9999% is used. Using 100% here causes columns to wrap prematurely.
const divisibleFullWidth = '99.9999%';

/**
 * Sets flex basis to occupy the specified number of columns.
 */
const getGridColumnSpanStyles = (spacing: GridSpacing) => {
  const gap = `${spacingMapping[spacing]}px`;

  /**
   * We need to add the gap here to get the same results as before
   * because of how gaps were emulated with margins.
   *
   * Before the margins on the edges could extend past the edges
   * of the container, while still contributing to width calculations.
   */
  const availableWidth = `(${divisibleFullWidth} + ${gap})`;
  const singleColumnWidth = `${availableWidth} / var(${varColumnsNum})`;

  return css({
    minWidth: `calc(${singleColumnWidth} - ${gap})`,
    maxWidth: `calc(${singleColumnWidth} *  var(${varColumnSpan}) - ${gap})`,
    flexBasis: `100%`,
  });
};

const gridColumnSpanStyles = {
  cosy: getGridColumnSpanStyles('cosy'),
  comfortable: getGridColumnSpanStyles('comfortable'),
  compact: getGridColumnSpanStyles('compact'),
  fullWidth: css({
    maxWidth: '100%',
    flexBasis: '100%',
  }),
  fillAvailable: css({
    maxWidth: '100%',
    flexBasis: 'auto',
  }),
};

const gridColumnStyles = css({
  flexGrow: 1,
  flexShrink: 0,
  wordWrap: 'break-word',
});

/**
 * __Grid column context__
 *
 * @internal
 */
export const GridColumnContext = createContext({ medium: defaultMedium });

/**
 * __Grid column__
 *
 * A grid column can span one or more column positions within a grid.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/page)
 */
const GridColumn = ({
  medium = defaultMedium,
  children,
  testId,
}: GridColumnProps) => {
  const { spacing, columns } = useContext(GridContext);

  const contextValue = useMemo(() => ({ medium }), [medium]);

  const colSpan = Math.max(1, Math.min(medium, columns));

  /**
   * The full-width case is handled separately because of rounding.
   */
  const isFullWidth = colSpan === columns;

  /**
   * A `medium` of 0 (the default) equates to an automatic flex-basis,
   * meaning the column will fill available space.
   */
  const shouldFillAvailable = medium === defaultMedium;

  return (
    <GridColumnContext.Provider value={contextValue}>
      <div
        css={[
          gridColumnStyles,
          gridColumnSpanStyles[spacing],
          isFullWidth && gridColumnSpanStyles.fullWidth,
          shouldFillAvailable && gridColumnSpanStyles.fillAvailable,
        ]}
        style={
          {
            /**
             * The 'auto' value here isn't actually consumed anywhere and is
             * just to better reflect what is happening.
             */
            [varColumnSpan]: shouldFillAvailable ? 'auto' : colSpan,
          } as React.CSSProperties
        }
        data-testid={testId}
      >
        {children}
      </div>
    </GridColumnContext.Provider>
  );
};

export default GridColumn;
