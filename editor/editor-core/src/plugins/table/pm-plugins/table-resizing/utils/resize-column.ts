// Resize a given column by an amount from the current state
import { growColumn, shrinkColumn } from './resize-logic';
import { updateColgroup } from './resize-state';
import { ResizeState } from './types';

export const resizeColumn = (
  resizeState: ResizeState,
  colIndex: number,
  amount: number,
  tableRef: HTMLElement,
  selectedColumns?: number[],
): ResizeState => {
  const newState =
    amount > 0
      ? growColumn(resizeState, colIndex, amount, selectedColumns)
      : amount < 0
      ? shrinkColumn(resizeState, colIndex, amount, selectedColumns)
      : resizeState;

  updateColgroup(newState, tableRef);

  return newState;
};
