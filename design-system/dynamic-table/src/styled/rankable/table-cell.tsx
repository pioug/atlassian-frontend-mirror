/** @jsx jsx */
import { FC, HTMLProps } from 'react';

import { css, jsx } from '@emotion/core';

import { TruncateStyleProps } from '../constants';
import { TableBodyCell } from '../table-cell';

type RankableTableBodyCellProps = HTMLProps<
  HTMLTableCellElement | HTMLTableRowElement
> &
  TruncateStyleProps & {
    isRanking?: boolean;
  };

const rankingStyles = css({
  boxSizing: 'border-box',
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const RankableTableBodyCell: FC<RankableTableBodyCellProps> = ({
  isRanking,
  innerRef,
  ...props
}) => (
  <TableBodyCell
    css={isRanking && rankingStyles}
    // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
    {...props}
    innerRef={innerRef}
  />
);
