import { closeHistory } from '@atlaskit/editor-prosemirror/history';
import type { Mark as PMMark } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, SafePluginSpec } from '@atlaskit/editor-prosemirror/state';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';

import { isGapCursorSelection } from './editor-common';
import { createInputRulePlugin } from './plugin';
import type { InputRuleWrapper, OnInputEvent } from './types';

const hasUnsupportedMarks = (
	state: EditorState,
	start: number,
	end: number,
	marksNameUnsupported: string[],
) => {
	const isUnsupportedMark = (node: PMMark) => (marksNameUnsupported || []).includes(node.type.name);

	const $from = state.doc.resolve(start);
	const $to = state.doc.resolve(end);
	const marksInSelection = start === end ? $from.marks() : $from.marksAcross($to);

	return (marksInSelection || []).some(isUnsupportedMark);
};

const isCursorInsideUnsupportedMarks = (
	state: EditorState,
	marksNameUnsupported: string[],
): boolean => {
	const { selection } = state;
	if (!(selection instanceof TextSelection)) {
		return false;
	}
	const { $cursor } = selection;
	const isUnsupportedMark = (node: PMMark) => marksNameUnsupported.includes(node.type.name);

	return Boolean($cursor?.nodeBefore?.marks?.some(isUnsupportedMark));
};

type Options = {
	isBlockNodeRule?: boolean;
	allowInsertTextOnDocument?: boolean;
};
export const createPlugin = (
	pluginName: string,
	rules: Array<InputRuleWrapper>,
	options: Options = {},
): SafePluginSpec => {
	const { isBlockNodeRule = false, allowInsertTextOnDocument = true } = options;

	const onInputEvent: OnInputEvent = ({ state, from, to }) => {
		const unsupportedMarks = isBlockNodeRule ? ['code', 'link', 'typeAheadQuery'] : ['code'];

		const $from = state.selection.$from;

		if (
			$from.parent.type.spec.code ||
			(!(state.selection instanceof TextSelection) && !isGapCursorSelection(state.selection)) ||
			hasUnsupportedMarks(state, from, to, unsupportedMarks) ||
			(isBlockNodeRule && isCursorInsideUnsupportedMarks(state, unsupportedMarks))
		) {
			return false;
		}

		return true;
	};

	return createInputRulePlugin(pluginName, rules, {
		allowInsertTextOnDocument,
		onInputEvent,
		onBeforeRegexMatch: (tr) => {
			closeHistory(tr);
		},
	});
};
