import { DecorationSet } from 'prosemirror-view';

export const MAX_NESTED_LIST_INDENTATION = 6;

export interface ListState {
  bulletListActive: boolean;
  bulletListDisabled: boolean;
  orderedListActive: boolean;
  orderedListDisabled: boolean;
  decorationSet: DecorationSet; // used to add attributes representing indentation level
}
