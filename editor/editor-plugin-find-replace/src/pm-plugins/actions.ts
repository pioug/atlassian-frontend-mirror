import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import type { Match } from '../types';

export enum FindReplaceActionTypes {
	ACTIVATE = 'ACTIVATE',
	FIND = 'FIND',
	UPDATE_DECORATIONS = 'UPDATE_DECORATIONS',
	FIND_NEXT = 'FIND_NEXT',
	FIND_PREVIOUS = 'FIND_PREVIOUS',
	REPLACE = 'REPLACE',
	REPLACE_ALL = 'REPLACE_ALL',
	CANCEL = 'CANCEL',
	BLUR = 'BLUR',
	TOGGLE_MATCH_CASE = 'TOGGLE_MATCH_CASE',
}

export interface Activate {
	findText?: string;
	index?: number;
	matches?: Match[];
	type: FindReplaceActionTypes.ACTIVATE;
}

export interface Find {
	findText: string;
	index: number;
	matches: Match[];
	type: FindReplaceActionTypes.FIND;
}

export interface FindNext {
	decorationSet: DecorationSet;
	index: number;
	type: FindReplaceActionTypes.FIND_NEXT;
}

export interface FindPrevious {
	decorationSet: DecorationSet;
	index: number;
	type: FindReplaceActionTypes.FIND_PREVIOUS;
}

export interface Replace {
	decorationSet: DecorationSet;
	index: number;
	matches: Match[];
	replaceText: string;
	type: FindReplaceActionTypes.REPLACE;
}

export interface ReplaceAll {
	decorationSet: DecorationSet;
	index: number;
	matches: Match[];
	replaceText: string;
	type: FindReplaceActionTypes.REPLACE_ALL;
}

export interface Cancel {
	type: FindReplaceActionTypes.CANCEL;
}

export interface Blur {
	type: FindReplaceActionTypes.BLUR;
}

export interface UpdateDecorations {
	decorationSet: DecorationSet;
	type: FindReplaceActionTypes.UPDATE_DECORATIONS;
}
export interface ToggleMatchCase {
	type: FindReplaceActionTypes.TOGGLE_MATCH_CASE;
}

export type FindReplaceAction =
	| Activate
	| Find
	| FindNext
	| FindPrevious
	| Replace
	| ReplaceAll
	| Cancel
	| Blur
	| UpdateDecorations
	| ToggleMatchCase;
