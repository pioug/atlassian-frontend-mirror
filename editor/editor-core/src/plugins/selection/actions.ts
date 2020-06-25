import { Selection } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';

export enum SelectionActionTypes {
  SET_DECORATIONS = 'SET_DECORATIONS',
}

export interface SetDecorations {
  type: SelectionActionTypes.SET_DECORATIONS;
  decorationSet: DecorationSet;
  selection: Selection;
}

export type SelectionAction = SetDecorations;
