import React from 'react';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { TableLayout, UrlType } from '@atlaskit/adf-schema';
import {
  TableSharedCssClassName,
  tableMarginTop,
} from '@atlaskit/editor-common/styles';
import { WidthConsumer, overflowShadow } from '@atlaskit/editor-common/ui';
import type { OverflowShadowProps } from '@atlaskit/editor-common/ui';

import {
  createCompareNodes,
  convertProsemirrorTableNodeToArrayOfRows,
  hasMergedCell,
  compose,
} from '@atlaskit/editor-common/utils';
import { SortOrder } from '@atlaskit/editor-common/types';
import {
  akEditorDefaultLayoutWidth,
  akEditorFullWidthLayoutWidth,
} from '@atlaskit/editor-shared-styles';
import { getTableContainerWidth } from '@atlaskit/editor-common/node-width';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import type {
  RendererAppearance,
  StickyHeaderConfig,
} from '../../ui/Renderer/types';
import { FullPagePadding } from '../../ui/Renderer/style';
import { TableHeader } from './tableCell';
import type { WithSmartCardStorageProps } from '../../ui/SmartCardStorage';
import { withSmartCardStorage } from '../../ui/SmartCardStorage';

import type { StickyMode } from './table/sticky';
import {
  StickyTable,
  tableStickyPadding,
  OverflowParent,
} from './table/sticky';
import { Table } from './table/table';
import type { SharedTableProps } from './table/types';
import { isFullWidthOrFullPageAppearance } from '../utils/appearance';

type TableArrayMapped = {
  rowNodes: Array<PMNode | null>;
  rowReact: React.ReactElement;
};

export const isTableResizingEnabled = (appearance: RendererAppearance) =>
  isFullWidthOrFullPageAppearance(appearance);

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

const isHeaderRowEnabled = (
  rows: (React.ReactChild | React.ReactFragment | React.ReactPortal)[],
) => {
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
  children: (React.ReactChild | React.ReactFragment | React.ReactPortal)[],
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
  wrapperWidth: number;
  headerRowHeight: number;
}

const canUseLinelength = (appearance: RendererAppearance) =>
  appearance === 'full-page' || appearance === 'mobile';

export class TableContainer extends React.Component<
  TableProps & OverflowShadowProps & WithSmartCardStorageProps,
  TableState
> {
  state: TableState = {
    stickyMode: 'none',
    wrapperWidth: 0,
    headerRowHeight: 0,
  };

  tableRef = React.createRef<HTMLTableElement>();
  stickyHeaderRef = React.createRef<HTMLElement>();

  // used for sync scroll + copying wrapper width to sticky header
  stickyWrapperRef = React.createRef<HTMLDivElement>();
  wrapperRef = React.createRef<HTMLDivElement>();

  nextFrame: number | undefined;
  overflowParent: OverflowParent | null = null;

  private resizeObserver: ResizeObserver | null = null;

  private applyResizerChange: ResizeObserverCallback = (entries) => {
    let wrapperWidth = this.state.wrapperWidth;
    let headerRowHeight = this.state.headerRowHeight;

    for (const entry of entries) {
      if (entry.target === this.wrapperRef.current) {
        wrapperWidth = entry.contentRect.width;
      } else if (entry.target === this.stickyHeaderRef.current) {
        headerRowHeight = Math.round(entry.contentRect.height);
      }
    }

    if (
      headerRowHeight !== this.state.headerRowHeight ||
      wrapperWidth !== this.state.wrapperWidth
    ) {
      this.setState({
        wrapperWidth,
        headerRowHeight,
      });
    }
  };

  componentDidMount() {
    this.resizeObserver = new ResizeObserver(this.applyResizerChange);
    if (this.wrapperRef.current) {
      this.resizeObserver.observe(this.wrapperRef.current);
    }
    if (this.stickyHeaderRef.current) {
      this.resizeObserver.observe(this.stickyHeaderRef.current);
    }

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

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
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

    this.stickyWrapperRef.current.scrollLeft =
      this.wrapperRef.current.scrollLeft;
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

  render() {
    const {
      isNumberColumnEnabled,
      layout,
      renderWidth,
      columnWidths,
      stickyHeaders,
      tableNode,
      rendererAppearance,
      isInsideOfBlockNode,
      isinsideMultiBodiedExtension,
    } = this.props;

    const { stickyMode } = this.state;

    const lineLength = akEditorDefaultLayoutWidth;
    let left: number | undefined;
    let updatedLayout: TableLayout | 'custom';

    // The tableWidth and left offset logic below must stay aligned with the `breakout-ssr.tsx` logic
    // Please consider changes below carefully to not negatively impact SSR
    // `renderWidth` cannot be depended on during SSR
    const isRenderWidthValid = !!renderWidth && renderWidth > 0;

    const calcDefaultLayoutWidthByAppearance = (
      rendererAppearance: RendererAppearance,
      tableNode?: PMNode,
    ) => {
      if (rendererAppearance === 'full-width' && !tableNode?.attrs.width) {
        return isRenderWidthValid
          ? Math.min(akEditorFullWidthLayoutWidth, renderWidth)
          : akEditorFullWidthLayoutWidth;
      } else {
        // custom width, or width mapped to breakpoint
        const tableContainerWidth = getTableContainerWidth(tableNode);
        return isRenderWidthValid
          ? Math.min(tableContainerWidth, renderWidth)
          : tableContainerWidth;
      }
    };

    const tableWidth = calcDefaultLayoutWidthByAppearance(
      rendererAppearance,
      tableNode,
    );

    if (canUseLinelength(rendererAppearance) && tableWidth > lineLength) {
      left = lineLength / 2 - tableWidth / 2;
    }

    const children = React.Children.toArray(this.props.children);

    // Historically, tables in the full-width renderer had their layout set to 'default' which is deceiving.
    // This check caters for those tables and helps with SSR logic
    const isFullWidth =
      !tableNode?.attrs.width &&
      rendererAppearance === 'full-width' &&
      layout !== 'full-width';

    if (isFullWidth) {
      updatedLayout = 'full-width';
      // if table has width explicity set, ensure SSR is handled
    } else if (
      tableNode?.attrs.width
    ) {
      updatedLayout = 'custom';
    } else {
      updatedLayout = layout;
    }

    return (
      <>
        <div
          className={`${TableSharedCssClassName.TABLE_CONTAINER} ${
            this.props.shadowClassNames || ''
          }`}
          data-layout={updatedLayout}
          ref={this.props.handleRef}
          style={{
            width: isTableResizingEnabled(rendererAppearance) ? tableWidth : 'inherit',
            // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/design-system/ensure-design-token-usage/preview
            left,
          }}
        >
          {stickyHeaders && tableCanBeSticky(tableNode, children) && (
            <StickyTable
              isNumberColumnEnabled={isNumberColumnEnabled}
              tableWidth={tableWidth}
              layout={layout}
              renderWidth={renderWidth}
              handleRef={this.props.handleRef}
              shadowClassNames={this.props.shadowClassNames}
              top={this.stickyTop}
              mode={stickyMode}
              innerRef={this.stickyWrapperRef}
              wrapperWidth={this.state.wrapperWidth}
              columnWidths={columnWidths}
              rowHeight={this.state.headerRowHeight}
              tableNode={tableNode}
              rendererAppearance={rendererAppearance}
            >
              {[children && children[0]]}
            </StickyTable>
          )}
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
              tableNode={tableNode}
              rendererAppearance={rendererAppearance}
              isInsideOfBlockNode={isInsideOfBlockNode}
              isinsideMultiBodiedExtension={isinsideMultiBodiedExtension}
            >
              {this.grabFirstRowRef(children)}
            </Table>
          </div>
        </div>
      </>
    );
  }

  private grabFirstRowRef = (
    children: (React.ReactNode | React.ReactFragment | React.ReactPortal)[],
  ): React.ReactNode[] => {
    return React.Children.map<React.ReactElement, any>(
      children || false,
      (child, idx) => {
        if (idx === 0 && React.isValidElement(child)) {
          return React.cloneElement(child, {
            innerRef: this.stickyHeaderRef,
          } as React.Attributes);
        }

        return child;
      },
    );
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

    let childrenArray = React.Children.toArray(children);
    const orderedChildren = compose(
      this.addNumberColumnIndexes,
      this.addSortableColumn,
      // @ts-expect-error TS2345: Argument of type '(ReactChild | ReactFragment | ReactPortal)[]' is not assignable to parameter of type 'ReactElement<any, string | JSXElementConstructor<any>>[]'
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
  useShadowObserver: true,
});

const TableWithWidth = (
  props: React.PropsWithChildren<
    {
      renderWidth?: number;
    } & Omit<React.ComponentProps<typeof TableWithShadows>, 'renderWidth'>
  >,
) => {
  // Remember, `width` will be 0 during SSR
  return (
    <WidthConsumer>
      {({ width }) => {
        // we are adding full page padding before but now it cause difference between editor and renderer so we need to remove it, and 1px also for matching exact width.
        const renderWidth =
          props.rendererAppearance === 'full-page'
            ? getBooleanFF('platform.editor.table-width-diff-in-renderer_x5s3z')
              ? width + FullPagePadding - 1
              : width - FullPagePadding * 2
            : width;
        const colWidthsSum =
          props.columnWidths?.reduce((total, val) => total + val, 0) || 0;

        if (colWidthsSum || isTableResizingEnabled(props.rendererAppearance)) {
          return <TableWithShadows renderWidth={renderWidth} {...props} />;
        }
        // there should not be a case when colWidthsSum is 0 and table is in overflow state - so no need to render shadows in this case
        return <TableProcessor renderWidth={renderWidth} {...props} />;
      }}
    </WidthConsumer>
  );
};

export default withSmartCardStorage(TableWithWidth);
