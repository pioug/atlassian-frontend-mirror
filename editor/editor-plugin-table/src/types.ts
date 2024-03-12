import type { IntlShape } from 'react-intl-next';

import type { TableLayout } from '@atlaskit/adf-schema';
import {
  tableCellSelector,
  tableHeaderSelector,
  tablePrefixSelector,
} from '@atlaskit/adf-schema';
import type { TableColumnOrdering } from '@atlaskit/custom-steps';
import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { TableSharedCssClassName } from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import type { Rect } from '@atlaskit/editor-tables/table-map';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';

import type tablePlugin from './plugin';

export const RESIZE_HANDLE_AREA_DECORATION_GAP = 30;
export type RowInsertPosition = 'TOP' | 'BOTTOM';

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-6877 Internal documentation for deprecation (no external access)}
 **/
export type PermittedLayoutsDescriptor = TableLayout[] | 'all';
export type Cell = { pos: number; start: number; node: PmNode };
export type CellTransform = (cell: Cell) => (tr: Transaction) => Transaction;

export interface InsertRowOptions {
  index: number;
  moveCursorToInsertedRow: boolean;
}

export type PluginInjectionAPI = ExtractInjectionAPI<typeof tablePlugin>;

export type InsertRowMethods =
  | INPUT_METHOD.CONTEXT_MENU
  | INPUT_METHOD.BUTTON
  | INPUT_METHOD.SHORTCUT
  | INPUT_METHOD.KEYBOARD
  | INPUT_METHOD.FLOATING_TB
  | INPUT_METHOD.TABLE_CONTEXT_MENU;

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
  /**
   * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-6877 Internal documentation for deprecation (no external access)}
   **/
  permittedLayouts?: PermittedLayoutsDescriptor;
  allowControls?: boolean;
  stickyHeaders?: boolean;
  allowCellOptionsInFloatingToolbar?: boolean;
  allowDistributeColumns?: boolean;
}

export type { ColumnResizingPluginState } from '@atlaskit/editor-common/types';

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
export interface CellHoverMeta {
  colIndex?: number;
  rowIndex?: number;
}

export interface TablePluginState {
  editorHasFocus?: boolean;
  hoveredColumns: number[];
  hoveredRows: number[];
  hoveredCell: CellHoverMeta;
  pluginConfig: PluginConfig;
  isHeaderColumnEnabled: boolean;
  isHeaderRowEnabled: boolean;
  isNumberColumnEnabled?: boolean;
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
  isWholeTableInDanger?: boolean;
  insertColumnButtonIndex?: number;
  insertRowButtonIndex?: number;
  isFullWidthModeEnabled?: boolean;
  layout?: TableLayout;
  ordering?: TableColumnOrdering;
  isResizeHandleWidgetAdded?: boolean;
  resizeHandleRowIndex?: number;
  resizeHandleColumnIndex?: number;
  resizeHandleIncludeTooltip?: boolean;
  isKeyboardResize?: boolean;
  // for table wrap/collapse
  isTableCollapsed?: boolean; // is the current table already in an expand?
  canCollapseTable?: boolean; // enabled/disabled state of collapse option

  getIntl: () => IntlShape;

  isBreakoutEnabled?: boolean;
  wasFullWidthModeEnabled?: boolean;
  isTableResizingEnabled?: boolean;
  isDragAndDropEnabled?: boolean;
  isTableHovered?: boolean;
  isTableScalingEnabled?: boolean;
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
      type: 'HOVER_MERGED_CELLS';
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
      type: 'START_KEYBOARD_COLUMN_RESIZE';
      data: {
        decorationSet: DecorationSet;
        resizeHandleRowIndex: number;
        resizeHandleColumnIndex: number;
        resizeHandleIncludeTooltip: boolean;
        isKeyboardResize?: boolean;
      };
    }
  | {
      type: 'ADD_RESIZE_HANDLE_DECORATIONS';
      data: {
        decorationSet: DecorationSet;
        resizeHandleRowIndex: number;
        resizeHandleColumnIndex: number;
        resizeHandleIncludeTooltip: boolean;
        isKeyboardResize?: boolean;
      };
    }
  | {
      type: 'UPDATE_RESIZE_HANDLE_DECORATIONS';
      data: {
        decorationSet: DecorationSet;
        resizeHandleRowIndex: number | undefined;
        resizeHandleColumnIndex: number | undefined;
        resizeHandleIncludeTooltip: boolean | undefined;
      };
    }
  | {
      type: 'REMOVE_RESIZE_HANDLE_DECORATIONS';
      data: { decorationSet: DecorationSet };
    }
  | {
      type: 'STOP_KEYBOARD_COLUMN_RESIZE';
      data: { decorationSet: DecorationSet };
    }
  | { type: 'CLEAR_HOVER_SELECTION'; data: { decorationSet: DecorationSet } }
  | { type: 'SHOW_RESIZE_HANDLE_LINE'; data: { decorationSet: DecorationSet } }
  | { type: 'HIDE_RESIZE_HANDLE_LINE'; data: { decorationSet: DecorationSet } }
  | {
      type: 'HOVER_CELL';
      data: {
        hoveredCell: CellHoverMeta;
      };
    }
  | {
      type: 'TABLE_HOVERED';
      data: {
        isTableHovered: boolean;
      };
    }
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
  | { type: 'TOGGLE_CONTEXTUAL_MENU' };

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
  /** Classic controls */
  ALL_CONTROLS_HOVER = 'CONTROLS_HOVER',
  ROW_CONTROLS_HOVER = 'ROW_CONTROLS_HOVER',
  COLUMN_CONTROLS_HOVER = 'COLUMN_CONTROLS_HOVER',
  TABLE_CONTROLS_HOVER = 'TABLE_CONTROLS_HOVER',
  CELL_CONTROLS_HOVER = 'CELL_CONTROLS_HOVER',

  COLUMN_CONTROLS_DECORATIONS = 'COLUMN_CONTROLS_DECORATIONS',
  COLUMN_DROP_TARGET_DECORATIONS = 'COLUMN_DROP_TARGET_DECORATIONS',
  COLUMN_SELECTED = 'COLUMN_SELECTED',
  COLUMN_RESIZING_HANDLE = 'COLUMN_RESIZING_HANDLE',
  COLUMN_RESIZING_HANDLE_WIDGET = 'COLUMN_RESIZING_HANDLE_WIDGET',
  COLUMN_RESIZING_HANDLE_LINE = 'COLUMN_RESIZING_HANDLE_LINE',

  COLUMN_INSERT_LINE = 'COLUMN_INSERT_LINE',
  ROW_INSERT_LINE = 'ROW_INSERT_LINE',

  LAST_CELL_ELEMENT = 'LAST_CELL_ELEMENT',
}

export const TableCssClassName = {
  ...TableSharedCssClassName,

  /** Classic controls */
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

  DRAG_CONTROLS_INSERT_BUTTON: `${tablePrefixSelector}-controls__drag-insert-button`,
  DRAG_CONTROLS_INSERT_BUTTON_INNER: `${tablePrefixSelector}-controls__drag-insert-button-inner`,
  DRAG_CONTROLS_INSERT_BUTTON_INNER_COLUMN: `${tablePrefixSelector}-controls__drag-insert-button-inner-column`,
  DRAG_CONTROLS_INSERT_BUTTON_INNER_ROW: `${tablePrefixSelector}-controls__drag-insert-button-inner-row`,
  DRAG_CONTROLS_INSERT_BUTTON_WRAP: `${tablePrefixSelector}-controls__drag-insert-button-wrap`,

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

  /** drag and drop controls */
  DRAG_ROW_CONTROLS_WRAPPER: `${tablePrefixSelector}-drag-row-controls-wrapper`,
  DRAG_ROW_CONTROLS: `${tablePrefixSelector}-drag-row-controls`,
  DRAG_ROW_FLOATING_INSERT_DOT_WRAPPER: `${tablePrefixSelector}-drag-row-floating-insert-dot-wrapper`,
  DRAG_ROW_FLOATING_INSERT_DOT: `${tablePrefixSelector}-drag-row-floating-insert-dot`,

  DRAG_COLUMN_CONTROLS: `${tablePrefixSelector}-drag-column-controls`,
  DRAG_COLUMN_FLOATING_INSERT_DOT_WRAPPER: `${tablePrefixSelector}-drag-columns-floating-insert-dot-wrapper`,
  DRAG_COLUMN_FLOATING_INSERT_DOT: `${tablePrefixSelector}-drag-columns-floating-insert-dot`,

  DRAG_COLUMN_CONTROLS_WRAPPER: `${tablePrefixSelector}-col-controls-wrapper`,
  DRAG_COLUMN_DROP_TARGET_CONTROLS: `${tablePrefixSelector}-col-drop-target-controls`,
  DRAG_COLUMN_CONTROLS_INNER: `${tablePrefixSelector}-col-controls__inner`,

  DRAG_HANDLE_BUTTON_CONTAINER: `${tablePrefixSelector}-drag-handle-button-container`,
  DRAG_HANDLE_BUTTON_CLICKABLE_ZONE: `${tablePrefixSelector}-drag-handle-button-clickable-zone`,

  DRAG_CORNER_BUTTON: `${tablePrefixSelector}-drag-corner-button`,
  DRAG_CORNER_BUTTON_INNER: `${tablePrefixSelector}-drag-corner-button-inner`,

  /** disabled classes */
  DRAG_HANDLE_DISABLED: `${tablePrefixSelector}-drag-handle-disabled`,

  /** minimised handle class */
  DRAG_HANDLE_MINIMISED: `${tablePrefixSelector}-drag-handle-minimised`,

  DRAG_SUBMENU: `${tablePrefixSelector}-drag-submenu`,
  DRAG_SUBMENU_ICON: `${tablePrefixSelector}-drag-submenu-icon`,

  /** Other classes */
  NUMBERED_COLUMN: `${tablePrefixSelector}-numbered-column`,
  NUMBERED_COLUMN_BUTTON: `${tablePrefixSelector}-numbered-column__button`,
  NUMBERED_COLUMN_BUTTON_DISABLED: `${tablePrefixSelector}-numbered-column__button-disabled`,

  HOVERED_COLUMN: `${tablePrefixSelector}-hovered-column`,
  HOVERED_ROW: `${tablePrefixSelector}-hovered-row`,
  HOVERED_TABLE: `${tablePrefixSelector}-hovered-table`,
  HOVERED_NO_HIGHLIGHT: `${tablePrefixSelector}-hovered-no-highlight`,
  HOVERED_CELL: `${tablePrefixSelector}-hovered-cell`,
  HOVERED_CELL_IN_DANGER: 'danger',
  HOVERED_CELL_ACTIVE: 'active',
  HOVERED_CELL_WARNING: `${tablePrefixSelector}-hovered-cell__warning`,
  HOVERED_DELETE_BUTTON: `${tablePrefixSelector}-hovered-delete-button`,
  WITH_CONTROLS: `${tablePrefixSelector}-with-controls`,
  RESIZING_PLUGIN: `${tablePrefixSelector}-resizing-plugin`,
  RESIZE_CURSOR: `${tablePrefixSelector}-resize-cursor`,
  IS_RESIZING: `${tablePrefixSelector}-is-resizing`,

  RESIZE_HANDLE_DECORATION: `${tablePrefixSelector}-resize-decoration`,

  CONTEXTUAL_SUBMENU: `${tablePrefixSelector}-contextual-submenu`,
  CONTEXTUAL_MENU_BUTTON_WRAP: `${tablePrefixSelector}-contextual-menu-button-wrap`,
  CONTEXTUAL_MENU_BUTTON: `${tablePrefixSelector}-contextual-menu-button`,
  CONTEXTUAL_MENU_BUTTON_FIXED: `${tablePrefixSelector}-contextual-menu-button-fixed`,
  CONTEXTUAL_MENU_ICON: `${tablePrefixSelector}-contextual-submenu-icon`,
  CONTEXTUAL_MENU_ICON_SMALL: `${tablePrefixSelector}-contextual-submenu-icon-small`,

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

  WITH_COLUMN_INSERT_LINE: `${tablePrefixSelector}-column-insert-line`,
  WITH_COLUMN_INSERT_LINE_INACTIVE: `${tablePrefixSelector}-column-insert-line__inactive`,
  WITH_FIRST_COLUMN_INSERT_LINE: `${tablePrefixSelector}-first-column-insert-line`,
  WITH_FIRST_COLUMN_INSERT_LINE_INACTIVE: `${tablePrefixSelector}-first-column-insert-line__inactive`,

  WITH_LAST_COLUMN_INSERT_LINE: `${tablePrefixSelector}-last-column-insert-line`,
  WITH_LAST_COLUMN_INSERT_LINE_INACTIVE: `${tablePrefixSelector}-last-column-insert-line__inactive`,

  WITH_RESIZE_LINE: `${tablePrefixSelector}-column-resize-line`,
  WITH_RESIZE_LINE_LAST_COLUMN: `${tablePrefixSelector}-column-resize-line-last-column`,

  WITH_ROW_INSERT_LINE: `${tablePrefixSelector}-row-insert-line`,
  WITH_ROW_INSERT_LINE_INACTIVE: `${tablePrefixSelector}-row-insert-line__inactive`,
  WITH_LAST_ROW_INSERT_LINE: `${tablePrefixSelector}-last-row-insert-line`,
  WITH_LAST_ROW_INSERT_LINE_INACTIVE: `${tablePrefixSelector}-last-row-insert-line__inactive`,
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
  isDragAndDropEnabled?: boolean;
}

export interface ToolbarMenuContext {
  formatMessage: IntlShape['formatMessage'];
}

export type ElementContentRects = {
  [key: string]: ResizeObserverEntry['contentRect'];
};

export enum ShadowEvent {
  SHOW_BEFORE_SHADOW = 'showBeforeShadow',
  SHOW_AFTER_SHADOW = 'showAfterShadow',
}

export type ReportInvalidNodeAttrs = (
  invalidNodeAttrs: InvalidNodeAttr,
) => void;

export type InvalidNodeAttr = {
  nodeType: string;
  attribute: string;
  reason: string;
  spanValue: number;
  tableLocalId: string;
};

export type TableDirection = 'row' | 'column';

/**
 * Drag and Drop interfaces
 */
export type DraggableType = 'table-row' | 'table-column';
export interface DraggableSourceData extends Record<string, unknown> {
  type: DraggableType;
  localId: string;
  indexes: number[];
}

export interface DraggableTargetData extends Record<string | symbol, unknown> {
  type: DraggableType;
  localId: string;
  targetIndex: number;
}

export interface DraggableData {
  sourceType: DraggableType;
  sourceLocalId: string;
  sourceIndexes: number[];
  targetType: DraggableType;
  targetLocalId: string;
  targetIndex: number;
  targetAdjustedIndex: number;
  targetClosestEdge: Edge;
  direction: 1 | -1;
}

export type HandleTypes = 'hover' | 'selected';

export interface MessageDescriptor {
  id: string;
  description: string;
  defaultMessage: string;
}
