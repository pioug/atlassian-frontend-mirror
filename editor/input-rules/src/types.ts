import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { InputRuleWrapper } from './editor-common';

export type HandleInputEvent = (props: {
	from: number;
	text: string;
	to: number;
	view: EditorView;
}) => boolean;

export type InputRulePluginState = {
	from: number;
	matchedRule: MatchedRule;
	textInserted: string;
	to: number;
} | null;

export type MatchedRule = InputRuleWrapper & {
	result: RegExpExecArray;
};

export type OnInputEvent = (props: { from: number; state: EditorState; to: number }) => boolean;

export type OnBeforeRegexMatch = (tr: Transaction) => void;
