import { TableAEP, UIAEP } from './utils';
import { INPUT_METHOD, ACTION_SUBJECT } from './enums';
import { TableSortOrder as SortOrder } from '@atlaskit/adf-schema/steps';

//#region Constants
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
}

export enum TABLE_BREAKOUT {
  WIDE = 'wide',
  FULL_WIDTH = 'fullWidth',
  NORMAL = 'normal',
}
//#endregion

//#region Type Helpers
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
//#endregion

type AttemptedResizeInfo = {
  type: string;
  position: string;
  duration: number;
  delta: number;
};

//#region Analytic Event Payloads
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
      | INPUT_METHOD.FLOATING_TB;
  } & HorizontalAndVerticalCells &
    TotalRowAndColCount,
  undefined
>;

type TableMergeSplitAEP = TableAEP<
  TABLE_ACTION.MERGED | TABLE_ACTION.SPLIT,
  AllCellInfo,
  undefined
>;

type TableColorAEP = TableAEP<
  TABLE_ACTION.COLORED,
  { cellColor: string } & AllCellInfo,
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

type TableCopyAndCutAEP = TableAEP<
  TABLE_ACTION.CUT | TABLE_ACTION.COPIED,
  AllCellInfo,
  undefined
>;

type TableAddRowOrColumnAEP = TableAEP<
  TABLE_ACTION.ADDED_ROW | TABLE_ACTION.ADDED_COLUMN,
  {
    inputMethod:
      | INPUT_METHOD.SHORTCUT
      | INPUT_METHOD.CONTEXT_MENU
      | INPUT_METHOD.BUTTON
      | INPUT_METHOD.KEYBOARD
      | INPUT_METHOD.FLOATING_TB;
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
      | INPUT_METHOD.FLOATING_TB;
    position: number;
    count: number;
  } & TotalRowAndColCount,
  undefined
>;

type TableDistributeColumnsWidthsAEP = TableAEP<
  TABLE_ACTION.DISTRIBUTED_COLUMNS_WIDTHS,
  {
    inputMethod: INPUT_METHOD.CONTEXT_MENU;
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
      | INPUT_METHOD.BUTTON
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

type TableCollapsedAEP = TableAEP<
  TABLE_ACTION.COLLAPSED,
  TotalRowAndColCount,
  undefined
>;

//#endregion

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
  | TableCollapsedAEP;
