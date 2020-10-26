import { Transaction } from 'prosemirror-state';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { findTable } from '@atlaskit/editor-tables/utils';
import { DecorationSet } from 'prosemirror-view';

import { TableDecorations } from '../../../types';
import {
  createColumnControlsDecoration,
  createColumnSelectedDecoration,
  findColumnControlSelectedDecoration,
  findControlsHoverDecoration,
  updateDecorations,
} from '../../../utils/decoration';

import { composeDecorations } from './compose-decorations';
import { DecorationTransformer } from './types';

const isColumnSelected = (tr: Transaction): boolean =>
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
  if (!table) {
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

export const maybeUpdateColumnControlsSelectedDecoration: DecorationTransformer = ({
  decorationSet,
  tr,
}): DecorationSet => {
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
  ])({ decorationSet: DecorationSet.empty, tr });
};
