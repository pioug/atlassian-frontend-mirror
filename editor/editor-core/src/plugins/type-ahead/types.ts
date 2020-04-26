import { InjectedIntl } from 'react-intl';
import { EditorState, Transaction } from 'prosemirror-state';
import { Node } from 'prosemirror-model';
import { Dispatch } from '../../event-dispatcher';
import { TypeAheadItem } from '@atlaskit/editor-common/provider-factory';

// Re-export typeahead types
export {
  TypeAheadItem,
  TypeAheadItemRenderProps,
} from '@atlaskit/editor-common/provider-factory';

export type SelectItemMode =
  | 'shift-enter'
  | 'enter'
  | 'space'
  | 'selected'
  | 'tab';

export type TypeAheadInsert = (
  node?: Node | Object | string,
  opts?: { selectInlineNode?: boolean },
) => Transaction;

export type TypeAheadSelectItem = (
  state: EditorState,
  item: TypeAheadItem,
  insert: TypeAheadInsert,
  meta: {
    mode: SelectItemMode;
  },
) => Transaction | false;

export type TypeAheadHandler = {
  trigger: string;
  customRegex?: string;
  headless?: boolean;
  forceSelect?: (query: string, items: Array<TypeAheadItem>) => boolean;
  getItems: (
    query: string,
    editorState: EditorState,
    intl: InjectedIntl,
    meta: {
      prevActive: boolean;
      queryChanged: boolean;
    },
    tr: Transaction,
    dipatch: Dispatch,
  ) => Array<TypeAheadItem> | Promise<Array<TypeAheadItem>>;
  selectItem: TypeAheadSelectItem;
  dismiss?: (state: EditorState) => void;
  getHighlight?: (state: EditorState) => JSX.Element | null;
};

export type TypeAheadItemsLoader = null | {
  promise: Promise<Array<TypeAheadItem>>;
  cancel(): void;
};
