import { Node as PmNode } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { Rect } from '@atlaskit/editor-tables/table-map';
import { DecorationSet } from 'prosemirror-view';
import { InjectedIntl } from 'react-intl';

import {
  tableCellSelector,
  tableHeaderSelector,
  TableLayout,
  tablePrefixSelector,
} from '@atlaskit/adf-schema';
import { TableSharedCssClassName } from '@atlaskit/editor-common';
import { TableColumnOrdering } from '@atlaskit/adf-schema/steps';

import { INPUT_METHOD } from '../analytics/types/enums';

export const RESIZE_HANDLE_AREA_DECORATION_GAP = 30;
export type RowInsertPosition = 'TOP' | 'BOTTOM';

export type PermittedLayoutsDescriptor = TableLayout[] | 'all';
export type Cell = { pos: number; start: number; node: PmNode };
export type CellTransform = (cell: Cell) => (tr: Transaction) => Transaction;

export interface InsertRowOptions {
  index: number;
  moveCursorToInsertedRow: boolean;
}

export type InsertRowMethods =
  | INPUT_METHOD.CONTEXT_MENU
  | INPUT_METHOD.BUTTON
  | INPUT_METHOD.SHORTCUT
  | INPUT_METHOD.KEYBOARD
  | INPUT_METHOD.FLOATING_TB;

export interface PluginConfig {
  advanced?: boolean;
  allowBackgroundColor?: boolean;
  allowColumnResizing?: boolean;
  allowHeaderColumn?: boolean;
  allowHeaderRow?: boolean;
  allowMergeCells?: boolean;
  allowNumberColumn?: boolean;
  allowColumnSorting?: boolean;
  allowAddColumnWithCustomStep?: boolean;
  allowCollapse?: boolean;
  isHeaderRowRequired?: boolean;
  stickToolbarToBottom?: boolean;
  permittedLayouts?: PermittedLayoutsDescriptor;
  allowControls?: boolean;
  stickyHeaders?: boolean;
  allowCellOptionsInFloatingToolbar?: boolean;
  tableCellOptimization?: boolean;
  tableRenderOptimization?: boolean;
  stickyHeadersOptimization?: boolean;
  initialRenderOptimization?: boolean;
  mouseMoveOptimization?: boolean;
  tableOverflowShadowsOptimization?: boolean;
  allowDistributeColumns?: boolean;
}

export interface ColumnResizingPluginState {
  resizeHandlePos: number | null;
  dragging: { startX: number; startWidth: number } | null;
  lastClick: { x: number; y: number; time: number } | null;
  lastColumnResizable?: boolean;
  dynamicTextSizing?: boolean;
}

/*
 * This type represents the start and end from a cell in a column,
 * for example, on this table the cell C1 will have
 * `left: 1` and `right: 3`.
 *
 * ```
 *      left          right
 *        1             3
 *        |             |
 *        |             |
 *        |             |
 * _______∨_____________∨_______
 * |      |             |      |
 * |  B1  |     C1      |  A1  |
 * |______|______ ______|______|
 * |             |      |      |
 * |     B2      |  D1  |  A2  |
 * |______ ______|______|______|
 * |      |      |             |
 * |  B3  |  C2  |      D2     |
 * |______|______|_____________|
 * ```
 *
 */
export type CellColumnPositioning = Pick<Rect, 'right' | 'left'>;

export interface TablePluginState {
  editorHasFocus?: boolean;
  hoveredColumns: number[];
  hoveredRows: number[];
  pluginConfig: PluginConfig;
  isHeaderColumnEnabled: boolean;
  isHeaderRowEnabled: boolean;
  // position of a cell PM node that has cursor
  targetCellPosition?: number;
  // controls need to be re-rendered when table content changes
  // e.g. when pressing enter inside of a cell, it creates a new p and we need to update row controls
  tableNode?: PmNode;
  tableRef?: HTMLTableElement;
  tablePos?: number;
  tableWrapperTarget?: HTMLElement;
  isContextualMenuOpen?: boolean;
  isInDanger?: boolean;
  insertColumnButtonIndex?: number;
  insertRowButtonIndex?: number;
  isFullWidthModeEnabled?: boolean;
  layout?: TableLayout;
  ordering?: TableColumnOrdering;
  resizeHandleColumnIndex?: number;
  tableCellOptimization?: boolean;
  tableHeight?: number;
  tableWidth?: number;
  // for table wrap/collapse
  isTableCollapsed?: boolean; // is the current table already in an expand?
  canCollapseTable?: boolean; // enabled/disabled state of collapse option
}

export type TablePluginAction =
  | { type: 'SET_EDITOR_FOCUS'; data: { editorHasFocus: boolean } }
  | { type: 'TOGGLE_HEADER_ROW' }
  | { type: 'TOGGLE_HEADER_COLUMN' }
  | { type: 'SORT_TABLE'; data: { ordering: TableColumnOrdering } }
  | {
      type: 'SET_TABLE_REF';
      data: {
        tableRef?: HTMLTableElement;
        tableNode?: PmNode;
        tableWrapperTarget?: HTMLElement;
        layout: TableLayout;
        isHeaderRowEnabled: boolean;
        isHeaderColumnEnabled: boolean;
      };
    }
  | {
      type: 'HOVER_ROWS';
      data: {
        decorationSet: DecorationSet;
        hoveredRows: number[];
        isInDanger?: boolean;
      };
    }
  | {
      type: 'HOVER_CELLS';
      data: {
        decorationSet: DecorationSet;
      };
    }
  | {
      type: 'HOVER_COLUMNS';
      data: {
        decorationSet: DecorationSet;
        hoveredColumns: number[];
        isInDanger?: boolean;
      };
    }
  | {
      type: 'HOVER_TABLE';
      data: {
        decorationSet: DecorationSet;
        hoveredRows: number[];
        hoveredColumns: number[];
        isInDanger?: boolean;
      };
    }
  | {
      type: 'ADD_RESIZE_HANDLE_DECORATIONS';
      data: { decorationSet: DecorationSet; resizeHandleColumnIndex: number };
    }
  | { type: 'CLEAR_HOVER_SELECTION'; data: { decorationSet: DecorationSet } }
  | { type: 'SHOW_RESIZE_HANDLE_LINE'; data: { decorationSet: DecorationSet } }
  | { type: 'HIDE_RESIZE_HANDLE_LINE'; data: { decorationSet: DecorationSet } }
  | { type: 'SET_TARGET_CELL_POSITION'; data: { targetCellPosition?: number } }
  | {
      type: 'SELECT_COLUMN';
      data: { targetCellPosition: number; decorationSet: DecorationSet };
    }
  | {
      type: 'SET_TABLE_LAYOUT';
      data: { layout: TableLayout };
    }
  | { type: 'SHOW_INSERT_ROW_BUTTON'; data: { insertRowButtonIndex: number } }
  | {
      type: 'SHOW_INSERT_COLUMN_BUTTON';
      data: { insertColumnButtonIndex: number };
    }
  | {
      type: 'HIDE_INSERT_COLUMN_OR_ROW_BUTTON';
    }
  | { type: 'TOGGLE_CONTEXTUAL_MENU' }
  | {
      type: 'SET_TABLE_SIZE';
      data: { tableHeight: number; tableWidth: number };
    };

export type ColumnResizingPluginAction =
  | {
      type: 'SET_RESIZE_HANDLE_POSITION';
      data: { resizeHandlePos: number | null };
    }
  | { type: 'STOP_RESIZING' }
  | {
      type: 'SET_DRAGGING';
      data: { dragging: { startX: number; startWidth: number } | null };
    }
  | {
      type: 'SET_LAST_CLICK';
      data: { lastClick: { x: number; y: number; time: number } | null };
    };

export enum TableDecorations {
  ALL_CONTROLS_HOVER = 'CONTROLS_HOVER',
  ROW_CONTROLS_HOVER = 'ROW_CONTROLS_HOVER',
  COLUMN_CONTROLS_HOVER = 'COLUMN_CONTROLS_HOVER',
  TABLE_CONTROLS_HOVER = 'TABLE_CONTROLS_HOVER',
  CELL_CONTROLS_HOVER = 'CELL_CONTROLS_HOVER',

  COLUMN_CONTROLS_DECORATIONS = 'COLUMN_CONTROLS_DECORATIONS',
  COLUMN_SELECTED = 'COLUMN_SELECTED',
  COLUMN_RESIZING_HANDLE = 'COLUMN_RESIZING_HANDLE',
  COLUMN_RESIZING_HANDLE_LINE = 'COLUMN_RESIZING_HANDLE_LINE',

  LAST_CELL_ELEMENT = 'LAST_CELL_ELEMENT',
}

export const TableCssClassName = {
  ...TableSharedCssClassName,

  COLUMN_CONTROLS: `${tablePrefixSelector}-column-controls`,
  COLUMN_CONTROLS_DECORATIONS: `${tablePrefixSelector}-column-controls-decoration`,
  COLUMN_SELECTED: `${tablePrefixSelector}-column__selected`,

  ROW_CONTROLS_WRAPPER: `${tablePrefixSelector}-row-controls-wrapper`,
  ROW_CONTROLS: `${tablePrefixSelector}-row-controls`,
  ROW_CONTROLS_INNER: `${tablePrefixSelector}-row-controls__inner`,
  ROW_CONTROLS_BUTTON_WRAP: `${tablePrefixSelector}-row-controls__button-wrap`,
  ROW_CONTROLS_BUTTON: `${tablePrefixSelector}-row-controls__button`,

  CONTROLS_BUTTON: `${tablePrefixSelector}-controls__button`,
  CONTROLS_BUTTON_ICON: `${tablePrefixSelector}-controls__button-icon`,

  CONTROLS_INSERT_BUTTON: `${tablePrefixSelector}-controls__insert-button`,
  CONTROLS_INSERT_BUTTON_INNER: `${tablePrefixSelector}-controls__insert-button-inner`,
  CONTROLS_INSERT_BUTTON_WRAP: `${tablePrefixSelector}-controls__insert-button-wrap`,
  CONTROLS_INSERT_LINE: `${tablePrefixSelector}-controls__insert-line`,
  CONTROLS_BUTTON_OVERLAY: `${tablePrefixSelector}-controls__button-overlay`,
  LAYOUT_BUTTON: `${tablePrefixSelector}-layout-button`,

  CONTROLS_INSERT_MARKER: `${tablePrefixSelector}-controls__insert-marker`,
  CONTROLS_INSERT_COLUMN: `${tablePrefixSelector}-controls__insert-column`,
  CONTROLS_INSERT_ROW: `${tablePrefixSelector}-controls__insert-row`,
  CONTROLS_DELETE_BUTTON_WRAP: `${tablePrefixSelector}-controls__delete-button-wrap`,
  CONTROLS_DELETE_BUTTON: `${tablePrefixSelector}-controls__delete-button`,

  CONTROLS_FLOATING_BUTTON_COLUMN: `${tablePrefixSelector}-controls-floating__button-column`,
  CONTROLS_FLOATING_BUTTON_ROW: `${tablePrefixSelector}-controls-floating__button-row`,

  CORNER_CONTROLS: `${tablePrefixSelector}-corner-controls`,
  CORNER_CONTROLS_INSERT_ROW_MARKER: `${tablePrefixSelector}-corner-controls__insert-row-marker`,
  CORNER_CONTROLS_INSERT_COLUMN_MARKER: `${tablePrefixSelector}-corner-controls__insert-column-marker`,
  CONTROLS_CORNER_BUTTON: `${tablePrefixSelector}-corner-button`,

  NUMBERED_COLUMN: `${tablePrefixSelector}-numbered-column`,
  NUMBERED_COLUMN_BUTTON: `${tablePrefixSelector}-numbered-column__button`,

  HOVERED_COLUMN: `${tablePrefixSelector}-hovered-column`,
  HOVERED_ROW: `${tablePrefixSelector}-hovered-row`,
  HOVERED_TABLE: `${tablePrefixSelector}-hovered-table`,
  HOVERED_CELL: `${tablePrefixSelector}-hovered-cell`,
  HOVERED_CELL_IN_DANGER: 'danger',
  HOVERED_CELL_ACTIVE: 'active',
  HOVERED_CELL_WARNING: `${tablePrefixSelector}-hovered-cell__warning`,
  HOVERED_DELETE_BUTTON: `${tablePrefixSelector}-hovered-delete-button`,
  WITH_CONTROLS: `${tablePrefixSelector}-with-controls`,
  RESIZING_PLUGIN: `${tablePrefixSelector}-resizing-plugin`,
  RESIZE_CURSOR: `${tablePrefixSelector}-resize-cursor`,
  IS_RESIZING: `${tablePrefixSelector}-is-resizing`,

  RESIZE_HANDLE: `${tablePrefixSelector}-resize-handle`,
  RESIZE_HANDLE_DECORATION: `${tablePrefixSelector}-resize-decoration`,

  CONTEXTUAL_SUBMENU: `${tablePrefixSelector}-contextual-submenu`,
  CONTEXTUAL_MENU_BUTTON_WRAP: `${tablePrefixSelector}-contextual-menu-button-wrap`,
  CONTEXTUAL_MENU_BUTTON: `${tablePrefixSelector}-contextual-menu-button`,
  CONTEXTUAL_MENU_ICON: `${tablePrefixSelector}-contextual-submenu-icon`,

  // come from prosemirror-table
  SELECTED_CELL: 'selectedCell',

  // defined in ReactNodeView based on PM node name
  NODEVIEW_WRAPPER: 'tableView-content-wrap',

  TABLE_SELECTED: `${tablePrefixSelector}-table__selected`,
  TABLE_CELL: tableCellSelector,
  TABLE_HEADER_CELL: tableHeaderSelector,
  TABLE_STICKY: `${tablePrefixSelector}-sticky`,

  TOP_LEFT_CELL: 'table > tbody > tr:nth-child(2) > td:nth-child(1)',
  LAST_ITEM_IN_CELL: `${tablePrefixSelector}-last-item-in-cell`,

  WITH_RESIZE_LINE: `${tablePrefixSelector}-column-resize-line`,
};

export interface ToolbarMenuConfig {
  allowHeaderRow?: boolean;
  allowHeaderColumn?: boolean;
  allowNumberColumn?: boolean;
  allowCollapse?: boolean;
}

export interface ToolbarMenuState {
  isHeaderRowEnabled?: boolean;
  isHeaderColumnEnabled?: boolean;
  isNumberColumnEnabled?: boolean;
  isTableCollapsed?: boolean;
  canCollapseTable?: boolean;
}

export interface ToolbarMenuContext {
  formatMessage: InjectedIntl['formatMessage'];
}

export type ElementContentRects = {
  [key: string]: ResizeObserverEntry['contentRect'];
};

export enum ShadowEvent {
  SHOW_BEFORE_SHADOW = 'showBeforeShadow',
  SHOW_AFTER_SHADOW = 'showAfterShadow',
}
