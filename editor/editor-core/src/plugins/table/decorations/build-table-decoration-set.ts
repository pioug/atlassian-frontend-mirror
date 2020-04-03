import { DecorationSet } from 'prosemirror-view';
import {
  findControlsHoverDecoration,
  findColumnControlSelectedDecoration,
  updateNodeDecorations,
  createColumnSelectedDecorations,
  createColumnControlsDecoration,
} from '../utils/decoration';
import { Transaction } from 'prosemirror-state';
import { CellSelection } from 'prosemirror-tables';
import { TableDecorations } from '../types';
import { DecorationSetBuilder } from './types';
import { buildDecorationSet, noop } from './utils';
import { findTable } from 'prosemirror-utils';

const isColumnSelected = (tr: Transaction): boolean =>
  tr.selection instanceof CellSelection && tr.selection.isColSelection();

// @see: https://product-fabric.atlassian.net/browse/ED-7304
const removeColumnControlsSelected: DecorationSetBuilder = ({
  decorationSet,
}): DecorationSet =>
  decorationSet.remove(findColumnControlSelectedDecoration(decorationSet));

// @see: https://product-fabric.atlassian.net/browse/ED-3796
const removeControlsHover: DecorationSetBuilder = ({
  decorationSet,
}): DecorationSet =>
  decorationSet.remove(findControlsHoverDecoration(decorationSet));

const createColumnSelected: DecorationSetBuilder = ({
  decorationSet,
  tr,
}): DecorationSet => {
  if (!isColumnSelected(tr)) {
    return decorationSet;
  }

  return updateNodeDecorations(
    tr.doc,
    decorationSet,
    createColumnSelectedDecorations(tr),
    TableDecorations.COLUMN_SELECTED,
  );
};

const createColumnControls: DecorationSetBuilder = ({
  decorationSet,
  tr,
}): DecorationSet => {
  const table = findTable(tr.selection);
  if (!table) {
    return decorationSet;
  }

  return updateNodeDecorations(
    tr.doc,
    decorationSet,
    createColumnControlsDecoration(tr.selection),
    TableDecorations.COLUMN_CONTROLS_DECORATIONS,
  );
};

export const buildTableDecorationSet = (
  shouldRecreateColumnControls: boolean,
): DecorationSetBuilder => ({ decorationSet, tr }): DecorationSet =>
  buildDecorationSet([
    removeColumnControlsSelected,
    createColumnSelected,
    shouldRecreateColumnControls ? createColumnControls : noop,
    removeControlsHover,
  ])({ decorationSet, tr });
