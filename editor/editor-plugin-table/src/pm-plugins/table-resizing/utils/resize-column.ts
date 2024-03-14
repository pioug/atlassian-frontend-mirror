// Resize a given column by an amount from the current state
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';

import { getTableScalingPercent } from './misc';
import { growColumn, shrinkColumn } from './resize-logic';
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
  let resizeAmount = amount;

  if (isTableScalingEnabled) {
    scalePercent = getTableScalingPercent(tableNode, tableRef);
    resizeAmount = amount / scalePercent;
  }
  const newState =
    resizeAmount > 0
      ? growColumn(resizeState, colIndex, resizeAmount, selectedColumns)
      : resizeAmount < 0
      ? shrinkColumn(resizeState, colIndex, resizeAmount, selectedColumns)
      : resizeState;

  updateColgroup(newState, tableRef, tableNode, isTableScalingEnabled);

  return newState;
};
