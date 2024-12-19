import type { Slice } from '@atlaskit/editor-prosemirror/model';

import type { ToolbarDropdownOption } from '../types/types';

export enum PastePluginActionTypes {
	START_TRACKING_PASTED_MACRO_POSITIONS = 'START_TRACKING_PASTED_MACRO_POSITIONS',
	STOP_TRACKING_PASTED_MACRO_POSITIONS = 'STOP_TRACKING_PASTED_MACRO_POSITIONS',
	SHOW_PASTE_OPTIONS = 'SHOW_PASTE_OPTIONS',
	HIDE_PASTE_OPTIONS = 'HIDE_PASTE_OPTIONS',
	HIGHLIGHT_CONTENT = 'HIGHLIGHT_CONTENT',
	CHANGE_FORMAT = 'CHANGE_FORMAT',
}

export interface ShowPasteOptions {
	type: PastePluginActionTypes.SHOW_PASTE_OPTIONS;
	data: {
		plaintext: string;
		selectedOption: ToolbarDropdownOption;
		isPlainText: boolean;
		richTextSlice: Slice;
		pasteStartPos: number;
		pasteEndPos: number;
	};
}

export interface HidePasteOptions {
	type: PastePluginActionTypes.HIDE_PASTE_OPTIONS;
}

export interface HighlightContent {
	type: PastePluginActionTypes.HIGHLIGHT_CONTENT;
}

export interface ChangeFormat {
	type: PastePluginActionTypes.CHANGE_FORMAT;
	data: {
		selectedOption: ToolbarDropdownOption;
	};
}

export type PastePluginAction =
	| ShowPasteOptions
	| HidePasteOptions
	| HighlightContent
	| ChangeFormat;
