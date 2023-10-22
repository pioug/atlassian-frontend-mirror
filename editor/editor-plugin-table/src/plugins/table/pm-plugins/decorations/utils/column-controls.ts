// @ts-ignore -- ReadonlyTransaction is a local declaration and will cause a TS2305 error in CCFE typecheck
import type {
  ReadonlyTransaction,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { findTable } from '@atlaskit/editor-tables/utils';

import { TableDecorations } from '../../../types';
import {
  createColumnControlsDecoration,
  createColumnSelectedDecoration,
  findColumnControlSelectedDecoration,
  findControlsHoverDecoration,
  updateDecorations,
} from '../../../utils/decoration';
import { pluginKey as tablePluginKey } from '../../plugin-key';

import { composeDecorations } from './compose-decorations';
import type { DecorationTransformer } from './types';

const isColumnSelected = (tr: Transaction | ReadonlyTransaction): boolean =>
  tr.selection instanceof CellSelection && tr.selection.isColSelection();

// @see: https://product-fabric.atlassian.net/browse/ED-3796
const removeControlsHoverDecoration: DecorationTransformer = ({
  decorationSet,
}): DecorationSet =>
  decorationSet.remove(findControlsHoverDecoration(decorationSet));

const maybeUpdateColumnSelectedDecoration: DecorationTransformer = ({
  decorationSet,
  tr,
}): DecorationSet => {
  if (!isColumnSelected(tr)) {
    return decorationSet;
  }

  return updateDecorations(
    tr.doc,
    decorationSet,
    createColumnSelectedDecoration(tr),
    TableDecorations.COLUMN_SELECTED,
  );
};

const maybeUpdateColumnControlsDecoration: DecorationTransformer = ({
  decorationSet,
  tr,
}): DecorationSet => {
  const table = findTable(tr.selection);
  const meta = tr.getMeta(tablePluginKey);

  // avoid re-drawing state if dnd decorations don't need to be updated
  if (!table && meta?.type !== 'HOVER_CELL') {
    return decorationSet;
  }

  return updateDecorations(
    tr.doc,
    decorationSet,
    createColumnControlsDecoration(tr.selection),
    TableDecorations.COLUMN_CONTROLS_DECORATIONS,
  );
};

// @see: https://product-fabric.atlassian.net/browse/ED-7304
const removeColumnControlsSelectedDecoration: DecorationTransformer = ({
  decorationSet,
}): DecorationSet =>
  decorationSet.remove(findColumnControlSelectedDecoration(decorationSet));

const hasColumnSelectedDecorations = (decorationSet: DecorationSet): boolean =>
  !!findColumnControlSelectedDecoration(decorationSet).length;

export const maybeUpdateColumnControlsSelectedDecoration: DecorationTransformer =
  ({ decorationSet, tr }): DecorationSet => {
    if (!hasColumnSelectedDecorations(decorationSet)) {
      return decorationSet;
    }

    return removeColumnControlsSelectedDecoration({ decorationSet, tr });
  };

export const buildColumnControlsDecorations: DecorationTransformer = ({
  decorationSet,
  tr,
}): DecorationSet => {
  return composeDecorations([
    removeColumnControlsSelectedDecoration,
    removeControlsHoverDecoration,
    maybeUpdateColumnSelectedDecoration,
    maybeUpdateColumnControlsDecoration,
  ])({ decorationSet, tr });
};
