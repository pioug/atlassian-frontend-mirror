/**
 * This file is to duplicate types that exist in editor-common
 * so that input-rules does not depend on it.
 *
 * This simplifies our dependencies and makes adoption much easier.
 */
import type { EditorState, Selection, Transaction } from '@atlaskit/editor-prosemirror/state';

export type InputRuleHandler = (
	state: EditorState,
	matchResult: RegExpExecArray,
	start: number,
	end: number,
) => Transaction | null;

export type OnHandlerApply = (
	state: EditorState,
	tr: Transaction,
	matchResult: RegExpExecArray,
) => void;

export interface InputRuleWrapper {
	handler: InputRuleHandler;
	match: RegExp;
	onHandlerApply?: OnHandlerApply;
}

// This is to workaround requiring editor-common in this repository which
// makes the dependency tree significantly more complex since editor-common
// needs to be a singleton
export const isGapCursorSelection = (selection: Selection): boolean => {
	// @ts-expect-error
	return Boolean(selection.jsonID === 'gapcursor');
};
