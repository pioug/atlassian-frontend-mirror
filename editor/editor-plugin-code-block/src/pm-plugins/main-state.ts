import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import type { FormatCodeResult, LanguageSource } from '../utils/format-code/formatter';

import { pluginKey } from './plugin-key';

export type PendingFormatRequest = {
	languageSource: LanguageSource;
	pos: number;
	requestId: string;
};

export type ResolveFormatCodeOutcome = 'failed' | 'formatted' | 'unchanged';

export type FormatCodeErrorState = {
	errorType: Extract<FormatCodeResult, { status: 'failed' }>['errorType'];
	languageSource: LanguageSource;
	localId: string;
};

export type CodeBlockState = {
	contentCopied: boolean;
	decorations: DecorationSet;
	formatCodeErrors: Record<string, FormatCodeErrorState>;
	isNodeSelected: boolean;
	pendingFormats: Record<string, PendingFormatRequest>;
	pos: number | null;
	shouldIgnoreFollowingMutations: boolean;
};

export const getPluginState = (state: EditorState): CodeBlockState => pluginKey.getState(state);
