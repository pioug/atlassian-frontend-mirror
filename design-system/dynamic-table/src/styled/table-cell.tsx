/** @jsx jsx */
import { type FC } from 'react';

import { jsx } from '@emotion/react';

import {
  cellStyles,
  fixedSizeTruncateStyles,
  getTruncationStyleVars,
  overflowTruncateStyles,
  type TruncateStyleProps,
  truncationWidthStyles,
} from './constants';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const TableBodyCell: FC<TruncateStyleProps> = ({
  width,
  isFixedSize,
  shouldTruncate,
  innerRef,
  ...props
}) => (
  <td
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
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
    // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
    {...props}
  />
);
