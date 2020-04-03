import { DecorationSet, Decoration } from 'prosemirror-view';
import {
  updateNodeDecorations,
  createResizeHandleDecoration,
} from '../utils/decoration';
import { TableDecorations } from '../types';
import { DecorationSetBuilder } from './types';
import { buildDecorationSet } from './utils';

const updateColumnResizeHandle = (
  columnResizesDecorations: Decoration[],
): DecorationSetBuilder => ({ decorationSet, tr }) =>
  updateNodeDecorations(
    tr.doc,
    decorationSet,
    columnResizesDecorations,
    TableDecorations.COLUMN_RESIZING_HANDLE,
  );

const updateLastCellElement = (
  lastCellElementsDecorations: Decoration[],
): DecorationSetBuilder => ({ decorationSet, tr }) =>
  updateNodeDecorations(
    tr.doc,
    decorationSet,
    lastCellElementsDecorations,
    TableDecorations.LAST_CELL_ELEMENT,
  );

const emptyDecorations = [[], []];

export const buildColumnResizingDecorationSet = (
  columnEndIndex: number,
): DecorationSetBuilder => ({ tr, decorationSet }): DecorationSet => {
  const [columnResizesDecorations, lastCellElementsDecorations] =
    columnEndIndex < 0
      ? emptyDecorations
      : createResizeHandleDecoration(tr, { right: columnEndIndex });

  return buildDecorationSet([
    updateColumnResizeHandle(columnResizesDecorations),
    updateLastCellElement(lastCellElementsDecorations),
  ])({ decorationSet, tr });
};
