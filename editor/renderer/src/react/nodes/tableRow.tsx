import React from 'react';
import { RendererCssClassName } from '../../consts';
import { SortOrder } from '@atlaskit/editor-common';

type Props = {
  isNumberColumnEnabled?: number;
  index?: number;
  children?: React.ReactNode;
  onSorting?: (columnIndex?: number, currentSortOrdered?: SortOrder) => void;
  allowColumnSorting?: boolean;
  tableOrderStatus?: {
    columnIndex: number;
    order: SortOrder;
  };
};

const TableRow = (props: Props) => {
  let { children, allowColumnSorting, index: rowIndex } = props;

  if (allowColumnSorting) {
    const isHeaderRow = !rowIndex;
    children = React.Children.toArray(children).map((child, index) => {
      if (React.isValidElement(child)) {
        const { tableOrderStatus } = props;
        let sortOrdered: SortOrder = SortOrder.NO_ORDER;
        if (tableOrderStatus) {
          sortOrdered =
            index === tableOrderStatus.columnIndex
              ? tableOrderStatus.order
              : SortOrder.NO_ORDER;
        }

        return React.cloneElement(child, {
          columnIndex: index,
          onSorting: props.onSorting,
          sortOrdered,
          isHeaderRow,
        });
      }
    });
  }

  return (
    <tr>
      {props.isNumberColumnEnabled && (
        <td className={RendererCssClassName.NUMBER_COLUMN}>{props.index}</td>
      )}
      {children}
    </tr>
  );
};

export default TableRow;
