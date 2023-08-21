import type { CSSProperties } from 'react';
import React from 'react';

import classnames from 'classnames';
import memoizeOne from 'memoize-one';
import rafSchedule from 'raf-schd';

import type { TableColumnOrdering } from '@atlaskit/adf-schema/steps';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { getParentNodeWidth } from '@atlaskit/editor-common/node-width';
import { tableMarginSides } from '@atlaskit/editor-common/styles';
import type {
  EditorContainerWidth,
  GetEditorFeatureFlags,
} from '@atlaskit/editor-common/types';
import { browser, isValidPosition } from '@atlaskit/editor-common/utils';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorTableToolbarSize as tableToolbarSize } from '@atlaskit/editor-shared-styles';
import { findTable, isTableSelected } from '@atlaskit/editor-tables/utils';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { autoSizeTable, clearHoverSelection } from '../commands';
import { getPluginState } from '../pm-plugins/plugin-factory';
import type {
  RowStickyState,
  StickyPluginState,
} from '../pm-plugins/sticky-headers';
import {
  findStickyHeaderForTable,
  pluginKey as stickyHeadersPluginKey,
} from '../pm-plugins/sticky-headers';
import {
  getLayoutSize,
  insertColgroupFromNode as recreateResizeColsByNode,
  scaleTable,
} from '../pm-plugins/table-resizing/utils';
import { hasTableBeenResized } from '../pm-plugins/table-resizing/utils/colgroup';
import { updateControls } from '../pm-plugins/table-resizing/utils/dom';
import type { PluginInjectionAPI } from '../types';
import { TableCssClassName as ClassName, ShadowEvent } from '../types';
import { tableOverflowShadowWidth } from '../ui/consts';
import TableFloatingControls from '../ui/TableFloatingControls';
import {
  containsHeaderRow,
  isTableNested,
  tablesHaveDifferentColumnWidths,
  tablesHaveDifferentNoOfColumns,
} from '../utils';

import { OverflowShadowsObserver } from './OverflowShadowsObserver';
import { TableContainer } from './TableContainer';
import type { TableOptions } from './types';

const isIE11 = browser.ie_version === 11;
export interface ComponentProps {
  view: EditorView;
  getNode: () => PmNode;
  allowColumnResizing?: boolean;
  eventDispatcher: EventDispatcher;
  getPos: () => number | undefined;
  options?: TableOptions;

  contentDOM: (node: HTMLElement | null) => void;
  containerWidth: EditorContainerWidth;
  allowControls: boolean;
  isHeaderRowEnabled: boolean;
  isHeaderColumnEnabled: boolean;
  isMediaFullscreen?: boolean;
  tableActive: boolean;
  ordering: TableColumnOrdering;
  isResizing?: boolean;
  getEditorFeatureFlags: GetEditorFeatureFlags;
  pluginInjectionApi?: PluginInjectionAPI;
}

interface TableState {
  scroll: number;
  parentWidth?: number;
  stickyHeader?: RowStickyState;
  [ShadowEvent.SHOW_BEFORE_SHADOW]: boolean;
  [ShadowEvent.SHOW_AFTER_SHADOW]: boolean;
}
class TableComponent extends React.Component<ComponentProps, TableState> {
  static displayName = 'TableComponent';

  state: TableState = {
    scroll: 0,
    parentWidth: undefined,
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
    const { options, containerWidth, getNode } = props;
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
  }

  componentDidMount() {
    const { allowColumnResizing, eventDispatcher, options } = this.props;
    if (allowColumnResizing && this.wrapper && !isIE11) {
      this.wrapper.addEventListener('scroll', this.handleScrollDebounced);
    }

    if (allowColumnResizing) {
      /**
       * We no longer use `containerWidth` as a variable to determine an update for table resizing (avoids unnecessary updates).
       * Instead we use the resize event to only trigger updates when necessary.
       */
      if (!options?.isTableResizingEnabled) {
        window.addEventListener('resize', this.handleWindowResizeDebounced);
      }
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
    const { allowColumnResizing, eventDispatcher, options } = this.props;
    if (this.wrapper && !isIE11) {
      this.wrapper.removeEventListener('scroll', this.handleScrollDebounced);
    }

    this.handleScrollDebounced.cancel();
    this.scaleTableDebounced.cancel();
    this.handleTableResizingDebounced.cancel();
    this.handleAutoSizeDebounced.cancel();
    if (!options?.isTableResizingEnabled) {
      this.handleWindowResizeDebounced.cancel();
    }

    if (!options?.isTableResizingEnabled && allowColumnResizing) {
      window.removeEventListener('resize', this.handleWindowResizeDebounced);
    }

    if (this.overflowShadowsObserver) {
      this.overflowShadowsObserver.dispose();
    }

    eventDispatcher.off(
      (stickyHeadersPluginKey as any).key,
      this.onStickyState,
    );
  }

  componentDidUpdate() {
    const {
      view,
      getNode,
      isMediaFullscreen,
      allowColumnResizing,
      isResizing,
      options,
    } = this.props;
    const { isInDanger } = getPluginState(view.state);
    const table = findTable(view.state.selection);

    if (isInDanger && !table) {
      clearHoverSelection()(view.state, view.dispatch);
    }

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
      this.overflowShadowsObserver.observeShadowSentinels(
        this.state.stickyHeader?.sticky,
      );
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

        const shouldRecreateResizeCols =
          !options?.isTableResizingEnabled ||
          !isResizing ||
          (tablesHaveDifferentNoOfColumns(currentTable, previousTable) &&
            isResizing);

        if (shouldRecreateResizeCols) {
          recreateResizeColsByNode(this.table, currentTable);
        }

        updateControls()(view.state);
      }

      this.handleTableResizingDebounced();
    }
  }

  private updateShadowState = (shadowKey: ShadowEvent, value: boolean) => {
    if (this.state[shadowKey] === value) {
      return;
    }
    this.setState({ [shadowKey]: value } as Pick<TableState, typeof shadowKey>);
  };

  private createShadowSentinels = (table: HTMLTableElement | null) => {
    if (table) {
      const shadowSentinelLeft = document.createElement('span');
      shadowSentinelLeft.className = ClassName.TABLE_SHADOW_SENTINEL_LEFT;
      const shadowSentinelRight = document.createElement('span');
      shadowSentinelRight.className = ClassName.TABLE_SHADOW_SENTINEL_RIGHT;
      table.prepend(shadowSentinelLeft);
      table.prepend(shadowSentinelRight);
    }
  };

  onStickyState = (state: StickyPluginState) => {
    const pos = this.props.getPos();
    if (!isValidPosition(pos, this.props.view.state)) {
      return;
    }
    const stickyHeader = findStickyHeaderForTable(state, pos);
    if (stickyHeader !== this.state.stickyHeader) {
      this.setState({ stickyHeader });
      if (this.overflowShadowsObserver) {
        this.overflowShadowsObserver.updateStickyShadows();
      }
    }
  };

  prevTableState: any = null;

  render() {
    const {
      view,
      getNode,
      isResizing,
      allowControls = true,
      isHeaderRowEnabled,
      ordering,
      isHeaderColumnEnabled,
      tableActive,
      containerWidth,
      options,
      getPos,
      pluginInjectionApi,
    } = this.props;
    const { showBeforeShadow, showAfterShadow } = this.state;
    const node = getNode();
    // doesn't work well with WithPluginState
    const { isInDanger, hoveredRows } = getPluginState(view.state);

    const tableRef = this.table || undefined;
    const headerRow = tableRef
      ? tableRef.querySelector<HTMLTableRowElement>('tr[data-header-row]')
      : undefined;

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
          headerRowHeight={headerRow ? headerRow.offsetHeight : undefined}
          stickyHeader={this.state.stickyHeader}
          getEditorFeatureFlags={this.props.getEditorFeatureFlags}
        />
      </div>
    );

    const shadowPadding =
      allowControls && tableActive ? -tableToolbarSize : tableMarginSides;

    const shadowStyle = memoizeOne(
      (visible) =>
        ({ visibility: visible ? 'visible' : 'hidden' } as CSSProperties),
    );

    const isNested = isTableNested(view.state, getPos());

    return (
      <TableContainer
        className={classnames(ClassName.TABLE_CONTAINER, {
          [ClassName.WITH_CONTROLS]: allowControls && tableActive,
          [ClassName.TABLE_STICKY]: this.state.stickyHeader && hasHeaderRow,
          [ClassName.HOVERED_DELETE_BUTTON]: isInDanger,
          [ClassName.TABLE_SELECTED]: isTableSelected(view.state.selection),
        })}
        editorView={view}
        getPos={getPos}
        node={node}
        tableRef={tableRef!}
        containerWidth={containerWidth}
        isBreakoutEnabled={options?.isBreakoutEnabled}
        isNested={isNested}
        pluginInjectionApi={pluginInjectionApi}
        isTableResizingEnabled={options?.isTableResizingEnabled}
        isResizing={isResizing}
      >
        <div
          className={ClassName.TABLE_STICKY_SENTINEL_TOP}
          data-testid="sticky-sentinel-top"
        />
        {allowControls && rowControls}
        <div
          style={shadowStyle(showBeforeShadow)}
          className={ClassName.TABLE_LEFT_SHADOW}
        />
        {this.state.stickyHeader && (
          <div
            className={`${ClassName.TABLE_LEFT_SHADOW} ${ClassName.TABLE_STICKY_SHADOW}`}
            style={{
              visibility:
                showBeforeShadow && hasHeaderRow ? 'visible' : 'hidden',
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
                this.createShadowSentinels(this.table);
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
              right: getBooleanFF('platform.editor.custom-table-width')
                ? `${tableOverflowShadowWidth}px`
                : '-2px',
            }}
          >
            <div
              className={`${ClassName.TABLE_RIGHT_SHADOW} ${ClassName.TABLE_STICKY_SHADOW}`}
              style={{
                visibility:
                  showAfterShadow && hasHeaderRow ? 'visible' : 'hidden',
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
        <div
          className={ClassName.TABLE_STICKY_SENTINEL_BOTTOM}
          data-testid="sticky-sentinel-bottom"
        />
      </TableContainer>
    );
  }

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

    this.setState({
      [ShadowEvent.SHOW_BEFORE_SHADOW]: this.wrapper.scrollLeft !== 0,
    });
  };

  private handleTableResizing = () => {
    const { getNode, containerWidth, options } = this.props;
    const prevNode = this.node!;
    const node = getNode();
    const prevAttrs = prevNode.attrs;

    const isNested = isTableNested(this.props.view.state, this.props.getPos());
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
      const shouldScaleTable =
        (!options?.isTableResizingEnabled ||
          (options?.isTableResizingEnabled && isNested)) &&
        !hasNumberedColumnChanged &&
        !noOfColumnsChanged;

      // If column has been inserted/deleted avoid multi dispatch
      if (shouldScaleTable) {
        this.scaleTable({
          parentWidth,
          layoutChanged,
        });
      }

      // only when table resizing is enabled and toggle numbered column to run scaleTable
      if (options?.isTableResizingEnabled && hasNumberedColumnChanged) {
        if (!hasTableBeenResized(prevNode)) {
          this.scaleTable({
            parentWidth: node.attrs.width,
            layoutChanged,
          });
        }
      }

      this.updateParentWidth(parentWidth);
    }

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

    if (typeof pos !== 'number' || !isValidPosition(pos, state)) {
      return;
    }
    const domAtPos = view.domAtPos.bind(view);
    const { width } = containerWidth;

    this.scaleTableDebounced.cancel();

    const tr = scaleTable(
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
    )(state.tr);

    dispatch(tr);
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
    const node = getNode();
    const prevNode = this.node;
    const layoutSize = this.tableNodeLayoutSize(node);
    const prevAttrs = prevNode?.attrs;
    const layoutChanged =
      prevAttrs?.layout !== node?.attrs?.layout &&
      prevAttrs?.__autoSize === node?.attrs?.__autoSize;

    if (containerWidth.width > layoutSize) {
      return;
    }

    const parentWidth = this.getParentNodeWidth();
    this.scaleTableDebounced({
      layoutChanged: layoutChanged,
      parentWidth: parentWidth,
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
    const parentNodeWith = getParentNodeWidth(
      pos,
      state,
      containerWidth,
      options && options.isFullWidthModeEnabled,
    );

    return parentNodeWith;
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
