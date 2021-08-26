import { Node as PMNode, Fragment } from 'prosemirror-model';
import type { DecorationSet } from 'prosemirror-view';
import type {
  TypeAheadItem,
  TypeAheadItemRenderProps,
} from '@atlaskit/editor-common/provider-factory';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import { EditorState, Transaction } from 'prosemirror-state';

import type { INPUT_METHOD } from '../analytics/types/enums';
import type { TypeAheadPayload } from '../analytics/types/type-ahead';
import type { CloseSelectionOptions } from './constants';
import type { UiComponentFactoryParams } from '../../types/ui-components';
import type { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
export type { TypeAheadItem, TypeAheadItemRenderProps };

export type TypeAheadInsert = (
  node?: PMNode | Object | string | Fragment,
  opts?: { selectInlineNode?: boolean },
) => Transaction;

export type OnSelectItem = (props: {
  index: number;
  item: TypeAheadItem;
}) => void;

export interface TypeAheadStats {
  startedAt: number;
  endedAt: number;
  keyCount: {
    arrowUp: number;
    arrowDown: number;
  };
}

export interface TypeAheadStatsSerializable extends TypeAheadStats {
  serialize: () => TypeAheadStats;
}

export interface TypeAheadStatsModifier extends TypeAheadStatsSerializable {
  increaseArrowUp: () => void;
  increaseArrowDown: () => void;
}

export interface TypeAheadStatsMobileModifier
  extends TypeAheadStatsSerializable {
  resetTime: () => void;
  closeTime: () => void;
}

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

type TypeAheadForceSelectProps = {
  query: string;
  items: Array<TypeAheadItem>;
  editorState: EditorState;
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
  }) => void;
  getHighlight?: (state: EditorState) => JSX.Element | null;
};

export type TypeAheadPluginState = {
  decorationSet: DecorationSet;
  decorationElement: HTMLElement | null;
  typeAheadHandlers: Array<TypeAheadHandler>;
  query: string;
  items: Array<TypeAheadItem>;
  triggerHandler?: TypeAheadHandler;
  selectedIndex: number;
  stats: TypeAheadStatsSerializable | null;
  inputMethod: TypeAheadInputMethod | null;
};

export type OnInsertSelectedItemProps = {
  mode: SelectItemMode;
  index: number;
  query: string;
};

export type OnItemMatchProps = {
  mode: SelectItemMode;
  query: string;
};
export type OnInsertSelectedItem = (props: OnInsertSelectedItemProps) => void;
export type OnItemMatch = (props: OnItemMatchProps) => boolean;

export type OnTextInsertProps = {
  forceFocusOnEditor: boolean;
  setSelectionAt: CloseSelectionOptions;
  text: string;
};
export type OnTextInsert = (props: OnTextInsertProps) => void;

export type TypeAheadInputMethod =
  | INPUT_METHOD.INSERT_MENU
  | INPUT_METHOD.KEYBOARD
  | INPUT_METHOD.QUICK_INSERT
  | INPUT_METHOD.TOOLBAR;

export type InsertionTransactionMeta = (
  editorState: EditorState,
) => Transaction | false;

type PopupMountPoints = Pick<
  UiComponentFactoryParams,
  'popupsMountPoint' | 'popupsBoundariesElement' | 'popupsScrollableElement'
>;
export type PopupMountPointReference = Record<
  'current',
  PopupMountPoints | null
>;

export type CreateTypeAheadDecorations = (
  tr: Transaction,
  options: {
    triggerHandler: TypeAheadHandler;
    inputMethod: TypeAheadInputMethod;
    reopenQuery?: string;
  },
) => {
  decorationSet: DecorationSet;
  decorationElement: HTMLElement | null;
  stats: TypeAheadStatsSerializable | null;
};

export type RemoveTypeAheadDecorations = (
  decorationSet?: DecorationSet,
) => boolean;
