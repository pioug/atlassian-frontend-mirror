import { Node } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';
import { InjectedIntl } from 'react-intl';

import { TypeAheadItem } from '@atlaskit/editor-common/provider-factory';

import { Dispatch } from '../../event-dispatcher';

// Re-export typeahead types
export type {
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
  forceSelect?: (
    query: string,
    items: Array<TypeAheadItem>,
  ) => TypeAheadItem | undefined;
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

export type TypeAheadPluginState = {
  isAllowed: boolean;
  active: boolean;
  prevActiveState: boolean;
  query: string | null;
  trigger: string | null;
  typeAheadHandler: TypeAheadHandler | null;
  items: Array<TypeAheadItem>;
  itemsLoader: TypeAheadItemsLoader;
  currentIndex: number;
  queryMarkPos: number | null;
  queryStarted: number;
  upKeyCount: number;
  downKeyCount: number;
  highlight?: JSX.Element | null;
};
