/** @jsx jsx */
import { useContext } from 'react';

import { css, jsx } from '@emotion/core';

import {
  defaultGridColumnWidth,
  defaultLayout,
  spacingMapping,
  varColumnsNum,
} from './constants';
import { GridContext } from './grid-context';
import type { GridProps, GridSpacing } from './types';

/**
 * Maximum width styles for a grid using a fixed layout.
 *
 * Equal to the space occupied by the columns + the padding required.
 */
const getGridFixedLayoutMaxWidthStyles = (spacing: GridSpacing) =>
  css({
    maxWidth: `calc(var(${varColumnsNum}) * ${defaultGridColumnWidth}px + ${spacingMapping[spacing]}px)`,
  });

/**
 * Horizontal padding for the grid.
 *
 * Not applied for nested grids as they should not be inset.
 */
const getGridPaddingStyles = (spacing: GridSpacing) =>
  css({ padding: `0 ${spacingMapping[spacing]}px` });

const getGridColumnGapStyles = (spacing: GridSpacing) =>
  css({ columnGap: spacingMapping[spacing] });

const gridFixedLayoutMaxWidthStyles = {
  cosy: getGridFixedLayoutMaxWidthStyles('cosy'),
  comfortable: getGridFixedLayoutMaxWidthStyles('comfortable'),
  compact: getGridFixedLayoutMaxWidthStyles('compact'),
};

const gridFluidLayoutMaxWidthStyles = css({ maxWidth: '100%' });

const gridPaddingStyles = {
  cosy: getGridPaddingStyles('cosy'),
  comfortable: getGridPaddingStyles('comfortable'),
  compact: getGridPaddingStyles('compact'),
};

const gridColumnGapStyles = {
  cosy: getGridColumnGapStyles('cosy'),
  comfortable: getGridColumnGapStyles('comfortable'),
  compact: getGridColumnGapStyles('compact'),
};

const gridStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  margin: '0 auto',
  position: 'relative',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
});

/**
 * __Grid__
 *
 * A container for one or more `GridColumn`.
 *
 * This is the internal component, which relies on the context provided by the
 * grid wrapper.
 *
 * @internal
 */
export const Grid: React.FC<GridProps> = ({
  layout = defaultLayout,
  testId,
  children,
}) => {
  const { isNested, columns, spacing } = useContext(GridContext);

  return (
    <div
      css={[
        gridStyles,
        !isNested && gridPaddingStyles[spacing],
        layout === 'fixed'
          ? gridFixedLayoutMaxWidthStyles[spacing]
          : gridFluidLayoutMaxWidthStyles,
        gridColumnGapStyles[spacing],
      ]}
      style={{ [varColumnsNum]: columns } as React.CSSProperties}
      data-testid={testId}
    >
      {children}
    </div>
  );
};
