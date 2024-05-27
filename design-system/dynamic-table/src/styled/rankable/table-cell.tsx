/** @jsx jsx */
import { type FC, type HTMLProps, type ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { type TruncateStyleProps } from '../constants';
import { TableBodyCell } from '../table-cell';

type RankableTableBodyCellProps = HTMLProps<
  HTMLTableCellElement | HTMLTableRowElement
> &
  TruncateStyleProps & {
    isRanking?: boolean;
    children?: ReactNode;
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
