import React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { TableLayout } from '@atlaskit/adf-schema';
import {
  calcTableWidth,
  WidthConsumer,
  TableSharedCssClassName,
  akEditorTableNumberColumnWidth,
  akEditorWideLayoutWidth,
  akEditorDefaultLayoutWidth,
  akEditorFullWidthLayoutWidth,
  akEditorTableLegacyCellMinWidth,
  tableCellBorderWidth,
  tableCellMinWidth,
  overflowShadow,
  OverflowShadowProps,
  getBreakpoint,
  mapBreakpointToLayoutMaxWidth,
  createCompareNodes,
  SortOrder,
  convertProsemirrorTableNodeToArrayOfRows,
  hasMergedCell,
  compose,
} from '@atlaskit/editor-common';

import { RendererAppearance } from '../../ui/Renderer/types';
import { FullPagePadding } from '../../ui/Renderer/style';
import { TableHeader } from './tableCell';
import {
  withSmartCardStorage,
  WithSmartCardStorageProps,
} from '../../ui/SmartCardStorage';
import { UrlType } from '@atlaskit/adf-schema';

type TableArrayMapped = {
  rowNodes: Array<PMNode | null>;
  rowReact: React.ReactElement;
};

const orderChildren = (
  children: React.ReactElement[],
  tableNode: PMNode,
  smartCardStorage: WithSmartCardStorageProps['smartCardStorage'],
  tableOrderStatus?: TableOrderStatus,
): React.ReactElement[] => {
  if (!tableOrderStatus || tableOrderStatus.order === SortOrder.NO_ORDER) {
    return children;
  }

  const { order, columnIndex } = tableOrderStatus;

  const compareNodesInOrder = createCompareNodes(
    {
      getInlineCardTextFromStore(attrs) {
        const { url } = attrs as UrlType;
        if (!url) {
          return null;
        }

        return smartCardStorage.get(url) || null;
      },
    },
    order,
  );

  const tableArray = convertProsemirrorTableNodeToArrayOfRows(tableNode);

  const tableArrayWithChildren: TableArrayMapped[] = tableArray.map(
    (rowNodes, index) => ({ rowNodes, rowReact: children[index] }),
  );

  const headerRow = tableArrayWithChildren.shift();

  const sortedTable = tableArrayWithChildren.sort(
    (rowA: TableArrayMapped, rowB: TableArrayMapped) =>
      compareNodesInOrder(
        rowA.rowNodes[columnIndex],
        rowB.rowNodes[columnIndex],
      ),
  );

  if (headerRow) {
    sortedTable.unshift(headerRow);
  }

  return sortedTable.map(elem => elem.rowReact);
};

const addSortableColumn = (
  rows: React.ReactElement<any>[],
  tableOrderStatus: TableOrderStatus | undefined,
  onSorting: (columnIndex: number, sortOrder: SortOrder) => void,
) => {
  return React.Children.map(rows, (row, index) => {
    if (index === 0) {
      return React.cloneElement(React.Children.only(row), {
        tableOrderStatus,
        onSorting,
      });
    }

    return row;
  });
};

export interface TableProps {
  columnWidths?: Array<number>;
  layout: TableLayout;
  isNumberColumnEnabled: boolean;
  children: React.ReactElement<any> | Array<React.ReactElement<any>>;
  tableNode?: PMNode;
  renderWidth: number;
  rendererAppearance?: RendererAppearance;
  allowDynamicTextSizing?: boolean;
  allowColumnSorting?: boolean;
}

export interface ScaleOptions {
  renderWidth: number;
  tableWidth: number;
  maxScale: number;
}

// we allow scaling down column widths by no more than 15%
const MAX_SCALING_PERCENT = 0.15;

export const calcScalePercent = ({
  renderWidth,
  tableWidth,
  maxScale,
}: ScaleOptions) => {
  const diffPercent = 1 - renderWidth / tableWidth;

  return diffPercent < maxScale ? diffPercent : maxScale;
};

const isHeaderRowEnabled = (rows: React.ReactChild[]) => {
  if (!rows.length) {
    return false;
  }
  const { children } = (rows[0] as React.ReactElement<any>).props;
  if (!children.length) {
    return false;
  }

  if (children.length === 1) {
    return children[0].type === TableHeader;
  }

  return children.every(
    (node: React.ReactElement) => node.type === TableHeader,
  );
};

interface TableWidthOptions {
  isDynamicTextSizingEnabled?: boolean;
  containerWidth?: number;
}

const getTableLayoutWidth = (layout: TableLayout, opts?: TableWidthOptions) => {
  switch (layout) {
    case 'full-width':
      return akEditorFullWidthLayoutWidth;
    case 'wide':
      return akEditorWideLayoutWidth;
    default:
      if (opts && opts.isDynamicTextSizingEnabled && opts.containerWidth) {
        return mapBreakpointToLayoutMaxWidth(
          getBreakpoint(opts.containerWidth),
        );
      }
      return akEditorDefaultLayoutWidth;
  }
};

const isTableResized = (columnWidths: Array<number>) => {
  const filteredWidths = columnWidths.filter(width => width !== 0);
  return !!filteredWidths.length;
};

const fixColumnWidth = (
  columnWidth: number,
  _tableWidth: number,
  _layoutWidth: number,
  zeroWidthColumnsCount: number,
  scaleDownPercent: number,
): number => {
  if (columnWidth === 0) {
    return columnWidth;
  }

  // If the tables total width (including no zero widths col or cols without width) is less than the current layout
  // We scale up the columns to meet the minimum of the table layout.
  if (zeroWidthColumnsCount === 0 && scaleDownPercent) {
    return Math.floor((1 - scaleDownPercent) * columnWidth);
  }

  return Math.max(
    // We need to take tableCellBorderWidth, to avoid unneccesary overflow.
    columnWidth - tableCellBorderWidth,
    zeroWidthColumnsCount ? akEditorTableLegacyCellMinWidth : tableCellMinWidth,
  );
};

interface TableOrderStatus {
  columnIndex: number;
  order: SortOrder;
}

interface TableState {
  tableOrderStatus?: TableOrderStatus;
}

export class TableContainer extends React.Component<
  TableProps & OverflowShadowProps & WithSmartCardStorageProps,
  TableState
> {
  state = {
    tableOrderStatus: undefined,
  };

  render() {
    const { isNumberColumnEnabled, layout, renderWidth, children } = this.props;
    if (!children) {
      return null;
    }

    let childrenArray = React.Children.toArray<React.ReactElement>(children);

    return (
      <div
        className={`${TableSharedCssClassName.TABLE_CONTAINER} ${this.props.shadowClassNames}`}
        data-layout={layout}
        ref={this.props.handleRef}
        style={{ width: calcTableWidth(layout, renderWidth, false) }}
      >
        <div className={TableSharedCssClassName.TABLE_NODE_WRAPPER}>
          <table data-number-column={isNumberColumnEnabled}>
            {this.renderColgroup()}
            <tbody>
              {compose(
                this.addNumberColumnIndexes,
                this.addSortableColumn,
              )(childrenArray)}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  private addNumberColumnIndexes = (rows: React.ReactElement<any>[]) => {
    const { isNumberColumnEnabled } = this.props;

    const headerRowEnabled = isHeaderRowEnabled(rows);
    return React.Children.map(rows, (row, index) => {
      return React.cloneElement(React.Children.only(row), {
        isNumberColumnEnabled,
        index: headerRowEnabled ? (index === 0 ? '' : index) : index + 1,
      });
    });
  };

  private addSortableColumn = (childrenArray: React.ReactElement[]) => {
    const { tableNode, allowColumnSorting, smartCardStorage } = this.props;
    const { tableOrderStatus } = this.state;

    if (
      allowColumnSorting &&
      isHeaderRowEnabled(childrenArray) &&
      tableNode &&
      !hasMergedCell(tableNode)
    ) {
      return addSortableColumn(
        orderChildren(
          childrenArray,
          tableNode,
          smartCardStorage,
          tableOrderStatus,
        ),
        tableOrderStatus,
        this.changeSortOrder,
      );
    }

    return childrenArray;
  };

  private changeSortOrder = (columnIndex: number, sortOrder: SortOrder) => {
    this.setState({
      tableOrderStatus: {
        columnIndex,
        order: sortOrder,
      },
    });
  };

  private renderColgroup = () => {
    let {
      columnWidths,
      layout,
      isNumberColumnEnabled,
      renderWidth,
      allowDynamicTextSizing,
    } = this.props;
    if (!columnWidths || !isTableResized(columnWidths)) {
      return null;
    }

    // @see ED-6056
    const layoutWidth = getTableLayoutWidth(layout, {
      isDynamicTextSizingEnabled: allowDynamicTextSizing,
      containerWidth: renderWidth,
    });
    const maxTableWidth = renderWidth < layoutWidth ? renderWidth : layoutWidth;

    // If table has a layout of default, it is confined by the defined column width.
    // renderWidth is better used for breakout tables.
    // @see ED-6737
    if (layout === 'default') {
      renderWidth = Math.min(renderWidth, layoutWidth);
    }

    let tableWidth = isNumberColumnEnabled ? akEditorTableNumberColumnWidth : 0;
    let minTableWidth = tableWidth;
    let zeroWidthColumnsCount = 0;

    columnWidths.forEach(width => {
      if (width) {
        tableWidth += Math.ceil(width);
      } else {
        zeroWidthColumnsCount += 1;
      }
      minTableWidth += Math.ceil(width) || akEditorTableLegacyCellMinWidth;
    });
    let cellMinWidth = 0;
    let scaleDownPercent = 0;
    // fixes migration tables with zero-width columns
    if (zeroWidthColumnsCount > 0) {
      if (minTableWidth > maxTableWidth) {
        const minWidth = Math.ceil(
          (maxTableWidth - tableWidth) / zeroWidthColumnsCount,
        );
        cellMinWidth =
          minWidth < akEditorTableLegacyCellMinWidth
            ? akEditorTableLegacyCellMinWidth
            : minWidth;
      }
    }
    // scaling down
    else if (renderWidth < tableWidth) {
      scaleDownPercent = calcScalePercent({
        renderWidth,
        tableWidth,
        maxScale: MAX_SCALING_PERCENT,
      });
    }

    return (
      <colgroup>
        {isNumberColumnEnabled && (
          <col style={{ width: akEditorTableNumberColumnWidth }} />
        )}
        {columnWidths.map((colWidth, idx) => {
          const width =
            fixColumnWidth(
              colWidth,
              minTableWidth,
              maxTableWidth,
              zeroWidthColumnsCount,
              scaleDownPercent,
            ) || cellMinWidth;

          const style = width ? { width: `${width}px` } : {};
          return <col key={idx} style={style} />;
        })}
      </colgroup>
    );
  };
}

const TableWithShadows = overflowShadow(TableContainer, {
  overflowSelector: `.${TableSharedCssClassName.TABLE_NODE_WRAPPER}`,
});

const TableWithWidth: React.FunctionComponent<React.ComponentProps<
  typeof TableWithShadows
>> = props => (
  <WidthConsumer>
    {({ width }) => {
      const renderWidth =
        props.rendererAppearance === 'full-page'
          ? width - FullPagePadding * 2
          : width;
      return <TableWithShadows renderWidth={renderWidth} {...props} />;
    }}
  </WidthConsumer>
);

export default withSmartCardStorage(TableWithWidth);
