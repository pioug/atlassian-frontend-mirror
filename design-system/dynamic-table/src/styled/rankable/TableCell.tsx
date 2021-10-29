/** @jsx jsx */
import { FC, HTMLProps } from 'react';

import { css, jsx } from '@emotion/core';

import { TruncateStyleProps } from '../constants';
import { TableBodyCell } from '../TableCell';

type RankableTableBodyCellProps = HTMLProps<
  HTMLTableCellElement | HTMLTableRowElement
> &
  TruncateStyleProps & {
    isRanking?: boolean;
  };

const rankingStyles = css({
  boxSizing: 'border-box',
});

export const RankableTableBodyCell: FC<RankableTableBodyCellProps> = ({
  isRanking,
  innerRef,
  ...props
}) => (
  <TableBodyCell
    css={isRanking && rankingStyles}
    {...props}
    innerRef={innerRef}
  />
);
