import React, { Component } from 'react';

import { Selection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { browser } from '@atlaskit/editor-common';
import type { TableColumnOrdering } from '@atlaskit/adf-schema/steps';

import { hoverRows, selectRow } from '../../commands';
import { RowStickyState } from '../../pm-plugins/sticky-headers';

import { isSelectionUpdated } from '../../utils';

import CornerControls from './CornerControls';
import NumberColumn from './NumberColumn';
import RowControls from './RowControls';
import { getFeatureFlags } from '../../../feature-flags-context';
export interface Props {
  editorView: EditorView;
  selection?: Selection;
  tableRef?: HTMLTableElement;
  tableActive?: boolean;
  isInDanger?: boolean;
  isResizing?: boolean;
  isHeaderRowEnabled?: boolean;
  isHeaderColumnEnabled?: boolean;
  isNumberColumnEnabled?: boolean;
  hasHeaderRow?: boolean;
  tableHeight?: number;
  headerRowHeight?: number;
  hoveredRows?: number[];
  ordering?: TableColumnOrdering;
  stickyHeader?: RowStickyState;
}

interface State {
  tableHeight: number;
}

export default class TableFloatingControls extends Component<Props, State> {
  static displayName = 'TableFloatingControls';
  private resizeObserver?: ResizeObserver;

  componentDidMount() {
    this.tryInitResizeObserver();
  }

  componentDidUpdate() {
    // tableRef prop is not guaranteed to be defined after componentDidMount, so retry to init resize observer on update
    this.tryInitResizeObserver();
  }

  // tracking the table height changes to update floating controls
  private tryInitResizeObserver() {
    let { tableRef } = this.props;
    const { tableRenderOptimization } =
      getFeatureFlags(this.props.editorView.state) || {};
    if (
      tableRenderOptimization &&
      tableRef &&
      !this.resizeObserver &&
      window?.ResizeObserver
    ) {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const tableHeight = entry.contentRect.height;
          this.setState({ tableHeight });
        }
      });
      this.resizeObserver.observe(tableRef);
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const {
      tableRef,
      isInDanger,
      isResizing,
      isHeaderRowEnabled,
      isNumberColumnEnabled,
      hoveredRows,
      selection,
      tableActive,
      isHeaderColumnEnabled,
      ordering,
      headerRowHeight,
      stickyHeader,
    } = this.props;
    const { tableRenderOptimization } =
      getFeatureFlags(this.props.editorView.state) || {};
    const tableHeight = tableRenderOptimization
      ? this.state?.tableHeight
      : this.props.tableHeight;
    const nextTableHeight = tableRenderOptimization
      ? nextState?.tableHeight
      : nextProps.tableHeight;
    return (
      ordering !== nextProps.ordering ||
      tableRef !== nextProps.tableRef ||
      tableHeight !== nextTableHeight ||
      tableActive !== nextProps.tableActive ||
      isInDanger !== nextProps.isInDanger ||
      isResizing !== nextProps.isResizing ||
      hoveredRows !== nextProps.hoveredRows ||
      isHeaderRowEnabled !== nextProps.isHeaderRowEnabled ||
      isHeaderColumnEnabled !== nextProps.isHeaderColumnEnabled ||
      isNumberColumnEnabled !== nextProps.isNumberColumnEnabled ||
      isSelectionUpdated(selection!, nextProps.selection) ||
      headerRowHeight !== nextProps.headerRowHeight ||
      stickyHeader !== nextProps.stickyHeader
    );
  }

  componentWillUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  render() {
    const {
      editorView,
      tableRef,
      isInDanger,
      isResizing,
      isNumberColumnEnabled,
      isHeaderRowEnabled,
      isHeaderColumnEnabled,
      tableActive,
      hasHeaderRow,
      hoveredRows,
      stickyHeader,
    } = this.props;

    if (!tableRef) {
      return null;
    }

    const stickyTop =
      stickyHeader && stickyHeader.sticky && hasHeaderRow
        ? stickyHeader.top
        : undefined;
    return (
      <div onMouseDown={(e) => e.preventDefault()}>
        {isNumberColumnEnabled ? (
          <NumberColumn
            editorView={editorView}
            hoverRows={this.hoverRows}
            tableRef={tableRef}
            tableActive={tableActive}
            hoveredRows={hoveredRows}
            hasHeaderRow={hasHeaderRow}
            isInDanger={isInDanger}
            isResizing={isResizing}
            selectRow={this.selectRow}
            stickyTop={stickyTop}
          />
        ) : null}

        {tableActive && (
          <>
            <CornerControls
              editorView={editorView}
              tableRef={tableRef}
              isInDanger={isInDanger}
              isResizing={isResizing}
              isHeaderRowEnabled={isHeaderRowEnabled}
              isHeaderColumnEnabled={isHeaderColumnEnabled}
              hoveredRows={hoveredRows}
              stickyTop={tableActive ? stickyTop : undefined}
            />
            <RowControls
              editorView={editorView}
              tableRef={tableRef}
              hoverRows={this.hoverRows}
              hoveredRows={hoveredRows}
              isInDanger={isInDanger}
              isResizing={isResizing}
              selectRow={this.selectRow}
              stickyTop={tableActive ? stickyTop : undefined}
            />
          </>
        )}
      </div>
    );
  }

  private selectRow = (row: number, expand: boolean) => {
    const { editorView } = this.props;
    const { state, dispatch } = editorView;
    // fix for issue ED-4665
    if (browser.ie_version === 11) {
      (editorView.dom as HTMLElement).blur();
    }
    selectRow(row, expand)(state, dispatch);
  };

  private hoverRows = (rows: Array<number>, danger?: boolean) => {
    const { state, dispatch } = this.props.editorView;
    hoverRows(rows, danger)(state, dispatch);
  };
}
