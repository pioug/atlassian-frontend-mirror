/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import type { IntlShape } from 'react-intl-next';

import type { TableLayout } from '@atlaskit/adf-schema';
import { tableCellSelector, tableHeaderSelector, tablePrefixSelector } from '@atlaskit/adf-schema';
import type { TableColumnOrdering } from '@atlaskit/custom-steps';
import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { TableSharedCssClassName } from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import type { Rect } from '@atlaskit/editor-tables/table-map';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';

import type { RowStickyState } from '../pm-plugins/sticky-headers/types';
import type { TablePlugin } from '../tablePluginType';

export const RESIZE_HANDLE_AREA_DECORATION_GAP = 30;
export type RowInsertPosition = 'TOP' | 'BOTTOM';

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-6877 Internal documentation for deprecation (no external access)}
 **/
export type PermittedLayoutsDescriptor = TableLayout[] | 'all';
export type Cell = { node: PmNode; pos: number; start: number };
export type CellTransform = (cell: Cell) => (tr: Transaction) => Transaction;

export interface InsertRowOptions {
	index: number;
	moveCursorToInsertedRow: boolean;
}

export type PluginInjectionAPI = ExtractInjectionAPI<TablePlugin>;

export type PluginInjectionAPIWithA11y = ExtractInjectionAPI<TablePlugin> & {
	accessibilityUtils?: {
		actions: {
			ariaNotify: (message: string) => void | undefined;
		};
	};
};

// override getPluginState but do not expose publicly as this type is experimental and will change
// in the future
export type TableSharedStateInternal = Pick<
	TablePluginState,
	| 'isFullWidthModeEnabled'
	| 'wasFullWidthModeEnabled'
	| 'isHeaderRowEnabled'
	| 'isHeaderColumnEnabled'
	| 'ordering'
	| 'isInDanger'
	| 'hoveredRows'
	| 'hoveredColumns'
	| 'hoveredCell'
	| 'isTableHovered'
	| 'tableNode'
	| 'widthToWidest'
	| 'tableRef'
	| 'tablePos'
	| 'targetCellPosition'
	| 'isContextualMenuOpen'
	| 'pluginConfig'
	| 'insertColumnButtonIndex'
	| 'insertRowButtonIndex'
	| 'isDragAndDropEnabled'
	| 'tableWrapperTarget'
	| 'isCellMenuOpenByKeyboard'
> & {
	dragMenuDirection?: TableDirection;
	dragMenuIndex?: number;
	isDragMenuOpen?: boolean;
	isResizing: boolean;
	isSizeSelectorOpen?: boolean;
	isTableResizing?: boolean;
	isWholeTableInDanger?: boolean;
	resizingTableLocalId?: string;
	resizingTableRef?: HTMLTableElement;
	sizeSelectorTargetRef?: HTMLElement;
	stickyHeader?: RowStickyState;
};

export type TableSharedState = Pick<
	TablePluginState,
	'isFullWidthModeEnabled' | 'wasFullWidthModeEnabled'
>;

export type AlignmentOptions = 'center' | 'align-start';

export type InsertRowMethods =
	| INPUT_METHOD.CONTEXT_MENU
	| INPUT_METHOD.BUTTON
	| INPUT_METHOD.SHORTCUT
	| INPUT_METHOD.KEYBOARD
	| INPUT_METHOD.FLOATING_TB
	| INPUT_METHOD.TABLE_CONTEXT_MENU;

export interface PluginConfig {
	advanced?: boolean;
	allowAddColumnWithCustomStep?: boolean;
	allowBackgroundColor?: boolean;
	allowCellOptionsInFloatingToolbar?: boolean;
	allowCollapse?: boolean;
	allowColumnResizing?: boolean;
	allowColumnSorting?: boolean;
	allowControls?: boolean;
	allowDistributeColumns?: boolean;
	allowHeaderColumn?: boolean;
	allowHeaderRow?: boolean;
	allowMergeCells?: boolean;
	allowNestedTables?: boolean;
	allowNumberColumn?: boolean;
	allowTableAlignment?: boolean;
	allowTableResizing?: boolean;
	isHeaderRowRequired?: boolean;
	/**
	 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-6877 Internal documentation for deprecation (no external access)}
	 **/
	permittedLayouts?: PermittedLayoutsDescriptor;
	stickyHeaders?: boolean;
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
export interface WidthToWidest {
	[tableLocalId: string]: boolean;
}

export interface TablePluginState {
	canCollapseTable?: boolean; // enabled/disabled state of collapse option
	editorHasFocus?: boolean;
	getIntl: () => IntlShape;
	hoveredCell: CellHoverMeta;
	hoveredColumns: number[];
	hoveredRows: number[];
	insertColumnButtonIndex?: number;
	insertRowButtonIndex?: number;
	isCellMenuOpenByKeyboard?: boolean;
	isContextualMenuOpen?: boolean;
	isDragAndDropEnabled?: boolean;
	isFullWidthModeEnabled?: boolean;
	isHeaderColumnEnabled: boolean;
	isHeaderRowEnabled: boolean;
	isInDanger?: boolean;
	isKeyboardResize?: boolean;
	isNumberColumnEnabled?: boolean;
	isResizeHandleWidgetAdded?: boolean;
	// for table wrap/collapse
	isTableCollapsed?: boolean; // is the current table already in an expand?
	isTableHovered?: boolean;
	// Currently isTableScalingEnabled is the same as options.isTableScalingEnabled from TablePluginOptions.
	// However, if you want to learn if tablePlugin is configured to enable Preserve Table Widths feature,
	// use options.isTableScalingEnabled and avoid using pluginState.isTableScalingEnabled or
	// const { isTableScalingEnabled } = getPluginState(state) for that purpose.
	isTableScalingEnabled?: boolean;
	isWholeTableInDanger?: boolean;
	ordering?: TableColumnOrdering;
	pluginConfig: PluginConfig;
	resizeHandleColumnIndex?: number;
	resizeHandleIncludeTooltip?: boolean;
	resizeHandleRowIndex?: number;
	// controls need to be re-rendered when table content changes
	// e.g. when pressing enter inside of a cell, it creates a new p and we need to update row controls
	tableNode?: PmNode;

	tablePos?: number;

	tableRef?: HTMLTableElement;
	tableWrapperTarget?: HTMLElement;
	// position of a cell PM node that has cursor
	targetCellPosition?: number;

	wasFullWidthModeEnabled?: boolean;
	widthToWidest?: WidthToWidest; // is the current table set to the widest width regarding view port
}

export type TablePluginAction =
	| { data: { editorHasFocus: boolean }; type: 'SET_EDITOR_FOCUS' }
	| { type: 'TOGGLE_HEADER_ROW' }
	| { type: 'TOGGLE_HEADER_COLUMN' }
	| { data: { ordering: TableColumnOrdering }; type: 'SORT_TABLE' }
	| {
			data: {
				isHeaderColumnEnabled: boolean;
				isHeaderRowEnabled: boolean;
				tableNode?: PmNode;
				tableRef?: HTMLTableElement;
				tableWrapperTarget?: HTMLElement;
			};
			type: 'SET_TABLE_REF';
	  }
	| {
			data: {
				decorationSet: DecorationSet;
				hoveredRows: number[];
				isInDanger?: boolean;
			};
			type: 'HOVER_ROWS';
	  }
	| {
			data: {
				decorationSet: DecorationSet;
			};
			type: 'HOVER_MERGED_CELLS';
	  }
	| {
			data: {
				decorationSet: DecorationSet;
				hoveredColumns: number[];
				isInDanger?: boolean;
			};
			type: 'HOVER_COLUMNS';
	  }
	| {
			data: {
				decorationSet: DecorationSet;
				hoveredColumns: number[];
				hoveredRows: number[];
				isInDanger?: boolean;
			};
			type: 'HOVER_TABLE';
	  }
	| {
			data: {
				decorationSet: DecorationSet;
				isKeyboardResize?: boolean;
				resizeHandleColumnIndex: number;
				resizeHandleIncludeTooltip: boolean;
				resizeHandleRowIndex: number;
			};
			type: 'START_KEYBOARD_COLUMN_RESIZE';
	  }
	| {
			data: {
				decorationSet: DecorationSet;
				isKeyboardResize?: boolean;
				resizeHandleColumnIndex: number;
				resizeHandleIncludeTooltip: boolean;
				resizeHandleRowIndex: number;
			};
			type: 'ADD_RESIZE_HANDLE_DECORATIONS';
	  }
	| {
			data: {
				decorationSet: DecorationSet;
				resizeHandleColumnIndex: number | undefined;
				resizeHandleIncludeTooltip: boolean | undefined;
				resizeHandleRowIndex: number | undefined;
			};
			type: 'UPDATE_RESIZE_HANDLE_DECORATIONS';
	  }
	| {
			data: {
				widthToWidest: WidthToWidest | undefined;
			};
			type: 'UPDATE_TABLE_WIDTH_TO_WIDEST';
	  }
	| {
			data: { decorationSet: DecorationSet };
			type: 'REMOVE_RESIZE_HANDLE_DECORATIONS';
	  }
	| {
			data: { decorationSet: DecorationSet };
			type: 'STOP_KEYBOARD_COLUMN_RESIZE';
	  }
	| { data: { decorationSet: DecorationSet }; type: 'CLEAR_HOVER_SELECTION' }
	| { data: { decorationSet: DecorationSet }; type: 'SHOW_RESIZE_HANDLE_LINE' }
	| { data: { decorationSet: DecorationSet }; type: 'HIDE_RESIZE_HANDLE_LINE' }
	| {
			data: {
				hoveredCell: CellHoverMeta;
			};
			type: 'HOVER_CELL';
	  }
	| {
			data: {
				isTableHovered: boolean;
			};
			type: 'TABLE_HOVERED';
	  }
	| { data: { targetCellPosition?: number }; type: 'SET_TARGET_CELL_POSITION' }
	| {
			data: { decorationSet: DecorationSet; targetCellPosition: number };
			type: 'SELECT_COLUMN';
	  }
	| { data: { insertRowButtonIndex: number }; type: 'SHOW_INSERT_ROW_BUTTON' }
	| {
			data: { insertColumnButtonIndex: number };
			type: 'SHOW_INSERT_COLUMN_BUTTON';
	  }
	| {
			type: 'HIDE_INSERT_COLUMN_OR_ROW_BUTTON';
	  }
	| { type: 'TOGGLE_CONTEXTUAL_MENU' }
	| {
			data: {
				isCellMenuOpenByKeyboard: boolean;
			};
			type: 'SET_CELL_MENU_OPEN';
	  };

export type ColumnResizingPluginAction =
	| {
			data: { resizeHandlePos: number | null };
			type: 'SET_RESIZE_HANDLE_POSITION';
	  }
	| { type: 'STOP_RESIZING' }
	| {
			data: { dragging: { startWidth: number; startX: number } | null };
			type: 'SET_DRAGGING';
	  }
	| {
			data: { lastClick: { time: number; x: number; y: number } | null };
			type: 'SET_LAST_CLICK';
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

	DRAG_CONTROLS_INSERT_BUTTON: `${tablePrefixSelector}-controls__drag-insert-button`,
	DRAG_CONTROLS_INSERT_BUTTON_INNER: `${tablePrefixSelector}-controls__drag-insert-button-inner`,
	DRAG_CONTROLS_INSERT_BUTTON_INNER_COLUMN: `${tablePrefixSelector}-controls__drag-insert-button-inner-column`,
	DRAG_CONTROLS_INSERT_BUTTON_INNER_ROW: `${tablePrefixSelector}-controls__drag-insert-button-inner-row`,
	DRAG_CONTROLS_INSERT_BUTTON_INNER_ROW_CHROMELESS: `${tablePrefixSelector}-controls__drag-insert-button-inner-row-chromeless`,
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

	/** nested tables classes */
	NESTED_TABLE_WITH_CONTROLS: `${tablePrefixSelector}-nested-table-with-controls`,

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
	TABLE_CHROMELESS: `${tablePrefixSelector}-chromeless`,

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

	WITH_DRAG_RESIZE_LINE: `${tablePrefixSelector}-drag-column-resize-line`,
	WITH_DRAG_RESIZE_LINE_LAST_COLUMN: `${tablePrefixSelector}-drag-column-resize-line-last-column`,

	WITH_ROW_INSERT_LINE: `${tablePrefixSelector}-row-insert-line`,
	WITH_ROW_INSERT_LINE_INACTIVE: `${tablePrefixSelector}-row-insert-line__inactive`,
	WITH_LAST_ROW_INSERT_LINE: `${tablePrefixSelector}-last-row-insert-line`,
	WITH_LAST_ROW_INSERT_LINE_INACTIVE: `${tablePrefixSelector}-last-row-insert-line__inactive`,

	NATIVE_STICKY: `${tablePrefixSelector}-row-native-sticky`,
	NO_OVERFLOW: `${tablePrefixSelector}-no-overflow`,
};

export interface ToolbarMenuConfig {
	allowCollapse?: boolean;
	allowHeaderColumn?: boolean;
	allowHeaderRow?: boolean;
	allowNumberColumn?: boolean;
}

export interface ToolbarMenuState {
	canCollapseTable?: boolean;
	isDragAndDropEnabled?: boolean;
	isHeaderColumnEnabled?: boolean;
	isHeaderRowEnabled?: boolean;
	isNumberColumnEnabled?: boolean;
	isTableCollapsed?: boolean;
}

export interface ToolbarMenuContext {
	formatMessage: IntlShape['formatMessage'];
}

export enum ShadowEvent {
	SHOW_BEFORE_SHADOW = 'showBeforeShadow',
	SHOW_AFTER_SHADOW = 'showAfterShadow',
}

export type ReportInvalidNodeAttrs = (invalidNodeAttrs: InvalidNodeAttr) => void;

export type InvalidNodeAttr = {
	attribute: string;
	nodeType: string;
	reason: string;
	spanValue: number;
	tableLocalId: string;
};

export type TableDirection = 'row' | 'column';

/**
 * Drag and Drop interfaces
 */
export type DraggableType = 'table-row' | 'table-column';
export type DraggableBehaviour = 'move' | 'clone';

export interface DraggableSourceData extends Record<string, unknown> {
	indexes: number[];
	localId: string;
	type: DraggableType;
}

export interface DraggableTargetData extends Record<string | symbol, unknown> {
	localId: string;
	targetIndex: number;
	type: DraggableType;
}

export interface DraggableData {
	behaviour: DraggableBehaviour;
	/**
	 * This represents a hollistic movement direction; a value of 1 means the source->target index would shift in a positive direction.
	 * A value of 0 indicates that the target index is inside the the source indexes.
	 */
	direction: 1 | -1 | 0;
	sourceIndexes: number[];
	sourceLocalId: string;
	sourceType: DraggableType;
	targetAdjustedIndex: number;
	targetClosestEdge: Edge;
	/**
	 * The target direction identifies where relative to the target index is the item being dropped. A value of 'start' would
	 * mean that the item is being inserted before the index, and 'end would be after.
	 */
	targetDirection: 'start' | 'end';
	targetIndex: number;
	targetLocalId: string;
	targetType: DraggableType;
}

export type HandleTypes = 'hover' | 'selected';

export interface MessageDescriptor {
	defaultMessage: string;
	description: string;
	id: string;
}
