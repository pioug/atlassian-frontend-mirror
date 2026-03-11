import type { Slice } from '@atlaskit/editor-prosemirror/model';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

export const pasteOptionsPluginKey = new PluginKey('paste-options');

export enum ToolbarDropdownOption {
	Markdown,
	RichText,
	PlainText,
	None,
}

export interface PasteOptionsPluginState {
	highlightContent: boolean;
	highlightDecorationSet: DecorationSet;
	isPlainText: boolean;
	pasteAncestorNodeNames: string[];
	pasteEndPos: number;
	pasteStartPos: number;
	plaintext: string;
	richTextSlice: Slice;
	selectedOption: ToolbarDropdownOption;
	showLegacyOptions: boolean;
	showToolbar: boolean;
}

export interface Position {
	left?: number;
	top?: number;
}

export type PasteType = 'rich-text' | 'markdown' | 'plain-text';
