// Resize a given column by an amount from the current state
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { TableCssClassName as ClassName } from '../../../types';

import { getTableContainerElementWidth, getTableScalingPercent } from './misc';
import { growColumn, shrinkColumn, updateAffectedColumn } from './resize-logic';
import { updateColgroup } from './resize-state';
import type { ResizeState } from './types';

export const resizeColumn = (
  resizeState: ResizeState,
  colIndex: number,
  amount: number,
  tableRef: HTMLElement,
  tableNode: PmNode,
  selectedColumns?: number[],
  isTableScalingEnabled = false,
): ResizeState => {
  let scalePercent = 1;
  let resizeAmount = getBooleanFF(
    'platform.editor.table.colum-resizing-improvements',
  )
    ? amount * 2
    : amount;

  if (isTableScalingEnabled) {
    scalePercent = getTableScalingPercent(tableNode, tableRef);
    resizeAmount = amount / scalePercent;
  }

  const newState = getBooleanFF(
    'platform.editor.table.colum-resizing-improvements',
  )
    ? updateAffectedColumn(resizeState, colIndex, resizeAmount)
    : resizeAmount > 0
    ? growColumn(resizeState, colIndex, resizeAmount, selectedColumns)
    : resizeAmount < 0
    ? shrinkColumn(resizeState, colIndex, resizeAmount, selectedColumns)
    : resizeState;

  updateColgroup(newState, tableRef, tableNode, isTableScalingEnabled);

  if (getBooleanFF('platform.editor.table.colum-resizing-improvements')) {
    // use the difference in width from affected column to update overall table width
    const delta =
      newState.cols[colIndex].width - resizeState.cols[colIndex].width;

    updateTable(delta, tableRef, tableNode);
    return {
      ...newState,
      tableWidth: resizeState.tableWidth + delta,
    };
  }

  return newState;
};

const updateTable = (
  resizeAmount: number,
  tableRef: HTMLElement,
  tableNode: PmNode,
  // isTableScalingEnabled: boolean,
) => {
  const currentWidth = getTableContainerElementWidth(tableNode);
  const resizingContainer = tableRef.closest(
    `.${ClassName.TABLE_RESIZER_CONTAINER}`,
  );
  const resizingItem = resizingContainer?.querySelector('.resizer-item');

  if (resizingContainer && resizingItem) {
    const newWidth = `${currentWidth + resizeAmount}px`;
    tableRef.style.width = newWidth;
    (resizingContainer as HTMLElement).style.width = newWidth;
    (resizingItem as HTMLElement).style.width = newWidth;
  }
};
