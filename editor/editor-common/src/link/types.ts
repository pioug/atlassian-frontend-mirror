import { type Node } from '@atlaskit/editor-prosemirror/model';
import { type DecorationSet } from '@atlaskit/editor-prosemirror/view';

import { type INPUT_METHOD } from '../analytics';
import type { EditorAppearance } from '../types';

export enum LinkAction {
	SHOW_INSERT_TOOLBAR = 'SHOW_INSERT_TOOLBAR',
	HIDE_TOOLBAR = 'HIDE_TOOLBAR',
	SELECTION_CHANGE = 'SELECTION_CHANGE',
	INSERT_LINK_TOOLBAR = 'INSERT',
	EDIT_INSERTED_TOOLBAR = 'EDIT_INSERTED_TOOLBAR',
	SET_CONFIGURE_BUTTON_TARGET_POS = 'SET_CONFIGURE_BUTTON_TARGET_POS',
	SET_CONFIGURE_DROPDOWN_OPEN = 'SET_CONFIGURE_DROPDOWN_OPEN',
}

export enum InsertStatus {
	EDIT_LINK_TOOLBAR = 'EDIT',
	INSERT_LINK_TOOLBAR = 'INSERT',
	EDIT_INSERTED_TOOLBAR = 'EDIT_INSERTED',
}

export type InsertState = {
	from: number;
	to: number;
	type: InsertStatus.INSERT_LINK_TOOLBAR;
};

export type EditInsertedState = {
	node: Node;
	pos: number;
	type: InsertStatus.EDIT_INSERTED_TOOLBAR;
};

export type EditState = {
	node: Node;
	pos: number;
	type: InsertStatus.EDIT_LINK_TOOLBAR;
};

export type LinkToolbarState = EditState | EditInsertedState | InsertState | undefined;

export interface HyperlinkState {
	activeLinkMark?: LinkToolbarState;
	activeText?: string;
	canInsertLink: boolean;
	configureButtonTargetPos?: number;
	configureDropdownOpen?: boolean;
	decorations?: DecorationSet;
	editorAppearance?: EditorAppearance;
	inputMethod?: INPUT_METHOD;
	searchSessionId?: string;
	timesViewed: number;
}
