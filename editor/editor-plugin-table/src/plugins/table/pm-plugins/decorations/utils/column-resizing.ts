import { Decoration, DecorationSet } from 'prosemirror-view';

import { TableDecorations } from '../../../types';
import {
  createResizeHandleDecoration,
  updateDecorations,
} from '../../../utils/decoration';

import { composeDecorations } from './compose-decorations';
import { DecorationTransformer } from './types';

const emptyDecorations = [[], []];

const updateColumnResizeHandle = (
  columnResizesDecorations: Decoration[],
): DecorationTransformer => ({ decorationSet, tr }) =>
  updateDecorations(
    tr.doc,
    decorationSet,
    columnResizesDecorations,
    TableDecorations.COLUMN_RESIZING_HANDLE,
  );

const updateLastCellElement = (
  lastCellElementsDecorations: Decoration[],
): DecorationTransformer => ({ decorationSet, tr }) =>
  updateDecorations(
    tr.doc,
    decorationSet,
    lastCellElementsDecorations,
    TableDecorations.LAST_CELL_ELEMENT,
  );

export const buildColumnResizingDecorations = (
  columnEndIndex: number,
): DecorationTransformer => ({ tr, decorationSet }): DecorationSet => {
  const [columnResizesDecorations, lastCellElementsDecorations] =
    columnEndIndex < 0
      ? emptyDecorations
      : createResizeHandleDecoration(tr, { right: columnEndIndex });

  return composeDecorations([
    updateColumnResizeHandle(columnResizesDecorations),
    updateLastCellElement(lastCellElementsDecorations),
  ])({ decorationSet, tr });
};
