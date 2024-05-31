import type { TableSortOrder as SortOrder } from '@atlaskit/custom-steps';

import type { ACTION_SUBJECT, INPUT_METHOD } from './enums';
import type { OperationalAEP, TableAEP, UIAEP } from './utils';

export enum TABLE_ACTION {
	DELETED = 'deleted',
	CLEARED = 'cleared',
	COLLAPSED = 'collapsed',
	MERGED = 'merged',
	SPLIT = 'split',
	COLORED = 'colored',
	TOGGLED_HEADER_COLUMN = 'toggledHeaderColumn',
	TOGGLED_HEADER_ROW = 'toggledHeaderRow',
	TOGGLED_NUMBER_COLUMN = 'toggledNumberColumn',
	CHANGED_BREAKOUT_MODE = 'changedBreakoutMode',
	CUT = 'cut',
	COPIED = 'copied',
	ADDED_ROW = 'addedRow',
	ADDED_COLUMN = 'addedColumn',
	DELETED_ROW = 'deletedRow',
	DELETED_COLUMN = 'deletedColumn',
	SORTED_COLUMN = 'sortedColumn',
	REPLACED = 'replaced',
	ATTEMPTED_TABLE_WIDTH_CHANGE = 'attemptedTableWidthChange',
	DISTRIBUTED_COLUMNS_WIDTHS = 'distributedColumnsWidths',
	FIXED = 'fixed',
	RESIZED = 'resized',
	RESIZE_PERF_SAMPLING = 'resizePerfSampling',
	COLUMN_RESIZED = 'columnResized',
	OVERFLOW_CHANGED = 'overflowChanged',
	INITIAL_OVERFLOW_CAPTURED = 'initialOverflowCaptured',
	MOVED_ROW = 'movedRow',
	MOVED_COLUMN = 'movedColumn',
	CLONED_ROW = 'clonedRow',
	CLONED_COLUMN = 'clonedColumn',
	/**
	 * This is a unique action that's used to track legacy table move behaviour flow of insert+copy+paste. Please use
	 * the MOVED_ROW | MOVED_COLUMN actions if you want to track events which move row/cols in a single step.
	 */
	ROW_OR_COLUMN_MOVED = 'rowOrColumnMoved',
	CHANGED_DISPLAY_MODE = 'changedDisplayMode',
	CHANGED_ALIGNMENT = 'changedAlignment',
}

export enum TABLE_BREAKOUT {
	WIDE = 'wide',
	FULL_WIDTH = 'fullWidth',
	NORMAL = 'normal',
}

export enum TABLE_OVERFLOW_CHANGE_TRIGGER {
	EXTERNAL = 'external',
	ADDED_COLUMN = 'addedColumn',
	DELETED_COLUMN = 'deletedColumn',
	RESIZED_COLUMN = 'resizedColumn',
	ENABLED_NUMBERED_COLUMN = 'enabledNumberedColumn',
	DISABLED_NUMBERED_COLUMN = 'disabledNumberedColumn',
	DISTRIBUTED_COLUMNS = 'distributedColumnsWidths',
	RESIZED = 'resizedTable',
}

export enum TABLE_STATUS {
	SUCCESS = 'success',
	CANCELLED = 'cancelled',
	INVALID = 'invalid',
}

interface SortColumn {
	sortOrder: SortOrder;
	mode: 'editor';
}

interface TotalRowAndColCount {
	totalRowCount: number;
	totalColumnCount: number;
}

interface HorizontalAndVerticalCells {
	horizontalCells: number;
	verticalCells: number;
}

type AllCellInfo = TotalRowAndColCount &
	HorizontalAndVerticalCells & {
		totalCells: number;
	};

type AttemptedResizeInfo = {
	type: string;
	position: string;
	duration: number;
	delta: number;
};

type ResizedInfo = {
	prevWidth: number | null;
	newWidth: number;
	totalTableWidth: number | null;
	nodeSize: number;
} & TotalRowAndColCount;

type ColumnResizedInfo = {
	colIndex?: number;
	resizedDelta: number;
	isLastColumn: boolean;
	tableWidth: number | null;
	inputMethod: INPUT_METHOD.MOUSE | INPUT_METHOD.SHORTCUT;
} & TotalRowAndColCount;

type ResizePreviewInfo = {
	frameRate: number;
	isInitialSample: boolean;
	docSize: number;
	nodeSize: number;
};

export type OverflowStateInfo = {
	editorWidth: number;
	isOverflowing: boolean;
	tableResizingEnabled: boolean;
	width: number;
	parentWidth: number;
};

type TableDeleteAEP = TableAEP<
	TABLE_ACTION.DELETED,
	{
		inputMethod: INPUT_METHOD.KEYBOARD | INPUT_METHOD.FLOATING_TB;
	} & TotalRowAndColCount,
	undefined
>;

type TableClearAEP = TableAEP<
	TABLE_ACTION.CLEARED,
	{
		inputMethod:
			| INPUT_METHOD.KEYBOARD
			| INPUT_METHOD.CONTEXT_MENU
			| INPUT_METHOD.FLOATING_TB
			| INPUT_METHOD.TABLE_CONTEXT_MENU;
	} & HorizontalAndVerticalCells &
		TotalRowAndColCount,
	undefined
>;

type TableMergeSplitAEP = TableAEP<
	TABLE_ACTION.MERGED | TABLE_ACTION.SPLIT,
	{
		inputMethod: INPUT_METHOD.CONTEXT_MENU | INPUT_METHOD.FLOATING_TB;
	} & AllCellInfo,
	undefined
>;

type TableColorAEP = TableAEP<
	TABLE_ACTION.COLORED,
	{
		inputMethod:
			| INPUT_METHOD.CONTEXT_MENU
			| INPUT_METHOD.FLOATING_TB
			| INPUT_METHOD.TABLE_CONTEXT_MENU;
	} & { cellColor: string } & AllCellInfo,
	undefined
>;

type TableToggleHeaderAEP = TableAEP<
	| TABLE_ACTION.TOGGLED_NUMBER_COLUMN
	| TABLE_ACTION.TOGGLED_HEADER_ROW
	| TABLE_ACTION.TOGGLED_HEADER_COLUMN,
	// newState -> true : on, false: off
	{ newState: boolean } & TotalRowAndColCount,
	undefined
>;

type TableChangeBreakoutAEP = TableAEP<
	TABLE_ACTION.CHANGED_BREAKOUT_MODE,
	{
		newBreakoutMode: TABLE_BREAKOUT;
		previousBreakoutMode: TABLE_BREAKOUT;
	} & TotalRowAndColCount,
	undefined
>;

type TableCopyAndCutAEP = TableAEP<TABLE_ACTION.CUT | TABLE_ACTION.COPIED, AllCellInfo, undefined>;

type TableAddRowOrColumnAEP = TableAEP<
	TABLE_ACTION.ADDED_ROW | TABLE_ACTION.ADDED_COLUMN,
	{
		inputMethod:
			| INPUT_METHOD.SHORTCUT
			| INPUT_METHOD.CONTEXT_MENU
			| INPUT_METHOD.BUTTON
			| INPUT_METHOD.KEYBOARD
			| INPUT_METHOD.FLOATING_TB
			| INPUT_METHOD.TABLE_CONTEXT_MENU;
		position: number;
	} & TotalRowAndColCount,
	undefined
>;

type TableDeleteRowOrColumnAEP = TableAEP<
	TABLE_ACTION.DELETED_ROW | TABLE_ACTION.DELETED_COLUMN,
	{
		inputMethod:
			| INPUT_METHOD.CONTEXT_MENU
			| INPUT_METHOD.BUTTON
			| INPUT_METHOD.FLOATING_TB
			| INPUT_METHOD.SHORTCUT
			| INPUT_METHOD.TABLE_CONTEXT_MENU;
		position: number;
		count: number;
	} & TotalRowAndColCount,
	undefined
>;

type TableDistributeColumnsWidthsAEP = TableAEP<
	TABLE_ACTION.DISTRIBUTED_COLUMNS_WIDTHS,
	{
		inputMethod:
			| INPUT_METHOD.CONTEXT_MENU
			| INPUT_METHOD.FLOATING_TB
			| INPUT_METHOD.TABLE_CONTEXT_MENU;
		position: number;
		count: number;
	} & TotalRowAndColCount,
	undefined
>;

type TableSortColumnAEP = TableAEP<
	TABLE_ACTION.SORTED_COLUMN,
	{
		inputMethod:
			| INPUT_METHOD.SHORTCUT
			| INPUT_METHOD.CONTEXT_MENU
			| INPUT_METHOD.TABLE_CONTEXT_MENU
			| INPUT_METHOD.BUTTON
			| INPUT_METHOD.FLOATING_TB
			| INPUT_METHOD.KEYBOARD;
		position: number;
	} & TotalRowAndColCount &
		SortColumn,
	undefined
>;

type TableReplaceAEP = TableAEP<
	TABLE_ACTION.REPLACED,
	{
		inputMethod: INPUT_METHOD.KEYBOARD | INPUT_METHOD.CLIPBOARD;
	} & TotalRowAndColCount,
	undefined
>;

type TableAttemptedResizeAEP = UIAEP<
	TABLE_ACTION.ATTEMPTED_TABLE_WIDTH_CHANGE,
	ACTION_SUBJECT.TABLE,
	null,
	AttemptedResizeInfo,
	undefined
>;

type TableCollapsedAEP = TableAEP<TABLE_ACTION.COLLAPSED, TotalRowAndColCount, undefined>;

type TableFixedAEP = TableAEP<
	TABLE_ACTION.FIXED,
	{
		reason: string;
	},
	undefined
>;

type TableOverflowChangedAEP = TableAEP<
	TABLE_ACTION.OVERFLOW_CHANGED,
	{
		wasOverflowing: boolean;
		trigger: TABLE_OVERFLOW_CHANGE_TRIGGER;
	} & OverflowStateInfo,
	undefined
>;

type TableInitialOverflowCapturedAEP = TableAEP<
	TABLE_ACTION.INITIAL_OVERFLOW_CAPTURED,
	OverflowStateInfo,
	undefined
>;

type TableResizedAEP = TableAEP<TABLE_ACTION.RESIZED, ResizedInfo, undefined>;

type TableResizePerfSamplingAEP = OperationalAEP<
	TABLE_ACTION.RESIZE_PERF_SAMPLING,
	ACTION_SUBJECT.TABLE,
	undefined,
	ResizePreviewInfo
>;

type TableColumnResizedAEP = TableAEP<TABLE_ACTION.COLUMN_RESIZED, ColumnResizedInfo, undefined>;

type TableRowOrColumnMovedAEP = TableAEP<
	TABLE_ACTION.ROW_OR_COLUMN_MOVED,
	{
		type: 'row' | 'column';
	},
	undefined
>;

type TableMovedRowOrColumnAEP = TableAEP<
	TABLE_ACTION.MOVED_ROW | TABLE_ACTION.MOVED_COLUMN,
	{
		inputMethod:
			| INPUT_METHOD.TABLE_CONTEXT_MENU
			| INPUT_METHOD.DRAG_AND_DROP
			| INPUT_METHOD.SHORTCUT;
		// The total amount of row/columns that we're moved in a single event
		count: number;
		distance: number;
		status: TABLE_STATUS.SUCCESS | TABLE_STATUS.CANCELLED | TABLE_STATUS.INVALID;
	} & TotalRowAndColCount,
	undefined
>;

type TableClonedRowOrColumnAEP = TableAEP<
	TABLE_ACTION.CLONED_ROW | TABLE_ACTION.CLONED_COLUMN,
	{
		inputMethod:
			| INPUT_METHOD.TABLE_CONTEXT_MENU
			| INPUT_METHOD.DRAG_AND_DROP
			| INPUT_METHOD.SHORTCUT;
		// The total amount of row/columns that we're moved in a single event
		count: number;
		distance: number;
		status: TABLE_STATUS.SUCCESS | TABLE_STATUS.CANCELLED | TABLE_STATUS.INVALID;
	} & TotalRowAndColCount,
	undefined
>;

export enum TABLE_DISPLAY_MODE {
	FIXED = 'fixed',
	DEFAULT = 'default',
	INITIAL = 'initial',
}

type TableChangedDisplayModeAEP = TableAEP<
	TABLE_ACTION.CHANGED_DISPLAY_MODE,
	{
		inputMethod: INPUT_METHOD.FLOATING_TB | INPUT_METHOD.CONTEXT_MENU;
		previousDisplayMode: TABLE_DISPLAY_MODE;
		newDisplayMode: TABLE_DISPLAY_MODE;
		tableWidth: number | null;
	} & TotalRowAndColCount,
	undefined
>;

// currently duplicated in editor-plugin-table/src/types.ts
type AlignmentOptions = 'center' | 'align-start';

type TableChangedAlignmentAEP = TableAEP<
	TABLE_ACTION.CHANGED_ALIGNMENT,
	{
		newAlignment: AlignmentOptions;
		previousAlignment: AlignmentOptions | null;
		tableWidth: number | null;
		inputMethod: INPUT_METHOD.FLOATING_TB;
	} & TotalRowAndColCount,
	undefined
>;

export type TableEventPayload =
	| TableDeleteAEP
	| TableClearAEP
	| TableMergeSplitAEP
	| TableColorAEP
	| TableToggleHeaderAEP
	| TableChangeBreakoutAEP
	| TableCopyAndCutAEP
	| TableAddRowOrColumnAEP
	| TableSortColumnAEP
	| TableDeleteRowOrColumnAEP
	| TableReplaceAEP
	| TableAttemptedResizeAEP
	| TableDistributeColumnsWidthsAEP
	| TableCollapsedAEP
	| TableFixedAEP
	| TableOverflowChangedAEP
	| TableInitialOverflowCapturedAEP
	| TableResizedAEP
	| TableResizePerfSamplingAEP
	| TableRowOrColumnMovedAEP
	| TableMovedRowOrColumnAEP
	| TableClonedRowOrColumnAEP
	| TableChangedDisplayModeAEP
	| TableColumnResizedAEP
	| TableChangedAlignmentAEP;
