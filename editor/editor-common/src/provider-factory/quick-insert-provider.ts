import { Node } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';

import { TypeAheadItem } from '../types/type-ahead';

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
  | 'custompanel'
  | 'layout'
  | 'expand'
  | 'placeholderText';

export type QuickInsertItem = TypeAheadItem & {
  /** other names used to find the item */
  keywords?: Array<string>;
  /** categories where to find the item */
  categories?: Array<string>;
  /** optional sorting priority */
  priority?: number;
  /** optional identifier */
  id?: QuickInsertItemId;
  /** indicates if the item will be highlighted where approppriated (plus menu for now) */
  featured?: boolean;
  /** what to do on insert */
  action: (
    insert: QuickInsertActionInsert,
    state: EditorState,
  ) => Transaction | false;
};

export type QuickInsertProvider = {
  getItems: () => Promise<Array<QuickInsertItem>>;
};
