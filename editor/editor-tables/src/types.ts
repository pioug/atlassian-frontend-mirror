import { Fragment, ResolvedPos } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

// copied CellAttributes from adf-schema to avoid dependency cycles
export interface CellAttributes {
  colspan?: number;
  rowspan?: number;
  colwidth?: number[];
  background?: string;
}

export interface SelectionBounds {
  $from: ResolvedPos;
  $to: ResolvedPos;
}

export interface SerializedCellSelection {
  type: 'cell';
  anchor: number;
  head: number;
}

export interface CellSelectionRect {
  height: number;
  width: number;
  rows: Fragment[];
}

export type Axis = 'horiz' | 'vert';

/*
 * UP = -1
 * DOWN = 1
 * LEFT = -1
 * RIGHT = 1
 */
export type Direction = -1 | 1;

export type Dispatch = (tr: Transaction) => void;
export type Command = (state: EditorState, dispatch?: Dispatch) => boolean;
export type CommandWithView = (
  state: EditorState,
  dispatch?: Dispatch,
  view?: EditorView,
) => boolean;

export type SelectionRange = {
  $anchor: ResolvedPos;
  $head: ResolvedPos;
  // an array of column/row indexes
  indexes: number[];
};

export type CellAttributesWithColSpan = CellAttributes & {
  colspan: number;
};
