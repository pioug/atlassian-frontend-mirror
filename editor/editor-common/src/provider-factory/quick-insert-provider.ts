import { Node } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';
import { TypeAheadItem } from '../types/typeAhead';

export type QuickInsertActionInsert = (
  node?: Node | Record<string, any> | string,
  opts?: { selectInlineNode?: boolean },
) => Transaction;

export type QuickInsertItem = TypeAheadItem & {
  keywords?: Array<string>;
  priority?: number;
  action: (
    insert: QuickInsertActionInsert,
    state: EditorState,
  ) => Transaction | false;
};

export type QuickInsertProvider = {
  getItems: () => Promise<Array<QuickInsertItem>>;
};
