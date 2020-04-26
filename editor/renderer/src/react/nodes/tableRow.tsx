import React from 'react';
import { RendererCssClassName } from '../../consts';
import { SortOrder, compose } from '@atlaskit/editor-common';
import { TableHeader } from './tableCell';
import { findHorizontalOverflowScrollParent } from '../../utils';
import { StickyHeaderConfig } from '../../ui/Renderer/types';

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
  stickyHeaders?: StickyHeaderConfig;
};

type StickyMode = 'fixed' | 'sticky' | 'none';

type State = {
  colGroupWidths: string[];
  stickyMode: StickyMode;
};

const hasHeaderRow = (children: React.ReactNode) =>
  React.Children.toArray(children)
    .map(child => React.isValidElement(child) && child.type === TableHeader)
    .every(Boolean);

const borderOffset = 2;

export default class TableRow extends React.Component<Props, State> {
  tableHeaderRow = React.createRef<HTMLTableRowElement>();

  // Container with overflowScroll
  overflowParent: HTMLElement | false = false;

  state: State = {
    colGroupWidths: [],
    stickyMode: 'none',
  };

  addHeaderAttribute = (tableHeaderRow: HTMLTableRowElement): void => {
    if (!tableHeaderRow.getAttribute('data-header-row')) {
      tableHeaderRow.setAttribute('data-header-row', 'true');
    }
    return;
  };

  getHeaderTop = (tableHeaderRow: HTMLTableRowElement): number => {
    const offsetTop =
      (this.props.stickyHeaders && this.props.stickyHeaders.offsetTop) || 0;
    const tbody = tableHeaderRow.parentElement!;
    const refTop = this.getRefTop(tbody);
    const tableHeight = tableHeaderRow.clientHeight;
    const tbodyHeight = tbody.clientHeight;
    const heightofVisibleTable =
      tableHeight + -refTop + offsetTop - borderOffset;
    const didHeaderReachEnd = heightofVisibleTable < tbodyHeight;

    return didHeaderReachEnd
      ? this.getScrollTop()
      : tbody.clientHeight - heightofVisibleTable + offsetTop;
  };

  getRefTop = (refElement: HTMLElement): number => {
    return Math.round(refElement.getBoundingClientRect().top) - borderOffset;
  };

  getScrollTop = (): number => {
    const windowScrollTop = 0;
    const offsetTop =
      (this.props.stickyHeaders && this.props.stickyHeaders.offsetTop) || 0;

    return (
      (this.overflowParent
        ? this.overflowParent.getBoundingClientRect().top
        : windowScrollTop) + offsetTop
    );
  };

  shouldHeaderStick = (refElement: HTMLElement): boolean => {
    const res = this.getRefTop(refElement) <= this.getScrollTop();
    return res;
  };

  makeHeadersSticky = (tableHeaderRow: HTMLTableRowElement) => {
    tableHeaderRow.classList.add('sticky');
    this.getWrapperElement(tableHeaderRow).style.overflow = 'visible';
  };

  getWrapperElement = (tableHeaderRow: HTMLTableRowElement): HTMLElement => {
    const tbody = tableHeaderRow.parentElement as HTMLElement;
    const table = tbody.parentElement as HTMLElement;
    const wrapper = table.parentElement as HTMLElement;
    return wrapper;
  };

  passColGroupWidth = (tableHeaderRow: HTMLTableRowElement): void => {
    const colGroup = tableHeaderRow.parentElement!.previousElementSibling;
    if (!colGroup) {
      return;
    }
    const colGroupWidths: string[] = [];
    colGroup.childNodes.forEach((colGroup, index) => {
      const colGroupElem = colGroup as HTMLElement;
      colGroupWidths[index] = colGroupElem.style.width || 'inherit';
    });

    if (this.props.isNumberColumnEnabled) {
      const numberedColumnHeader = tableHeaderRow.firstElementChild! as HTMLElement;
      const numberedColumnWidth = colGroupWidths.shift();

      // if numbered column is enabled dont pass its width to the children
      numberedColumnHeader.style.width = numberedColumnWidth || 'inherit';
      numberedColumnHeader.style.minWidth = numberedColumnWidth || 'inherit';
    }

    this.setState(prevState => {
      if (!prevState.colGroupWidths.length) {
        return {
          colGroupWidths,
        };
      }
      return null;
    });
    return;
  };

  resetColGroupWidth = (tableHeaderRow: HTMLTableRowElement) => {
    const colGroup = tableHeaderRow.parentElement!.previousSibling;
    if (!colGroup) {
      return;
    }
    if (this.props.isNumberColumnEnabled) {
      const numberedColumnHeader = tableHeaderRow.firstChild! as HTMLElement;
      // if numbered column is enabled dont pass its width to the children
      numberedColumnHeader.style.width = 'inherit';
      numberedColumnHeader.style.minWidth = 'inherit';
    }

    this.setState(prevState => {
      if (prevState.colGroupWidths.length) {
        return {
          colGroupWidths: [],
        };
      }
      return null;
    });
  };

  addFixedStylesToHeader = (tableHeaderRow: HTMLTableRowElement) => {
    const wrapperElement = this.getWrapperElement(tableHeaderRow);

    const next = tableHeaderRow.nextElementSibling;
    if (next) {
      // Add Border to the row beneath header-row to curtail table shifting
      (next as HTMLElement).style.borderTop = `${tableHeaderRow.clientHeight}px solid transparent`;
    }

    // Add fixed class to the current tableHeaderRow
    tableHeaderRow.classList.add('fixed');

    // Set the top based on the current position of scroll
    tableHeaderRow.style.top = `${this.getHeaderTop(tableHeaderRow)}px`;

    // sync the current scroll left
    tableHeaderRow.scrollLeft = wrapperElement.scrollLeft;
    tableHeaderRow.style.width = `${wrapperElement.clientWidth}px`;
  };

  removeFixedStylesFromHeader = (tableHeaderRow: HTMLTableRowElement) => {
    const next = tableHeaderRow.nextElementSibling;
    if (next) {
      (next as HTMLElement).style.borderTop = ``;
    }
    tableHeaderRow.style.width = `inherit`;
    tableHeaderRow.classList.remove('fixed');
  };

  makeHeadersFixed = (tableHeaderRow: HTMLTableRowElement) => {
    this.passColGroupWidth(tableHeaderRow);
    this.addFixedStylesToHeader(tableHeaderRow);
  };

  removeStickyHeaders = (tableHeaderRow: HTMLTableRowElement) => {
    tableHeaderRow.classList.remove('sticky');
    this.getWrapperElement(tableHeaderRow).style.overflow = 'auto';
  };

  removeFixedHeaders = (tableHeaderRow: HTMLTableRowElement) => {
    this.removeFixedStylesFromHeader(tableHeaderRow);
    this.resetColGroupWidth(tableHeaderRow);
  };

  onScroll = () => {
    const tableHeaderRow = this.tableHeaderRow.current as HTMLTableRowElement;

    if (!this.tableHeaderRow.current || !tableHeaderRow!.parentElement) {
      return;
    }

    const tbody = tableHeaderRow.parentElement!;
    const table = tbody.parentElement!;
    const wrapper = table.parentElement!;

    const shouldSticky = this.shouldHeaderStick(tbody);
    const isOverflowTable = table.clientWidth > wrapper.clientWidth;
    const stickyMode: StickyMode = !shouldSticky
      ? 'none'
      : isOverflowTable
      ? 'fixed'
      : 'sticky';

    this.applyStickyMode(stickyMode);

    if (this.state.stickyMode !== stickyMode) {
      this.setState({
        stickyMode,
      });
    }
  };

  addSortableColumn = (childrenArray: React.ReactNode[]): React.ReactNode[] => {
    const { allowColumnSorting, index: rowIndex } = this.props;

    if (allowColumnSorting) {
      const isHeaderRow = !rowIndex;
      childrenArray = childrenArray.map((child, index) => {
        if (React.isValidElement(child)) {
          const { tableOrderStatus } = this.props;
          let sortOrdered: SortOrder = SortOrder.NO_ORDER;
          if (tableOrderStatus) {
            sortOrdered =
              index === tableOrderStatus.columnIndex
                ? tableOrderStatus.order
                : SortOrder.NO_ORDER;
          }

          return React.cloneElement(child, {
            columnIndex: index,
            onSorting: this.props.onSorting,
            sortOrdered,
            isHeaderRow,
          });
        }
      });
    }
    return childrenArray;
  };

  addColGroupWidth = (childrenArray: React.ReactNode[]): React.ReactNode[] => {
    if (this.state.colGroupWidths) {
      childrenArray = childrenArray.map((child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            colGroupWidth: this.state.colGroupWidths[index],
          });
        }
      });
    }
    return childrenArray;
  };

  addOffsetTop = (childrenArray: React.ReactNode[]): React.ReactNode[] => {
    const offsetTop =
      this.props.stickyHeaders && this.props.stickyHeaders.offsetTop;

    // if we're using position: sticky then we want to apply positioning to the cells
    // so, pass through offsetTop
    //
    // if we're using position: fixed, we do it on the row, so no need to pass
    // anything down
    if (this.state.stickyMode !== 'sticky') {
      return childrenArray;
    }

    return childrenArray.map((child, index) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          offsetTop,
        });
      }
    });
  };

  componentDidMount() {
    const { stickyHeaders } = this.props;
    const tableHeaderRow = this.tableHeaderRow.current;
    if (tableHeaderRow && stickyHeaders && stickyHeaders.showStickyHeaders) {
      this.overflowParent = findHorizontalOverflowScrollParent(
        this.tableHeaderRow.current,
      );
      this.addHeaderAttribute(tableHeaderRow);
      this.addScrollListener();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.stickyHeaders !== prevProps.stickyHeaders) {
      this.applyStickyMode(this.state.stickyMode);
    }
  }

  addScrollListener = (): void => {
    if (this.overflowParent) {
      this.overflowParent.addEventListener('scroll', this.onScroll);
    } else {
      window.addEventListener('scroll', this.onScroll);
    }
  };

  componentWillUnmount() {
    if (this.overflowParent) {
      this.overflowParent.removeEventListener('scroll', this.onScroll);
    } else {
      window.removeEventListener('scroll', this.onScroll);
    }
  }

  applyStickyMode(stickyMode: StickyMode) {
    const tableHeaderRow = this.tableHeaderRow.current as HTMLTableRowElement;
    if (!tableHeaderRow) {
      return;
    }

    if (stickyMode === 'none') {
      this.removeStickyHeaders(tableHeaderRow);
      this.removeFixedHeaders(tableHeaderRow);
    } else if (stickyMode === 'sticky') {
      this.makeHeadersSticky(tableHeaderRow);
    } else if (stickyMode === 'fixed') {
      this.makeHeadersFixed(tableHeaderRow);
    }
  }

  render() {
    const { children } = this.props;

    const childrenArray = React.Children.toArray<React.ReactNode>(children);

    // fixed sticky on number column is handled by the tr
    const offsetTop =
      this.state.stickyMode === 'sticky'
        ? this.props.stickyHeaders && this.props.stickyHeaders.offsetTop
        : undefined;

    return (
      <tr ref={hasHeaderRow(this.props.children) ? this.tableHeaderRow : null}>
        {this.props.isNumberColumnEnabled && (
          <td
            className={RendererCssClassName.NUMBER_COLUMN}
            style={{ top: offsetTop }}
          >
            {this.props.index}
          </td>
        )}
        {compose(
          this.addSortableColumn,
          this.addColGroupWidth,
          this.addOffsetTop,
        )(childrenArray)}
      </tr>
    );
  }
}
