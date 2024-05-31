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

export interface PasteOtionsPluginState {
	showToolbar: boolean;
	pasteStartPos: number;
	pasteEndPos: number;
	plaintext: string;
	richTextSlice: Slice;
	isPlainText: boolean;
	highlightContent: boolean;
	highlightDecorationSet: DecorationSet;
	selectedOption: ToolbarDropdownOption;
}

export interface Position {
	top?: number;
	left?: number;
}
