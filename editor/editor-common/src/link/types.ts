import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import type { INPUT_METHOD } from '../analytics';
import type { EditorAppearance } from '../types';

import type { InsertStatus } from './InsertStatus';

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
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { LinkAction } from './LinkAction';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { InsertStatus } from './InsertStatus';
