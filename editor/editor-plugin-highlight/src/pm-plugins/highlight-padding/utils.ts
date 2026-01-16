import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

export const isHighlightedTextNode = (node: PMNode): boolean => {
	return node.isText && node.marks.some((mark) => mark.type.name === 'backgroundColor');
};

type ShouldPadLeftOptions = {
	nodeStart: number;
	state: EditorState;
};

export const shouldPadLeft = ({ state, nodeStart }: ShouldPadLeftOptions): boolean => {
	const $pos = state.doc.resolve(nodeStart);
	const isAtBlockStart = $pos.parentOffset === 0;
	if (isAtBlockStart) {
		return true;
	}
	const isAtDocStart = nodeStart === 0;
	if (isAtDocStart) {
		return true;
	}
	const isPrevCharSpace = state.doc.textBetween(nodeStart - 1, nodeStart) === ' ';
	if (isPrevCharSpace) {
		return true;
	}

	return false;
};

type ShouldPadRightOptions = {
	nodeEnd: number;
	state: EditorState;
};

export const shouldPadRight = ({ state, nodeEnd }: ShouldPadRightOptions): boolean => {
	const $pos = state.doc.resolve(nodeEnd);
	const isAtBlockEnd = $pos.parentOffset === $pos.parent.content.size;
	if (isAtBlockEnd) {
		return true;
	}
	const isAtDocEnd = nodeEnd === state.doc.content.size;
	if (isAtDocEnd) {
		return true;
	}
	const isNextCharSpace = state.doc.textBetween(nodeEnd, nodeEnd + 1) === ' ';
	if (isNextCharSpace) {
		return true;
	}

	return false;
};
