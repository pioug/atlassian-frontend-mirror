import type { DecorationSet } from 'prosemirror-view';

import {
  EditorState,
  Transaction,
  ReadonlyTransaction,
} from 'prosemirror-state';

import type { INPUT_METHOD } from '../analytics/types/enums';
import type { CloseSelectionOptions } from './constants';
import type { UiComponentFactoryParams } from '../../types/ui-components';
import type { SelectItemMode } from '@atlaskit/editor-common/type-ahead';

import type {
  TypeAheadStats,
  TypeAheadItemRenderProps,
  TypeAheadInsert,
  TypeAheadSelectItem,
  TypeAheadItem,
  TypeAheadForceSelect,
  TypeAheadHandler,
} from '@atlaskit/editor-common/types';

export type {
  TypeAheadStats,
  TypeAheadItemRenderProps,
  TypeAheadInsert,
  TypeAheadSelectItem,
  TypeAheadItem,
  TypeAheadForceSelect,
  TypeAheadHandler,
};

export type OnSelectItem = (props: {
  index: number;
  item: TypeAheadItem;
}) => void;

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
  tr: ReadonlyTransaction,
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
