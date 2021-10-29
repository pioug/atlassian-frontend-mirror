import React, { FC, KeyboardEvent, LegacyRef } from 'react';

import { HeadCell } from '../styled/TableHead';
import { SortOrderType } from '../types';

export interface Props {
  sortKey?: string;
  isSortable?: boolean;
  sortOrder?: SortOrderType;
  isFixedSize?: boolean;
  innerRef?: LegacyRef<HTMLTableCellElement>;
  inlineStyles?: {};
  content?: React.ReactNode;
  onClick?: () => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  testId?: string;
  isRanking?: boolean;
}

const TableHeadCell: FC<Props> = ({
  content,
  inlineStyles,
  testId,
  isRanking,
  innerRef,
  isSortable,
  ...rest
}) => {
  return (
    <HeadCell
      style={inlineStyles}
      data-testid={testId && `${testId}--head--cell`}
      ref={typeof innerRef !== 'string' ? innerRef : null} // string refs must be discarded as LegacyRefs are not compatible with FC forwardRefs
      {...rest}
      tabIndex={isSortable ? 0 : undefined}
      isSortable={isSortable}
    >
      <span>{content}</span>
    </HeadCell>
  );
};

export default TableHeadCell;
