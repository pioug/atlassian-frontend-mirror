import {
  waitForTooltip,
  waitForNoTooltip,
} from '@atlaskit/visual-regression/helper';
import {
  hoverElementWithText,
  clickElementWithText,
  getBoundingRect,
  scrollToElement,
} from './_editor';
import { clickToolbarMenu, ToolbarMenuItem } from './_toolbar';
import { TableCssClassName as ClassName } from '../../../plugins/table/types';
import messages from '../../../messages';
import {
  pressKeyDown,
  pressKeyUp,
} from '../../__helpers/page-objects/_keyboard';
import { animationFrame } from '../../__helpers/page-objects/_editor';
import { isVisualRegression } from '../utils';
import { Page } from 'puppeteer';
import { RESIZE_HANDLE_AREA_DECORATION_GAP } from '../../../plugins/table/types';

export const tableSelectors = {
  contextualMenu: `.${ClassName.CONTEXTUAL_MENU_BUTTON}`,
  hoveredCell: `.ProseMirror table .${ClassName.HOVERED_CELL}`,
  nthRowControl: (n: number) =>
    `.${ClassName.ROW_CONTROLS_BUTTON_WRAP}:nth-child(${n}) button`,
  nthColumnControl: (n: number) =>
    `.${ClassName.COLUMN_CONTROLS_DECORATIONS}[data-start-index='${n}']`,
  nthNumberedColumnRowControl: (n: number) =>
    `.${ClassName.NUMBERED_COLUMN_BUTTON}:nth-child(${n})`,
  firstRowControl: `.${ClassName.ROW_CONTROLS_BUTTON_WRAP}:nth-child(1) button`,
  firstColumnControl: `.${ClassName.COLUMN_CONTROLS_DECORATIONS}[data-start-index='0'] `,
  lastRowControl: `.${ClassName.ROW_CONTROLS_BUTTON_WRAP}:nth-child(3) button`,
  rowControlSelector: ClassName.ROW_CONTROLS_BUTTON_WRAP,
  deleteButtonSelector: `.${ClassName.CONTROLS_DELETE_BUTTON_WRAP} .${ClassName.CONTROLS_DELETE_BUTTON}`,
  rowControls: ClassName.ROW_CONTROLS_WRAPPER,
  insertColumnButton: `.${ClassName.CONTROLS_INSERT_COLUMN}`,
  insertRowButton: `.${ClassName.CONTROLS_INSERT_ROW}`,
  insertButton: `.${ClassName.CONTROLS_INSERT_BUTTON}`,
  cornerButton: `.${ClassName.CONTROLS_CORNER_BUTTON}`,
  hoveredColumn: `.${ClassName.HOVERED_COLUMN}`,
  breakoutButton: `.${ClassName.LAYOUT_BUTTON}`,
  mergeCellsText: `Merge cells`,
  sortColumnASC: `Sort column A → Z`,
  sortColumnDESC: `Sort column Z → A`,
  splitCellText: `Split cell`,
  tableWrapper: '.ProseMirror .pm-table-wrapper',
  tableOptionsText: `Table options`,
  removeRowButton: `button[title="Remove row"]`,
  removeColumnButton: `button[title="Remove column"]`,
  removeDanger: '.ProseMirror table .danger',
  removeTable: `button[aria-label="Remove"]`,
  selectedCell: `.ProseMirror table .${ClassName.SELECTED_CELL}`,
  topLeftCell: `table > tbody > tr:nth-child(2) > td:nth-child(1)`,
  wideState: `.ProseMirror table[data-layout="wide"]`,
  fullWidthState: `.ProseMirror table[data-layout="full-width"]`,
  defaultState: `.ProseMirror table[data-layout="center"]`,
  fullWidthSelector: `div[aria-label="${messages.layoutFullWidth.defaultMessage}"]`,
  wideSelector: `div[aria-label="${messages.layoutWide.defaultMessage}"]`,
  defaultSelector: `div[aria-label="${messages.layoutFixedWidth.defaultMessage}"]`,
  tableTd: 'table td',
  tableTh: 'table th',
  cellBackgroundText: 'Cell background',
  cellBackgroundSubmenuSelector: `.${ClassName.CONTEXTUAL_SUBMENU}`,
};
// insert table from menu
export const insertTable = async (page: any) => {
  await clickToolbarMenu(page, ToolbarMenuItem.table);
  await page.waitForSelector(tableSelectors.tableTd);
  await page.click(tableSelectors.tableTh);
};

// click into first cell on table
export const clickFirstCell = async (page: any) => {
  await page.waitForSelector(tableSelectors.topLeftCell);
  await page.click(tableSelectors.topLeftCell);
};

export const selectTable = async (page: any) => {
  await page.waitForSelector(tableSelectors.cornerButton);
  await page.click(tableSelectors.cornerButton);
  await page.waitForSelector(tableSelectors.selectedCell);
};

// table floating toolbar interactions
export const clickTableOptions = async (page: any) => {
  await clickElementWithText({
    page,
    tag: 'span',
    text: tableSelectors.tableOptionsText,
  });
};

export const selectTableOption = async (page: any, option: string) => {
  await clickTableOptions(page);
  await clickElementWithText({ page, tag: 'span', text: option });
};

export const clickCellOptions = async (page: any) => {
  await page.waitForSelector(tableSelectors.contextualMenu);
  await page.click(tableSelectors.contextualMenu);
};

export const selectCellOption = async (page: any, option: string) => {
  await clickCellOptions(page);
  await clickElementWithText({ page, tag: 'span', text: option });
};

export const hoverCellOption = async (page: any, option: string) => {
  await clickCellOptions(page);
  await hoverElementWithText({ page, tag: 'span', text: option });
};

// colorIndex - index of the color button DOM node, values from 1 to 8
export const selectCellBackground = async ({
  page,
  from,
  to,
  colorIndex,
}: {
  page: any;
  from: { row: number; column: number };
  to: { row: number; column: number };
  colorIndex: number;
}) => {
  const firstCell = getSelectorForTableCell({
    row: from.row,
    cell: from.column,
    cellType: from.row === 1 ? 'th' : 'td',
  });
  const lastCell = getSelectorForTableCell({
    row: to.row,
    cell: to.column,
    cellType: from.row === 1 ? 'th' : 'td',
  });
  await page.click(firstCell);
  await pressKeyDown(page, 'Shift');
  await page.click(lastCell);
  await pressKeyUp(page, 'Shift');
  await page.waitForSelector(tableSelectors.selectedCell);
  await animationFrame(page);

  const colorButtonSelector =
    tableSelectors.cellBackgroundSubmenuSelector +
    ` div:nth-child(${colorIndex}) button`;

  await selectCellOption(page, tableSelectors.cellBackgroundText);
  await page.waitForSelector(colorButtonSelector);
  await page.click(colorButtonSelector);
  await animationFrame(page);
};

// support for table layout
export const setTableLayoutWide = async (page: any) => {
  await page.waitForSelector(tableSelectors.wideSelector);
  await page.click(tableSelectors.wideSelector);
  await page.waitForSelector(tableSelectors.wideState);
};

export const setTableLayoutFullWidth = async (page: any) => {
  await setTableLayoutWide(page);
  await page.click(tableSelectors.fullWidthSelector);
  await page.waitForSelector(tableSelectors.fullWidthState);
};

export const resetTableLayoutDefault = async (page: any) => {
  await page.waitForSelector(tableSelectors.defaultSelector);
  await page.click(tableSelectors.defaultSelector);
  await page.waitForSelector(tableSelectors.defaultState);
};

export const setTableLayout = async (page: any, layout: string) => {
  if (layout === 'wide') {
    await setTableLayoutWide(page);
  } else if (layout === 'full-width') {
    await setTableLayoutFullWidth(page);
  }
};

export const insertRow = async (page: any, atIndex: number) => {
  await clickFirstCell(page);
  const bounds = await getBoundingRect(
    page,
    tableSelectors.nthRowControl(atIndex),
  );

  if (isVisualRegression()) {
    const x = bounds.left;
    const y = bounds.top + bounds.height - 5;

    await page.mouse.move(x, y);
  } else {
    await page.hover(tableSelectors.nthRowControl(atIndex + 1));
  }

  await page.waitForSelector(tableSelectors.insertButton);
  await page.click(tableSelectors.insertButton);

  if (isVisualRegression()) {
    // cursor is still over insert row button so make sure tooltip renders fully
    await waitForTooltip(page);
  }
};

export const hoverColumnControls = async (
  page: any,
  atIndex: number,
  side: 'left' | 'right' = 'left',
) => {
  const bounds = await getBoundingRect(
    page,
    tableSelectors.nthColumnControl(atIndex),
  );

  let offset = bounds.width * (side === 'left' ? 0.5 : 0.55);

  const x = bounds.left + offset;
  const y = bounds.top + bounds.height - 5;

  await page.mouse.move(x, y);
  await page.waitForSelector(tableSelectors.hoveredColumn);
};

export const insertColumn = async (
  page: any,
  atIndex: number,
  side: 'left' | 'right' = 'left',
) => {
  await clickFirstCell(page);

  const bounds = await getBoundingRect(
    page,
    tableSelectors.nthColumnControl(atIndex),
  );

  if (isVisualRegression()) {
    let offset = bounds.width * (side === 'left' ? 0.5 : 0.55);

    const x = bounds.left + offset;
    const y = bounds.top + bounds.height - 5;
    await page.mouse.move(x, y);
  } else {
    const x = side === 'left' ? 1 : Math.ceil(bounds.width * 0.55);
    const columnDecorationSelector = tableSelectors.nthColumnControl(atIndex);
    await page.moveTo(columnDecorationSelector, x, 1);
  }

  await page.waitForSelector(tableSelectors.insertButton);
  await page.click(tableSelectors.insertButton);

  if (isVisualRegression()) {
    // cursor could or could not be over an insert col button so move it to 0,0
    // and wait for tooltip to fade (if one was previously showing)
    await page.mouse.move(0, 0);
    await waitForNoTooltip(page);
  }
};

export const deleteRow = async (page: any, atIndex: number) => {
  const controlSelector = `.${tableSelectors.rowControls} .${ClassName.ROW_CONTROLS_BUTTON_WRAP}:nth-child(${atIndex}) .${ClassName.CONTROLS_BUTTON}`;
  await deleteRowOrColumn(page, controlSelector);
};

export const deleteColumn = async (page: any, atIndex: number) => {
  const controlSelector = `.${ClassName.COLUMN_CONTROLS_DECORATIONS}[data-start-index="${atIndex}"]`;
  await deleteRowOrColumn(page, controlSelector);
};

export const deleteRowOrColumn = async (page: any, controlSelector: string) => {
  await clickFirstCell(page);
  await page.waitForSelector(controlSelector);
  await page.click(controlSelector);
  await page.hover(tableSelectors.deleteButtonSelector);
  await page.waitForSelector(tableSelectors.deleteButtonSelector);
  await page.click(tableSelectors.deleteButtonSelector);
};

type CellSelectorOpts = {
  row: number;
  cell?: number;
  cellType?: 'td' | 'th';
};

export const getSelectorForTableCell = ({
  row,
  cell,
  cellType = 'td',
}: CellSelectorOpts) => {
  const rowSelector = `table tr:nth-child(${row})`;
  if (!cell) {
    return rowSelector;
  }

  return `${rowSelector} > ${cellType}:nth-child(${cell})`;
};

export const splitCells = async (page: any, selector: string) => {
  await page.click(selector);
  await clickCellOptions(page);
  await selectCellOption(page, tableSelectors.splitCellText);
};

export const mergeCells = async (
  page: any,
  firstCell: string,
  lastCell: string,
) => {
  await page.click(firstCell);
  await pressKeyDown(page, 'Shift');
  await page.click(lastCell);
  await pressKeyUp(page, 'Shift');
  await page.waitForSelector(tableSelectors.selectedCell);
  await clickCellOptions(page);
  await selectCellOption(page, tableSelectors.mergeCellsText);
};

export const getSelectorForTableControl = (type: string, atIndex?: number) => {
  let selector = `.pm-table-${type}-controls__button-wrap`;
  if (atIndex) {
    selector += `:nth-child(${atIndex})`;
  }

  return selector;
};

type ResizeColumnOpts = {
  colIdx: number;
  amount: number;
  // Useful if a row has a colspan and you need resize a col it spans over.
  row?: number;
};

export const resizeColumn = async (
  page: any,
  { colIdx, amount, row = 1 }: ResizeColumnOpts,
) => {
  const queryTableCell = getSelectorForTableCell({ row, cell: colIdx });
  const cell = await getBoundingRect(page, queryTableCell);

  await page.mouse.move(cell.left + cell.width, cell.top + 5);
  await page.waitForSelector(
    `${queryTableCell} .${ClassName.RESIZE_HANDLE_DECORATION}`,
  );

  const cellResizeeHandle = await getBoundingRect(
    page,
    `${queryTableCell} .${ClassName.RESIZE_HANDLE_DECORATION}`,
  );

  const columnEndPosition = cellResizeeHandle.left;

  // Move to the right edge of the cell.
  await page.mouse.move(columnEndPosition, cellResizeeHandle.top);

  // Resize
  await page.mouse.down();
  await page.mouse.move(columnEndPosition + amount, cellResizeeHandle.top);
  await page.mouse.up();
};

export const grabAndMoveColumnResing = async (
  page: any,
  { colIdx, amount, row = 1 }: ResizeColumnOpts,
) => {
  let cell = await getBoundingRect(
    page,
    getSelectorForTableCell({ row, cell: colIdx }),
  );

  const columnEndPosition = cell.left + cell.width;

  // Move to the right edge of the cell.
  await page.mouse.move(columnEndPosition, cell.top);

  // Resize
  await page.mouse.down();
  await page.mouse.move(columnEndPosition + amount, cell.top);
};

export const grabResizeHandle = async (
  page: any,
  { colIdx, row = 1 }: { colIdx: number; row: number },
) => {
  const queryTableCell = getSelectorForTableCell({ row, cell: colIdx });
  const cell = await getBoundingRect(page, queryTableCell);

  // We need to move the mouse first, giving time to prosemirror catch the event
  // and add the decorations
  await page.mouse.move(
    cell.left + cell.width - RESIZE_HANDLE_AREA_DECORATION_GAP,
    cell.top + 5,
  );
  await animationFrame(page);

  // then we grab the resize handle
  await page.mouse.move(cell.left + cell.width, cell.top + 5);
  await animationFrame(page);

  await page.waitForSelector(
    `${queryTableCell} .${ClassName.RESIZE_HANDLE_DECORATION}`,
  );

  await page.mouse.down();
};

export const scrollTable = async (page: any, percentage: number = 1) => {
  await page.evaluate(
    (selector: string, percentage: number) => {
      const element = document.querySelector(selector) as HTMLElement;

      if (element) {
        element.scrollTo(
          (element.scrollWidth - element.offsetWidth) * percentage,
          0,
        );
      }
    },
    `.${ClassName.TABLE_NODE_WRAPPER}`,
    percentage,
  );
};

export const toggleBreakout = async (page: any, times: number) => {
  const timesArray = Array.from({ length: times });

  await page.waitForSelector(tableSelectors.breakoutButton);
  for (let _iter of timesArray) {
    await page.click(tableSelectors.breakoutButton);
  }
};

export const scrollToTable = async (page: any) => {
  await scrollToElement(page, tableSelectors.tableTd, 50);
};

export const unselectTable = async (page: Page) => {
  const rect = await getBoundingRect(page, `.${ClassName.TABLE_NODE_WRAPPER}`)!;

  await page.mouse.click(
    rect.left + rect.width * 0.5, // Middle of the table
    rect.top - 20, // 20px outside the top of the table
  );
};

const select = (type: 'row' | 'column' | 'numbered') => async (
  n: number,
  isShiftPressed: boolean = false,
) => {
  // @ts-ignore
  const page = global.page;
  const selector =
    type === 'row'
      ? tableSelectors.nthRowControl(n + 1)
      : type === 'column'
      ? tableSelectors.nthColumnControl(n)
      : tableSelectors.nthNumberedColumnRowControl(n + 1);

  await page.waitForSelector(selector);

  if (isShiftPressed) {
    await page.keyboard.down('Shift');
    await page.click(selector);
    await page.keyboard.up('Shift');
  } else {
    await page.click(selector);
  }
  await page.waitForSelector(tableSelectors.selectedCell);
};

/**
 * @param n This has `0` based index.
 */
export const selectRow = select('row');
/**
 * @param n This has `0` based index.
 */
export const selectColumn = select('column');
/**
 * @param n This has `1` based index.
 */
export const selectNumberedColumnRow = select('numbered');
