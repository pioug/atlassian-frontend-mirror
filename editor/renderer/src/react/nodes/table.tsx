import React from 'react';
import styled from 'styled-components';
import { Node as PMNode } from 'prosemirror-model';

import { UrlType } from '@atlaskit/adf-schema';
import {
  calcTableWidth,
  WidthConsumer,
  TableSharedCssClassName,
  overflowShadow,
  OverflowShadowProps,
  createCompareNodes,
  SortOrder,
  convertProsemirrorTableNodeToArrayOfRows,
  hasMergedCell,
  compose,
  tableMarginTop,
} from '@atlaskit/editor-common';

import {
  RendererAppearance,
  StickyHeaderConfig,
} from '../../ui/Renderer/types';
import { FullPagePadding } from '../../ui/Renderer/style';
import { TableHeader } from './tableCell';
import {
  withSmartCardStorage,
  WithSmartCardStorageProps,
} from '../../ui/SmartCardStorage';
import { calcLineLength } from '../../ui/Renderer/breakout-ssr';

import {
  StickyTable,
  StickyMode,
  tableStickyPadding,
  OverflowParent,
} from './table/sticky';
import { Table } from './table/table';
import { SharedTableProps } from './table/types';

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

  return sortedTable.map((elem) => elem.rowReact);
};

const hasRowspan = (row: PMNode) => {
  let hasRowspan = false;
  row.forEach((cell) => (hasRowspan = hasRowspan || cell.attrs.rowspan > 1));
  return hasRowspan;
};

const getRefTop = (refElement: HTMLElement): number => {
  return Math.round(refElement.getBoundingClientRect().top);
};

const shouldHeaderStick = (
  scrollTop: number,
  tableTop: number,
  tableBottom: number,
  rowHeight: number,
) => tableTop <= scrollTop && !(tableBottom - rowHeight <= scrollTop);

const shouldHeaderPinBottom = (
  scrollTop: number,
  tableBottom: number,
  rowHeight: number,
) => tableBottom - rowHeight <= scrollTop && !(tableBottom < scrollTop);

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

export type TableProps = SharedTableProps & {
  children: React.ReactElement<any> | Array<React.ReactElement<any>>;
  tableNode?: PMNode;
  rendererAppearance?: RendererAppearance;
  allowColumnSorting?: boolean;
  stickyHeaders?: StickyHeaderConfig;
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

const tableCanBeSticky = (
  node: PMNode | undefined,
  children: React.ReactChild[],
) => {
  return (
    isHeaderRowEnabled(children) &&
    node &&
    node.firstChild &&
    !hasRowspan(node.firstChild)
  );
};

interface TableOrderStatus {
  columnIndex: number;
  order: SortOrder;
}

interface TableState {
  stickyMode: StickyMode;
}

const MainTableContainer = styled.div``;

const canUseLinelength = (appearance: RendererAppearance) =>
  appearance === 'full-page' || appearance === 'mobile';

export class TableContainer extends React.Component<
  TableProps & OverflowShadowProps & WithSmartCardStorageProps,
  TableState
> {
  state: TableState = {
    stickyMode: 'none',
  };

  tableRef = React.createRef<HTMLTableElement>();
  stickyHeaderRef = React.createRef<HTMLElement>();

  // used for sync scroll + copying wrapper width to sticky header
  stickyWrapperRef = React.createRef<HTMLDivElement>();
  wrapperRef = React.createRef<HTMLDivElement>();

  nextFrame: number | undefined;
  overflowParent: OverflowParent | null = null;

  componentDidMount() {
    if (this.props.stickyHeaders) {
      this.overflowParent = OverflowParent.fromElement(this.tableRef.current);
      this.overflowParent.addEventListener('scroll', this.onScroll);
    }
  }

  componentDidUpdate(prevProps: TableProps, prevState: TableState) {
    // toggling sticky headers visiblity
    if (this.props.stickyHeaders && !this.overflowParent) {
      this.overflowParent = OverflowParent.fromElement(this.tableRef.current);
    } else if (!this.props.stickyHeaders && this.overflowParent) {
      this.overflowParent.removeEventListener('scroll', this.onScroll);
      this.overflowParent = null;
    }

    // offsetTop might have changed, re-position sticky header
    if (this.props.stickyHeaders !== prevProps.stickyHeaders) {
      this.updateSticky();
    }

    // sync horizontal scroll in floating div when toggling modes
    if (prevState.stickyMode !== this.state.stickyMode) {
      this.onWrapperScrolled();
    }
  }

  componentWillUnmount = () => {
    if (this.overflowParent) {
      this.overflowParent.removeEventListener('scroll', this.onScroll);
    }

    if (this.nextFrame) {
      cancelAnimationFrame(this.nextFrame);
    }
  };

  getScrollTop = (): number => {
    const { stickyHeaders } = this.props;
    const offsetTop = (stickyHeaders && stickyHeaders.offsetTop) || 0;
    return (this.overflowParent ? this.overflowParent.top : 0) + offsetTop;
  };

  updateSticky = () => {
    const tableElem = this.tableRef.current;
    const refElem = this.stickyHeaderRef.current;
    if (!tableElem || !refElem) {
      return;
    }

    const scrollTop = this.getScrollTop() + tableStickyPadding;
    const tableTop = getRefTop(tableElem);
    const tableBottom = tableTop + tableElem.clientHeight;

    const shouldSticky = shouldHeaderStick(
      scrollTop,
      tableTop,
      tableBottom,
      refElem.clientHeight,
    );
    const shouldPin = shouldHeaderPinBottom(
      scrollTop,
      tableBottom,
      refElem.clientHeight,
    );

    let stickyMode: StickyMode = 'none';
    if (shouldPin) {
      stickyMode = 'pin-bottom';
    } else if (shouldSticky) {
      stickyMode = 'stick';
    }

    if (this.state.stickyMode !== stickyMode) {
      this.setState({ stickyMode });
    }

    this.nextFrame = undefined;
  };

  onScroll = () => {
    if (!this.nextFrame) {
      this.nextFrame = requestAnimationFrame(this.updateSticky);
    }
  };

  onWrapperScrolled = () => {
    if (!this.wrapperRef.current || !this.stickyWrapperRef.current) {
      return;
    }

    this.stickyWrapperRef.current.scrollLeft = this.wrapperRef.current.scrollLeft;
  };

  get pinTop() {
    if (!this.tableRef.current || !this.stickyHeaderRef.current) {
      return;
    }

    return (
      this.tableRef.current.offsetHeight -
      this.stickyHeaderRef.current.offsetHeight +
      tableMarginTop -
      tableStickyPadding
    );
  }

  get stickyTop() {
    switch (this.state.stickyMode) {
      case 'pin-bottom':
        return this.pinTop;
      case 'stick':
        return this.props.stickyHeaders && this.props.stickyHeaders.offsetTop;
      default:
        return undefined;
    }
  }

  get headerRowHeight() {
    return this.stickyHeaderRef.current
      ? this.stickyHeaderRef.current.offsetHeight
      : 0;
  }

  render() {
    const {
      isNumberColumnEnabled,
      layout,
      renderWidth,
      allowDynamicTextSizing,
      columnWidths,
      stickyHeaders,
      tableNode,
    } = this.props;

    const { stickyMode } = this.state;

    let tableWidth = calcTableWidth(layout, renderWidth, false);
    const lineLength = calcLineLength(renderWidth, allowDynamicTextSizing);

    let left;
    if (
      canUseLinelength(this.props.rendererAppearance) &&
      tableWidth !== 'inherit'
    ) {
      const tableWidthPx = Number(
        tableWidth.substring(0, tableWidth.length - 2),
      );

      left = lineLength / 2 - tableWidthPx / 2;
    }

    const wrapperWidth = this.wrapperRef.current
      ? this.wrapperRef.current.clientWidth
      : 0;

    const children = React.Children.toArray<React.ReactChild>(
      this.props.children,
    );

    return (
      <>
        {stickyHeaders && tableCanBeSticky(tableNode, children) && (
          <StickyTable
            isNumberColumnEnabled={isNumberColumnEnabled}
            tableWidth={tableWidth}
            layout={layout}
            renderWidth={renderWidth}
            handleRef={this.props.handleRef}
            shadowClassNames={this.props.shadowClassNames}
            top={this.stickyTop}
            left={left}
            mode={stickyMode}
            innerRef={this.stickyWrapperRef}
            wrapperWidth={wrapperWidth}
            columnWidths={columnWidths}
            rowHeight={this.headerRowHeight}
            allowDynamicTextSizing={allowDynamicTextSizing}
          >
            {[children && children[0]]}
          </StickyTable>
        )}
        <MainTableContainer
          className={`${TableSharedCssClassName.TABLE_CONTAINER} ${this.props.shadowClassNames}`}
          data-layout={layout}
          innerRef={this.props.handleRef}
          style={{
            width: tableWidth,
            left: left && left < 0 ? left : undefined,
          }}
        >
          <div
            className={TableSharedCssClassName.TABLE_NODE_WRAPPER}
            ref={this.wrapperRef}
            onScroll={this.props.stickyHeaders && this.onWrapperScrolled}
          >
            <Table
              innerRef={this.tableRef}
              columnWidths={columnWidths}
              layout={layout}
              isNumberColumnEnabled={isNumberColumnEnabled}
              renderWidth={renderWidth}
              allowDynamicTextSizing={allowDynamicTextSizing}
            >
              {this.grabFirstRowRef(children)}
            </Table>
          </div>
        </MainTableContainer>
      </>
    );
  }

  private grabFirstRowRef = (children: React.ReactNode[]) => {
    return React.Children.map(children, (child, idx) => {
      if (idx === 0 && React.isValidElement(child)) {
        return React.cloneElement(child, {
          innerRef: this.stickyHeaderRef,
        });
      }

      return child;
    });
  };
}

export type TableProcessorState = {
  tableOrderStatus?: TableOrderStatus;
};

export class TableProcessor extends React.Component<
  TableProps & OverflowShadowProps & WithSmartCardStorageProps,
  TableProcessorState
> {
  state = {
    tableOrderStatus: undefined,
  };

  render() {
    const { children } = this.props;
    if (!children) {
      return null;
    }

    let childrenArray = React.Children.toArray<React.ReactElement>(children);
    const orderedChildren = compose(
      this.addNumberColumnIndexes,
      this.addSortableColumn,
    )(childrenArray);

    return <TableContainer {...this.props}>{orderedChildren}</TableContainer>;
  }

  // adds sortable + re-orders children
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
}

const TableWithShadows = overflowShadow(TableProcessor, {
  overflowSelector: `.${TableSharedCssClassName.TABLE_NODE_WRAPPER}`,
});

const TableWithWidth: React.FunctionComponent<
  {
    renderWidth?: number;
  } & Omit<React.ComponentProps<typeof TableWithShadows>, 'renderWidth'>
> = (props) => (
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
