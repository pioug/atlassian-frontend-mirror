import { type Node } from '@atlaskit/editor-prosemirror/model';

import { type INPUT_METHOD } from '../analytics';
import type { EditorAppearance } from '../types';

export enum LinkAction {
  SHOW_INSERT_TOOLBAR = 'SHOW_INSERT_TOOLBAR',
  HIDE_TOOLBAR = 'HIDE_TOOLBAR',
  SELECTION_CHANGE = 'SELECTION_CHANGE',
  INSERT_LINK_TOOLBAR = 'INSERT',
  EDIT_INSERTED_TOOLBAR = 'EDIT_INSERTED_TOOLBAR',
}

export enum InsertStatus {
  EDIT_LINK_TOOLBAR = 'EDIT',
  INSERT_LINK_TOOLBAR = 'INSERT',
  EDIT_INSERTED_TOOLBAR = 'EDIT_INSERTED',
}

export type InsertState = {
  type: InsertStatus.INSERT_LINK_TOOLBAR;
  from: number;
  to: number;
};

export type EditInsertedState = {
  type: InsertStatus.EDIT_INSERTED_TOOLBAR;
  node: Node;
  pos: number;
};

export type EditState = {
  type: InsertStatus.EDIT_LINK_TOOLBAR;
  node: Node;
  pos: number;
};

export type LinkToolbarState =
  | EditState
  | EditInsertedState
  | InsertState
  | undefined;

export interface HyperlinkState {
  activeText?: string;
  activeLinkMark?: LinkToolbarState;
  timesViewed: number;
  canInsertLink: boolean;
  searchSessionId?: string;
  inputMethod?: INPUT_METHOD;
  editorAppearance?: EditorAppearance;
}
