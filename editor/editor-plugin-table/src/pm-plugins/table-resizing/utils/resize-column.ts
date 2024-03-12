// Resize a given column by an amount from the current state
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';

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
  const newState =
    amount > 0
      ? growColumn(resizeState, colIndex, amount, selectedColumns)
      : amount < 0
      ? shrinkColumn(resizeState, colIndex, amount, selectedColumns)
      : resizeState;

  updateColgroup(newState, tableRef, tableNode, isTableScalingEnabled);

  return newState;
};
