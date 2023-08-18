import { LegacyRef, ReactNode } from 'react';

import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const CSS_VAR_WIDTH = '--local-dynamic-table-width';

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
  // Use "clip" overflow to allow ellipses on x-axis without clipping descenders
  '@supports not (overflow-x: clip)': {
    overflow: 'hidden',
  },
  '@supports (overflow-x: clip)': {
    overflowX: 'clip',
  },
});

export const getTruncationStyleVars = ({ width }: TruncateStyleProps) =>
  typeof width !== 'undefined' ? { [CSS_VAR_WIDTH]: `${width}%` } : undefined;

export const cellStyles = css({
  padding: `${token('space.050', '4px')} ${token('space.100', '8px')}`,
  border: 'none',
  textAlign: 'left',
  '&:first-of-type': {
    paddingLeft: token('space.0', '0px'),
  },
  '&:last-child': {
    paddingRight: token('space.0', '0px'),
  },
});
