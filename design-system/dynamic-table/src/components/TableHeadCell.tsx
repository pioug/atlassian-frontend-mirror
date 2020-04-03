import React, { KeyboardEvent } from 'react';
import { HeadCell } from '../styled/TableHead';
import { SortOrderType } from '../types';

export interface Props {
  sortKey?: string;
  isSortable?: boolean;
  sortOrder?: SortOrderType;
  isFixedSize?: boolean;
  innerRef?: (element?: React.ReactElement<any>) => void;
  inlineStyles?: {};
  content?: React.ReactNode;
  onClick?: () => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  testId?: string;
}

class TableHeadCell extends React.Component<Props, {}> {
  static defaultProps = {
    innerRef: () => {},
    inlineStyles: {},
  };

  render() {
    const { content, inlineStyles, testId, ...rest } = this.props;
    return (
      <HeadCell
        style={inlineStyles}
        data-testid={testId && `${testId}--head--cell`}
        {...rest}
        tabIndex={rest.isSortable ? 0 : undefined}
      >
        <span>{content}</span>
      </HeadCell>
    );
  }
}

export default TableHeadCell;
