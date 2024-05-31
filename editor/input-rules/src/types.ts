import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { InputRuleWrapper } from './editor-common';

export type { InputRuleHandler, InputRuleWrapper, OnHandlerApply } from './editor-common';

export type HandleInputEvent = (props: {
	view: EditorView;
	from: number;
	to: number;
	text: string;
}) => boolean;

export type InputRulePluginState = {
	matchedRule: MatchedRule;
	from: number;
	to: number;
	textInserted: string;
} | null;

export type MatchedRule = InputRuleWrapper & {
	result: RegExpExecArray;
};

export type OnInputEvent = (props: { state: EditorState; from: number; to: number }) => boolean;

export type OnBeforeRegexMatch = (tr: Transaction) => void;
