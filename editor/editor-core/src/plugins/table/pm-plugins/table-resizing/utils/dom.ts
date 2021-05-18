import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import {
  browser,
  tableCellBorderWidth,
  tableCellPadding,
  tableMarginTop,
} from '@atlaskit/editor-common';

import {
  closestElement,
  containsClassName,
  parsePx,
} from '../../../../../utils/dom';
import { updateOverflowShadows } from '../../../nodeviews/update-overflow-shadows';
import { TableCssClassName as ClassName } from '../../../types';
import { getRowHeights } from '../../../utils';
import { colWidthsForRow } from '../../../utils/column-controls';
import { getPluginState as getMainPluginState } from '../../plugin-factory';

export const updateControls = (state: EditorState) => {
  const { tableRef } = getMainPluginState(state);
  if (!tableRef) {
    return;
  }
  const tr = tableRef.querySelector('tr');
  if (!tr) {
    return;
  }
  const wrapper = tableRef.parentElement;
  if (!(wrapper && wrapper.parentElement)) {
    return;
  }

  const rowControls = wrapper.parentElement.querySelectorAll<HTMLElement>(
    `.${ClassName.ROW_CONTROLS_BUTTON_WRAP}`,
  );
  const numberedRows = wrapper.parentElement.querySelectorAll<HTMLElement>(
    ClassName.NUMBERED_COLUMN_BUTTON,
  );

  syncStickyRowToTable(tableRef);

  const rowHeights = getRowHeights(tableRef);

  // update rows controls height on resize
  for (let i = 0, count = rowControls.length; i < count; i++) {
    const height = rowHeights[i];
    if (height) {
      rowControls[i].style.height = `${height}px`;

      if (numberedRows.length) {
        numberedRows[i].style.height = `${height}px`;
      }
    }
  }

  const rightShadows = wrapper.parentElement.querySelectorAll<HTMLElement>(
    `.${ClassName.TABLE_RIGHT_SHADOW}`,
  );

  const leftShadows = wrapper.parentElement.querySelectorAll<HTMLElement>(
    `.${ClassName.TABLE_LEFT_SHADOW}`,
  );

  updateOverflowShadows(state, wrapper, tableRef, rightShadows, leftShadows);
};

export const isClickNear = (
  event: MouseEvent,
  click: { x: number; y: number },
): boolean => {
  const dx = click.x - event.clientX,
    dy = click.y - event.clientY;
  return dx * dx + dy * dy < 100;
};

export const getResizeCellPos = (
  view: EditorView,
  event: MouseEvent,
  lastColumnResizable: boolean,
): number | null => {
  const target = event.target as HTMLElement;

  if (!containsClassName(target, ClassName.RESIZE_HANDLE_DECORATION)) {
    return null;
  }

  const tableCell = closestElement(target, 'td, th');

  if (!tableCell) {
    return null;
  }

  const cellStartPosition = view.posAtDOM(tableCell, 0);
  return cellStartPosition - 1;
};

export const updateStickyMargins = (table: HTMLElement) => {
  const row = table.querySelector('tr.sticky');
  if (!row) {
    table.style.marginTop = '';
    return;
  }

  const paddingTop =
    parsePx(window.getComputedStyle(row).paddingTop || '') || 0;
  const firstRowHeight = row.clientHeight - paddingTop - 2; /* border */

  // firefox handles margin and padding differently
  // when applied with tables
  table.style.marginTop = `${
    browser.gecko
      ? firstRowHeight + tableCellPadding - tableCellBorderWidth
      : tableMarginTop + firstRowHeight
  }px`;
};

export const applyColWidthsToStickyRow = (
  colGroup: HTMLTableColElement | null,
  headerRow: HTMLTableRowElement,
) => {
  // sync column widths for the sticky row
  const newCols = colWidthsForRow(colGroup, headerRow);

  if (newCols) {
    headerRow.style.gridTemplateColumns = newCols;
  }
};

export const syncStickyRowToTable = (tableRef?: HTMLElement | null) => {
  if (!tableRef) {
    return;
  }

  const headerRow = tableRef.querySelector(
    'tr[data-header-row]',
  ) as HTMLTableRowElement;

  if (!headerRow) {
    return;
  }

  applyColWidthsToStickyRow(tableRef.querySelector('colgroup'), headerRow);
  applyTableWidthToStickyRow(tableRef, headerRow);
};

export const applyTableWidthToStickyRow = (
  tableRef: HTMLElement,
  headerRow: HTMLTableRowElement,
) => {
  const tbody = tableRef.querySelector('tbody')!;
  const wrapper = tableRef.parentElement;

  if (tbody && wrapper) {
    // when resizing in Chrome, clientWidth will give us 759px
    // but toggling the sticky class will reset it to 760px.
    //
    // both elements in the dom + inspector will
    // be the same width but at layout will be different..
    const newWidth = Math.min(tbody.offsetWidth + 1, wrapper.offsetWidth);

    headerRow.style.width = `${newWidth}px`;
    headerRow.scrollLeft = wrapper.scrollLeft;
  }
};
