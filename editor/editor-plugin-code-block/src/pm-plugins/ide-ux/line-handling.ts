import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import { getCursor } from '../utils';

export const isSelectionEntirelyInsideCodeBlock = (state: EditorState): boolean =>
	state.selection.$from.sameParent(state.selection.$to) &&
	state.selection.$from.parent.type === state.schema.nodes.codeBlock;

export const isCursorInsideCodeBlock = (state: EditorState): boolean =>
	!!getCursor(state.selection) && isSelectionEntirelyInsideCodeBlock(state);

export const getStartOfCurrentLine = (state: EditorState) => {
	const { $from } = state.selection;
	if ($from.nodeBefore && $from.nodeBefore.isText) {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const prevNewLineIndex = $from.nodeBefore.text!.lastIndexOf('\n');
		return {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			text: $from.nodeBefore.text!.substring(prevNewLineIndex + 1),
			pos: $from.start() + prevNewLineIndex + 1,
		};
	}
	return { text: '', pos: $from.pos };
};

export const getEndOfCurrentLine = (state: EditorState) => {
	const { $to } = state.selection;
	if ($to.nodeAfter && $to.nodeAfter.isText) {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const nextNewLineIndex = $to.nodeAfter.text!.indexOf('\n');
		return {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			text: $to.nodeAfter.text!.substring(0, nextNewLineIndex >= 0 ? nextNewLineIndex : undefined),
			pos: nextNewLineIndex >= 0 ? $to.pos + nextNewLineIndex : $to.end(),
		};
	}
	return { text: '', pos: $to.pos };
};

export function getLinesFromSelection(state: EditorState) {
	const { pos: start } = getStartOfCurrentLine(state);
	const { pos: end } = getEndOfCurrentLine(state);
	const text = state.doc.textBetween(start, end);
	return { text, start, end };
}

export const forEachLine = (text: string, callback: (line: string, offset: number) => void): void => {
	let offset = 0;
	text.split('\n').forEach((line) => {
		callback(line, offset);
		offset += line.length + 1;
	});
};

// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const SPACE = { token: ' ', size: 2, regex: /[^ ]/ };
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const TAB = { token: '\t', size: 1, regex: /[^\t]/ };
export const getLineInfo = (line: string) => {
	const indentToken = line.startsWith('\t') ? TAB : SPACE;
	const indentLength = line.search(indentToken.regex);
	const indentText = line.substring(0, indentLength >= 0 ? indentLength : line.length);
	return { indentToken, indentText };
};
