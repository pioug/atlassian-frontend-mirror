import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import { Node as PmNode } from 'prosemirror-model';
import { isTableSelected } from '@atlaskit/editor-tables/utils';
import { EditorView } from 'prosemirror-view';
import rafSchedule from 'raf-schd';
import { findTable } from '@atlaskit/editor-tables/utils';

import {
  calcTableWidth,
  tableMarginSides,
} from '@atlaskit/editor-common/styles';
import { browser, isValidPosition } from '@atlaskit/editor-common/utils';
import {
  akEditorMobileBreakoutPoint,
  akEditorTableToolbarSize as tableToolbarSize,
} from '@atlaskit/editor-shared-styles';

import { getParentNodeWidth } from '@atlaskit/editor-common/node-width';
import type { EditorContainerWidth } from '@atlaskit/editor-common/types';
import { parsePx } from '@atlaskit/editor-common/utils';

import { autoSizeTable, clearHoverSelection } from '../commands';
import { getPluginState } from '../pm-plugins/plugin-factory';
import {
  findStickyHeaderForTable,
  RowStickyState,
  pluginKey as stickyHeadersPluginKey,
  StickyPluginState,
} from '../pm-plugins/sticky-headers';
import { scaleTable } from '../pm-plugins/table-resizing';
import {
  getLayoutSize,
  insertColgroupFromNode as recreateResizeColsByNode,
} from '../pm-plugins/table-resizing/utils';
import { updateControls } from '../pm-plugins/table-resizing/utils/dom';

import type { GetEditorFeatureFlags } from '@atlaskit/editor-common/types';
import {
  TableCssClassName as ClassName,
  ColumnResizingPluginState,
  ShadowEvent,
} from '../types';
import type { TableColumnOrdering } from '@atlaskit/adf-schema/steps';
import TableFloatingControls from '../ui/TableFloatingControls';
import {
  containsHeaderRow,
  tablesHaveDifferentColumnWidths,
  tablesHaveDifferentNoOfColumns,
} from '../utils';

import type { TableOptions } from './types';
import { updateOverflowShadows } from './update-overflow-shadows';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';

import memoizeOne from 'memoize-one';
import { OverflowShadowsObserver } from './OverflowShadowsObserver';

const isIE11 = browser.ie_version === 11;
const NOOP = () => undefined;
export interface ComponentProps {
  view: EditorView;
  getNode: () => PmNode;
  allowColumnResizing?: boolean;
  eventDispatcher: EventDispatcher;
  getPos: () => number;
  options?: TableOptions;

  contentDOM: (node: HTMLElement | null) => void;
  containerWidth: EditorContainerWidth;
  allowControls: boolean;
  isHeaderRowEnabled: boolean;
  isHeaderColumnEnabled: boolean;
  isMediaFullscreen?: boolean;
  tableActive: boolean;
  ordering: TableColumnOrdering;
  tableResizingPluginState?: ColumnResizingPluginState;
  getEditorFeatureFlags: GetEditorFeatureFlags;
}

interface TableState {
  scroll: number;
  tableContainerWidth: string;
  parentWidth?: number;
  isLoading: boolean;
  stickyHeader?: RowStickyState;
  [ShadowEvent.SHOW_BEFORE_SHADOW]: boolean;
  [ShadowEvent.SHOW_AFTER_SHADOW]: boolean;
}
class TableComponent extends React.Component<ComponentProps, TableState> {
  static displayName = 'TableComponent';

  state: TableState = {
    scroll: 0,
    tableContainerWidth: 'inherit',
    parentWidth: undefined,
    isLoading: true,
    [ShadowEvent.SHOW_BEFORE_SHADOW]: false,
    [ShadowEvent.SHOW_AFTER_SHADOW]: false,
  };

  private wrapper?: HTMLDivElement | null;
  private table?: HTMLTableElement | null;
  private node: PmNode;
  private containerWidth?: EditorContainerWidth;
  private layoutSize?: number;
  private overflowShadowsObserver?: OverflowShadowsObserver;

  constructor(props: ComponentProps) {
    super(props);
    const { options, containerWidth, getNode, getEditorFeatureFlags } = props;
    this.node = getNode();
    this.containerWidth = containerWidth;

    // store table size using previous full-width mode so can detect if it has changed
    const isFullWidthModeEnabled = options
      ? options.wasFullWidthModeEnabled
      : false;
    this.layoutSize = this.tableNodeLayoutSize(
      this.node,
      containerWidth.width,
      {
        isFullWidthModeEnabled,
      },
    );

    // Disable inline table editing and resizing controls in Firefox
    // https://github.com/ProseMirror/prosemirror/issues/432
    if ('execCommand' in document) {
      ['enableObjectResizing', 'enableInlineTableEditing'].forEach((cmd) => {
        if (document.queryCommandSupported(cmd)) {
          document.execCommand(cmd, false, 'false');
        }
      });
    }

    const { initialRenderOptimization } = getEditorFeatureFlags();

    if (!initialRenderOptimization) {
      // @see ED-7945
      requestAnimationFrame(() => {
        this.setState({ isLoading: false });
      });
    }
  }

  componentDidMount() {
    const { allowColumnResizing, eventDispatcher } = this.props;
    if (allowColumnResizing && this.wrapper && !isIE11) {
      this.wrapper.addEventListener('scroll', this.handleScrollDebounced);
    }

    if (allowColumnResizing) {
      /**
       * We no longer use `containerWidth` as a variable to determine an update for table resizing (avoids unnecessary updates).
       * Instead we use the resize event to only trigger updates when necessary.
       */
      window.addEventListener('resize', this.handleWindowResizeDebounced);
      this.updateTableContainerWidth();
      this.handleTableResizingDebounced();
    }

    const currentStickyState = stickyHeadersPluginKey.getState(
      this.props.view.state,
    );

    if (currentStickyState) {
      this.onStickyState(currentStickyState);
    }

    eventDispatcher.on((stickyHeadersPluginKey as any).key, this.onStickyState);
  }

  componentWillUnmount() {
    if (this.wrapper && !isIE11) {
      this.wrapper.removeEventListener('scroll', this.handleScrollDebounced);
    }

    this.handleScrollDebounced.cancel();
    this.scaleTableDebounced.cancel();
    this.handleTableResizingDebounced.cancel();
    this.handleAutoSizeDebounced.cancel();
    this.handleWindowResizeDebounced.cancel();

    if (this.props.allowColumnResizing) {
      window.removeEventListener('resize', this.handleWindowResizeDebounced);
    }

    if (this.overflowShadowsObserver) {
      this.overflowShadowsObserver.dispose();
    }

    this.props.eventDispatcher.off(
      (stickyHeadersPluginKey as any).key,
      this.onStickyState,
    );
  }

  componentDidUpdate(prevProps: ComponentProps) {
    const { view, getNode, isMediaFullscreen, allowColumnResizing } =
      this.props;
    const { isInDanger } = getPluginState(view.state);
    const table = findTable(view.state.selection);

    if (isInDanger && !table) {
      clearHoverSelection()(view.state, view.dispatch);
    }

    const { tableOverflowShadowsOptimization } =
      this.props.getEditorFeatureFlags();

    if (!tableOverflowShadowsOptimization) {
      this.updateShadows();
    } else {
      if (
        this.wrapper?.parentElement &&
        this.table &&
        !this.overflowShadowsObserver
      ) {
        this.overflowShadowsObserver = new OverflowShadowsObserver(
          this.updateShadowState,
          this.table,
          this.wrapper,
        );
      }

      if (this.overflowShadowsObserver) {
        this.overflowShadowsObserver.observeCells(
          this.state.stickyHeader?.sticky,
          containsHeaderRow(getNode()),
        );
      }
    }

    const currentTable = getNode();
    if (currentTable.attrs.__autoSize) {
      // Wait for next tick to handle auto sizing, gives the browser time to do layout calc etc.
      this.handleAutoSizeDebounced();
    }
    // re-drawing will cause media component get unmounted that will exit fullscreen mode if media is in fullscreen mode
    // see https://product-fabric.atlassian.net/browse/MEX-1290
    else if (allowColumnResizing && this.table && !isMediaFullscreen) {
      // If col widths (e.g. via collab) or number of columns (e.g. delete a column) have changed,
      // re-draw colgroup.
      const previousTable = this.node;
      if (
        tablesHaveDifferentColumnWidths(currentTable, previousTable) ||
        tablesHaveDifferentNoOfColumns(currentTable, previousTable)
      ) {
        const { view } = this.props;
        recreateResizeColsByNode(this.table, currentTable);
        updateControls(this.props.getEditorFeatureFlags)(view.state);
      }

      this.handleTableResizingDebounced();
    }
  }

  private updateShadows() {
    const parent = this.wrapper?.parentElement;
    if (this.wrapper && parent) {
      const rightShadows = parent.querySelectorAll<HTMLElement>(
        `.${ClassName.TABLE_RIGHT_SHADOW}`,
      );
      const leftShadows = parent.querySelectorAll<HTMLElement>(
        `.${ClassName.TABLE_LEFT_SHADOW}`,
      );

      updateOverflowShadows(this.props.getEditorFeatureFlags)(
        this.props.view.state,
        this.wrapper,
        this.table,
        rightShadows,
        leftShadows,
      );
    }
  }

  private updateShadowState = (shadowKey: ShadowEvent, value: boolean) => {
    if (this.state[shadowKey] === value) {
      return;
    }
    // need this check to satisfy types for the setState argument
    if (shadowKey === ShadowEvent.SHOW_BEFORE_SHADOW) {
      return this.setState({ [shadowKey]: value });
    }
    this.setState({ [shadowKey]: value });
  };

  onStickyState = (state: StickyPluginState) => {
    const { tableOverflowShadowsOptimization } =
      this.props.getEditorFeatureFlags();

    const pos = this.props.getPos();
    if (!isValidPosition(pos, this.props.view.state)) {
      return;
    }
    const stickyHeader = findStickyHeaderForTable(state, pos);
    if (stickyHeader !== this.state.stickyHeader) {
      this.setState({ stickyHeader });
      if (tableOverflowShadowsOptimization && this.overflowShadowsObserver) {
        this.overflowShadowsObserver.updateStickyShadows();
      }
    }
  };

  prevTableState: any = null;

  render() {
    const {
      view,
      getNode,
      tableResizingPluginState,
      allowControls = true,
      isHeaderRowEnabled,
      ordering,
      isHeaderColumnEnabled,
      tableActive,
      containerWidth,
    } = this.props;
    const {
      isLoading,
      tableContainerWidth,
      showBeforeShadow,
      showAfterShadow,
    } = this.state;
    const node = getNode();
    // doesn't work well with WithPluginState
    const { isInDanger, hoveredRows } = getPluginState(view.state);

    const {
      stickyHeadersOptimization,
      initialRenderOptimization,
      tableRenderOptimization,
      tableOverflowShadowsOptimization,
    } = this.props.getEditorFeatureFlags();

    const tableRef = this.table || undefined;
    const isResizing =
      !!tableResizingPluginState && !!tableResizingPluginState.dragging;
    const headerRow = tableRef
      ? tableRef.querySelector<HTMLTableRowElement>('tr[data-header-row]')
      : undefined;

    //dont need to change tableHeight with tableRenderOptimization because it will be observed inside floating components
    const tableHeight =
      tableRef && !tableRenderOptimization ? tableRef.offsetHeight : undefined;

    const hasHeaderRow = containsHeaderRow(node);
    const rowControls = (
      <div className={ClassName.ROW_CONTROLS_WRAPPER}>
        <TableFloatingControls
          editorView={view}
          tableRef={tableRef}
          tableActive={tableActive}
          hoveredRows={hoveredRows}
          isInDanger={isInDanger}
          isResizing={isResizing}
          isNumberColumnEnabled={node.attrs.isNumberColumnEnabled}
          isHeaderRowEnabled={isHeaderRowEnabled}
          ordering={ordering}
          isHeaderColumnEnabled={isHeaderColumnEnabled}
          hasHeaderRow={hasHeaderRow}
          // pass `selection` and `tableHeight` to control re-render
          selection={view.state.selection}
          tableHeight={tableHeight}
          headerRowHeight={headerRow ? headerRow.offsetHeight : undefined}
          stickyHeader={this.state.stickyHeader}
          getEditorFeatureFlags={this.props.getEditorFeatureFlags}
        />
      </div>
    );

    const shadowPadding =
      allowControls && (!isLoading || initialRenderOptimization) && tableActive
        ? -tableToolbarSize
        : tableMarginSides;

    const shadowStyle = tableOverflowShadowsOptimization
      ? memoizeOne(
          (visible) =>
            ({ visibility: visible ? 'visible' : 'hidden' } as CSSProperties),
        )
      : NOOP;

    return (
      <div
        style={{
          width: tableContainerWidth,
          marginLeft: this.getMarginLeft(tableContainerWidth),
        }}
        className={classnames(ClassName.TABLE_CONTAINER, {
          [ClassName.WITH_CONTROLS]: allowControls && tableActive,
          [ClassName.TABLE_STICKY]: this.state.stickyHeader && hasHeaderRow,
          [ClassName.HOVERED_DELETE_BUTTON]: isInDanger,
          [ClassName.TABLE_SELECTED]: isTableSelected(view.state.selection),
          'less-padding': containerWidth.width < akEditorMobileBreakoutPoint,
        })}
        data-number-column={node.attrs.isNumberColumnEnabled}
        data-layout={node.attrs.layout}
      >
        {stickyHeadersOptimization && (
          <div
            className={ClassName.TABLE_STICKY_SENTINEL_TOP}
            data-testid="sticky-sentinel-top"
          />
        )}
        {allowControls &&
          (!isLoading || initialRenderOptimization) &&
          rowControls}
        <div
          style={shadowStyle(showBeforeShadow)}
          className={ClassName.TABLE_LEFT_SHADOW}
        />
        {this.state.stickyHeader && (
          <div
            className={`${ClassName.TABLE_LEFT_SHADOW} ${ClassName.TABLE_STICKY_SHADOW}`}
            style={{
              visibility: tableOverflowShadowsOptimization
                ? showBeforeShadow && hasHeaderRow
                  ? 'visible'
                  : 'hidden'
                : undefined,
              top: `${
                this.state.stickyHeader.top +
                this.state.stickyHeader.padding +
                shadowPadding +
                2
              }px`,
            }}
          />
        )}

        <div
          className={classnames(ClassName.TABLE_NODE_WRAPPER)}
          ref={(elem) => {
            this.wrapper = elem;
            if (elem) {
              this.props.contentDOM(elem);
              const tableElement = elem.querySelector('table');
              if (tableElement !== this.table) {
                this.table = tableElement;
              }
            }
          }}
        />
        <div
          style={shadowStyle(showAfterShadow)}
          className={ClassName.TABLE_RIGHT_SHADOW}
        />
        {this.state.stickyHeader && (
          <div
            style={{
              position: 'absolute',
              right: '-2px',
            }}
          >
            <div
              className={`${ClassName.TABLE_RIGHT_SHADOW} ${ClassName.TABLE_STICKY_SHADOW}`}
              style={{
                visibility: tableOverflowShadowsOptimization
                  ? showAfterShadow && hasHeaderRow
                    ? 'visible'
                    : 'hidden'
                  : undefined,
                top: `${
                  this.state.stickyHeader.top +
                  this.state.stickyHeader.padding +
                  shadowPadding +
                  2
                }px`,
              }}
            />
          </div>
        )}
        {stickyHeadersOptimization && (
          <div
            className={ClassName.TABLE_STICKY_SENTINEL_BOTTOM}
            data-testid="sticky-sentinel-bottom"
          />
        )}
      </div>
    );
  }

  private getMarginLeft = (tableContainerCssWidth: string) => {
    const { containerWidth } = this.props;
    const { lineLength } = containerWidth;
    let marginLeft;
    if (tableContainerCssWidth !== 'inherit' && lineLength) {
      const containerWidth = parsePx(tableContainerCssWidth);

      if (containerWidth) {
        marginLeft = (lineLength - containerWidth) / 2;
      }
    }
    return marginLeft;
  };

  private handleScroll = (event: Event) => {
    if (!this.wrapper || event.target !== this.wrapper) {
      return;
    }

    if (this.table) {
      // sync sticky header row to table scroll
      const headers = this.table.querySelectorAll('tr[data-header-row]');
      for (let i = 0; i < headers.length; i++) {
        const header = headers[i] as HTMLElement;

        header.scrollLeft = this.wrapper.scrollLeft;
        header.style.marginRight = '2px';
      }
    }

    const { tableOverflowShadowsOptimization } =
      this.props.getEditorFeatureFlags();

    if (!tableOverflowShadowsOptimization) {
      this.updateShadows();
    }
  };

  private handleTableResizing = () => {
    const { getNode, containerWidth, options } = this.props;
    const prevNode = this.node!;
    const node = getNode();
    const prevAttrs = prevNode.attrs;

    // We only consider a layout change valid if it's done outside of an autoSize.
    const layoutChanged =
      prevAttrs.layout !== node.attrs.layout &&
      prevAttrs.__autoSize === node.attrs.__autoSize;

    const parentWidth = this.getParentNodeWidth();
    const parentWidthChanged =
      parentWidth && parentWidth !== this.state.parentWidth;

    const layoutSize = this.tableNodeLayoutSize(
      node,
      containerWidth.width,
      options,
    );

    const hasNumberedColumnChanged =
      prevAttrs.isNumberColumnEnabled !== node.attrs.isNumberColumnEnabled;

    const noOfColumnsChanged = tablesHaveDifferentNoOfColumns(node, prevNode);

    if (
      // Breakout mode/layout changed
      layoutChanged ||
      // We need to react if our parent changes
      // Scales the cols widths relative to the new parent width.
      parentWidthChanged ||
      // Enabling / disabling this feature reduces or adds size to the table.
      hasNumberedColumnChanged ||
      // This last check is also to cater for dynamic text sizing changing the 'default' layout width
      // Usually happens on window resize.
      layoutSize !== this.layoutSize ||
      noOfColumnsChanged
    ) {
      // If column has been inserted/deleted avoid multi dispatch
      if (!hasNumberedColumnChanged && !noOfColumnsChanged) {
        this.scaleTable({ parentWidth, layoutChanged });
      }
      this.updateParentWidth(parentWidth);
    }

    this.updateTableContainerWidth();
    this.node = node;
    this.containerWidth = containerWidth;
    this.layoutSize = layoutSize;
  };

  private scaleTable = (scaleOptions: {
    layoutChanged: boolean;
    parentWidth?: number;
  }) => {
    const { view, getNode, getPos, containerWidth, options } = this.props;
    const node = getNode();
    const { state, dispatch } = view;
    const pos = getPos();
    if (!isValidPosition(pos, state)) {
      return;
    }
    const domAtPos = view.domAtPos.bind(view);
    const { width } = containerWidth;

    this.scaleTableDebounced.cancel();

    scaleTable(
      this.table,
      {
        ...scaleOptions,
        node,
        prevNode: this.node || node,
        start: pos + 1,
        containerWidth: width,
        previousContainerWidth: this.containerWidth!.width || width,
        ...options,
      },
      domAtPos,
    )(state, dispatch);
  };

  private handleAutoSize = () => {
    if (this.table) {
      const { view, getNode, getPos, containerWidth } = this.props;
      const node = getNode();
      const pos = getPos();
      if (!isValidPosition(pos, view.state)) {
        return;
      }
      autoSizeTable(view, node, this.table, pos, {
        containerWidth: containerWidth.width,
      });
    }
  };

  private handleWindowResize = () => {
    const { getNode, containerWidth } = this.props;
    const layoutSize = this.tableNodeLayoutSize(getNode());

    if (containerWidth.width > layoutSize) {
      return;
    }

    const parentWidth = this.getParentNodeWidth();
    this.scaleTableDebounced(parentWidth);
  };

  private updateTableContainerWidth = () => {
    const { getNode, containerWidth, options } = this.props;
    const node = getNode();
    if (options && options.isBreakoutEnabled === false) {
      return;
    }
    const tableContainerWidth = calcTableWidth(
      node.attrs.layout,
      containerWidth.width,
    );

    if (this.state.tableContainerWidth === tableContainerWidth) {
      return null;
    }

    this.setState((prevState: TableState) => {
      if (
        options &&
        options.isBreakoutEnabled === false &&
        prevState.tableContainerWidth !== 'inherit'
      ) {
        return { tableContainerWidth: 'inherit' };
      }

      return {
        tableContainerWidth,
      };
    });
  };

  private getParentNodeWidth = () => {
    const {
      getPos,
      containerWidth,
      options,
      view: { state },
    } = this.props;
    const pos = getPos();
    if (!isValidPosition(pos, state)) {
      return;
    }
    return getParentNodeWidth(
      pos,
      state,
      containerWidth,
      options && options.isFullWidthModeEnabled,
    );
  };

  private updateParentWidth = (width?: number) => {
    this.setState({ parentWidth: width });
  };

  private tableNodeLayoutSize = (
    node: PmNode,
    containerWidth?: number,
    options?: TableOptions,
  ) =>
    getLayoutSize(
      node.attrs.layout,
      containerWidth || this.props.containerWidth.width,
      options || this.props.options || {},
    );

  private scaleTableDebounced = rafSchedule(this.scaleTable);
  private handleTableResizingDebounced = rafSchedule(this.handleTableResizing);
  private handleScrollDebounced = rafSchedule(this.handleScroll);
  private handleAutoSizeDebounced = rafSchedule(this.handleAutoSize);
  private handleWindowResizeDebounced = rafSchedule(this.handleWindowResize);
}

export default TableComponent;
