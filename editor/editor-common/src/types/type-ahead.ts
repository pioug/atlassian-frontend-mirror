import type { ReactElement } from 'react';

import { Fragment, Node as PMNode } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';

import type { TypeAheadPayload } from '../analytics/types/type-ahead';
import type { SelectItemMode, TypeAheadAvailableNodes } from '../type-ahead';

type TypeAheadForceSelectProps = {
  query: string;
  items: Array<TypeAheadItem>;
  editorState: EditorState;
};

export interface TypeAheadStats {
  startedAt: number;
  endedAt: number;
  keyCount: {
    arrowUp: number;
    arrowDown: number;
  };
}

export type TypeAheadItemRenderProps = {
  onClick: () => void;
  onHover: () => void;
  isSelected: boolean;
};

export type TypeAheadInsert = (
  node?: PMNode | Object | string | Fragment,
  opts?: { selectInlineNode?: boolean },
) => Transaction;

export type TypeAheadSelectItem = (
  state: EditorState,
  item: TypeAheadItem,
  insert: TypeAheadInsert,
  meta: {
    mode: SelectItemMode;
    stats: TypeAheadStats;
    query: string;
    sourceListItem: Array<TypeAheadItem>;
  },
) => Transaction | false;

export type TypeAheadItem = {
  title: string;
  description?: string;
  keyshortcut?: string;
  key?: string | number;
  icon?: () => ReactElement<any>;
  render?: (
    props: TypeAheadItemRenderProps,
  ) => React.ReactElement<TypeAheadItemRenderProps> | null;
  [key: string]: any;
};

export type TypeAheadForceSelect = (
  props: TypeAheadForceSelectProps,
) => TypeAheadItem | undefined;

export type TypeAheadHandler = {
  id: TypeAheadAvailableNodes;
  trigger: string;
  customRegex?: string;
  headless?: boolean;
  forceSelect?: TypeAheadForceSelect;
  onInvokeAnalytics?: TypeAheadPayload;
  onOpen?: (editorState: EditorState) => void;
  getItems: (props: {
    query: string;
    editorState: EditorState;
  }) => Promise<Array<TypeAheadItem>>;
  selectItem: TypeAheadSelectItem;
  dismiss?: (props: {
    editorState: EditorState;
    query: string;
    stats: TypeAheadStats;
    wasItemInserted?: boolean;
  }) => void;
  getHighlight?: (state: EditorState) => JSX.Element | null;
};
