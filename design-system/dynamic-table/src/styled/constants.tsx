import { LegacyRef, ReactNode } from 'react';

import { css } from '@emotion/react';

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
  className?: string;
}

export const truncationWidthStyles = css({ width: `var(${CSS_VAR_WIDTH})` });

export const fixedSizeTruncateStyles = css({
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const overflowTruncateStyles = css({
  overflow: 'hidden',
});

export const getTruncationStyleVars = ({ width }: TruncateStyleProps) =>
  typeof width !== 'undefined' ? { [CSS_VAR_WIDTH]: `${width}%` } : undefined;

export const cellStyles = css({
  padding: `${gridSize / 2}px ${gridSize}px`,
  border: 'none',
  textAlign: 'left',
  '&:first-of-type': {
    paddingLeft: 0,
  },
  '&:last-child': {
    paddingRight: 0,
  },
});
