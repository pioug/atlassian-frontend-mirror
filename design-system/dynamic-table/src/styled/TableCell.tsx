/** @jsx jsx */
import { FC } from 'react';

import { jsx } from '@emotion/core';

import {
  cellStyles,
  fixedSizeTruncateStyles,
  getTruncationStyleVars,
  overflowTruncateStyles,
  TruncateStyleProps,
  truncationWidthStyles,
} from './constants';

export const TableBodyCell: FC<TruncateStyleProps> = ({
  width,
  isFixedSize,
  shouldTruncate,
  innerRef,
  ...props
}) => (
  <td
    style={getTruncationStyleVars({ width }) as React.CSSProperties}
    css={[
      truncationWidthStyles,
      isFixedSize && shouldTruncate && fixedSizeTruncateStyles,
      isFixedSize && overflowTruncateStyles,
      cellStyles,
    ]}
    // HOC withDimensions complains about the types but it is working fine
    // @ts-ignore
    ref={innerRef}
    {...props}
  />
);
