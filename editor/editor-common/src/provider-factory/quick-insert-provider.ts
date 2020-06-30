import { Node } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';

import { TypeAheadItem } from '../types/typeAhead';

export type QuickInsertActionInsert = (
  node?: Node | Record<string, any> | string,
  opts?: { selectInlineNode?: boolean },
) => Transaction;

export type QuickInsertItemId =
  | 'hyperlink'
  | 'table'
  | 'helpdialog'
  | 'date'
  | 'media'
  | 'blockquote'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'heading5'
  | 'heading6'
  | 'codeblock'
  | 'unorderedList'
  | 'feedbackdialog'
  | 'orderedList'
  | 'rule'
  | 'status'
  | 'mention'
  | 'emoji'
  | 'action'
  | 'decision'
  | 'infopanel'
  | 'notepanel'
  | 'successpanel'
  | 'warningpanel'
  | 'errorpanel'
  | 'layout'
  | 'expand';

export type QuickInsertItem = TypeAheadItem & {
  keywords?: Array<string>;
  priority?: number;
  id?: QuickInsertItemId;
  action: (
    insert: QuickInsertActionInsert,
    state: EditorState,
  ) => Transaction | false;
};

export type QuickInsertProvider = {
  getItems: () => Promise<Array<QuickInsertItem>>;
};
