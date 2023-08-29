import type { IntlShape } from 'react-intl-next';

import type {
  Decoration,
  DecorationSet,
} from '@atlaskit/editor-prosemirror/view';

import { TableDecorations } from '../../../types';
import {
  createResizeHandleDecoration,
  updateDecorations,
} from '../../../utils/decoration';

import { composeDecorations } from './compose-decorations';
import type { DecorationTransformer } from './types';

const emptyDecorations = [[], []];

const updateColumnResizeHandle =
  (columnResizesDecorations: Decoration[]): DecorationTransformer =>
  ({ decorationSet, tr }) =>
    updateDecorations(
      tr.doc,
      decorationSet,
      columnResizesDecorations,
      TableDecorations.COLUMN_RESIZING_HANDLE_WIDGET,
    );

const updateLastCellElement =
  (lastCellElementsDecorations: Decoration[]): DecorationTransformer =>
  ({ decorationSet, tr }) =>
    updateDecorations(
      tr.doc,
      decorationSet,
      lastCellElementsDecorations,
      TableDecorations.LAST_CELL_ELEMENT,
    );

export const buildColumnResizingDecorations =
  (
    rowEndIndex: number,
    columnEndIndex: number,
    includeTooltip: boolean,
    getIntl: () => IntlShape,
  ): DecorationTransformer =>
  ({ tr, decorationSet }): DecorationSet => {
    const [columnResizesDecorations, lastCellElementsDecorations] =
      columnEndIndex < 0
        ? emptyDecorations
        : createResizeHandleDecoration(
            tr,
            rowEndIndex,
            {
              right: columnEndIndex,
            },
            includeTooltip,
            getIntl,
          );

    return composeDecorations([
      updateColumnResizeHandle(columnResizesDecorations),
      updateLastCellElement(lastCellElementsDecorations),
    ])({ decorationSet, tr });
  };

export const clearColumnResizingDecorations =
  (): DecorationTransformer =>
  ({ tr, decorationSet }): DecorationSet => {
    const [columnResizesDecorations, lastCellElementsDecorations] =
      emptyDecorations;
    return composeDecorations([
      updateColumnResizeHandle(columnResizesDecorations),
      updateLastCellElement(lastCellElementsDecorations),
    ])({ decorationSet, tr });
  };
