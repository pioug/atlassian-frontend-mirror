import { Node as PMNode } from 'prosemirror-model';
import { NodeSelection, Selection, Transaction } from 'prosemirror-state';

import { StatusType } from './types';

export const mayGetStatusAtSelection = (
  selection: Selection,
): StatusType | null => {
  if (selection && selection instanceof NodeSelection) {
    const nodeSelection = selection as NodeSelection;
    if (nodeSelection.node.type.name === 'status') {
      return (selection.node.attrs as StatusType) || null;
    }
  }
  return null;
};

export const mayGetStatusAtPos = (
  pos: number | null,
  doc: PMNode,
): StatusType | null => {
  if (pos) {
    const node = doc.nodeAt(pos);
    if (node && node.type.name === 'status') {
      return node.attrs as StatusType;
    }
  }

  return null;
};

export const isEmptyStatus = (node: StatusType): boolean =>
  node && ((node.text && node.text.trim().length === 0) || node.text === '');

export const setSelectionNearPos = (
  tr: Transaction,
  pos: number,
): Transaction =>
  tr.setSelection(Selection.near(tr.doc.resolve(tr.mapping.map(pos))));

export const setNodeSelectionNearPos = (
  tr: Transaction,
  pos: number,
): Transaction =>
  tr.setSelection(NodeSelection.create(tr.doc, tr.mapping.map(pos)));
