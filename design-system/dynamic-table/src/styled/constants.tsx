import { LegacyRef, ReactNode } from 'react';

import { css } from '@emotion/core';

import { gridSize as getGridSize } from '@atlaskit/theme/constants';

const CSS_VAR_WIDTH = '--local-dynamic-table-width';

const gridSize = getGridSize();

export interface TruncateStyleProps {
  width?: number;
  isFixedSize?: boolean;
  shouldTruncate?: boolean;
  children?: ReactNode;
  testId?: string;
  innerRef?: LegacyRef<HTMLTableCellElement | HTMLTableRowElement> | undefined;
}

export const truncationWidthStyles = css({ width: `var(${CSS_VAR_WIDTH})` });

export const fixedSizeTruncateStyles = css({
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const overflowTruncateStyles = css({
  overflow: 'hidden',
});

export const getTruncationStyleVars = ({ width }: TruncateStyleProps) => {
  return { [CSS_VAR_WIDTH]: `${width}%` };
};

export const cellStyles = css({
  border: 'none',
  padding: `${gridSize / 2}px ${gridSize}px`,
  textAlign: 'left',

  '&:first-of-type': {
    paddingLeft: 0,
  },

  '&:last-child': {
    paddingRight: 0,
  },
});
